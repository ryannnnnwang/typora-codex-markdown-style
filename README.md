# Typora Codex Markdown Style

一套面向 macOS Typora 的全局 Markdown 样式，目标是接近 Codex 自带的
Markdown 阅读体验。

## 效果

- 正文、标题、列表、引用、表格和侧边栏样式
- Codex 风格的浅灰代码块
- 代码块左上角显示语言
- 代码块右上角始终显示复制按钮
- 点击复制后短暂显示对勾

## 环境

- macOS
- Typora 1.13.x
- 当前验证版本：Typora 1.13.7
- 可选字体：JetBrains Mono

## 一键安装

1. 安装 Typora，并完全退出 Typora。
2. 克隆本仓库。
3. 在仓库目录运行：

```bash
chmod +x install.sh
./install.sh
```

如果 Typora 不在 `/Applications/Typora.app`：

```bash
./install.sh "/自定义路径/Typora.app"
```

安装完成后重新打开 Typora。

## 安装内容

主题文件：

```text
~/Library/Application Support/abnerworks.Typora/themes/base.user.css
```

复制按钮插件：

```text
~/Library/Application Support/abnerworks.Typora/plugins/plugins/
  typora-community-plugin.codeblock-copy-button/
```

插件框架固定使用
[`typora-community-plugin 2.9.0`](https://github.com/typora-community-plugin/typora-community-plugin/releases/tag/2.9.0)，
由安装脚本下载并校验 SHA-256，本仓库不保存其构建产物。

## 重装或换电脑

```bash
git clone git@github.com:ryannnnnwang/typora-codex-markdown-style.git
cd typora-codex-markdown-style
chmod +x install.sh
./install.sh
```

Typora 更新或重新安装会覆盖应用包中的插件加载入口。主题和插件文件可能仍在，
但仍应再次执行 `./install.sh`。

## 备份

每次安装前，脚本会把旧主题和 Typora 的 `index.html` 保存到：

```text
~/Library/Application Support/abnerworks.Typora/codex-style-backups/
```

## 仓库内容

```text
theme/base.user.css
plugin/codeblock-copy-button/main.js
plugin/codeblock-copy-button/manifest.json
scripts/merge-settings.js
install.sh
README.md
```

不要提交以下内容：

- `/Applications/Typora.app` 内的文件
- `~/Library/Application Support/abnerworks.Typora/plugins` 整个运行目录
- 下载的插件 zip
- `index.html` 和 CSS 备份
- 临时测试文件与截图

## 注意

安装插件框架需要修改 Typora 应用包中的 `index.html`，因此 macOS 的代码签名验证
会显示应用资源已被修改。这是该社区插件框架在 macOS 上的加载方式。

复制按钮基于
[`typora-plugin-codeblock-copy-button`](https://github.com/typora-community-plugin/typora-plugin-codeblock-copy-button)
修改，保留其 MIT 许可证与原作者信息。
