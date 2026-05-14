import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, baseThresholds } from "./thresholds";

// 50 users for 6 hours — surfaces memory leaks, FD leaks, slow pool drift.
export const options = {
  vus: 50,
  duration: "6h",
  thresholds: baseThresholds,
};

export default function () {
  const r = http.get(`${BASE_URL}/api/projects`);
  check(r, { "status 200": (res) => res.status === 200 });
  sleep(3);
}
