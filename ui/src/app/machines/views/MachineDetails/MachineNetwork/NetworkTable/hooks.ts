import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { isMachineStorageConfigurable } from "./storage";

import { general as generalActions } from "app/base/actions";
import generalSelectors from "app/store/general/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import type { Host } from "app/store/types/host";
import { NodeStatus } from "app/store/types/node";

/**
 * Check if a machine can be edited.
 * @param machine - A machine object.
 * @param ignoreRackControllerConnection - Whether the editable check should
 *                                         include whether the rack controller
 *                                          is connected.
 * @returns Whether the machine can be edited.
 */
// export const useCanEdit = (
//   machine?: Machine | null,
//   ignoreRackControllerConnection = false
// ): boolean => {
//   const isRackControllerConnected = useIsRackControllerConnected();
//   if (!machine) {
//     return false;
//   }
//   return (
//     machine.permissions.includes("edit") &&
//     !machine.locked &&
//     (ignoreRackControllerConnection || isRackControllerConnected)
//   );
// };

// Check if the interface is selected.
const isInterfaceSelected = (nic) => {
  return selectedInterfaces.indexOf(getUniqueKey(nic)) > -1;
};

// Returns true if the interface is not selected
const cannotEditInterface = (nic) => {
  if (selectedMode === SELECTION_MODE.NONE) {
    return false;
  } else if (
    selectedMode !== SELECTION_MODE.MULTI &&
    isInterfaceSelected(nic)
  ) {
    return false;
  } else {
    return true;
  }
};

const canMarkAsConnected = (nic) => {
  return !cannotEditInterface(nic) && !nic.link_connected && isInterface(nic);
};

const canMarkAsDisconnected = (nic) => {
  return !cannotEditInterface(nic) && nic.link_connected && isInterface(nic);
};

const canAddAliasOrVLAN = (nic) => {
  if ($parent.isController) {
    return false;
  } else if (isAllNetworkingDisabled()) {
    return false;
  } else {
    return canAddAlias(nic) || canAddVLAN(nic);
  }
};

// Check if the interface can be removed.
const canBeRemoved = () => {
  return !$parent.isController && !isAllNetworkingDisabled();
};
