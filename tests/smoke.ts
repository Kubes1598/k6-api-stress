import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, baseThresholds } from "./thresholds";

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: baseThresholds,
};

export default function () {
  const r = http.get(`${BASE_URL}/api/health`);
  check(r, {
    "status is 200": (res) => res.status === 200,
    "has version field": (res) => !!res.json("version"),
  });
  sleep(1);
}
