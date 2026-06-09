#!/bin/bash

set -euo pipefail

readonly COMMUNITY_VERSION="2.9.0"
readonly COMMUNITY_SHA256="c350e84ef16324cbdfcd8c8cc1e65861ff3b121875823806cc22f19232d51f80"
readonly COMMUNITY_URL="https://github.com/typora-community-plugin/typora-community-plugin/releases/download/${COMMUNITY_VERSION}/typora-community-plugin.zip"
readonly ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly USER_DATA="$HOME/Library/Application Support/abnerworks.Typora"
readonly THEME_DIR="$USER_DATA/themes"
readonly PLUGIN_ROOT="$USER_DATA/plugins"
readonly CUSTOM_PLUGIN_DIR="$PLUGIN_ROOT/plugins/typora-community-plugin.codeblock-copy-button"

typora_app="${1:-/Applications/Typora.app}"

if [[ ! -d "$typora_app" ]]; then
  echo "找不到 Typora：$typora_app"
  echo "也可以传入路径：./install.sh /path/to/Typora.app"
  exit 1
fi

if [[ "${TYPORA_CODEX_ALLOW_RUNNING:-0}" != "1" ]] && pgrep -x Typora >/dev/null; then
  echo "请先完全退出 Typora，再重新运行 ./install.sh"
  exit 1
fi

readonly index_html="$typora_app/Contents/Resources/TypeMark/index.html"
if [[ ! -f "$index_html" ]]; then
  echo "找不到 Typora index.html：$index_html"
  exit 1
fi

timestamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$USER_DATA/codex-style-backups/$timestamp"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

mkdir -p \
  "$backup_dir" \
  "$THEME_DIR" \
  "$PLUGIN_ROOT" \
  "$PLUGIN_ROOT/settings" \
  "$CUSTOM_PLUGIN_DIR"

cp "$index_html" "$backup_dir/index.html"
if [[ -f "$THEME_DIR/base.user.css" ]]; then
  cp "$THEME_DIR/base.user.css" "$backup_dir/base.user.css"
fi

echo "下载 typora-community-plugin ${COMMUNITY_VERSION}..."
curl -fL "$COMMUNITY_URL" -o "$tmp_dir/community.zip"

actual_sha="$(shasum -a 256 "$tmp_dir/community.zip" | awk '{print $1}')"
if [[ "$actual_sha" != "$COMMUNITY_SHA256" ]]; then
  echo "下载文件校验失败。"
  exit 1
fi

mkdir -p "$tmp_dir/community"
ditto -x -k "$tmp_dir/community.zip" "$tmp_dir/community"

cp -R "$tmp_dir/community/." "$PLUGIN_ROOT/"
bash "$tmp_dir/community/install-macos.sh" -p "$typora_app"

cp "$ROOT_DIR/theme/base.user.css" "$THEME_DIR/base.user.css"
cp "$ROOT_DIR/plugin/codeblock-copy-button/main.js" "$CUSTOM_PLUGIN_DIR/main.js"
cp "$ROOT_DIR/plugin/codeblock-copy-button/manifest.json" "$CUSTOM_PLUGIN_DIR/manifest.json"

osascript -l JavaScript \
  "$ROOT_DIR/scripts/merge-settings.js" \
  "$PLUGIN_ROOT/settings"

echo
echo "安装完成。"
echo "备份目录：$backup_dir"
echo "现在重新打开 Typora 即可。"
echo "注意：Typora 更新或重新安装后，需要再次运行本脚本。"
