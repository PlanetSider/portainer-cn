# PROJECT KNOWLEDGE BASE

**Generated:** 2026-09-05
**Upstream baseline:** d79ba726c (`2.45.0`)
**Branch:** develop

## OVERVIEW
`portainer-cn` 是基于上游 [portainer/portainer](https://github.com/portainer/portainer) CE **2.45.0 (LTS)** 的**中文汉化 fork**：只改前端可见文案，不改业务逻辑 / API 契约 / 版本号。前端为 **AngularJS 1.8 + React 17 混合**架构（`app/`），后端为 **Go**（`api/` + `pkg/`，module path 仍为 `github.com/portainer/portainer`）。镜像发布到 `ghcr.io/planetsider/portainer-cn`。

## STRUCTURE
```
portainer-cn/
├── app/                 # 前端：legacy AngularJS + 新 React 混合（见 app/AGENTS.md）
│   ├── react/           #   新 React 前端主目录 ~3020 个 TS/TSX（见 app/react/AGENTS.md）
│   ├── react-tools/     #   AngularJS↔React 桥接（react2angular、withUIRouter…）
│   ├── docker|kubernetes|edge|agent|portainer|azure/  # legacy AngularJS 模块
│   ├── index.js         #   webpack 入口（entry.main='./app'）
│   ├── i18n.ts          #   i18next 初始化（lng='zh-CN'，实际生产少用）
│   └── setup-tests/     #   Vitest/MSW 测试引导
├── api/                 # Go 后端（见 api/AGENTS.md）
│   ├── cmd/portainer/   #   main.go 入口 + buildServer() 依赖装配
│   ├── http/            #   handler / middlewares / security / proxy
│   ├── datastore/       #   BoltDB + migrator（迁移顺序不可改）
│   ├── dataservices/    #   领域仓储（DataStore 接口 + BaseDataService）
│   └── portainer.go     #   APIVersion="2.45.0" APIVersionSupport="LTS"
├── pkg/                 # 共享 Go 库（libhelm/libstack/libhttp…，见 pkg/AGENTS.md）
├── build/               # Dockerfile（linux/windows/docker-extension）
├── translations/        # i18next 骨架 en/zh-CN（各 30 行，非主要汉化机制）
├── webpack/             # 前端构建配置（common/dev/prod/testing/analyze）
├── .github/workflows/   # 仅 build-image.yml（push develop/main、v* tag、workflow_dispatch）
└── dist/                # 构建产物（.gitignore）
```

## WHERE TO LOOK
| 任务 | 位置 | 备注 |
|---|---|---|
| 汉化 React 界面文案 | `app/react/**` | 直接内联中文字符串，不用 useTranslation |
| 汉化 legacy 界面 | `app/{docker,kubernetes,edge,portainer}/**` | .html 模板 + .js 控制器内联中文 |
| Kubernetes 重点界面 | `app/react/kubernetes/{cluster,ingresses,helm,more-resources}/` | 节点、Ingress、Helm、Job、RBAC、ServiceAccount |
| 新 React 查询/表单 | `app/react/**/queries/`、`**/CreateView|ListView|ItemView/` | React Query v4 + Formik/Yup |
| 实时资源统计 | `app/react/docker/containers/StatsView/`、`app/react/kubernetes/**/StatsView/` | Recharts 折线图，容器、应用和节点统计 |
| GitOps 来源/工作流 | `app/react/portainer/gitops/{sources,workflows}/` | 来源创建与管理、工作流列表和详情 |
| Go handler / 路由 | `api/http/handler/**` | gorilla/mux + `httperror.LoggerHandler` |
| 版本号同步 | `api/portainer.go`、`package.json`、`api/http/handler/handler.go` | 三处必须一致（`@version` 注释） |
| 数据库迁移 | `api/datastore/migrator/migrator.go` | 已发布迁移禁止修改 |
| 镜像构建/发布 | `.github/workflows/build-image.yml`、`build/linux/Dockerfile` | linux/amd64 only |

## CODE MAP
> 本机无 LSP 服务器，以下基于源码勘察，centrality 未测量。

| 符号 | 类型 | 位置 | 角色 |
|---|---|---|---|
| `entry.main = './app'` | 配置 | `webpack/webpack.common.js` | 前端构建入口，输出到 `dist/public` |
| `portainer` (angular.module) | 模块 | `app/index.js` | 启动 AngularJS + React hybrid |
| `main()` / `buildServer()` | 函数 | `api/cmd/portainer/main.go` | 后端入口 + 依赖装配 |
| `Handler.ServeHTTP` | 方法 | `api/http/handler/handler.go` | 顶层 `/api` 路径分发（strings.HasPrefix） |
| `DataStore` 接口 | 接口 | `api/dataservices/interface.go` | 领域仓储聚合接口 |
| `APIVersion` / `APIVersionSupport` | 常量 | `api/portainer.go` | `"2.45.0"` / `"LTS"` |
| `workflows/ListView` / `workflows/ItemView` | React 页面 | `app/react/portainer/gitops/workflows/` | GitOps 工作流的列表、状态汇总与详情 |

## CONVENTIONS
- **汉化策略**（README 权威）：可直接中文表达的内容优先中文化；专业术语保留或中英混合；命令名/协议名/格式名/键名通常保留。
- **保留/中英混合术语**：`Docker`、`Kubernetes`、`Helm`、`Ingress`、`Registry`、`Webhook`、`TLS`、`ConfigMap`、`Secret`、`YAML`。
- **汉化实现方式**：直接内联中文字符串（`.tsx`/`.ts`/`.js`/`.html`），**不要引入 i18next 抽象**（依赖存在但生产代码未用；`translations/` 仅是骨架）。
- **测试断言**：已汉化的 UI 用中文断言；仍为英文的消息保留英文断言，不盲目翻译。
- **提交风格**：英文 plain（无 conventional 前缀），如 `sync upstream portainer 2.45.0`、`clarify upstream version mapping`。
- 前端：strict TS、`@/`（app）、`@@/`（app/react/components）、`@api/`（generated-api）别名；命名函数组件；`data-cy` 测试 ID。
- 后端：module path 保持 `github.com/portainer/portainer`，**不要改成 portainer-cn**；handler 返回 `*httperror.HandlerError`。
- CI：`pnpm install --no-frozen-lockfile`（勿改回 frozen，会触发 `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`）。

## ANTI-PATTERNS (THIS PROJECT)
- 不盲目翻译保留术语（见 CONVENTIONS）。
- 不借汉化修改业务逻辑 / API 契约 / 版本号。
- 不在 `app/react` 引入 `useTranslation`/`Trans`（现有代码全为内联中文）。
- 不直接使用 `ReactSelect`（用 `PortainerSelect`）。
- 不用 `crypto.randomUUID`、`crypto.subtle`、`navigator.clipboard` 等（eslint 禁止，用项目替代方案）。
- 不改 `api/datastore/migrator/` 中已发布迁移（文件内有 `!IMPORTANT` 警告）。
- 不加 `any`（eslint strict 禁止）。
- 不改动 `app/react/hooks/useDebounce.ts` 的实现（有明确 "Do not change" 警告）。

## UNIQUE STYLES
- 双栈前端：AngularJS 1.8（`@uirouter/angularjs`）+ React 17（`@uirouter/react-hybrid`）共存，React 组件通过 `app/react-tools/react2angular.tsx` 桥接注册。
- 路由是 **UI Router**（`$stateRegistryProvider` / `@uirouter/react`），不是 React Router。
- 状态：React Query v4（服务端）+ Zustand（客户端 UI 状态），无 Redux。
- 表单：Formik + Yup（Zod 仅用于 generated-api schema）。
- `go.mod` 与上游一致（Go 1.26.4），fork 身份不体现在 Go import path 上。

## COMMANDS
```bash
# 前端（node ^22, pnpm 10.26.2）
pnpm dev              # webpack-dev-server :8999
pnpm build            # 生产构建 → dist/public
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint --cache --fix
pnpm test             # vitest run（app/**/*.test.{ts,tsx}）
pnpm format           # prettier --write

# 后端 / 全量
make build            # tidy deps build-server build-client
make build-image      # docker buildx build --load（本地）
make test-server      # gotestsum + coverage ./...
make lint-server      # golangci-lint 主配置 + forward 配置
make dev              # dev-server + dev-client
```

## NOTES
- **本机（Windows）有 Node/pnpm 运行时，但未安装 `node_modules`，且无 Go/Docker**；完整构建与测试验证依赖 GitHub Actions（`gh` CLI 可用）。
- CI 只构建 `linux/amd64`；`v*` tag 不剥 `v` 前缀（metadata 无 strip 配置，版本镜像应使用 `v2.45.0` 形式的 tag）。
- 上游同步基线：`upstream/release/2.45.0`（tag `2.45.0` 指向 `d79ba726c`）；本地无 `v2.45.0` 发布 tag。
- `CLAUDE.md` 引用 `docs/guidelines/*` 但本 fork **无 `docs/` 目录**（上游遗留的死链，勿依赖）。
- 本机 `pnpm lint-staged` 无显式配置（husky pre-commit 仅调用命令）。
