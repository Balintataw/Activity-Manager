import React, { useContext } from "react";
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps
} from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";

interface IProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const ProtectedRoute: React.FC<IProps> = ({
  component: C,
  ...rest
}: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn } = rootStore.userStore;
  return (
    <Route
      {...rest}
      render={props => (isLoggedIn ? <C {...props} /> : <Redirect to="/" />)}
    />
  );
};

export default observer(ProtectedRoute);
