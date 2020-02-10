import React from "react";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";

import Navbar from "../components/Navbar";

import Home from "../pages/Home";
import ActivityForm from "../pages/ActivityForm";
import ActivityDetails from "../pages/ActivityDetails";
import ActivityDashboard from "../pages/ActivityDashboard";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <Route path="/" exact component={Home} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7rem" }}>
              <Route path="/activities" exact component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                path={["/create_activity", "/manage/:id"]}
                component={ActivityForm}
                key={location.key}
              />
            </Container>
          </>
        )}
      />
    </>
  );
};

export default withRouter(observer(App));
