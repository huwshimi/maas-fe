import { Button, Code, Col, Row } from "@canonical/react-components";
import { format, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import "./ScriptsList.scss";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import ColumnToggle from "app/base/components/ColumnToggle";
import SettingsTable from "app/settings/components/SettingsTable";
import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import { scripts as scriptActions } from "app/base/actions";
import { scripts as scriptSelectors } from "app/base/selectors";
import Tooltip from "app/base/components/Tooltip";

const generateRows = (
  scripts,
  expandedId,
  setExpandedId,
  expandedType,
  setExpandedType,
  hideExpanded,
  dispatch,
  setDeleting
) =>
  scripts.map(script => {
    const expanded = expandedId === script.id;
    const showDelete = expandedType === "delete";

    const [lastHistory] = script.history.slice(-1);

    let scriptSrc;
    if (lastHistory.data) {
      try {
        scriptSrc = atob(lastHistory.data);
      } catch {
        console.error(`Unable to decode script src for ${script.name}.`);
      }
    }

    // history timestamps are in the format: Mon, 02 Sep 2019 02:02:39 -0000
    let uploadedOn;
    if (lastHistory && lastHistory.created) {
      try {
        uploadedOn = format(
          parse(
            lastHistory.created,
            "EEE, dd LLL yyyy HH:mm:ss xxxx",
            new Date()
          ),
          "yyyy-LL-dd H:mm"
        );
      } catch (error) {
        console.error(`Unable to parse timestamp for ${script.name}.`);
      }
    } else {
      uploadedOn = "Never";
    }

    return {
      className: expanded ? "p-table__row is-active" : null,
      columns: [
        {
          content: (
            <ColumnToggle
              isExpanded={expanded && !showDelete}
              label={script.name}
              onClose={hideExpanded}
              onOpen={() => {
                setExpandedId(script.id);
                setExpandedType("details");
              }}
            />
          ),
          role: "rowheader"
        },
        {
          content: script.description
        },
        { content: uploadedOn },
        {
          content: (
            <Tooltip
              position="left"
              message={script.default && "Default scripts cannot be deleted."}
            >
              <Button
                appearance="base"
                disabled={script.default}
                className="is-dense u-table-cell-padding-overlap"
                hasIcon
                onClick={() => {
                  setExpandedId(script.id);
                  setExpandedType("delete");
                }}
              >
                <i className="p-icon--delete">Delete</i>
              </Button>
            </Tooltip>
          ),
          className: "u-align--right"
        }
      ],
      expanded: expanded,
      expandedContent:
        expanded &&
        (showDelete ? (
          <TableDeleteConfirm
            modelName={script.name}
            modelType="Script"
            onCancel={hideExpanded}
            onConfirm={() => {
              dispatch(scriptActions.delete(script));
              setDeleting(script.name);
              hideExpanded();
            }}
          />
        ) : (
          <Row>
            <Col size="10">
              <Code className="u-no-margin--bottom">{scriptSrc}</Code>
            </Col>
          </Row>
        )),
      key: script.id,
      sortData: {
        name: script.name,
        description: script.description,
        uploaded_on: uploadedOn
      }
    };
  });

const ScriptsList = ({ type = "commissioning" }) => {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState();
  const [expandedType, setExpandedType] = useState();
  const [searchText, setSearchText] = useState("");
  const [deletingScript, setDeleting] = useState();

  const scriptsLoading = useSelector(scriptSelectors.loading);
  const scriptsLoaded = useSelector(scriptSelectors.loaded);
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);

  const userScripts = useSelector(state =>
    scriptSelectors.search(state, searchText, type)
  );

  useWindowTitle(`${type[0].toUpperCase()}${type.slice(1)} scripts`);

  useAddMessage(
    saved,
    scriptActions.cleanup,
    `${deletingScript} removed successfully.`,
    setDeleting
  );

  useAddMessage(
    hasErrors,
    scriptActions.cleanup,
    `Error removing ${deletingScript}: ${errors}`,
    null,
    "negative"
  );

  const hideExpanded = () => {
    setExpandedId();
    setExpandedType();
  };

  useEffect(() => {
    dispatch(scriptActions.fetch());
  }, [dispatch, type]);

  return (
    <SettingsTable
      buttons={[
        { label: "Upload script", url: `/settings/scripts/${type}/upload` }
      ]}
      headers={[
        {
          content: "Script name",
          sortKey: "name"
        },
        {
          content: "Description",
          sortKey: "description"
        },
        {
          content: "Uploaded on",
          sortKey: "uploaded_on"
        },
        {
          content: "Actions",
          className: "u-align--right"
        }
      ]}
      loaded={scriptsLoaded}
      loading={scriptsLoading}
      rows={generateRows(
        userScripts,
        expandedId,
        setExpandedId,
        expandedType,
        setExpandedType,
        hideExpanded,
        dispatch,
        setDeleting
      )}
      searchOnChange={setSearchText}
      searchPlaceholder={`Search ${type} scripts`}
      searchText={searchText}
      tableClassName="scripts-list"
    />
  );
};

ScriptsList.propTypes = {
  type: PropTypes.string
};

export default ScriptsList;
