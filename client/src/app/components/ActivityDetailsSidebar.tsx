import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Segment, List, Item, Label, Image } from "semantic-ui-react";
import { IAttendee } from "../Models/Activity";

interface IProps {
  attendees: IAttendee[];
}

const ActivityDetailsSidebar: React.FC<IProps> = ({ attendees }) => {
  const sortedByHost = attendees.slice().sort(a => (a.isHost ? -1 : 1));
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees.length} {attendees.length === 1 ? "Person" : "People"} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {sortedByHost.map(attendee => (
            <Item style={{ position: "relative" }} key={attendee.username}>
              {attendee.isHost && (
                <Label
                  style={{ position: "absolute" }}
                  color="orange"
                  ribbon="right"
                >
                  Host
                </Label>
              )}
              <Image size="tiny" src={attendee.image || "/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${attendee.username}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                {attendee.following && (
                  <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>
                )}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailsSidebar);
