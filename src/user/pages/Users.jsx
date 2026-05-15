import React, { useContext, useEffect, useState, useCallback } from "react";

import UserList from "../components/UserList";
import useHttpRequest from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import EndOfList from "../../shared/components/UIElements/EndOfList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import useInfiniteScroll from "../../shared/hooks/infinite-scroll-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const auth = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userList, setUserList] = useState([]);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const fetchUsers = useCallback(async (pageNum) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
      const responseData = await sendRequest(
        `${apiBaseUrl}/users?page=${pageNum}&limit=6`
      );

      setUserList(prev => pageNum === 1 ? responseData.data : [...prev, ...responseData.data]);
      setHasMore(responseData.meta.hasMore);
    } catch (err) {
      console.log(err);
    }
  }, [sendRequest]);

  const loadMoreHandler = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchUsers(nextPage);
        return nextPage;
      });
    }
  }, [isLoading, hasMore, fetchUsers]);

  const lastUserRef = useInfiniteScroll(loadMoreHandler, hasMore, isLoading);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearErrorHandler} />

      {userList && (
        <UserList items={userList} />
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={lastUserRef} style={{ height: '20px', margin: '10px 0' }}>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
      </div>

      {!isLoading && !hasMore && userList.length > 0 && page > 1 && (
        <EndOfList message="All users loaded" />
      )}
    </React.Fragment>
  );
};

export default Users;
