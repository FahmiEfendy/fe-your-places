import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./PlaceForm.css";
import useForm from "../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";

const NewPlace = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();
  const [formState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `${import.meta.env.VITE_API_BASE_URL}/places/`,
        "POST",
        { Authorization: `Bearer ${auth.userToken}` },
        formData
      );

      const { id } = JSON.parse(localStorage.getItem("userData"));
      navigate(`/${id}/places`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <form className="place-form" onSubmit={formSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          errorText="Please enter a valid title!"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
        />
        <Input
          id="description"
          type="textarea"
          label="Description"
          errorText="Please enter a valid description (at least 5 characters)!"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputChangeHandler}
        />
        <Input
          id="address"
          type="text"
          label="Address"
          errorText="Please enter a valid adress!"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputChangeHandler}
          errorText="Please upload an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
      <ErrorModal error={error} onClear={clearErrorHandler} />
    </React.Fragment>
  );
};

export default NewPlace;
