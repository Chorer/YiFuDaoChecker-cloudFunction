# YiFuDaoChecker
> 奕辅导自动打卡脚本

使用方法：

1. **腾讯云部署云函数**：将 `checker.js` 中的代码粘贴到 IDE 中，并安装依赖 axios。具体操作参考[这里](https://github.com/Chorer/WoZaiXiaoYuanPuncher)。
2. **修改配置**：修改 `yiToken` 的值为抓包获取的奕辅导 accessToken，修改 `notifyToken` 为 pushplus 的 token

注意：

* token 的有效期有待验证，失效了重新抓包更新即可
* 问卷默认只提交必选题，打卡地址暂时也是固定的，有需要可以自己修改
