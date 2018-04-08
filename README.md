# suqin

> 苏秦，字季子，战国时期著名纵横家，提倡合纵。他劝说六国国君联合，身佩六国相印，进军秦国。
> suqin 顾名思义，对接多种`账号管理体系`，并使之暴露统一API，易于使用。

## 工作原理

> suqin 现主要针对`目录 / Directory`类型身份系统，通过加载各种`Provider`逻辑来实现对对应身份系统的访问、操作等。

## 已对接账号体系

- [AAD / Azure Active Directory](https://github.com/DFocusFE/suqin-aad)
- [钉钉 / DingTalk](https://github.com/DFocusFE/suqin-dingtalk)
- [腾讯企业邮箱 / Tencent Exmail](https://github.com/DFocusFE/suqin-exmail)

## 使用方法

```js
const Suqin = require('suqin');
const AAD = require('suqin-aad');

const directories = new Suqin();
directories.use('AD', new AAD(options));

directories.getUsers();
directories.addUser(options);
directories.setUser(options);
```

## 贡献

查阅 [CONTRIBUTING.md](CONTRIBUTING.md)。
