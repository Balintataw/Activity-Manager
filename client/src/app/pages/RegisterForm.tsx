import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../common/form/TextInput";
import { RootStoreContext } from "../stores/rootStore";
import { IUserFormValues } from "../Models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../common/form/ErrorMessage";

const validate = combineValidators({
  username: isRequired("username"),
  displayname: isRequired("displayname"),
  email: isRequired("email"),
  password: isRequired("password")
});

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        register(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as="h2" content="Register" color="teal" textAlign="center" />
          <Field name="username" component={TextInput} placeholder="Username" />
          <Field
            name="displayname"
            component={TextInput}
            placeholder="Display Name"
          />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && submitError.statusText && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <br />
          <Button
            fluid
            color="teal"
            content="Register"
            onClick={handleSubmit}
            loading={submitting}
            disabled={pristine || (invalid && !dirtySinceLastSubmit)}
          />
        </Form>
      )}
    />
  );
};

export default RegisterForm;
