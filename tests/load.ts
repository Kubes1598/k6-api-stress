import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, baseThresholds } from "./thresholds";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "3m", target: 50 },
    { duration: "1m", target: 0 },
  ],
  thresholds: baseThresholds,
};

const ENDPOINTS = ["/api/projects", "/api/projects/k6-api-stress", "/api/health"];

export default function () {
  const url = `${BASE_URL}${ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)]}`;
  const r = http.get(url);
  check(r, { "status 2xx": (res) => res.status >= 200 && res.status < 300 });
  sleep(Math.random() * 2 + 1);
}
