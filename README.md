<p align="center">
  <img
    title="portainer"
    src="https://github.com/portainer/portainer/blob/develop/app/assets/images/portainer-github-banner.png?raw=true"
  />
</p>

# Portainer 中文版

这是一个基于 [portainer/portainer](https://github.com/portainer/portainer) 的 **非官方中文汉化版** 仓库。

本仓库的目标很明确：

- 尽可能将 **前端用户界面可见英文** 汉化为中文
- 对 Docker、Kubernetes、Helm、Ingress、Registry、Webhook、TLS 等专业词汇，优先采用 **保留术语** 或 **中英混合** 的方式处理
- 持续跟进上游版本，并同步构建可直接使用的镜像

适合希望在中文环境中日常使用 Portainer、同时又不想丢失专业术语语义的用户。

---

## 项目定位

本仓库不是 Portainer 官方分支，也不是一个功能魔改版。

它的定位是：

1. **尽量贴近上游功能与结构**
2. **主要修改前端展示文案**
3. **尽量不改业务逻辑**
4. **在版本上尽量与上游同步**

如果你只关心“有没有中文界面、能不能直接跑”，这个仓库就是为这个目标维护的。

---

## 当前特性

- 大量 Portainer 前端界面已完成中文化
- React 新界面与 Angular/legacy 界面都做了持续清理
- 保留专业术语，避免过度直译导致误解
- 已配置 GitHub Actions 自动构建镜像
- 可通过 GHCR 直接拉取镜像使用

说明：

- 由于上游持续更新，极少数低频页面或深层弹窗仍可能存在零星英文
- 这类内容会继续按“高置信度可见文案优先”的方式持续收敛

---

## 镜像构建与发布

本仓库已配置 GitHub Actions 自动构建镜像。

触发方式：

- 推送到 `develop`
- 推送到 `main`
- 推送 `v*` tag

默认镜像地址：

```bash
ghcr.io/planetsider/portainer-cn
```

常见标签包括：

- `develop`
- `latest`
- `sha-<commit>`
- 版本 tag（例如：`2.39.1` 对应的 `v2.39.1` tag 构建）

---

## 拉取与运行

### 拉取镜像

例如：

```bash
docker pull ghcr.io/planetsider/portainer-cn:develop
```

如果仓库已经打了版本 tag，也可以拉取对应版本：

```bash
docker pull ghcr.io/planetsider/portainer-cn:2.39.1
```

### 一个常见运行示例

```bash
docker run -d \
  --name portainer \
  -p 9000:9000 \
  -p 9443:9443 \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  ghcr.io/planetsider/portainer-cn:develop
```

如需生产使用，请根据自己的环境补充 TLS、反向代理、数据卷、访问控制等配置。

---

## 与上游版本关系

本仓库会尽量跟进上游 Portainer CE 版本。

当前策略是：

- **功能与核心逻辑尽量保持上游一致**
- **显示版本号尽量与上游正式版本同步**
- **文案层面持续做中文化收敛**

上游最新版本可参考：

[![latest version](https://img.shields.io/github/v/release/portainer/portainer?color=%2344cc11&label=Latest%20release&style=for-the-badge)](https://github.com/portainer/portainer/releases/latest)

---

## 汉化策略说明

本仓库不是“所有英文一律强翻”。

采用的是更偏实用的策略：

- 可直接中文表达的内容：优先中文化
- 容易误解的专业词：保留英文或使用中英混合
- 命令名、协议名、格式名、键名：通常保留

例如：

- 保留或中英混合：`Docker`、`Kubernetes`、`Helm`、`Ingress`、`Registry`、`Webhook`、`TLS`、`ConfigMap`、`Secret`、`YAML`
- 直接中文化：按钮、表格列名、提示文案、空状态、确认对话框、配置说明等

这样做的目的，是尽量在“中文可读性”和“专业准确性”之间保持平衡。

---

## 适用说明

这个仓库更适合：

- 自用
- 学习
- 测试环境
- 中文界面优先的日常运维场景

如果你要用于生产环境：

- 请自行评估风险
- 请持续关注上游安全更新
- 请结合自己的发布流程进行验证后再上线

---

## 上游项目与文档

- Upstream: https://github.com/portainer/portainer
- Official docs: https://docs.portainer.io
- Install guide: https://docs.portainer.io/start/install-ce
- Features: https://www.portainer.io/features

---

## 问题反馈

### 关于汉化问题

如果你发现仍有前端可见英文未被汉化，欢迎反馈。

反馈时建议尽量提供：

- 页面位置
- 截图
- 原始英文文案
- 你期望的中文表达

### 关于上游功能 / Bug

如果问题属于 Portainer 原始功能本身，而不是汉化造成的显示问题，请优先到上游仓库反馈：

- https://github.com/portainer/portainer/issues

---

## 许可证

Portainer 使用 zlib 许可证，详见：

- [LICENSE](./LICENSE)

同时项目包含来自其他开源项目的代码，详见：

- [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)

---

## 免责声明

本仓库为基于上游项目维护的 **非官方中文汉化版**，与 Portainer 官方无直接隶属关系。

本仓库主要目标是改善中文使用体验，而不是替代官方发布渠道。若你用于生产环境，请自行评估风险，并优先关注上游版本变更与安全公告。
