import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import useAuth from "./shared/hooks/auth-hook";
import { AuthContext } from "./shared/context/auth-context";
import PageSkeleton from "./shared/components/UIElements/PageSkeleton";
import ErrorBoundary from "./shared/components/UIElements/ErrorBoundary";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

const NotFound = React.lazy(() => import("./shared/pages/NotFound"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const AllPlaces = React.lazy(() => import("./places/pages/AllPlaces"));
const UserPlace = React.lazy(() => import("./places/pages/UserPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));

function App() {
  const { userId, userToken, login, logout, sessionExpired, clearSessionExpired } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLogin: !!userToken,
        userId,
        userToken,
        login,
        logout,
        sessionExpired,
        clearSessionExpired,
      }}
    >
      <Router>
        <MainNavigation></MainNavigation>
        <main>
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>

              {userToken ? (
                <Routes>
                  <Route path="/" exact element={<AllPlaces />} />
                  <Route path="/users" exact element={<Users />} />
                  <Route path="/:userId/places" exact element={<UserPlace />} />
                  <Route path="/place/new" exact element={<NewPlace />} />
                  <Route path="/place/:placeId" exact element={<UpdatePlace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              ) : (
                <Routes>
                  <Route path="/" exact element={<AllPlaces />} />
                  <Route path="/users" exact element={<Users />} />
                  <Route path="/:userId/places" exact element={<UserPlace />} />
                  <Route path="/auth" exact element={<Auth />} />
                  {/* Protected paths redirect to /auth (not 404) when the session expires mid-visit */}
                  <Route path="/place/new" element={<Navigate to="/auth" replace />} />
                  <Route path="/place/:placeId" element={<Navigate to="/auth" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              )}
            </Suspense>
          </ErrorBoundary>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}


export default App;
