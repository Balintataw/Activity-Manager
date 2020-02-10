import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <Menu inverted fixed="top" style={{ zIndex: 10000000000 }}>
      <Container>
        <Menu.Item header as={NavLink} to="/" exact>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "12px" }}
          />
          <span>Kasama</span>
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="activities" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/create_activity"
            positive
            content="Create Activity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
