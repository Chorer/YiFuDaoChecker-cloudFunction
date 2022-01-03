# YiFuDaoChecker
> 奕辅导自动打卡脚本

## 使用方法

### 0. 克隆项目到本地

```bash
git clone git@github.com:Chorer/YiFuDaoChecker-cloudFunction.git
```

### 1. 获取 token

1）**获取 pushPlus 的 notifyToken**：微信搜索公众号“pushplus 推送加”，关注后即可生成属于自己的 notifyToken，后面需要用到。

2）**获取奕辅导的 accessToken**：利用 Fiddler 抓包获取奕辅导的 accessToken，后面需要用到。

### 2. 创建云函数

1）注册腾讯云账号并登录，进行实名认证

2）到 https://console.cloud.tencent.com/scf/list?rid=1&ns=default ，选择 “新建云函数” ➔ “自定义创建”，提交方法选择“本地上传文件夹”，选中 `YiFuDaoChecker-cloudFunction/src` 文件夹上传，点击“完成”即可创建云函数。

### 3. 修改配置文件

到刚才新创建的云函数中，打开 `src/checker.js` 文件进行修改：

1）修改第 2 行的 `accessToken` 为之前获得的奕辅导的 accessToken

2）修改第 3 行的 `notifyToken` 为之前获得的 pushplus 的 notifyToken

3）修改第 5 行到第 12 行的内容为问题的答案。这里答案默认已经填好了，如有需要，可对照 `src/descriptions.md` 文件中的字段说明进行修改。

### 5. 安装依赖

到刚才新创建的云函数中，`ctrl + shift + ~` 新建终端，通过如下命令安装 axios：

```bash
cd src
npm install axios --save
```

### 6. 部署和测试

修改完成后点击部署并测试，如果微信有收到 pushPlus 公众号发来的打卡结果通知，说明设置没有问题。

### 7. 实现自动打卡

点击控制台左侧的“触发管理”，新建一个云函数触发器。设置如下：

![](https://myblog-1258623898.cos.ap-chengdu.myqcloud.com/2021%E5%B9%B4%E7%BB%88%E6%80%BB%E7%BB%93/0.jpg)

触发时间使用的是 Cron 表达式，这里的意思是每天早上 8 点触发（打卡）一次，可以自己按需修改。

最后点击提交就可以了，以后到点了就会自动打卡并把打卡结果发到你的微信上。

## 注意

* accessToken 的有效期有待验证，失效了重新抓包更新即可

## ⚠️ 免责声明

- 此脚本仅做正常情况下免去手动打卡之用，**请勿瞒报、误报、漏报**
- 此脚本默认使用者不存在以下异常情况：位于风险地区、接触确诊病例、接触疑似病例、本人疑似患病、本人确诊患病等，**如与事实不符，请修改文件相应位置的内容**
- 如使用者存在以上异常情况，请**立即停止使用此脚本**，并在小程序中**如实填报**
- 使用者请务必不要泄露自己的 accessToken 和 notifyToken
- 使用此脚本产生的任何问题**由使用者负责**，与作者无关

