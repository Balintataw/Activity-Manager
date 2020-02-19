import React, { useContext } from "react";
import { Menu, Header } from "semantic-ui-react";
import { Calendar } from "react-widgets";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../stores/rootStore";

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;

  return (
    <>
      <Menu vertical size={"large"} style={{ width: "100%", marginTop: 50 }}>
        <Header icon={"filter"} attached color={"teal"} content={"Filters"} />
        <Menu.Item
          active={predicate.size === 0}
          color={"blue"}
          name={"all"}
          content={"All Activities"}
          onClick={() => setPredicate("all", "true")}
        />
        <Menu.Item
          active={predicate.has("isGoing")}
          color={"blue"}
          name={"username"}
          content={"I'm Going"}
          onClick={() => setPredicate("isGoing", "true")}
        />
        <Menu.Item
          active={predicate.has("isHost")}
          color={"blue"}
          name={"host"}
          content={"I'm hosting"}
          onClick={() => setPredicate("isHost", "true")}
        />
      </Menu>
      <Header
        icon={"calendar"}
        attached
        color={"teal"}
        content={"Select Date"}
      />
      <Calendar
        onChange={date => setPredicate("startDate", date!)}
        value={predicate.get("startDate" || new Date())}
      />
    </>
  );
};

export default observer(ActivityFilters);
