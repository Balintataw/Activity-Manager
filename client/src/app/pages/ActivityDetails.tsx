import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { useParams, useHistory, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import ActivityStore from "../stores/activityStore";
import Spinner from "../components/Spinner";

const ActivityDetails: React.FC = () => {
  const history = useHistory();
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loading } = activityStore;
  const params = useParams<{ id: string }>();

  useEffect(() => {
    loadActivity(params.id);
  }, [loadActivity, params.id]);

  if (loading) return <Spinner content="Loading Activity..." />;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity?.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity?.title || "Title"}</Card.Header>
        <Card.Meta>
          <span>{activity?.date}</span>
        </Card.Meta>
        <Card.Description>{activity?.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${activity?.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => history.push("/activities")}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
