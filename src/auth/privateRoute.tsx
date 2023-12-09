import React from "react";
import { connect } from "react-redux";
import { Route, Navigate, RouteProps } from "react-router-dom";
import PropTypes from "prop-types";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  isLoading,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: any) =>
      (isAuthenticated || isLoading) ? (
        <Component {...props} {...rest} />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
);

const mapStateToProps = (state: any) => ({
  isAuthenticated: !!state.user.uid,
  isLoading: state.user.isLoading
});

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(PrivateRoute);
