import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import "./PlaceForm.css";
import useForm from "../../shared/hooks/form-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
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
    },
    false
  );

  // GET Place Detail
  useEffect(() => {
    const fetchRequest = async () => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
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
          },
          true
        );
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
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
      await sendRequest(
        `${apiBaseUrl}/places/${placeId}`,
        "PATCH",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userToken}`,
        },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        })
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
