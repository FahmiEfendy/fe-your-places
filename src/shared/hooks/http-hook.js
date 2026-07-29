import { useCallback, useEffect, useRef, useState } from "react";

import { emitUnauthorized } from "../utils/authEvents";

const useHttpRequest = () => {
  const activeHttpRequest = useRef([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (url, method = "GET", headers = {}, body = null) => {
      setIsLoading(true);

      // Store data when component re-render
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (response.status === 401 && headers.Authorization) {
          emitUnauthorized();
        }

        if (!response.ok) throw new Error(responseData.message);

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message || "Something went wrong, please try again.");
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearErrorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearErrorHandler };
};

export default useHttpRequest;
