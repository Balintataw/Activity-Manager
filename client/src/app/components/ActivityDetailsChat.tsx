import React, { Fragment, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { formatDistance } from "date-fns";
import { Form as FinalForm, Field } from "react-final-form";
import { Segment, Header, Form, Button, Comment } from "semantic-ui-react";
import { RootStoreContext } from "../stores/rootStore";
import TextAreaInput from "../common/form/TextAreaInput";

const ActivityDetailsChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);
    return () => {
      stopHubConnection(activity!.id);
    };
  }, [createHubConnection, stopHubConnection, activity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map(comment => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={2}
                  placeholder="Add Comment"
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailsChat);
