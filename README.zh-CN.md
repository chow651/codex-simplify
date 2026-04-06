# Codex Simplify 插件

[English README](./README.md)

`simplify` 是一个面向 Codex 的代码收尾审查插件与技能。

它的定位不是开场技能，而是**代码任务临近完成时**使用的一道收尾检查。目标很明确：围绕当前 diff，从三个方向做并行审查，再把真正成立的问题收敛修正。

- reuse
- quality
- efficiency

## 这个插件解决什么问题

很多代码在“能跑”之后，仍然会留下三类常见问题：

- 明明已有现成工具或抽象，却又手写了一遍
- 结构上能用，但还有冗余状态、参数蔓延、复制粘贴变体
- 功能正确，但做了不必要的工作，或者在热路径上变重了

`simplify` 的作用就是在**完成前**再做一次定向清理，而不是把它当成泛化的全局 code review。

## 仓库内容

- `.codex-plugin/plugin.json`
- `skills/simplify/SKILL.md`
- `examples/marketplace.json`
- `examples/AGENTS.snippet.md`

## 安装方式

Windows PowerShell 一条命令安装：

```powershell
irm https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.ps1 | iex
```

macOS / Linux 一条命令安装：

```bash
curl -fsSL https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.sh | bash
```

如果你希望安装时顺手把 completion gate 也加进全局 `AGENTS.md`，可以用下面两条：

Windows PowerShell：

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.ps1))) -WithGate
```

macOS / Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.sh | SIMPLIFY_WITH_GATE=1 bash
```

安装脚本会自动完成这些事：

- 把插件安装或更新到 `~/plugins/simplify`
- 更新 `~/.agents/plugins/marketplace.json`
- 把可见 skill 镜像写入 `~/.codex/skills/simplify/SKILL.md`
- 可选地把 completion gate 写进 `~/.codex/AGENTS.md`

如果你更想手动接入，也可以参考下面这些文件：

- 目标文件：`~/.agents/plugins/marketplace.json`
- 示例内容见：[examples/marketplace.json](./examples/marketplace.json)
- completion gate 片段见：[examples/AGENTS.snippet.md](./examples/AGENTS.snippet.md)

## 可选的自动触发

如果你希望 `simplify` 在**代码任务收尾阶段**自动触发，而不是手动每次调用，那么把下面这份规则片段加进你自己的全局 `AGENTS.md`：

- [examples/AGENTS.snippet.md](./examples/AGENTS.snippet.md)

这一层的意义是：

- 只在代码任务、且存在有效代码改动时触发
- 不在普通问答里乱触发
- 不在每次写文件之后自动打断流程

## 使用建议

手动使用：

- 在 skill picker 或命令入口里调用 `simplify`

推荐使用方式：

- 只在当前已有代码改动时使用
- 只围绕当前 diff 或当前任务涉及文件做审查
- 把它当成 completion gate，而不是通用 code review

## 适合什么场景

- 一个功能已经完成，准备收尾
- 一次重构已经结束，准备检查有没有重复和结构性噪声
- 一个 bugfix 已经通过测试，准备再做一轮轻量质量清理

## 不适合什么场景

- 会话刚开始的时候
- 纯讨论、纯设计、纯问答阶段
- 当前没有代码 diff 的阶段
- 想让它代替完整架构评审的时候

## 一句话理解

`simplify` 不是让模型“再看一遍代码”，而是让它在收尾阶段，专门盯住：

- 有没有能删掉的
- 有没有能复用的
- 有没有能更轻的
