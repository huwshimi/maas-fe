import { Spinner, Strip } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import {
  domain as domainActions,
  fabric as fabricActions,
  general as generalActions,
  messages as messagesActions,
  resourcepool as resourcePoolActions,
  space as spaceActions,
  subnet as subnetActions,
  vlan as vlanActions,
  zone as zoneActions,
} from "app/base/actions";
import domainSelectors from "app/store/domain/selectors";
import fabricSelectors from "app/store/fabric/selectors";
import generalSelectors from "app/store/general/selectors";
import podSelectors from "app/store/pod/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import spaceSelectors from "app/store/space/selectors";
import subnetSelectors from "app/store/subnet/selectors";
import vlanSelectors from "app/store/vlan/selectors";
import zoneSelectors from "app/store/zone/selectors";
import ActionForm from "app/base/components/ActionForm";
import ComposeFormFields from "./ComposeFormFields";

export type ComposeFormValues = {
  architecture: string;
  cores: number;
  domain: string;
  hostname: string;
  interfaces: string;
  memory: number;
  pool: string;
  storage: string;
  zone: string;
};

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const ComposeForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const errors = useSelector(podSelectors.errors);
  const composingPods = useSelector(podSelectors.composing);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const pools = useSelector(resourcePoolSelectors.all);
  const poolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const [machineName, setMachineName] = useState("");

  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(fabricActions.fetch());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(podActions.fetch({})); // TODO: This shouldn't require a param.
    dispatch(resourcePoolActions.fetch());
    dispatch(spaceActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const loaded =
    domainsLoaded &&
    fabricsLoaded &&
    poolsLoaded &&
    powerTypesLoaded &&
    spacesLoaded &&
    subnetsLoaded &&
    vlansLoaded &&
    zonesLoaded;

  if (!!pod && loaded) {
    const powerType = powerTypes.find((type) => type.name === pod.type);
    const available = {
      cores: pod.total.cores * pod.cpu_over_commit_ratio - pod.used.cores,
      memory: pod.total.memory * pod.memory_over_commit_ratio - pod.used.memory, // MiB
    };
    const defaults = {
      cores: powerType?.defaults?.cores || 1,
      memory: powerType?.defaults?.memory || 2048,
    };

    const ComposeFormSchema = Yup.object().shape({
      architecture: Yup.string(),
      cores: Yup.number("Cores must be a positive number.")
        .min(1, "Cores must be a positive number.")
        .max(available.cores, `Only ${available.cores} cores available.`),
      domain: Yup.string(),
      hostname: Yup.string(),
      interfaces: Yup.string(),
      memory: Yup.number("RAM must be a positive number.")
        .min(1024, "At least 1024 MiB is required.")
        .max(available.memory, `Only ${available.memory} MiB available.`),
      pool: Yup.string(),
      storage: Yup.string(),
      zone: Yup.string(),
    });

    return (
      <ActionForm
        actionName="compose"
        allowUnchanged
        cleanup={() => podActions.cleanup({})} // TODO: This shouldn't require a param.
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        initialValues={{
          architecture: pod.architectures[0] || "",
          cores: "",
          domain: `${domains[0]?.id}` || "",
          hostname: "",
          interfaces: "",
          memory: "",
          pool: `${pools[0]?.id}` || "",
          storage: "",
          zone: `${zones[0]?.id}` || "",
        }}
        modelName="machine"
        onSubmit={(values: ComposeFormValues) => {
          const params = {
            architecture: values.architecture,
            cores: values.cores,
            domain: Number(values.domain),
            hostname: values.hostname,
            id: Number(id),
            interfaces: undefined, // TODO: https://github.com/canonical-web-and-design/MAAS-squad/issues/2042
            memory: values.memory,
            pool: Number(values.pool),
            storage: undefined, // TODO: https://github.com/canonical-web-and-design/MAAS-squad/issues/2043
            zone: Number(values.zone),
          };
          setMachineName(values.hostname || "Machine");
          dispatch(podActions.compose(params));
        }}
        onSuccess={() =>
          dispatch(
            messagesActions.add(
              `${machineName} composed successfully.`,
              "information"
            )
          )
        }
        processingCount={composingPods.length}
        validationSchema={ComposeFormSchema}
      >
        <ComposeFormFields
          architectures={pod.architectures}
          available={available}
          defaults={defaults}
        />
      </ActionForm>
    );
  }
  return (
    <Strip>
      <Spinner text="Loading..." />
    </Strip>
  );
};

export default ComposeForm;
