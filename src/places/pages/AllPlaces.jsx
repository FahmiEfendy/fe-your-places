import React, { useEffect, useState } from "react";

import PlaceList from "../components/PlaceList";
import useHttpRequest from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const AllPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const updatePlaceListHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
        const responseData = await sendRequest(`${apiBaseUrl}/places`);
        
        // The backend returns { message: "...", data: [ ...places... ] }
        // We ensure each place has an 'id' property by mapping _id if needed
        const transformedPlaces = responseData.data.map(place => ({
          ...place,
          id: place.id || place._id
        }));
        
        setLoadedPlaces(transformedPlaces);

      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={updatePlaceListHandler} />
      )}
    </React.Fragment>
  );
};

export default AllPlaces;
