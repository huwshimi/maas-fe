import React from "react";

import "./MachineList.scss";
import Button from "app/base/components/Button";
import data from "./data.json";
import MainTable from "app/base/components/MainTable";

const sliced = data;

const sortStatus = (a, b) => {
  if (a.sortData.header) {
    return -1;
  }
  if (b.sortData.header) {
    return 1;
  }
  if (!a.sortData || !b.sortData) {
    return 0;
  }
  if (a.sortData.status > b.sortData.status) {
    return 1;
  } else if (a.sortData.status < b.sortData.status) {
    return -1;
  }
  return 0;
};

const normaliseStatus = status => {
  switch (status) {
    case "Entering rescue mode":
    case "Exiting rescue mode":
      return "Rescue mode";
    case "Failed testing":
    case "Failed to exit rescue mode":
      return "Failed";
    default:
      return status;
  }
};

const generateRows = machines =>
  machines.map(machine => ({
    columns: [
      { content: null },
      {
        content: (
          <>
            <input type="checkbox" />
            <label>{machine.fqdn}</label>
          </>
        )
      },
      { content: <>{machine.power_state}</> },
      { content: <>{machine.status}</> },
      { content: <>{machine.owner}</> },
      { content: <>{machine.pool.name}</> },
      { content: <>{machine.zone.name}</> },
      {
        content: (
          <>
            <i className="p-icon--error" /> {machine.cpu_count}{" "}
            <small className="p-muted-heading">i386</small>
          </>
        )
      },
      {
        content: (
          <>
            <i className="p-icon--error" /> {machine.memory}{" "}
            <small className="p-muted-heading">GiB</small>
          </>
        )
      },
      {
        content: (
          <>
            <i className="p-icon--error" /> {machine.physical_disk_count}{" "}
            <small className="p-muted-heading">GiB</small>
          </>
        )
      },
      {
        content: (
          <>
            {machine.storage} <small className="p-muted-heading">GiB</small>
          </>
        )
      }
    ],
    sortData: {
      status: machine.status,
      name: machine.fqdn,
      power: machine.power_state,
      status: normaliseStatus(machine.status),
      owner: machine.owner,
      pool: machine.pool.name,
      zone: machine.zone.name,
      cores: machine.cpu_count,
      ram: machine.memory,
      disks: machine.physical_disk_count,
      storage: machine.storage
    }
  }));

const MachineList = () => {
  const rows = [
    "Failed",
    "Testing",
    "New",
    "Rescue mode",
    "Releasing",
    "Commissioning"
  ]
    .map(status => ({
      columns: [
        {
          content: (
            <>
              <input type="checkbox" />
              <label>
                <strong>{status}</strong>
              </label>
            </>
          )
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      sortData: {
        status: status
      }
    }))
    .concat(generateRows(sliced))
    .sort(sortStatus);
  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        defaultSort="status"
        defaultSortDirection="ascending"
        headers={[
          {
            content: (
              <>
                <input type="checkbox" />
                <label></label>
              </>
            ),
            style: { width: "3rem" }
          },
          {
            className: "p-table-multi-header",
            content: (
              <>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  FQDN
                </Button>
                <span className="p-table-multi-header__spacer">|</span>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  MAC
                </Button>
                <span className="p-table-multi-header__spacer">|</span>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  IP
                </Button>
              </>
            ),
            sortKey: "name"
          },
          {
            content: "Power",
            sortKey: "power"
          },
          {
            content: "Status",
            sortKey: "status"
          },
          {
            content: "Owner",
            sortKey: "owner"
          },
          {
            content: "Pool",
            sortKey: "pool"
          },
          {
            content: "Zone",
            sortKey: "zone"
          },
          {
            content: "Cores",
            sortKey: "cores"
          },
          {
            content: "Ram",
            sortKey: "ram"
          },
          {
            content: "Disks",
            sortKey: "disks"
          },
          {
            content: "Storage",
            sortKey: "storage"
          }
        ]}
        paginate={200}
        preSort={sortStatus}
        rows={rows}
        sortable
      />
    </>
  );
};

export default MachineList;
