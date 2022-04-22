import { useEffect } from "react";

import { Col, Spinner, Row, Select } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const DnsSchema = Yup.object().shape({
  // TODO: Client-side IP validation, or display error from server
  // https://github.com/canonical-web-and-design/maas-ui/issues/39
  upstream_dns: Yup.string(),
  dnssec_validation: Yup.string().required(),
  dns_trusted_acl: Yup.string(),
});

const DnsForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const dnssecValidation = useSelector(configSelectors.dnssecValidation);
  const dnsTrustedAcl = useSelector(configSelectors.dnsTrustedAcl);
  const upstreamDns = useSelector(configSelectors.upstreamDns);
  const dnssecOptions = useSelector(configSelectors.dnssecOptions);

  useWindowTitle("DNS");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && (
          <Formik
            initialValues={{
              dnssec_validation: dnssecValidation || "",
              dns_trusted_acl: dnsTrustedAcl || "",
              upstream_dns: upstreamDns || "",
            }}
            onSubmit={(values, { resetForm }) => {
              dispatch(updateConfig(values));
              resetForm({ values });
            }}
            validationSchema={DnsSchema}
          >
            <FormikFormContent
              buttonsAlign="left"
              buttonsBordered={false}
              onSaveAnalytics={{
                action: "Saved",
                category: "Network settings",
                label: "DNS form",
              }}
              saving={saving}
              saved={saved}
            >
              <FormikField
                name="upstream_dns"
                label="Upstream DNS used to resolve domains not managed by this MAAS (space-separated IP addresses)"
                help="Only used when MAAS is running its own DNS server. This value is used as the value of 'forwarders' in the DNS server config."
                type="text"
              />
              <FormikField
                component={Select}
                options={dnssecOptions}
                name="dnssec_validation"
                label="Enable DNSSEC validation of upstream zones"
                help="Only used when MAAS is running its own DNS server. This value is used as the value of 'dnssec_validation' in the DNS server config."
              />
              <FormikField
                name="dns_trusted_acl"
                label="List of external networks (not previously known), that will be allowed to use MAAS for DNS resolution"
                help="MAAS keeps a list of networks that are allowed to use MAAS for DNS resolution. This option allows to add extra networks (not previously known) to the trusted ACL where this list of networks is kept. It also supports specifying IPs or ACL names."
                type="text"
              />
            </FormikFormContent>
          </Formik>
        )}
      </Col>
    </Row>
  );
};

export default DnsForm;
