import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import AddHardwareMenu from "./AddHardwareMenu";

import ModelListSubtitle from "app/base/components/ModelListSubtitle";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import type { SetSearchFilter } from "app/base/types";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import machineURLs from "app/machines/urls";
import { getHeaderTitle } from "app/machines/utils";
import poolsURLs from "app/pools/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";

type Props = {
  headerContent: MachineHeaderContent | null;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: MachineSetHeaderContent;
};

export const MachineListHeader = ({
  headerContent,
  setSearchFilter,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const selectedMachines = useSelector(machineSelectors.selected);

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname !== machineURLs.machines.index) {
      setHeaderContent(null);
    }
  }, [location.pathname, setHeaderContent]);

  const getHeaderButtons = () => {
    if (location.pathname === machineURLs.machines.index) {
      return [
        <AddHardwareMenu
          disabled={selectedMachines.length > 0}
          key="add-hardware"
          setHeaderContent={setHeaderContent}
        />,
        <NodeActionMenu
          alwaysShowLifecycle
          key="machine-list-action-menu"
          nodeDisplay="machine"
          nodes={selectedMachines}
          onActionClick={(action) => {
            const view = Object.values(MachineHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ];
    }
    if (location.pathname === poolsURLs.index) {
      return [
        <Button data-testid="add-pool" element={Link} to={poolsURLs.add}>
          Add pool
        </Button>,
      ];
    }
    return null;
  };

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      headerContent={
        headerContent && (
          <MachineHeaderForms
            headerContent={headerContent}
            machines={selectedMachines}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        )
      }
      subtitle={
        <ModelListSubtitle
          available={machines.length}
          filterSelected={() => setSearchFilter("in:(Selected)")}
          modelName="machine"
          selected={selectedMachines.length}
        />
      }
      subtitleLoading={!machinesLoaded}
      tabLinks={[
        {
          active: location.pathname.startsWith(machineURLs.machines.index),
          component: Link,
          label: `${pluralize("Machine", machines.length, true)}`,
          to: machineURLs.machines.index,
        },
        {
          active: location.pathname.startsWith(poolsURLs.index),
          component: Link,
          label: `${pluralize("Resource pool", resourcePools.length, true)}`,
          to: poolsURLs.index,
        },
      ]}
      title={getHeaderTitle("Machines", headerContent)}
    />
  );
};

export default MachineListHeader;
