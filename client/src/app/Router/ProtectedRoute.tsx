import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";

interface IProps {
  exact?: boolean;
  path: string | string[];
  component: React.ComponentType<any>;
}

export const ProtectedRoute = ({ component: C, ...rest }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn } = rootStore.userStore;
  return (
    <Route
      {...rest}
      render={props => (isLoggedIn ? <C {...props} /> : <Redirect to="/" />)}
    />
  );
};
