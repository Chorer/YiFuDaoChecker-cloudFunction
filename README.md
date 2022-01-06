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

### 2. 创建 leanCloud 云存储应用

1）[注册 leanCloud 账号](https://console.leancloud.app/) （注意是国际版的 leanCloud，因为国内版使用云存储需要绑定域名）

2）到控制台新建应用，应用名字随意，应用版本选择 **开发版**

3）进入应用，点击左侧的“数据存储 ➡ 结构化数据”，新建 Class：名称为“Answers”，Class 访问权限为“所有用户”，下面的 ACL 权限选择“无限制”

4）进入刚才创建的 Class，添加新列，列名称是“answers”，列类型是“Array”；之后添加新行，值空着不填。注意这时候 objectId 会有一个值

5）点击左侧的“设置 ➡ 应用凭证”，记住 appId 和 appKey 的值（**请务必自己保管好，不要泄露**），后面需要用到

### 3. 创建云函数

1）注册腾讯云账号并登录，进行实名认证

2）进入[这个链接](https://console.cloud.tencent.com/scf/list?rid=1&ns=default)，选择 “新建云函数” ➔ “自定义创建”，函数名随便起一个，运行环境选择 `Nodejs12.16`，提交方法选择“本地上传文件夹”，选中 `YiFuDaoChecker-cloudFunction/src` 文件夹上传，点击“完成”即可创建云函数。

### 4. 修改配置文件

到刚才新创建的云函数中，打开 `src/checker.js` 文件进行修改：

1）修改第 2 行的 `accessToken` 为之前获得的奕辅导的 accessToken

2）修改第 3 行的 `notifyToken` 为之前获得的 pushplus 的 notifyToken

3）修改第 4 行的 `appId` 为之前复制的 leanCloud 的 appId

4）修改第 5 行的 `appKey` 为之前复制的 leanCloud 的 appKey

### 5. 安装依赖

到刚才新创建的云函数中，`ctrl + shift + ~` 新建终端。

通过如下命令安装 axios 和 leancloud-storage：

```bash
cd src
npm init -y
npm i axios --save
npm i leancloud-storage --save
```

### 6. 部署和测试

1）首次使用此脚本，**请务必先手动打卡一次，或者确保今天已经打卡**（这是为了能够在数据库中自动存入打卡数据）

2）在确保今天已经打卡后，点击云函数下面的“部署”和“测试”，如果微信有收到 pushPlus 公众号发来的打卡结果通知，说明设置没有问题。

### 7. 实现自动打卡

点击控制台左侧的“触发管理”，新建一个云函数触发器。设置如下：

![](https://myblog-1258623898.cos.ap-chengdu.myqcloud.com/2021%E5%B9%B4%E7%BB%88%E6%80%BB%E7%BB%93/0.jpg)

触发时间使用的是 Cron 表达式，这里的意思是每天早上 8 点触发（打卡）一次，可以自己按需修改。

最后点击提交就可以了，以后到点了就会自动打卡并把打卡结果发到你的微信上。

## Q & A

**1）accessToken 的有效期多久？**

有效期六天，失效了重新抓包更新即可

**2）如何修改打卡数据？**

每次打卡时，默认会提交使用者初次打卡时提交的数据。如因情况有变而需要修改打卡数据，请手动将 leanCloud 中 answers 列的值重置为空数组 `[]`，之后再手动打卡，脚本会自动将新数据写入数据库中

## ⚠️ 免责声明

- 此脚本仅做正常情况下免去手动打卡之用，**请勿瞒报、误报、漏报**
- 如使用者存在以下异常情况：位于风险地区、接触确诊病例、接触疑似病例、本人疑似患病、本人确诊患病等，请**立即停止使用此脚本**，并在小程序中**如实填报**
- 使用者请务必不要泄露自己的 accessToken、notifyToken、appKey
- 使用此脚本产生的任何问题**由使用者负责**，与作者无关
