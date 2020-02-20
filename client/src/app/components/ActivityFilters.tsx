import React, { useContext } from "react";
import { Calendar } from "react-widgets";
import { observer } from "mobx-react-lite";
import { Menu, Header, Responsive, Accordion, Icon } from "semantic-ui-react";
import { ResponsiveOnUpdateData } from "semantic-ui-react/dist/commonjs/addons/Responsive";
import { RootStoreContext } from "../stores/rootStore";

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;
  const [width, setWidth] = React.useState<number>(0);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  const handleUpdate = (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: ResponsiveOnUpdateData
  ) => {
    setWidth(data.width);
  };

  const handleTitleClick = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  return (
    <Responsive onUpdate={handleUpdate} fireOnMount>
      <Menu
        vertical
        size={"large"}
        style={{
          width: "100%",
          marginTop: Responsive.onlyTablet.minWidth! > width ? 0 : 50
        }}
      >
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
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleTitleClick}
        >
          <Icon name="calendar" color={"teal"} />
          Select Date
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Calendar
            onChange={date => setPredicate("startDate", date!)}
            value={predicate.get("startDate" || new Date())}
          />
        </Accordion.Content>
      </Accordion>
    </Responsive>
  );
};

export default observer(ActivityFilters);
