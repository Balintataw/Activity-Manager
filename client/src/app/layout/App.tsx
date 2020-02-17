import React, { useContext } from "react";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from "react-router-dom";

import { RootStoreContext } from "../stores/rootStore";
import { ProtectedRoute } from "../router/ProtectedRoute";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ActivityForm from "../pages/ActivityForm";
import ActivityDetails from "../pages/ActivityDetails";
import ActivityDashboard from "../pages/ActivityDashboard";
import NotFound from "./NotFound";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import ModalContainer from "../common/modals/ModalContainer";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  React.useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <Spinner content="Loading App..." />;

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={Home} />
      <Route
        // because we don't want the navbar on the home page
        path={"/(.+)"}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7rem" }}>
              <Switch>
                <ProtectedRoute
                  path="/activities"
                  exact
                  component={ActivityDashboard}
                />
                <ProtectedRoute
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <ProtectedRoute
                  path={["/create_activity", "/manage/:id"]}
                  component={ActivityForm}
                  key={location.key}
                />
                <ProtectedRoute path="/profile/:username" component={Profile} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
