import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { RootStoreContext } from "../stores/rootStore";
import Spinner from "../components/Spinner";
import ActivityDetailsInfo from "../components/ActivityDetailsInfo";
import ActivityDetailsChat from "../components/ActivityDetailsChat";
import ActivityDetailsHeader from "../components/ActivityDetailsHeader";
import ActivityDetailsSidebar from "../components/ActivityDetailsSidebar";

const ActivityDetails: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loading } = rootStore.activityStore;
  const params = useParams<{ id: string }>();

  useEffect(() => {
    loadActivity(params.id);
  }, [loadActivity, params.id]);

  if (loading) return <Spinner content="Loading Activity..." />;
  if (!activity) return <h2>Activity not found</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
