import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import prefsURLs from "app/preferences/urls";
import { actions as tokenActions } from "app/store/token";
import tokenSelectors from "app/store/token/selectors";
import type { Token } from "app/store/token/types";

type Props = {
  token?: Token;
};

const APIKeyAddSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
});

const APIKeyEditSchema = Yup.object().shape({
  name: Yup.string().required("API key name is required"),
});

export const APIKeyForm = ({ token }: Props): JSX.Element => {
  const editing = !!token;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errors = useSelector(tokenSelectors.errors);
  const saved = useSelector(tokenSelectors.saved);
  const saving = useSelector(tokenSelectors.saving);
  const title = editing ? "Edit MAAS API key" : "Generate MAAS API key";

  useWindowTitle(title);
  useAddMessage(
    saved,
    tokenActions.cleanup,
    `API key successfully ${editing ? "updated" : "generated"}.`
  );

  return (
    <FormCard title={title}>
      <FormikForm
        allowAllEmpty={!editing}
        cleanup={tokenActions.cleanup}
        errors={errors}
        initialValues={{
          name: token ? token.consumer.name : "",
        }}
        onCancel={() => navigate({ pathname: prefsURLs.apiKeys.index })}
        onSaveAnalytics={{
          action: "Saved",
          category: "API keys preferences",
          label: "Generate API key form",
        }}
        onSubmit={(values) => {
          if (editing) {
            if (token) {
              dispatch(
                tokenActions.update({
                  id: token.id,
                  name: values.name,
                })
              );
            }
          } else {
            dispatch(tokenActions.create(values));
          }
        }}
        saving={saving}
        saved={saved}
        savedRedirect={prefsURLs.apiKeys.index}
        submitLabel={editing ? "Save API key" : "Generate API key"}
        validationSchema={editing ? APIKeyEditSchema : APIKeyAddSchema}
      >
        <Row>
          <Col size={4}>
            <FormikField
              name="name"
              label={`API key name${editing ? "" : " (optional)"}`}
              required={editing}
              type="text"
            />
          </Col>
          <Col size={4}>
            <p className="form-card__help">
              The API key is used to log in to the API from the MAAS CLI and by
              other services connecting to MAAS, such as Juju.
            </p>
          </Col>
        </Row>
      </FormikForm>
    </FormCard>
  );
};

export default APIKeyForm;
