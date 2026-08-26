# 部署到 GitHub Pages — 手动兜底步骤

本目录已经是一个**提交完毕的 git 仓库**（分支 `main`，commit `bba9a28`），包含：

| 文件 | 说明 |
|---|---|
| `index.html` | MRL 看板本体（9.0 MB，gzip 后约 1.78 MB） |
| `README.md` | 仓库说明（英文，符合 EU 交付物语言约定） |
| `.nojekyll` | 关闭 Jekyll 处理，避免 GitHub Pages 干扰静态文件 |

只需要「建远端仓库 + 推送 + 开 Pages」三步。

---

## 方式 A：网页建仓库 + 命令行推送（无需装任何工具）

### 1. 在网页上建空仓库

打开 <https://github.com/new>，按下表填写，**不要**勾选任何初始化选项：

| 字段 | 值 |
|---|---|
| Repository name | `eu-mrl-dashboard` |
| Visibility | **Public**（免费账号只有 Public 仓库能用 Pages） |
| Add a README file | ❌ 不勾 |
| Add .gitignore | ❌ 不选 |
| Choose a license | ❌ 不选 |

点 **Create repository**。

### 2. 推送本地仓库

把下面命令里的 `<你的用户名>` 替换成你的 GitHub 用户名，在本目录执行：

```bash
cd "D:/workbuddy/2026-08-03-18-16-46/_gh_pages"
git remote add origin https://github.com/<你的用户名>/eu-mrl-dashboard.git
git push -u origin main
```

弹出登录窗口时用浏览器授权，或在提示密码处粘贴 **Personal Access Token**（GitHub 已不接受账号密码）。

> 生成 token：<https://github.com/settings/tokens> → Generate new token (classic) → 勾选 `repo` → 复制。

### 3. 开启 Pages

进入仓库 → **Settings** → 左侧 **Pages**：

- **Source** 选 `Deploy from a branch`
- **Branch** 选 `main`，目录选 `/ (root)`
- 点 **Save**

等待 1–2 分钟，链接即为：

```
https://<你的用户名>.github.io/eu-mrl-dashboard/
```

---

## 方式 B：装了 GitHub CLI 的话（一条命令搞定）

```bash
cd "D:/workbuddy/2026-08-03-18-16-46/_gh_pages"
gh auth login
gh repo create eu-mrl-dashboard --public --source=. --push
gh api -X POST repos/:owner/eu-mrl-dashboard/pages -f "source[branch]=main" -f "source[path]=/"
```

最后一条命令直接开启 Pages，省去点网页设置。

---

## 验证清单

部署完成后确认这几点：

1. 打开 Pages 链接，页面正常渲染，右上角有 `中文 / EN` 切换。
2. 进入「活性物质清单」，随便点一个物质，MRL 矩阵弹窗能打开。
3. 浏览器控制台（F12）无红色报错。
4. 首次加载约传输 1.8 MB（Pages 自动 gzip），之后走缓存。

## 后续更新看板

改完 `mrl_dashboard_unified.html` 之后：

```bash
cd "D:/workbuddy/2026-08-03-18-16-46"
cp mrl_dashboard_unified.html _gh_pages/index.html
cd _gh_pages
git add -A && git commit -m "Update MRL dashboard" && git push
```

推送后 Pages 会在 1–2 分钟内自动重新发布，**链接不变**——这就是"永久可分享链接"的含义。
