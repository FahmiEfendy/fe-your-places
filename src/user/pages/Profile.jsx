import React, { useContext, useEffect, useState } from "react";

import "./Profile.css";
import useForm from "../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import useFetchImage from "../../shared/hooks/image-hook";
import Card from "../../shared/components/UIElements/Card";
import { API_BASE_URL } from "../../shared/utils/constants";
import Input from "../../shared/components/FormElements/Input";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import useDocumentMeta from "../../shared/hooks/document-meta-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";

const Profile = () => {
  const auth = useContext(AuthContext);

  const [selectedUser, setSelectedUser] = useState();
  const [useImageUrl, setUseImageUrl] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useDocumentMeta({
    title: "My Profile | Your Places",
    description: "View and update your account information and profile picture.",
  });

  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: true, // Initially valid because it already has an image
      },
    },
    false
  );

  const switchImageSourceHandler = () => {
    setUseImageUrl((prev) => !prev);
    // Reset image field when switching source
    inputChangeHandler("image", useImageUrl ? null : "", true);
  };

  // Transform existing image path into a full URL for preview
  const { imageUrl: existingImageUrl } = useFetchImage(selectedUser?.image);

  // GET My Profile
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const responseData = await sendRequest(`${API_BASE_URL}/users/me`, "GET", {
          Authorization: `Bearer ${auth.userToken}`,
        });

        setSelectedUser(responseData.data);

        setFormData(
          {
            name: {
              value: responseData.data.name,
              isValid: true,
            },
            email: {
              value: responseData.data.email,
              isValid: true,
            },
            image: {
              value: responseData.data.image,
              isValid: true,
            },
          },
          true
        );

        if (responseData.data.image && responseData.data.image.startsWith("http")) {
          setUseImageUrl(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequest();
  }, [auth.userToken, sendRequest, setFormData]);

  // Send Updated Profile to Database
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);

      // Only append image if it's a new file or new URL string
      if (formState.inputs.image.value !== selectedUser.image) {
        if (useImageUrl) {
          formData.append("imageUrl", formState.inputs.image.value);
        } else {
          formData.append("image", formState.inputs.image.value);
        }
      }

      const responseData = await sendRequest(
        `${API_BASE_URL}/users/me`,
        "PATCH",
        {
          Authorization: `Bearer ${auth.userToken}`,
        },
        formData
      );

      setSelectedUser(responseData.data);
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <LoadingSpinner asOverlay />;

  if (!selectedUser) {
    return (
      <Card className="center">
        <h2>No Profile Found!</h2>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Card className="profile">
        <h2>My Profile</h2>
        <hr />
        {successMessage && (
          <p className="profile__success">{successMessage}</p>
        )}
        <form onSubmit={formSubmitHandler}>
          <div
            className="image-source-toggle"
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="button" inverse onClick={switchImageSourceHandler}>
              {useImageUrl ? "USE UPLOAD" : "USE IMAGE URL"}
            </Button>
          </div>
          {!useImageUrl ? (
            <ImageUpload
              id="image"
              center
              onInput={inputChangeHandler}
              errorText="Please upload an image."
              initialValue={existingImageUrl}
              acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/avif"]}
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
              initialValue={formState.inputs.image.value}
              initialIsValid={true}
            />
          )}
          <Input
            id="name"
            type="text"
            label="Name"
            errorText="Please enter a valid name!"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputChangeHandler}
            initialValue={formState.inputs.name.value}
            initialIsValid={formState.inputs.name.isValid}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            errorText="Please enter a valid email!"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            onInput={inputChangeHandler}
            initialValue={formState.inputs.email.value}
            initialIsValid={formState.inputs.email.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            SAVE CHANGES
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Profile;
