import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteConfirm from "./DeleteConfirm";

import SectionHeader from "app/base/components/SectionHeader";
import authSelectors from "app/store/auth/selectors";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import zonesURLs from "app/zones/urls";

type Props = {
  id: number;
};

const ZoneDetailsHeader = ({ id }: Props): JSX.Element => {
  const [showConfirm, setShowConfirm] = useState(false);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const zonesSaved = useSelector(zoneSelectors.saved);
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, Number(id))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (zonesSaved) {
      dispatch(zoneActions.cleanup());
      navigate({ pathname: zonesURLs.index });
    }
  }, [dispatch, zonesSaved, navigate]);

  const isAdmin = useSelector(authSelectors.isAdmin);
  const isDefaultZone = id === 1;

  const deleteZone = () => {
    if (isAdmin && !isDefaultZone) {
      dispatch(zoneActions.delete(id));
    }
  };

  const closeExpanded = () => setShowConfirm(false);

  let buttons: JSX.Element[] | null = [
    <Button
      appearance="neutral"
      data-testid="delete-zone"
      key="delete-zone"
      onClick={() => setShowConfirm(true)}
    >
      Delete AZ
    </Button>,
  ];

  if (showConfirm || isDefaultZone || !isAdmin) {
    buttons = null;
  }

  let title = "";

  let confirmDelete = null;

  if (showConfirm && isAdmin && !isDefaultZone) {
    confirmDelete = (
      <>
        <hr />
        <DeleteConfirm
          confirmLabel="Delete AZ"
          onConfirm={deleteZone}
          closeExpanded={closeExpanded}
          message="Are you sure you want to delete this AZ?"
        />
      </>
    );
  }

  if (zonesLoaded && zone) {
    title = `Availability zone: ${zone.name}`;
  } else if (zonesLoaded) {
    title = "Availability zone not found";
    buttons = null;
  }

  return (
    <>
      <SectionHeader buttons={buttons} loading={!zonesLoaded} title={title} />

      {confirmDelete}
    </>
  );
};

export default ZoneDetailsHeader;
