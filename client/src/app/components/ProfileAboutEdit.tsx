import React from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Form, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { FORM_ERROR } from "final-form";
import { IProfile } from "../Models/Profile";
import TextInput from "../common/form/TextInput";
import ErrorMessage from "../common/form/ErrorMessage";
import TextAreaInput from "../common/form/TextAreaInput";

interface IProps {
  updateProfile: (profile: IProfile) => Promise<IProfile>;
  profile: IProfile;
  setEditMode: (value: boolean) => void;
}

const validate = combineValidators({
  displayName: isRequired("displayName")
});

const ProfileAboutEdit: React.FC<IProps> = ({
  updateProfile,
  profile,
  setEditMode
}) => {
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IProfile) =>
        updateProfile(values)
          .then(() => setEditMode(false))
          .catch(error => ({
            [FORM_ERROR]: error
          }))
      }
      initialValues={profile!}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Display Name"
            value={profile!.displayName}
          />
          <Field
            name="bio"
            component={TextAreaInput}
            rows={3}
            placeholder="Bio"
            value={profile!.bio}
          />
          {submitError && submitError.statusText && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} text="Display name is required" />
          )}
          <Button
            fluid
            color="teal"
            content="Update profile"
            onClick={handleSubmit}
            loading={submitting}
            disabled={pristine || (invalid && !dirtySinceLastSubmit)}
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileAboutEdit);
