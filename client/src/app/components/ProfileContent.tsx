import React from "react";
import { Tab, Responsive } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import ProfileActivities from "./ProfileActivities";
import { ResponsiveOnUpdateData } from "semantic-ui-react/dist/commonjs/addons/Responsive";

interface IProps {
  setActiveTab: (activeIndex: number | string | undefined) => void;
}

const panes = [
  { menuItem: "About", render: () => <ProfileAbout /> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <ProfileActivities />
  },
  { menuItem: "Followers", render: () => <ProfileFollowings /> },
  { menuItem: "Following", render: () => <ProfileFollowings /> }
];

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  const [width, setWidth] = React.useState<number>(0);

  const handleUpdate = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: ResponsiveOnUpdateData
  ) => {
    setWidth(data.width);
  };

  const alignment =
    width <= (Responsive.onlyTablet && Responsive.onlyTablet.minWidth)!
      ? false
      : true;

  return (
    <Responsive onUpdate={handleUpdate} fireOnMount>
      <Tab
        menu={{
          fluid: true,
          vertical: alignment
        }}
        menuPosition="right"
        panes={panes}
        onTabChange={(e, data) => setActiveTab(data.activeIndex)}
      ></Tab>
    </Responsive>
  );
};

export default ProfileContent;
