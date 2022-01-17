import { useEffect, useState } from "react";

import { Col, Row, Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import MachineTestsDetailsLogs from "./MachineTestsDetailsLogs";

import ScriptStatus from "app/base/components/ScriptStatus";
import { useGetURLId } from "app/base/hooks/urls";
import machineURLs from "app/machines/urls";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import type { ScriptResultResult } from "app/store/scriptresult/types";
import {
  ScriptResultMeta,
  ScriptResultDataType,
} from "app/store/scriptresult/types";
import { isId } from "app/utils";

const MachineTestsDetails = (): JSX.Element | null => {
  const [fetched, setFetched] = useState(false);
  const dispatch = useDispatch();
  const id = useGetURLId(MachineMeta.PK);
  const scriptResultId = useGetURLId(ScriptResultMeta.PK, "scriptResultId");
  const returnPath = useLocation().pathname.split("/")?.[3];
  const result = useSelector((state: RootState) =>
    scriptResultSelectors.getById(state, scriptResultId)
  );
  const logs = useSelector(scriptResultSelectors.logs);
  const loading = useSelector(scriptResultSelectors.loading);
  const log = logs && isId(scriptResultId) ? logs[scriptResultId] : null;

  useEffect(() => {
    if (!fetched && isId(scriptResultId)) {
      dispatch(scriptResultActions.get(scriptResultId));
      setFetched(true);
    }
  }, [dispatch, scriptResultId, fetched, setFetched]);

  useEffect(() => {
    if (!(logs && isId(scriptResultId) && logs[scriptResultId]) && result) {
      [
        ScriptResultDataType.COMBINED,
        ScriptResultDataType.STDOUT,
        ScriptResultDataType.STDERR,
        ScriptResultDataType.RESULT,
      ].forEach((type) =>
        dispatch(scriptResultActions.getLogs(result.id, type))
      );
    }
  }, [dispatch, result, logs, scriptResultId]);

  if (loading) {
    return <Spinner />;
  } else if (!result || !isId(id)) {
    return <h4 data-testid="not-found">Script result could not be found.</h4>;
  }

  if (id && result) {
    const hasMetrics = result.results.length > 0;
    return (
      <>
        <Row className="u-sv2">
          <Col size={8}>
            <h2 className="p-heading--four">{result.name} details</h2>
          </Col>
          <Col size={4} className="u-align--right">
            <Link to={`${machineURLs.machine.index({ id })}/${returnPath}`}>
              &lsaquo; Back to test results
            </Link>
          </Col>
        </Row>
        <Row className="u-sv2">
          <Col size={6}>
            <Row>
              <Col size={2}>Status</Col>
              <Col size={4}>
                <ScriptStatus status={result.status}>
                  {result.status_name}
                </ScriptStatus>
              </Col>
            </Row>
            <Row>
              <Col size={2}>Exit status</Col>
              <Col size={4}>{result.exit_status}</Col>
            </Row>
            <Row>
              <Col size={2}>Tags</Col>
              <Col size={4}>{result.tags}</Col>
            </Row>
          </Col>
          <Col size={6}>
            <Row>
              <Col size={2}>Start time</Col>
              <Col size={4}>{result.started}</Col>
            </Row>
            <Row>
              <Col size={2}>End time</Col>
              <Col size={4}>{result.ended}</Col>
            </Row>
            <Row>
              <Col size={2}>Runtime</Col>
              <Col size={4}>{result.runtime}</Col>
            </Row>
          </Col>
        </Row>
        {hasMetrics ? (
          <Row>
            <Col size={12}>
              <h4>Metrics</h4>
              <table role="grid" data-testid="script-details-metrics">
                <tbody>
                  {result.results.map((item: ScriptResultResult) => (
                    <tr role="row" key={`metric-${item.name}`}>
                      <td role="gridcell">
                        <Tooltip message={item.description}>
                          {item.title}
                        </Tooltip>
                      </td>
                      <td role="gridcell">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        ) : null}
        {log ? (
          <Row>
            <Col size={12}>
              <h4>Output</h4>
              <MachineTestsDetailsLogs log={log} />
            </Col>
          </Row>
        ) : null}
      </>
    );
  }
  return null;
};

export default MachineTestsDetails;
