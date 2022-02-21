import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from '../context/Context';

export const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export const NoUserRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={routeProps =>
          !currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
  };


// TODO - Update AdminRoute. Currently applies to any user. Needs admin logic

export const AdminRoute = ({ component: RouteComponent, ...rest }) => {
    const {userInfo} = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={routeProps =>
          userInfo && userInfo.admin ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
  };