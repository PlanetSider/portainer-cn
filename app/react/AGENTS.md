# REACT FRONTEND KNOWLEDGE BASE

## OVERVIEW
Modern React frontend, organized by Portainer domain and feature slice, with inline Chinese UI text.

## STRUCTURE
Top-level domains include `docker/`, `kubernetes/`, `edge/`, `portainer/`, `azure/`, `sidebar/`, `common/`, `components/`, `hooks/`, `utils/`, and `test-utils/`.

## WHERE TO LOOK
| Task | Location | Notes |
|---|---|---|
| Add a domain feature | `docker/`, `kubernetes/`, `edge/`, `portainer/`, `azure/` | Prefer a domain-first slice, not a layer-first folder |
| Follow a feature slice | `queries/`, `ListView/`, `ItemView/`, `CreateView/`, `types.ts`, `utils.ts` or `build-url.ts` | Queries hold `query-keys.ts` and `use*Query` or `use*Mutation` hooks |
| Build a table screen | `ListView/` and `components/datatables/` | Columns, actions, row contexts, and persisted settings are separate units |
| Add shared UI | `components/` | Reuse barrel exports from nearby `index.ts` files |
| Add a form | `components/form-components/` and the feature slice | Use Formik, Yup, and the existing validation helpers |
| Add server data access | Feature `queries/` | Use the shared axios client and React Query helpers |
| Add client or UI state | `hooks/`, feature stores, `components/datatables/` | Zustand stores cover environment, tables, insights, notifications, and Kubernetes summary |
| Add tests or stories | Beside the component as `*.test.tsx` or Storybook `*.stories.tsx` | Use the wrappers in `test-utils/` |
| Check auth code | `auth/` | Currently placeholder `.keep` files only. Actual auth is elsewhere |

## CONVENTIONS
- Organize by domain first. A normal slice is `queries/`, `ListView/` with `datatables/`, `ItemView/`, `CreateView/`, `types.ts`, and `utils.ts` or `build-url.ts`.
- Server state belongs in React Query v4, not Zustand. Put hierarchical readonly keys in `query-keys.ts` and end tuples with `as const`.
- Start keys with a domain namespace such as `'azure'` or a Docker root, include `environmentId` where applicable, and build item keys by spreading the parent key. The common filename is `query-keys.ts`; `app/react/docker/images/queries/queryKeys.ts` is the known variant.
- Mutations commonly combine `withInvalidate` and `withError` from `@/react-tools/react-query`, `withAgentTargetHeader()`, and `parseAxiosError()`. Use `@/portainer/services/axios/axios`.
- Client and UI state uses Zustand. Existing patterns include `useStore(store)`, `persist`, and `subscribeWithSelector`. See `current-environment-store.ts`, table state/settings, `insights-store.ts`, `notifications-store.ts`, and `kubernetes/summary/store.ts`.
- Forms use `<Formik>` with `validationSchema` and Yup. Use `yupToFormErrors` from `components/form-components/validate-form.ts` and validation hooks such as `useValidation.tsx`. Zod is only in generated API code, notably `portainer/generated-api/portainer/zod.gen.ts`.
- Routing uses UI Router through `@uirouter/react` and `@uirouter/react-hybrid`, not React Router. Navigate with `router.stateService.go()` and read `$state` parameters through the existing hooks. Tests use `test-utils/withRouter.tsx`.
- Use named function components such as `export function X`, explicit prop types, barrel `index.ts` exports, colocated tests, and colocated Storybook stories.
- Test IDs use `data-cy`; `app/setup-tests/setup-rtl.ts` configures it as Testing Library's `testIdAttribute`. Compose `withTestQuery.tsx` with retries disabled, `withRouter.tsx`, and `withUserProvider.tsx` as needed.
- Add Chinese directly in JSX props, children, columns, validation messages, notifications, placeholders, and aria titles. Existing examples include `title="添加新用户"`, `notifySuccess('用户创建成功')`, and `'用户名为必填项'`.
- Do not add `useTranslation`, `Trans`, or i18next calls in `app/react`. Some API and error-layer messages remain English and that is acceptable.
- Keep the protected terms from the root `AGENTS.md` untranslated or mixed; `Edge` and `kubectl` follow the same policy.
- The `portainer/` slice imports legacy shared services from `app/portainer`, including `user.service` and query keys. This boundary is porous, so verify imports before adding replacements.

## ANTI-PATTERNS
- Do not reorganize React features into shared layer-first folders.
- Do not use React Query v5, React Router, Redux, or React Hook Form.
- Do not invent a new query-key shape, omit the domain or environment parent, or use mutable key arrays.
- Do not put server state in Zustand or table settings in ad hoc component state.
- Do not introduce Zod for ordinary forms. Keep it in generated-api code only.
- Do not assume `app/react/auth/` contains the authentication implementation.
- Do not introduce translation abstractions or translate protected terms.
