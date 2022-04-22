import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { LinkMonitoring } from "../BondForm/types";

import AddBondForm from "./AddBondForm";

import { BondMode } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import {
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { submitFormikForm, waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("AddBondForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [
          vlanFactory({
            id: 1,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a table", async () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            id: 9,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
          machineInterfaceFactory({
            id: 10,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[{ nicId: 9 }, { nicId: 10 }]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    const table = wrapper.find("InterfaceFormTable");
    expect(table.exists()).toBe(true);
  });

  it("displays the selected interfaces when not editing members", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    const selected = [{ nicId: interfaces[0].id }, { nicId: interfaces[1].id }];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={selected}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("InterfaceFormTable").prop("interfaces")).toStrictEqual(
      selected
    );
  });

  it("displays all valid interfaces when editing members", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      // VLANs are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
        vlan_id: 1,
      }),
      // Bridges are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.BRIDGE,
        vlan_id: 1,
      }),
      // Bonds are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.BOND,
        vlan_id: 1,
      }),
      // Physical interfaces in other VLANs are not valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 2,
      }),
      // Physical interfaces in the same VLAN are valid.
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[
              { nicId: interfaces[0].id },
              { nicId: interfaces[1].id },
            ]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("button[data-testid='edit-members']").simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("InterfaceFormTable").prop("interfaces")).toStrictEqual(
      [
        { linkId: undefined, nicId: interfaces[0].id },
        { linkId: undefined, nicId: interfaces[1].id },
        { linkId: undefined, nicId: interfaces[6].id },
      ]
    );
  });

  it("disables the submit button if two interfaces aren't selected", async () => {
    const interfaces = [
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
      machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: 1,
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        system_id: "abc123",
        interfaces,
      }),
    ];
    const store = mockStore(state);
    // Use a component to pass props to the form so that setProps can be used
    // below.
    const PassthroughComponent = ({ ...props }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[
              { nicId: interfaces[0].id },
              { nicId: interfaces[1].id },
            ]}
            setSelected={jest.fn()}
            systemId="abc123"
            {...props}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<PassthroughComponent />);
    wrapper.find("button[data-testid='edit-members']").simulate("click");
    await waitForComponentToPaint(wrapper);
    wrapper.setProps({ selected: [] });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikFormContent").prop("submitDisabled")).toBe(true);
  });

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(store.getActions().some((action) => action.type === "fabric/fetch"));
    expect(store.getActions().some((action) => action.type === "subnet/fetch"));
    expect(store.getActions().some((action) => action.type === "vlan/fetch"));
  });

  it("displays a spinner when data is loading", async () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Spinner[data-testid='data-loading']").exists()).toBe(
      true
    );
  });

  it("displays a spinner if the VLAN hasn't been set", async () => {
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Spinner[data-testid='data-loading']").exists()).toBe(
      true
    );
  });

  it("can dispatch an action to add a bond", async () => {
    state.machine.items = [
      machineDetailsFactory({
        interfaces: [
          machineInterfaceFactory({
            id: 9,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
          machineInterfaceFactory({
            id: 10,
            type: NetworkInterfaceTypes.PHYSICAL,
            vlan_id: 1,
          }),
        ],
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddBondForm
            close={jest.fn()}
            selected={[{ nicId: 9 }, { nicId: 10 }]}
            setSelected={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      bond_downdelay: 10,
      bond_lacp_rate: "fast",
      bond_mode: BondMode.ACTIVE_BACKUP,
      bond_miimon: 20,
      bond_updelay: 30,
      fabric: 1,
      ip_address: "1.2.3.4",
      linkMonitoring: LinkMonitoring.MII,
      mac_address: "28:21:c6:b9:1b:22",
      mode: NetworkLinkMode.LINK_UP,
      name: "bond1",
      subnet: 1,
      tags: ["a", "tag"],
      vlan: 1,
    });
    await waitForComponentToPaint(wrapper);
    expect(
      store.getActions().find((action) => action.type === "machine/createBond")
    ).toStrictEqual({
      type: "machine/createBond",
      meta: {
        model: "machine",
        method: "create_bond",
      },
      payload: {
        params: {
          bond_downdelay: 10,
          bond_lacp_rate: "fast",
          bond_mode: BondMode.ACTIVE_BACKUP,
          bond_miimon: 20,
          bond_updelay: 30,
          fabric: 1,
          ip_address: "1.2.3.4",
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "bond1",
          parents: [9, 10],
          subnet: 1,
          system_id: "abc123",
          tags: ["a", "tag"],
          vlan: 1,
        },
      },
    });
  });
});
