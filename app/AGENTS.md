# APP KNOWLEDGE BASE

## OVERVIEW
Frontend hybrid: legacy AngularJS modules and the newer React application coexist under `app/`.

## STRUCTURE
- `docker/`, `kubernetes/`, `edge/`, `agent/`, `portainer/`, `azure/`: legacy AngularJS feature modules.
- `react/`: newer React application; its own `app/react/AGENTS.md` is authoritative for that subtree.
- `react-tools/`: AngularJS to React adapters and wrapper utilities.
- `setup-tests/`: test bootstrap, MSW handlers, and i18n test setup.
- `assets/`, `types/`, `__mocks__/`: shared frontend assets, types, and test mocks.
- `.storybook/`: Storybook configuration is outside this directory, but covers app components.

## WHERE TO LOOK
| Task | Location | Notes |
|---|---|---|
| Trace frontend startup | `index.js`, `index.html`, `app.js`, `config.js` | Webpack entry, AngularJS shell, startup hook, and `/auth` fallback. |
| Change legacy Docker UI | `docker/views/`, `docker/components/`, `docker/services/` | Keep the change in the legacy feature unless a React bridge already owns the view. |
| Change new UI | `react/` | Follow that subtree's `AGENTS.md`; do not add a parallel legacy view. |
| Add or change a legacy route | `*/__module.js` | Register UI Router states through `$stateRegistryProvider`. |
| Call a REST endpoint from legacy code | `*/rest/`, `*/rest/v1/` | Existing AngularJS `$resource` factories live here. |
| Wrap endpoint access for feature code | `*/services/` | Service wrappers sit between controllers and REST or React query code. |
| Bridge a React view into legacy | `*/react/index.ts`, `react-tools/` | Feature modules register React views as AngularJS components. |
| Find shared API constants | `constants.ts`, `ng-constants.ts` | Use the existing constant modules. |
| Find Chinese UI text | Matching `.html`, `.js`, `.ts`, `.tsx` | Check HTML templates and controllers/services, not only React files. |
| Add legacy tests | Beside legacy helpers/services | Coverage is sparse; existing examples include `docker/helpers/splitargs.test.ts` and `portainer/services/notifications.test.ts`. |

## CONVENTIONS
- Bootstrap is AngularJS: `index.js` imports `agent`, `azure`, `docker`, `edge`, and `portainer`, then runs `onStartupAngular`.
- `index.html` is the AngularJS shell. It declares `ng-app="portainer"` and renders sidebar/content through `#sideview` and `ui-view`.
- Routing is UI Router, not React Router. Feature modules such as `docker/__module.js` and `kubernetes/__module.js` call `$stateRegistryProvider.register`.
- Legacy views commonly pair `views/**/*.html` with `*Controller.js`, for example `docker/views/volumes/volumes.html` and `volumesController.js`.
- Newer legacy screens use a component definition plus controller, for example `docker/views/volumes/edit/volume.js`; reusable widgets belong under a feature's `components/` directory.
- Legacy REST factories use AngularJS `$resource` under feature `rest/` and `rest/v1/`, such as `agent/rest/browse.js` and `kubernetes/rest/pod.js`.
- React migration helpers live in `react-tools/`: `react2angular.tsx`, `withUIRouter.tsx`, `withCurrentUser.tsx`, `withReactQuery.tsx`, `withFormValidation.ts`, and `withControlledInput.ts`.
- Feature bridge entry points exist at `docker/react/`, `kubernetes/react/`, `edge/react/`, `azure/react/`, and `portainer/react/`.
- Some legacy services delegate to React query utilities. `docker/services/volumeService.js` is the concrete example.
- Production localization is direct inline Chinese in both templates and JavaScript or TypeScript. `i18n.ts` and `setup-tests/i18n.ts` are i18next scaffolding, not the main production path.
- Keep the protected technical terms (`Docker`, `Kubernetes`, `Helm`, `Ingress`, `Registry`, `Webhook`, `TLS`, `ConfigMap`, `Secret`, `YAML`) untranslated or mixed; full policy is in the root `AGENTS.md`.

## ANTI-PATTERNS
- Do not route new or existing screens with React Router; use the UI Router state registry.
- Do not place a legacy controller-only change in `app/react/`, or a React view in legacy templates, without using the established bridge.
- Do not assume a REST factory is the source of truth when the feature service delegates to React queries.
- Do not add a new localization abstraction for ordinary visible strings; inspect `.html` and `.js` inline Chinese first.
- Do not rely on deprecated services for new code: `portainer/services/themeManager.js` points to `applyTheme`, `authentication.js` points to `Authentication.isAdmin`, and `porAccessControlFormModel.js` points to `./model.ts` for React.
- Do not expect broad legacy test coverage. Most tests are under `app/react`; add legacy coverage only beside the behavior being changed.
