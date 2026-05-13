import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import "./PlaceForm.css";
import useForm from "../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import useFetchImage from "../../shared/hooks/image-hook";
import Card from "../../shared/components/UIElements/Card";
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

const UpdatePlace = () => {
  const navigate = useNavigate();

  const { placeId } = useParams();

  const auth = useContext(AuthContext);

  const [selectedPlace, setSelectedPlace] = useState();
  const [useImageUrl, setUseImageUrl] = useState(false);

  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
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
  const { imageUrl: existingImageUrl } = useFetchImage(selectedPlace?.image);

  // GET Place Detail
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "/your-places/api";
        const responseData = await sendRequest(
          `${apiBaseUrl}/places/${placeId}`
        );

        setSelectedPlace(responseData.data);

        setFormData(
          {
            title: {
              value: responseData.data.title,
              isValid: true,
            },
            description: {
              value: responseData.data.description,
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
  }, [placeId, sendRequest, setFormData]);

  // Send Updated Place to Database
  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);

      // Only append image if it's a new file or new URL string
      if (formState.inputs.image.value !== selectedPlace.image) {
        if (useImageUrl) {
          formData.append("imageUrl", formState.inputs.image.value);
        } else {
          formData.append("image", formState.inputs.image.value);
        }
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
      await sendRequest(
        `${apiBaseUrl}/places/${placeId}`,
        "PATCH",
        {
          Authorization: `Bearer ${auth.userToken}`,
        },
        formData
      );

      navigate(`/${auth.userId}/places`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <LoadingSpinner asOverlay />;

  if (!selectedPlace) {
    return (
      <Card className="center">
        <h2>No Place Found!</h2>
      </Card>
    );
  }

  return (
    !error && (
      <React.Fragment>
        <form className="place-form" onSubmit={formSubmitHandler}>
          <Input
            id="title"
            type="text"
            label="Title"
            errorText="Please enter a valid title!"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputChangeHandler}
            initialValue={formState.inputs.title.value}
            initialIsValid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            type="textarea"
            label="Description"
            errorText="Please enter a valid description (at least 5 characters)!"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            rows={3}
            onInput={inputChangeHandler}
            initialValue={formState.inputs.description.value}
            initialIsValid={formState.inputs.description.isValid}
          />
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
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
        <ErrorModal error={error} onClear={clearErrorHandler} />
      </React.Fragment>
    )
  );
};

export default UpdatePlace;
