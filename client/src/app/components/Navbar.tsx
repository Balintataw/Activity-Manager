import React, { useState } from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

const Navbar: React.FC<IProps> = ({ openCreateForm }) => {
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
          Reactivities
        </Menu.Item>
        <Menu.Item name="activities" active={activeItem === "activities"} />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={openCreateForm} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default Navbar;
