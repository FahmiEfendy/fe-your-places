import React, { useContext, useEffect, useState } from "react";

import UserList from "../components/UserList";
import useHttpRequest from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const auth = useContext(AuthContext);

  const [userList, setUserList] = useState([]);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
        const responseData = await sendRequest(
          `${apiBaseUrl}/users`
        );
        setUserList(responseData.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequest();
  }, [auth.userId, sendRequest]);

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      ) : (
        <UserList items={userList} />
      )}
      <ErrorModal error={error} onClear={clearErrorHandler} />
    </React.Fragment>
  );
};

export default Users;
