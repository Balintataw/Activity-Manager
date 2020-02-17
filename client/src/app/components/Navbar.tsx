import React, { useContext } from "react";
import { Menu, Container, Button, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";

const Navbar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;

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
        {user && (
          <Menu.Item position="right">
            <Image
              avatar
              spaced="right"
              src={user.image || "/assets/user.png"}
            />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`}
                  text="My profile"
                  icon="user"
                />
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
