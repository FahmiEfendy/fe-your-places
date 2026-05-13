import React from "react";
import { useContext, useState } from "react";

import "./Auth.css";
import useForm from "../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [useImageUrl, setUseImageUrl] = useState(false);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const auth = useContext(AuthContext);

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const toggleLoginModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }

    setIsLoginMode((prevState) => !prevState);
    setUseImageUrl(false); // Reset to upload mode on toggle
  };

  const switchImageSourceHandler = () => {
    setUseImageUrl((prev) => !prev);
    // Reset image field when switching source
    inputChangeHandler("image", useImageUrl ? null : "", false);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "/your-places/api";
        const responseData = await sendRequest(
          `${apiBaseUrl}/users/login`,
          "POST",
          {
            "Content-Type": "application/json",
          },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );

        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {
        // This catch err can be removed
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        if (useImageUrl) {
          formData.append("imageUrl", formState.inputs.image.value);
        } else {
          formData.append("image", formState.inputs.image.value);
        }

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
        const responseData = await sendRequest(
          `${apiBaseUrl}/users/signup`,
          "POST",
          {},
          formData
        );

        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{`${isLoginMode ? "Login" : "SignUp"} Mode`}</h2>
        <hr />
        <form onSubmit={formSubmitHandler}>
          {!isLoginMode && (
            <React.Fragment>
              <Input
                id="name"
                type="text"
                label="Name"
                errorText="Please enter a valid name!"
                validators={[VALIDATOR_REQUIRE]}
                onInput={inputChangeHandler}
              />
              <div className="image-source-toggle">
                <Button type="button" inverse onClick={switchImageSourceHandler}>
                  {useImageUrl ? "USE UPLOAD" : "USE IMAGE URL"}
                </Button>
              </div>
              {!useImageUrl ? (
                <ImageUpload
                  center
                  id="image"
                  onInput={inputChangeHandler}
                  errorText="Please upload an image."
                />
              ) : (
                <Input
                  id="image"
                  element="input"
                  type="text"
                  label="Image URL"
                  errorText="Please enter a valid image URL!"
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputChangeHandler}
                />
              )}
            </React.Fragment>
          )}
          <Input
            id="email"
            type="email"
            label="Email"
            errorText="Please enter a valid email!"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            onInput={inputChangeHandler}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            errorText="Please enter a valid password!"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputChangeHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {`${isLoginMode ? "LOGIN" : "SIGN UP"}`}
          </Button>
        </form>
        <Button inverse onClick={toggleLoginModeHandler}>
          {`SWITCH TO ${isLoginMode ? "SIGN UP" : "LOGIN"}`}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
