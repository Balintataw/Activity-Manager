import React, { useEffect, useContext, useState } from "react";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroller";

import Spinner from "../components/Spinner";
import ActivityList from "../components/ActivityList";
import { RootStoreContext } from "../stores/rootStore";
import ActivityFilters from "../components/ActivityFilters";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loading,
    setPage,
    page,
    totalPages
  } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loading && page === 0) return <Spinner content="Loading activities" />;

  return (
    <Grid>
      <GridColumn width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
      </GridColumn>
      <GridColumn width={6}>
        <ActivityFilters />
      </GridColumn>
      <GridColumn width={10}>
        <Loader active={loadingNext} />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDashboard);
