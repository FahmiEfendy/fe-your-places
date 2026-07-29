import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import PlaceList from "../components/PlaceList";
import useHttpRequest from "../../shared/hooks/http-hook";
import { API_BASE_URL } from "../../shared/utils/constants";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import useDocumentMeta from "../../shared/hooks/document-meta-hook";
import { PlaceItemSkeleton } from "../../shared/components/UIElements/Skeletons";

const UserPlace = () => {
  const { userId } = useParams();

  useDocumentMeta({
    title: "User's Places | Your Places",
    description: "Browse all places shared by this user.",
  });

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
        const responseData = await sendRequest(
          `${API_BASE_URL}/places/user/${userId}`
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
        <ul className="place-list">
          {Array.from({ length: 6 }).map((_, idx) => (
            <PlaceItemSkeleton key={idx} />
          ))}
        </ul>
      ) : (
        <PlaceList items={userPlaces} onDelete={updatePlaceListHandler} />
      )}
      <ErrorModal error={error} onClear={clearErrorHandler} />
    </React.Fragment>
  );
};

export default UserPlace;
