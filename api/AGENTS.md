# API BACKEND KNOWLEDGE BASE

## OVERVIEW
Go backend, roughly 977 files, retaining the upstream Portainer shape under `api/`; shared implementations belong in `pkg/` (see `pkg/AGENTS.md`).

## STRUCTURE
- `cmd/portainer/`: process entry and composition root.
- `http/`: transport, handlers, middleware, security, proxy, errors, models, utilities, offline gate, CSRF.
- `database/`: database factory and BoltDB implementation only.
- `datastore/`: concrete Store, transactions, migrations, post-init work.
- `dataservices/`: DataStore contracts, domain services, generic CRUD bases, errors.
- Domain areas: `docker/`, `kubernetes/`, `edge/`, `stacks/`, `gitops/`, `internal/`.
- Small helpers: `concurrent/`, `slicesx/`, `set/`, `url/`, `crypto/`, `jwt/`, `logs/`, `scheduler/`, `ws/`.

## WHERE TO LOOK
| Task | Location | Notes |
|---|---|---|
| Start or compose the server | `cmd/portainer/main.go` | `main()` calls `initCLI()` then `buildServer()`, returning `api/http.Server`. |
| Wire handler dependencies | `http/server.go` | `Start` creates handlers, then assigns DataStore and other services after `NewHandler`. |
| Add an HTTP endpoint | `http/handler/<feature>/` | Embed `*mux.Router`; register with `.Methods(...)`. Top level dispatch is in `handler/handler.go`. |
| Protect an endpoint | `http/security/bouncer.go` | Use `PublicAccess`, `AuthenticatedAccess`, `RestrictedAccess`, `AdminAccess`, or `TeamLeaderAccess`; check environments with `AuthorizedEndpointOperation`. |
| Return handler failures | `pkg/libhttp/error/` | Return `*httperror.HandlerError`; wrap with `httperror.LoggerHandler`. Escape hatch: `httperror.WriteError`. |
| Add persistence access | `dataservices/interface.go`, `datastore/services.go` | Add the domain interface, then implement it on the BoltDB-backed `Store`. |
| Use generic persistence | `dataservices/base.go`, `base_tx.go` | `BaseCRUD` supplies `Create`, `Read`, `Exists`, `ReadAll`, `Update`, `Delete`; wrappers open read or update transactions. |
| Handle missing records | `dataservices/errors/`, `dataservices/interface.go` | Use `ErrObjectNotFound` and `dataservices.IsErrObjectNotFound`, not string matching. |
| Add a schema migration | `datastore/migrator/migrator.go` | Append only. Do not reorder or change released migrations. The current migration always runs last. |
| Trace Edge or GitOps | `edge/`, `http/handler/edge*`, `internal/edge/`, `dataservices/edge*`; `gitops/sources`, `gitops/workflows`, `dataservices/source`, `dataservices/workflow`, `http/handler/gitops` | These areas cross handlers, services, and domain code. |
| Find tests | `**/*_test.go` | About 291 files; standard tests use table-driven `t.Run`, testify, and `net/http/httptest`. |

## CONVENTIONS
- `Handler.ServeHTTP` is not chi routing. It checks `strings.HasPrefix` for `/api` and uses `http.StripPrefix` to delegate to feature handlers. Feature routers are Gorilla `mux.Router` instances.
- HTTP errors serialize as JSON `{message, details}`. Status constructors include `BadRequest`, `NotFound`, `Unauthorized`, `Forbidden`, `InternalServerError`, `Conflict`, and `NewError`.
- `dataservices.DataStore` embeds `DataStoreTx`; domain interfaces include `UserService`, `EndpointService`, `StackService`, `SourceService`, `WorkflowService`, and others. `Store` has the compile-time assertion `var _ dataservices.DataStore = &Store{}`.
- Keep database reads and writes inside the transaction APIs. The forward linter rejects direct datastore access outside transactions.
- Use the filesystem helper for joins, not `path.Join` or `filepath.Join`. In stack code, `filesystem.JoinPaths` performs the required path handling.
- Follow `.golangci.yaml` and `.golangci-forward.yaml`. Prohibited imports include `encoding/json`, `golang.org/x/crypto`, legacy YAML/JWT/UUID/semver packages, and deprecated shared packages. Use `crypto.CreateTLSConfiguration()`.
- Keep the module path `github.com/portainer/portainer`; do not change it to `portainer-cn`.
- `api/portainer.go` defines `APIVersion="2.43.0"` and `APIVersionSupport="STS"`. Keep version metadata aligned with `package.json` and the `@version` in `http/handler/handler.go`; the parent guide defines the three-way rule.
- `api/stacks/stackutils/util.go:IsRelativePathStack` must always return `false` in CE.

## ANTI-PATTERNS
- Do not use chi, bypass `Handler.ServeHTTP`, or register routes without the feature Gorilla mux router.
- Do not bypass bouncer middleware or omit `AuthorizedEndpointOperation` when an endpoint resource needs authorization.
- Do not access BoltDB services directly from handlers; go through `dataservices` and transaction wrappers.
- Do not reorder or edit released migrations. Do not remove the `migrate_data.go:124` failure sentinel, used by `migrate_data_test.go`.
- Do not duplicate shared code already provided by `pkg/`, including `libhelm`, `libstack/compose`, `libstack/swarm`, `libhttp`, `libkubectl`, `ssrf`, `libcrypto`, and `liboras`.
- New endpoint path: handler directory, Gorilla mux route, `httperror.LoggerHandler`, bouncer middleware, dataservices access, then an `httptest` test.
