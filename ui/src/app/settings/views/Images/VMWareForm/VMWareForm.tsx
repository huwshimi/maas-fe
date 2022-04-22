import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const VMWareSchema = Yup.object().shape({
  vcenter_server: Yup.string(),
  vcenter_username: Yup.string(),
  vcenter_password: Yup.string(),
  vcenter_datacenter: Yup.string(),
});

const VMWareForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const vCenterServer = useSelector(configSelectors.vCenterServer);
  const vCenterUsername = useSelector(configSelectors.vCenterUsername);
  const vCenterPassword = useSelector(configSelectors.vCenterPassword);
  const vCenterDatacenter = useSelector(configSelectors.vCenterDatacenter);

  return (
    <Formik
      initialValues={{
        vcenter_server: vCenterServer,
        vcenter_username: vCenterUsername,
        vcenter_password: vCenterPassword,
        vcenter_datacenter: vCenterDatacenter,
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      validationSchema={VMWareSchema}
    >
      <FormikFormContent
        buttonsAlign="left"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Saved",
          category: "Images settings",
          label: "VMware form",
        }}
        saving={saving}
        saved={saved}
      >
        <FormikField
          label="VMware vCenter server FQDN or IP address"
          type="text"
          name="vcenter_server"
          help="VMware vCenter server FQDN or IP address which is passed to a deployed VMware ESXi host."
        />
        <FormikField
          label="VMware vCenter username"
          type="text"
          name="vcenter_username"
          help="VMware vCenter server username which is passed to a deployed VMware ESXi host."
        />
        <FormikField
          label="VMware vCenter password"
          type="text"
          name="vcenter_password"
          help="VMware vCenter server password which is passed to a deployed VMware ESXi host."
        />
        <FormikField
          label="VMware vCenter datacenter"
          type="text"
          name="vcenter_datacenter"
          help="VMware vCenter datacenter which is passed to a deployed VMware ESXi host."
        />
      </FormikFormContent>
    </Formik>
  );
};

export default VMWareForm;
