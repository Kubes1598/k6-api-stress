import http from "k6/http";
import { check } from "k6";
import { BASE_URL, stretchedThresholds } from "./thresholds";

export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 300 },
    { duration: "2m", target: 0 },
  ],
  thresholds: stretchedThresholds,
};

export default function () {
  const r = http.get(`${BASE_URL}/api/projects`);
  check(r, { "no 5xx": (res) => res.status < 500 });
}
