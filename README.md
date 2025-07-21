# 橘子导航 - 视频资源聚合导航平台

![orange](https://socialify.git.ci/qgming/orange/image?issues=1&language=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2Fqgming%2Forange%2Fd1c8c26a19827b78ea5e5a641a453b5d902276cd%2Fpublic%2Ffavicon.svg&name=1&owner=1&pattern=Plus&stargazers=1&theme=Light)

<p align="center">
  <h3 align="center"><strong>橘子导航 - 一站式视频资源导航平台</strong></h3>
  <p align="center">
    汇聚全网优质视频资源，提供智能网站可用性检测
    <br />
    <br />
    <a href="https://video.jdwdai.com">🚀 在线体验</a>
    ·
    <a href="https://github.com/qgming/orange/issues">🐛 报告Bug</a>
    ·
    <a href="https://github.com/qgming/orange/issues">📥 提交网站</a>
  </p>
</p>

## 🎯 项目简介

橘子导航是一个基于 Vue 3 开发的现代化视频资源聚合导航平台，旨在为用户提供便捷、高效的视频网站导航服务。平台不仅收录了丰富的视频资源网站，还提供了智能的网站可用性检测功能，帮助用户快速找到可用的视频资源。

## ✨ 核心功能

### 📺 丰富的资源分类

- **综合影视**: 收录 80+优质影视网站，包括 555 影视、NO 影视、低端影视等热门平台
- **动漫专区**: 汇聚樱花动漫、AGE 动漫、哔哩哔哩等 20+动漫网站
- **短剧频道**: 整合抖音短剧、快手短剧等 10+短剧平台
- **体育直播**: 提供 515 直播、直播吧等 12+体育直播平台
- **纪录片**: 收录央视网、B 站纪录片等 6 大纪录片平台
- **电子书**: 集成 Z-Library、安娜的档案等优质电子书资源

### 🔍 智能搜索

- 支持网站名称快速搜索
- 标签筛选功能，按类型精准查找
- 实时搜索建议

### ✅ 网站可用性检测

- **批量检测**: 一键检测所有网站可用性
- **实时状态**: 显示网站在线状态和响应时间
- **智能统计**: 提供可用率、平均响应时间等数据
- **分类筛选**: 可按可用/不可用状态筛选结果
- **单个重检**: 支持单个网站重新检测

### 📱 响应式设计

- 完美适配 PC、平板、手机等多种设备
- 移动端优化的交互体验

## 🛠️ 技术栈

### 前端技术

- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 新一代状态管理库
- **Vite** - 下一代前端构建工具

### 开发工具

- **Vue DevTools** - Vue 开发调试工具
- **ESLint** - 代码质量检查
- **现代浏览器支持** - Chrome, Firefox, Safari, Edge

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
orange/
├── public/                 # 静态资源
│   └── favicon.svg        # 网站图标
├── src/                   # 源代码
│   ├── components/        # Vue组件
│   │   ├── SearchBox.vue  # 搜索组件
│   │   ├── SiteChecker.vue # 网站检测组件
│   │   └── VideoNav.vue   # 导航组件
│   ├── data/             # 数据文件
│   │   └── videoSites.js # 网站数据
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/           # 状态管理
│   ├── utils/            # 工具函数
│   │   └── siteChecker.js # 网站检测工具
│   ├── views/            # 页面组件
│   │   ├── CheckerView.vue # 检测页面
│   │   ├── HomeView.vue   # 首页
│   │   └── PrivacyPolicy.vue # 隐私政策
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── README.md            # 项目文档
```

## 🎯 使用指南

### 浏览网站

1. 打开首页即可看到分类展示的视频网站
2. 点击顶部搜索框输入关键词快速查找
3. 点击网站卡片直接访问目标网站

### 网站检测

1. 点击顶部导航栏的"网站检测"
2. 点击"开始检测"按钮启动批量检测
3. 查看检测结果，包括可用状态、响应时间等
4. 使用筛选功能查看可用/不可用网站
5. 点击"重新检测"可单独检测某个网站

## 🌟 特色亮点

### 数据丰富

- 收录 150+优质视频相关网站
- 涵盖影视、动漫、短剧、体育、纪录片等多个领域
- 每个网站都有详细标签描述

### 技术先进

- 基于 Vue 3 Composition API 开发
- 响应式设计，完美适配多端
- 模块化架构，易于维护和扩展

### 体验优秀

- 简洁直观的用户界面
- 快速的网站检测功能
- 流畅的交互体验

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献内容

- 🆕 添加新的视频网站
- 🐛 修复网站链接或信息
- 📱 改进移动端体验
- 🎨 优化 UI 设计
- ⚡ 性能优化
- 📖 完善文档

## 📊 项目统计

- **收录网站**: 150+
- **资源分类**: 6 大类
- **技术栈**: Vue 3 + Vite + Pinia
- **响应时间**: <100ms
- **可用率检测**: 实时更新

## 📝 更新日志

### v1.0.0 (2024-12)

- ✨ 项目初始版本发布
- 🎨 基础 UI 界面完成
- 🔍 网站搜索功能
- ✅ 网站可用性检测功能
- 📱 响应式设计支持

## 📞 联系我们

- **作者**: qgming
- **邮箱**: qgming@qq.com
- **公众号**: 极点维度
- **在线体验**: [video.jdwdai.com](https://video.jdwdai.com)

## 🙏 鸣谢

- [Vercel](https://www.vercel.com) - 提供优秀的部署平台
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- 所有贡献者和支持者

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/qgming">qgming</a></sub>
</div>
