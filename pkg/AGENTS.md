# pkg/ KNOWLEDGE BASE

## OVERVIEW
Reusable Go libraries, about 162 Go files, shared by `api/` and other binaries: infrastructure, not HTTP endpoint handlers.

## STRUCTURE
The 24 package directories group platform integrations, transport helpers, policy, scheduling, and test support.

## WHERE TO LOOK
| Need | Location | Scope |
|---|---|---|
| Helm stack templates | `libhelm/` | Helm cache, options, releases, SDK, types, and SDK test utilities |
| Compose and Swarm stacks | `libstack/` | Stack engines under `compose/` and `swarm/`, plus status fixtures |
| HTTP and SSRF | `libhttp/` | Shared clients, errors, requests, responses, and outbound SSRF protection |
| Kubernetes CLI | `libkubectl/` | Apply, delete, drain, describe, restart, and dynamic resources |
| Compose conversion | `libkompose/` | Kompose conversion and related types |
| OCI registries | `liboras/` | ORAS/OCI repositories, manifests, and registry clients |
| Access resolution | `authorization/` | Authorization and endpoint access control |
| Policy fingerprints | `libpolicy/` | Policy fingerprint helpers |
| Edge utilities | `edge/` | Shared edge helpers |
| Endpoint utilities | `endpoints/` | Shared endpoint helpers |
| Feature flags | `featureflags/` | Feature flag definitions and checks |
| Build metadata | `build/` | Build and version metadata |
| Metric types | `metrics/` | Shared metric types |
| Prometheus | `libprometheus/` | Prometheus scraping, rules, and managers |
| Networking diagnostics | `networking/` | Network diagnostic helpers |
| Registry transport | `registryhttp/` | Registry HTTP clients and transports |
| Crypto helpers | `libcrypto/` | Encryption, hashing, SSL, and related helpers |
| FIPS support | `fips/` | FIPS-specific runtime support |
| Random values | `librand/` | Randomness helpers |
| Retry behavior | `retry/` | Retry policy and execution helpers |
| Scheduling | `schedule/` | Ticker and scheduling helpers |
| Snapshots | `snapshot/` | Docker and Kubernetes snapshot helpers |
| Validation | `validate/` | Shared validation functions |
| Test support | `testhelpers/` | Integration test helpers |

## CONVENTIONS
- Keep the module path `github.com/portainer/portainer`; the module declares Go `1.26.4`.
- The main `.golangci.yaml` applies here. Follow its security and style linters, including `zerologlint` and `testifylint`.
- Do not import prohibited packages: `encoding/json`, `golang.org/x/crypto`, legacy YAML, JWT, UUID, or semver packages. Use the configured replacements.
- `libhttp/error/status.go` owns shared `HandlerError` and status helpers such as `BadRequest` and `NotFound`; `api` handlers use these repo-wide.
- Tests use `*_test.go`, table-driven `t.Run`, `testify` `assert`/`require`, and `httptest` where HTTP behavior needs a server.
- Representative tests: `validate/validate_test.go`, `snapshot/docker_test.go`, `libhelm/sdk/client_test.go`, and `schedule/ticker_test.go`.
- Check `pkg/` first when adding shared infrastructure. Keep this directory upstream-aligned.

## ANTI-PATTERNS
- Do not add HTTP endpoint handlers here; those belong under `api/`.
- Do not duplicate infrastructure in `api/`; reuse the package library, especially `libhttp/ssrf` for outbound SSRF protection.
- Do not bypass shared `libhttp/error` status types with locally defined handler errors.
- Do not add fork-specific packages or localization logic to `pkg/`.
- Do not use prohibited imports or weaken the repository lint and FIPS constraints.
