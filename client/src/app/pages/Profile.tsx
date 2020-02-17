import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import Spinner from "../components/Spinner";
import ProfileHeader from "../components/ProfileHeader";
import ProfileContent from "../components/ProfileContent";
import { RootStoreContext } from "../stores/rootStore";

interface RouteParams {
  username: string;
}

const Profile: React.FC = () => {
  const params = useParams<RouteParams>();
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(params.username);
  }, [loadProfile, params.username]);

  if (loadingProfile) return <Spinner content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(Profile);
