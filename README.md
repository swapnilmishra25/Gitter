# 🛠️ gitter

**Automated Git Workflow Tool for Microservice Repositories**

Tired of running `git pull`, `git push`, `git checkout`, etc., across 10+ services or packages?  
`gitter` is a developer CLI tool that makes Git workflows fast and easy across **multiple repositories** — ideal for microservices, monorepos, or modular projects.

---

## 📦 Installation

### 🔧 Local (for development)

1. In your project folder, add this to `package.json`:

```json
{
  "name": "gitter",
  "version": "1.0.0",
  "bin": {
    "gitter": "./index.js"
  }
}
```

2. At the top of `index.js`, ensure this shebang exists:

```js
#!/usr/bin/env node
```

3. Link the CLI globally:

```bash
npm link
```

✅ Now you can run `gitter` from anywhere in your terminal.

---

## 📚 Commands

### 1. `pull [repo] <remote> <branch>`

Pulls a branch from a remote into one or more repos.

```bash
gitter pull origin main
gitter pull ./services origin main
```

---

### 2. `push [repo] <remote> <branch>`

Pushes local changes to a remote branch.

```bash
gitter push origin main
```

---

### 3. `checkout [repo] <branch>`

Checks out a branch in each repo.

```bash
gitter checkout dev
```

---

### 4. `add [repo] <path>`

Stages files or folders for commit. Use `.` to add all.

```bash
gitter add .
gitter add ./shared-lib src/
```

---

### 5. `commit [repo] <message>`

Commits staged files with a commit message.

```bash
gitter commit "chore: update all packages"
```

---

### 6. `exec <cmd>`

Runs any custom Git command across all repos.

```bash
gitter exec "log -1"
gitter exec "remote -v"
```

---

### 7. `status [repo]`

Shows current branch, uncommitted changes, and file count for each repo.

```bash
gitter status
```

Outputs a clean table:

```
┌────────────┬──────────┬────────────┬───────┐
│ Repo       │ Branch   │ Status     │ Files │
├────────────┼──────────┼────────────┼───────┤
│ user-svc   │ main     │ ✅ Clean   │ 0     │
│ auth-svc   │ dev      │ 🔧 Dirty   │ 3     │
└────────────┴──────────┴────────────┴───────┘
```

---

### 8. `stash [repo]`

Stashes changes in each repo.

```bash
gitter stash
```

---

### 9. `stash-apply [repo]`

Applies latest stashed changes.

```bash
gitter stash-apply
```

---

### 10. `clean [repo]`

Cleans untracked files and resets local changes.

```bash
gitter clean           # Interactive confirm
gitter clean --force   # No confirmation
```

---

### 11. `doctor [repo]`

Runs Git diagnostics: detached head, conflicts, remotes, unpushed commits.

```bash
gitter doctor
```

Sample output:

```
🔎 Diagnosing ./apps/auth-service
⚠️ Detached HEAD
⬆️ Unpushed commits: 2
🚫 No remotes configured
```

---

## ⚙️ Options (Global Flags)

| Flag              | Description                                                     |
|-------------------|-----------------------------------------------------------------|
| `--dry-run`       | Show commands without running them                              |
| `--log`           | Log output to `gitter.log`                                      |
| `--parallel`      | Run Git commands in parallel (max 5 at once)                    |
| `--pre "<cmd>"`   | Run a pre-hook Git command before main one                      |
| `--config <path>` | Load config file with repo paths and default options            |

You can mix them:

```bash
gitter pull origin main --parallel --log --dry-run
```

---

## 🧠 Config File Support

Define repo paths and defaults in a config file.

### Example: `gitter.config.json`

```json
{
  "repos": ["./apps/user-service", "./apps/payment-service"],
  "parallel": true,
  "log": true
}
```

### Supported formats:

- `gitter.config.json`
- `gitter.config.js`
- `gitter.config.yaml`
- Pass directly: `--config custom.json`

Usage:

```bash
gitter pull --config gitter.config.json
```

---

## 📂 Repo Folder Scanning

You can pass a folder and `gitter` will auto-detect all subfolders with `.git/`.

```bash
gitter status ./apps
gitter pull ./services origin dev
```

---

## 🧪 Practical Examples

### ✅ Pull all services with logging and concurrency

```bash
gitter pull origin main --parallel --log
```

### ✅ Commit with stash pre-hook

```bash
gitter commit --pre "stash" "fix: pre-deploy cleanup"
```

### ✅ Clean repos forcefully

```bash
gitter clean --force
```

### ✅ Run git log in all repos using config

```bash
gitter exec "log -1" --config gitter.config.json
```

---

## 📊 Output Samples

```bash
📁 [./apps/user-service] git pull origin main
✅ Success

📁 [./apps/payment-service] git pull origin main
❌ Failed: Your branch is behind...

📁 [./shared-lib] git pull origin main
✅ Success
```

---

## 🧱 Roadmap

- [x] Core Git commands
- [x] Dry-run mode
- [x] Parallel execution (`--parallel`)
- [x] Logging to file
- [x] Repo config support
- [x] Folder scanning
- [x] Status dashboard
- [x] Pre-hooks
- [x] Git stash/apply
- [x] Clean/reset command
- [x] Git diagnostics (`doctor`)
- [ ] Interactive CLI (select repos via prompt)
- [ ] Semantic version bumping
- [ ] VS Code Extension

---

## 👨‍💻 Author

Built with ❤️ by developers, for developers.

MIT License • Contributions welcome.

---
