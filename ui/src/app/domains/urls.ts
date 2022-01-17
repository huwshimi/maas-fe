import type { Domain } from "app/store/domain/types";
import { argPath } from "app/utils";

const urls = {
  domain: {
    index: argPath<{ id: Domain["id"] }>("/domain/:id"),
  },
  domains: {
    index: "/domains",
  },
};

export default urls;
