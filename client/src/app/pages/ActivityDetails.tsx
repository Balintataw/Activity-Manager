import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import ActivityStore from "../stores/activityStore";
import Spinner from "../components/Spinner";
import ActivityDetailsHeader from "../components/ActivityDetailsHeader";
import ActivityDetailsInfo from "../components/ActivityDetailsInfo";
import ActivityDetailsChat from "../components/ActivityDetailsChat";
import ActivityDetailsSidebar from "../components/ActivityDetailsSidebar";

const ActivityDetails: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loading } = activityStore;
  const params = useParams<{ id: string }>();

  useEffect(() => {
    loadActivity(params.id);
  }, [loadActivity, params.id]);

  if (loading || !activity) return <Spinner content="Loading Activity..." />;

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
