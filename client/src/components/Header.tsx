import React from "react";
import { Header as SemanticHeader, Icon } from "semantic-ui-react";

const Header = () => (
  <SemanticHeader as="h2">
    <Icon name="users" />
    <SemanticHeader.Content>Reactivities</SemanticHeader.Content>
  </SemanticHeader>
);

export default Header;
