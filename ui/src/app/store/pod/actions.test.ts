import { actions } from "./slice";

describe("pod actions", () => {
  it("should handle fetching pods", () => {
    expect(actions.fetch()).toEqual({
      type: "pod/fetch",
      meta: {
        model: "pod",
        method: "list",
      },
    });
  });

  it("can handle creating pods", () => {
    expect(actions.create({ name: "pod1", description: "a pod" })).toEqual({
      type: "pod/create",
      meta: {
        model: "pod",
        method: "create",
      },
      payload: {
        params: {
          name: "pod1",
          description: "a pod",
        },
      },
    });
  });

  it("can handle updating pods", () => {
    expect(actions.update({ name: "pod1", description: "a pod" })).toEqual({
      type: "pod/update",
      meta: {
        model: "pod",
        method: "update",
      },
      payload: {
        params: {
          name: "pod1",
          description: "a pod",
        },
      },
    });
  });

  it("can handle deleting pods", () => {
    expect(actions.delete(1)).toEqual({
      type: "pod/delete",
      meta: {
        model: "pod",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can handle refreshing pods", () => {
    expect(actions.refresh(1)).toEqual({
      type: "pod/refresh",
      meta: {
        model: "pod",
        method: "refresh",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can handle composing pods", () => {
    const params = { id: 1 };
    expect(actions.compose(params)).toEqual({
      type: "pod/compose",
      meta: {
        model: "pod",
        method: "compose",
      },
      payload: {
        params,
      },
    });
  });

  it("can handle selecting pods", () => {
    expect(actions.setSelected([1, 2, 4])).toEqual({
      type: "pod/setSelected",
      payload: [1, 2, 4],
    });
  });

  it("can handle cleaning pods", () => {
    expect(actions.cleanup()).toEqual({
      type: "pod/cleanup",
    });
  });
});
