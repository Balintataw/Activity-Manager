import React from "react";
import { Card, Image, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IProfile } from "../Models/Profile";

interface IProps {
  profile: IProfile;
}

const ProfileCard: React.FC<IProps> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profile/${profile.username}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name="user" />
          {profile.followersCount}{" "}
          {profile.followersCount === 1 ? "follower" : "followers"}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
