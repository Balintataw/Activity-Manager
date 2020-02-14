import React from "react";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from "react-router-dom";

import Navbar from "../components/Navbar";

import { ProtectedRoute } from "../Router/ProtectedRoute";
import Home from "../pages/Home";
import ActivityForm from "../pages/ActivityForm";
import ActivityDetails from "../pages/ActivityDetails";
import ActivityDashboard from "../pages/ActivityDashboard";
import NotFound from "./NotFound";
import LoginForm from "../pages/LoginForm";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Route path="/" exact component={Home} />
      <Route
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
                <Route path="/login" component={LoginForm} />
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
