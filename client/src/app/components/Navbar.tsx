import React, { useState, useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../stores/activityStore";

const Navbar = () => {
  const activityStore = useContext(ActivityStore);
  const [activeItem] = useState("activities");

  return (
    <Menu inverted fixed="top" style={{ zIndex: 10000000000 }}>
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "12px" }}
          />
          <span>Kasama</span>
        </Menu.Item>
        <Menu.Item name="activities" active={activeItem === "activities"} />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            onClick={activityStore.openCreateForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
