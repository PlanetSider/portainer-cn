<p align="center">
  <img title="portainer" src='https://github.com/portainer/portainer/blob/develop/app/assets/images/portainer-github-banner.png?raw=true' />
</p>

## Portainer 中文版说明

这是一个基于 [portainer/portainer](https://github.com/portainer/portainer) 的 **自用汉化版** 仓库，主要目标是将 Portainer 的界面文案尽可能汉化，方便中文环境下日常使用。

说明：

- 本仓库主要用于个人/自用场景
- 汉化范围以 Web 界面可见文本为主
- 部分专业名词会保留英文，例如 Docker、Kubernetes、Helm、Ingress、Stack、Registry 等
- 由于原项目持续更新，个别页面或低频功能可能仍存在少量未汉化文本

## 项目简介

**Portainer Community Edition** 是一个轻量级的容器应用管理平台，可用于管理 Docker、Swarm、Kubernetes 和 ACI 环境。它强调部署简单、使用直观，并提供图形化界面以及较完整的 API，用于管理容器、镜像、卷、网络等资源。

Portainer 可以以单容器方式运行，并能够部署在多种集群或宿主环境中，包括 Linux 容器和 Windows 原生容器。

**Portainer Business Edition** 在开源版本基础上提供更多面向企业用户的高级能力，例如 RBAC、支持服务等。

- [Compare Portainer CE and Compare Portainer BE](https://www.portainer.io/features)
- [Take3 – get 3 free nodes of Portainer Business for as long as you want them](https://www.portainer.io/take-3)
- [Portainer BE install guide](https://academy.portainer.io/install/)

## 自动构建镜像

本仓库已经配置 GitHub Actions 自动构建镜像：

- 推送到 `develop` / `main` 时自动构建
- 推送 `v*` tag 时自动构建
- 镜像默认发布到 `ghcr.io/planetsider/portainer-cn`

常见镜像标签包括：

- `develop`
- `latest`
- `sha-<commit>`

## 最新版本

上游 Portainer CE 会持续更新，本仓库会按需同步并继续补充汉化。 

[![latest version](https://img.shields.io/github/v/release/portainer/portainer?color=%2344cc11&label=Latest%20release&style=for-the-badge)](https://github.com/portainer/portainer/releases/latest)

## 快速开始

- [Deploy Portainer](https://docs.portainer.io/start/install-ce)
- [Documentation](https://docs.portainer.io)
- [Contribute to the project](https://docs.portainer.io/contribute/contribute)

## 功能说明

可通过 [官方功能对比页面](https://www.portainer.io/features) 查看 Portainer CE 与 Portainer Business Edition 的功能差异。

## 获取帮助

Portainer CE 是开源项目，主要由社区支持。如需商业支持，可前往官方站点了解商业版本。 

更多社区支持渠道可参考官方页面：[Get Support](https://www.portainer.io/resources/get-help/get-support)

- Issues: https://github.com/portainer/portainer/issues
- Slack (chat): [https://portainer.io/slack](https://portainer.io/slack)

也可以加入 Portainer 社区获取更新和活动通知：

- [https://www.portainer.io/join-our-community](https://www.portainer.io/join-our-community)

## 问题反馈与贡献

- 如需反馈上游功能问题或 bug，请到原仓库提交 issue：
  [https://github.com/portainer/portainer/issues/new](https://github.com/portainer/portainer/issues/new)
- 如需参与原项目开发，请参考官方贡献指南：
  [https://docs.portainer.io/contribute/contribute](https://docs.portainer.io/contribute/contribute)

## 安全

如需报告安全漏洞，请查看 [Security Policy](SECURITY.md)。

## 隐私

为帮助上游团队了解功能使用情况，Portainer 提供基于 [Matomo Analytics](https://matomo.org/) 的匿名统计能力。首次启动时你可以选择禁用该功能。更多信息请参考官方隐私政策：

- [https://www.portainer.io/legal/privacy-policy](https://www.portainer.io/legal/privacy-policy)

## 限制说明

Portainer 官方通常仅正式支持 “当前版本及前两个 Docker 版本” 的兼容范围，更早版本即使可以运行，也可能不在支持范围内。

## 许可证

Portainer 使用 zlib 许可证，详见 [LICENSE](./LICENSE)。

Portainer 同时包含来自其他开源项目的代码，详见 [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)。

## 免责声明

本仓库为基于上游项目的 **非官方自用汉化版**，与 Portainer 官方无直接隶属关系。若你用于生产环境，请自行评估风险，并优先关注上游安全更新与版本变更。
