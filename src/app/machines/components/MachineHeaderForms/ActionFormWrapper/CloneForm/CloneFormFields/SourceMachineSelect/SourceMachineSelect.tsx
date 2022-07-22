import type { ReactNode } from "react";

import { Notification, Spinner, Strip } from "@canonical/react-components";
import classNames from "classnames";

import SourceMachineDetails from "./SourceMachineDetails";

import { MachineSelect } from "app/base/components/MachineSelect/MachineSelect";
import type { Machine, MachineDetails } from "app/store/machine/types";

type Props = {
  className?: string;
  loadingData?: boolean;
  loadingMachineDetails?: boolean;
  machines: Machine[];
  onMachineClick: (machine: Machine | null) => void;
  selectedMachine?: MachineDetails | null;
};

export const SourceMachineSelect = ({
  className,
  loadingData = false,
  loadingMachineDetails = false,
  machines,
  onMachineClick,
  selectedMachine = null,
}: Props): JSX.Element => {
  let content: ReactNode;
  if (loadingData) {
    content = (
      <Strip shallow>
        <Spinner data-testid="loading-spinner" text="Loading..." />
      </Strip>
    );
  } else if (loadingMachineDetails || selectedMachine) {
    content = <SourceMachineDetails machine={selectedMachine} />;
  } else if (machines.length === 0) {
    content = (
      <Notification
        borderless
        data-testid="no-source-machines"
        severity="negative"
        title="No source machine available"
      >
        All machines are selected as destination machines. Unselect at least one
        machine from the list.
      </Notification>
    );
  }
  return (
    <div className={classNames("source-machine-select", className)}>
      <MachineSelect machines={machines} onSelect={onMachineClick} />
      {content}
    </div>
  );
};

export default SourceMachineSelect;
