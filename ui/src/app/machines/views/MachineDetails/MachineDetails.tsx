import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import MachineComissioning from "./MachineCommissioning";
import MachineConfiguration from "./MachineConfiguration";
import MachineHeader from "./MachineHeader";
import MachineInstances from "./MachineInstances";
import MachineLogs from "./MachineLogs";
import MachineNetwork from "./MachineNetwork";
import NetworkNotifications from "./MachineNetwork/NetworkNotifications";
import MachinePCIDevices from "./MachinePCIDevices";
import MachineStorage from "./MachineStorage";
import StorageNotifications from "./MachineStorage/StorageNotifications";
import MachineSummary from "./MachineSummary";
import SummaryNotifications from "./MachineSummary/SummaryNotifications";
import MachineTests from "./MachineTests";
import MachineTestsDetails from "./MachineTests/MachineTestsDetails/MachineTestsDetails";
import MachineUSBDevices from "./MachineUSBDevices";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import type { MachineHeaderContent } from "app/machines/types";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const MachineDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);
  const { pathname } = useLocation();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const machinesLoading = useSelector(machineSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (isId(id)) {
      dispatch(machineActions.get(id));
      // Set machine as active to ensure all machine data is sent from the server.
      dispatch(machineActions.setActive(id));
    }
    // Unset active machine on cleanup.
    return () => {
      dispatch(machineActions.setActive(null));
      // Clean up any machine errors etc. when closing the details.
      dispatch(machineActions.cleanup());
    };
  }, [dispatch, id]);

  if (!isId(id) || (!machinesLoading && !machine)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={machineURLs.machines.index}
        modelName="machine"
      />
    );
  }

  return (
    <Section
      header={
        <MachineHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          systemId={id}
        />
      }
    >
      {machine && (
        <Routes>
          <Route
            path={machineURLs.machine.summary(null, true)}
            element={
              <>
                <SummaryNotifications id={id} />
                <MachineSummary setHeaderContent={setHeaderContent} />
              </>
            }
          />
          <Route
            path={machineURLs.machine.instances(null, true)}
            element={<MachineInstances />}
          />
          <Route
            path={machineURLs.machine.network(null, true)}
            element={
              <>
                <NetworkNotifications id={id} />
                <MachineNetwork id={id} setHeaderContent={setHeaderContent} />
              </>
            }
          />
          <Route
            path={machineURLs.machine.storage(null, true)}
            element={
              <>
                <StorageNotifications id={id} />
                <MachineStorage />
              </>
            }
          />
          <Route
            path={machineURLs.machine.pciDevices(null, true)}
            element={<MachinePCIDevices setHeaderContent={setHeaderContent} />}
          />
          <Route
            path={machineURLs.machine.usbDevices(null, true)}
            element={<MachineUSBDevices setHeaderContent={setHeaderContent} />}
          />
          <Route
            path={machineURLs.machine.commissioning.index(null, true)}
            element={<MachineComissioning />}
          />
          <Route
            path={machineURLs.machine.commissioning.scriptResult(null, true)}
            element={<MachineTestsDetails />}
          />
          <Route
            path={machineURLs.machine.testing.index(null, true)}
            element={<MachineTests />}
          />
          <Route
            path={machineURLs.machine.testing.scriptResult(null, true)}
            element={<MachineTestsDetails />}
          />
          <Route
            path={machineURLs.machine.logs.index(null, true)}
            element={<MachineLogs systemId={id} />}
          />
          <Route path={machineURLs.machine.events(null, true)}>
            <Navigate
              replace
              to={machineURLs.machine.logs.events(null, true)}
            />
          </Route>
          <Route
            path={machineURLs.machine.configuration(null, true)}
            element={<MachineConfiguration />}
          />
          <Route path={machineURLs.machine.index(null, true)}>
            <Navigate replace to={machineURLs.machine.summary({ id })} />
          </Route>
        </Routes>
      )}
    </Section>
  );
};

export default MachineDetails;
