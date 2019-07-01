import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required")
});

const Login = () => (
  <div className="p-strip">
    <div className="row">
      <div class="col-8 col-start-large-3">
        <div class="p-card">
          <header class="p-card__header">
            <h1 class="p-heading--four">Login</h1>
          </header>
          <Formik
            initialValues={{
              username: "",
              password: ""
            }}
            validationSchema={LoginSchema}
            onSubmit={values => {
              // same shape as initial values
              console.log(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" id="username" />
                {errors.username && touched.username ? (
                  <p className="p-form-validation__message">
                    {errors.username}
                  </p>
                ) : null}
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" id="password" />
                {errors.password && touched.password ? (
                  <p className="p-form-validation__message">
                    {errors.password}
                  </p>
                ) : null}
                <button type="submit">Login</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  </div>
);

export default Login;
