import React, { useContext } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityList from "../components/ActivityList";
import ActivityDetails from "../components/ActivityDetails";
import ActivityForm from "../components/ActivityForm";
import ActivityStore from "../stores/activityStore";

const ActivityDashboard = () => {
  const activityStore = useContext(ActivityStore);
  const { editMode, selectedActivity } = activityStore;

  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityList />
      </GridColumn>
      <GridColumn width={6}>
        {selectedActivity && !editMode && <ActivityDetails />}
        {editMode && (
          <ActivityForm
            key={selectedActivity?.id || 0} // with an id change, the component will rerender
            activity={selectedActivity!}
          />
        )}
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDashboard);
