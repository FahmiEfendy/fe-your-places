import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import PlaceList from "../components/PlaceList";
import useHttpRequest from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlace = () => {
  const { userId } = useParams();
  const [userPlaces, setUserPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const updatePlaceListHandler = (deletedPlaceId) => {
    setUserPlaces((prevUserPlaces) =>
      prevUserPlaces.filter(
        (prevUserPlace) => prevUserPlace.id !== deletedPlaceId
      )
    );
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
        const responseData = await sendRequest(
          `${apiBaseUrl}/places/user/${userId}`
        );

        setUserPlaces(responseData.data.places);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequest();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      ) : (
        <PlaceList items={userPlaces} onDelete={updatePlaceListHandler} />
      )}
      <ErrorModal error={error} onClear={clearErrorHandler} />
    </React.Fragment>
  );
};

export default UserPlace;
