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
              const ws = new WebSocket("ws://maas.local:5240/MAAS/ws");
              ws.onmessage = event => {
                console.log("onmessage", event.data);
              };
              ws.onopen = event => {
                ws.send(
                  JSON.stringify({
                    type: 0,
                    request_id: 1,
                    method: "general.version"
                  })
                );
              };
              // var url = "http://maas.local:5240/MAAS/accounts/login/";
              // fetch(url, {
              //   method: "GET",
              //   mode: "no-cors",
              //   credentials: "include"
              // })
              //   .then(response => {
              //     console.log("Success:", response);
              //   })
              //   .catch(error => console.error("Error:", error));
              // fetch(url, {
              //   method: "POST",
              //   mode: "no-cors",
              //   credentials: "include",
              //   body: Object.keys(values)
              //     .map(key => key + "=" + values[key])
              //     .join("&")
              // })
              //   .then(response => {
              //     // console.log("Success:", response);
              //   })
              //   .catch(error => console.error("Error:", error));
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
