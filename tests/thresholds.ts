// Shared thresholds — imported by every profile so the bar is consistent.
export const baseThresholds = {
  http_req_duration: ["p(95)<500"],
  http_req_failed: ["rate<0.01"],
  checks: ["rate>0.99"],
};

export const stretchedThresholds = {
  // Stress profile: graceful degradation is OK, hard failure is not.
  http_req_duration: ["p(95)<1500"],
  http_req_failed: ["rate<0.05"],
  checks: ["rate>0.95"],
};

export const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
