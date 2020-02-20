import React, { useEffect, useContext, useState } from "react";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroller";

import { RootStoreContext } from "../stores/rootStore";
import ActivityList from "../components/ActivityList";
import ActivityFilters from "../components/ActivityFilters";
import ActivityListItemPlaceholder from "../components/ActivityListItemPlaceholder";

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

  return (
    <Grid stackable reversed="mobile">
      <GridColumn width={10}>
        {loading && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
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
