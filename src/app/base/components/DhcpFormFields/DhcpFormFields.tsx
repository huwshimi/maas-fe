import {
  Spinner,
  Notification,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { DHCPFormValues } from "app/base/components/DhcpForm/types";
import FormikField from "app/base/components/FormikField";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import deviceSelectors from "app/store/device/selectors";
import type { Device } from "app/store/device/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";

type Option = { label: string; value: string };

type ModelType = Subnet | Controller | Machine | Device;

type Props = {
  editing: boolean;
};

const generateOptions = (
  type: DHCPFormValues["type"],
  models: ModelType[] | null
): Option[] | null =>
  !!models
    ? [
        {
          value: "",
          label: `Choose ${type}`,
        },
      ].concat(
        models.map((model) => ({
          value:
            type === "subnet"
              ? model.id.toString()
              : ("system_id" in model && model.system_id) || "",
          label:
            type === "subnet"
              ? ("name" in model && model.name) || ""
              : ("fqdn" in model && model.fqdn) || "",
        }))
      )
    : null;

export enum Labels {
  Description = "Description",
  Disabled = "This snippet is disabled and will not be used by MAAS.",
  Enabled = "Enabled",
  Entity = "Applies to",
  LoadingData = "Loading DHCP snippet data",
  Name = "Snippet name",
  Type = "Type",
  Value = "DHCP snippet",
}

export const DhcpFormFields = ({ editing }: Props): JSX.Element => {
  const formikProps = useFormikContext<DHCPFormValues>();
  const subnets = useSelector(subnetSelectors.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const subnetLoading = useSelector(subnetSelectors.loading);
  const subnetLoaded = useSelector(subnetSelectors.loaded);
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const isLoading =
    subnetLoading || controllerLoading || deviceLoading || machineLoading;
  const hasLoaded =
    subnetLoaded && controllerLoaded && deviceLoaded && machineLoaded;
  const { enabled, type } = formikProps.values;
  let models: ModelType[] | null;
  switch (type) {
    case "subnet":
      models = subnets;
      break;
    case "controller":
      models = controllers;
      break;
    case "machine":
      models = machines;
      break;
    case "device":
      models = devices;
      break;
    default:
      models = null;
  }

  return (
    <>
      {editing && !enabled && (
        <Notification severity="caution" title="Warning:">
          {Labels.Disabled}
        </Notification>
      )}
      <FormikField
        label={Labels.Name}
        name="name"
        required={true}
        type="text"
      />
      <FormikField label={Labels.Enabled} name="enabled" type="checkbox" />
      <FormikField
        component={Textarea}
        label={Labels.Description}
        name="description"
      />
      <FormikField
        component={Select}
        label={Labels.Type}
        name="type"
        onChange={(e: React.FormEvent) => {
          formikProps.handleChange(e);
          formikProps.setFieldValue("entity", "");
          formikProps.setFieldTouched("entity", false, false);
        }}
        options={[
          { value: "", label: "Global" },
          { value: "subnet", label: "Subnet" },
          { value: "controller", label: "Controller" },
          { value: "machine", label: "Machine" },
          { value: "device", label: "Device" },
        ]}
      />
      {type &&
        (isLoading || !hasLoaded ? (
          <Spinner aria-label={Labels.LoadingData} text="loading..." />
        ) : (
          <FormikField
            component={Select}
            label={Labels.Entity}
            name="entity"
            options={
              // This won't need to pass the empty array once this issue is fixed:
              // https://github.com/canonical/react-components/issues/570
              generateOptions(type, models) || []
            }
          />
        ))}
      <FormikField
        component={Textarea}
        grow
        label={Labels.Value}
        name="value"
        placeholder="Custom DHCP snippet"
        required
      />
    </>
  );
};

export default DhcpFormFields;
