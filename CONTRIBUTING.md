# 如何参与本项目

> 参与本项目必须详细阅读以下文件，并相应遵照执行。

## [必须遵循]

### 代码注释

以下命令可以直接提交并注释代码。

```shell
npm run commit <文件名 | .>
# 多个文件用空格分开
# . 代表所有文件
# 代码执行后，按提示补全信息。
```

相关提示遵循，AngularJS Git Commit Message Conventions，详阅 [原文](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y)、[GITHUB](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)。

### 版本发布

使用 npm version 命令 而非 tag 命令。

**命令会自动推送到远端，请谨慎行事！！！**

```shell
npm version <x.x.x>
# x.x.x 为版本号。
```
版本规则遵循 [《语义化版本》](http://semver.org/lang/zh-CN/) 规范。

### 规范与禁止

* 使用 dev 分支参与开发，dev 分支禁止 push 远端。
* 作用全局的变更，预先向所有参与者详细说明。
* 注释详细完整。

## [建议遵循]

### 提交代码

推荐使用 PR 方式贡献代码。