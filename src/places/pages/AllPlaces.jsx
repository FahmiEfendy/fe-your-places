import React, { useEffect, useState, useCallback } from "react";

import PlaceList from "../components/PlaceList";
import useHttpRequest from "../../shared/hooks/http-hook";
import EndOfList from "../../shared/components/UIElements/EndOfList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import useInfiniteScroll from "../../shared/hooks/infinite-scroll-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const AllPlaces = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();
  const updatePlaceListHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const fetchPlaces = useCallback(async (pageNum) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
      const responseData = await sendRequest(`${apiBaseUrl}/places?page=${pageNum}&limit=6`);

      const transformedPlaces = responseData.data.map(place => ({
        ...place,
        id: place.id || place._id
      }));

      setLoadedPlaces(prev => pageNum === 1 ? transformedPlaces : [...prev, ...transformedPlaces]);
      setHasMore(responseData.meta.hasMore);

    } catch (err) {
      console.log(err);
    }
  }, [sendRequest]);

  const loadMoreHandler = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchPlaces(nextPage);
        return nextPage;
      });
    }
  }, [isLoading, hasMore, fetchPlaces]);

  const lastPlaceRef = useInfiniteScroll(loadMoreHandler, hasMore, isLoading);

  useEffect(() => {
    fetchPlaces(1);
  }, [fetchPlaces]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrorHandler} />

      {loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={updatePlaceListHandler} />
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={lastPlaceRef} style={{ height: '20px', margin: '10px 0' }}>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
      </div>

      {!isLoading && !hasMore && loadedPlaces.length > 0 && page > 1 && (
        <EndOfList message="You've seen all the places" />
      )}
    </React.Fragment>
  );
};

export default AllPlaces;
