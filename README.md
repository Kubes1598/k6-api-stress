# k6-api-stress

Four k6 test profiles — smoke, load, stress, soak — that live next to the API they test. Thresholds are code. CI fails when they fail. Results stream to Grafana Cloud so I get trend lines, not screenshots.

## Why not JMeter

I still use JMeter for full user-flow tests that mix protocols (the `jmeter-saas-loadtest` repo is the production-style one). For API-only checks, k6 is just nicer to live with: the tests are TypeScript files in the repo, they get reviewed in PRs like any other code, and the thresholds are the build gate.

## The profiles

| Profile  | Users  | Duration | When         | What it catches                                  |
| -------- | ------ | -------- | ------------ | ------------------------------------------------ |
| `smoke`  | 1      | 30 s     | Every PR     | Endpoint alive, schema didn't drift.             |
| `load`   | 50     | 5 m      | Every PR     | Regression in p95 or error rate.                 |
| `stress` | → 300  | 9 m      | Nightly      | Where the API breaks (saturation point).         |
| `soak`   | 50     | 6 h      | Weekly       | Memory leaks, FD leaks, pool drift over time.    |

The soak test is the one that earns its keep. Running 50 users for 6 hours surfaced a 12 MB/hour memory leak on a real API that none of the shorter profiles caught. Slow growth is invisible to smoke and load runs.

## Run locally

```bash
brew install k6
k6 run --env BASE_URL=https://staging.example.com tests/smoke.ts
```

Stream to Grafana Cloud:

```bash
k6 cloud run tests/load.ts
```

## Thresholds

All four profiles share these failure conditions in `tests/thresholds.ts`:

- `http_req_duration` p95 < 500 ms
- `http_req_failed` rate < 1%
- Custom checks pass rate > 99%

The stress profile uses a stretched threshold (p95 < 1500ms) to express graceful degradation. The point isn't that 1.5 seconds is acceptable for users — it's that the API should degrade rather than fail outright when overloaded.

## Companion

- The full-flow load test using JMeter: [jmeter-saas-loadtest](https://github.com/Kubes1598/jmeter-saas-loadtest).
- The alert rules that turn these thresholds into prod pages: [slo-error-budget-alerting](https://github.com/Kubes1598/slo-error-budget-alerting).

## License

MIT. See [LICENSE](./LICENSE).
