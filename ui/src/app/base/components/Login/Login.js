import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string()
});

const Login = () => {
  return (
    <div className="p-strip">
      <div className="row">
        <div className="col-8 col-start-large-3">
          <div className="p-card">
            <header className="p-card__header">
              <h1 className="p-heading--four">Login</h1>
            </header>
            <Formik
              initialValues={{
                username: "",
                password: ""
              }}
              validationSchema={LoginSchema}
              onSubmit={values => {
                var url = "/MAAS/accounts/login/";
                fetch(url, {
                  method: "POST",
                  mode: "no-cors",
                  credentials: "include",
                  headers: new Headers({
                    "Content-Type":
                      "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                  }),
                  body: Object.keys(values)
                    .map(key => key + "=" + values[key])
                    .join("&")
                })
                  .then(response => {
                    console.log("Success:", response);
                  })
                  .catch(error => console.error("Error:", error));
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
};
export default Login;
