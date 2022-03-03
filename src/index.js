// 配置项
const accessToken = '在这里填入奕辅导的 accessToken'
const notifyToken = '在这里填入 pushPlus 的 notifyToken'
const appId = '在这里填入 leanCloud 的 appId'
const appKey = '在这里填入 leanCloud 的 appKey'

// 依赖
const AV = require('leancloud-storage')
AV.init({ appId, appKey })
const axios = require('axios')

// 公共请求头
const commonHeaders = {
  "accessToken": accessToken,
  "Host": "yfd.ly-sky.com",
  "Connection": "keep-alive",
  "Accept-Encoding": "gzip, deflate, br",
  "Content-Type": "application/json;charset=UTF-8",
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat",
  "userAuthType": "MS",
  "Referer": "https://servicewechat.com/wx217628c7eb8ec43c/20/page-frame.html"
}

// 获取自己问卷的 id
const getQuestionnaireIdUrl = 'https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index'
const getQuestionnaireId = () => {
  return axios({
    method: 'get',
    url: getQuestionnaireIdUrl,
    headers: commonHeaders
  })
}

// 获取今日问卷
const getQuestionnaire = id => {
  const getQuestionnaireUrl = `https://yfd.ly-sky.com/ly-pd-mb/form/api/questionnairePublish/${id}/getDetailWithAnswer`
  return axios({
    method: 'get',
    url: getQuestionnaireUrl,
    headers: {
      ...commonHeaders,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}

// 获取数据库中的问卷答案
const getAnswers = async (questionnaireId) => {
  const obj = await new AV.Query('Answers').first();
  // 如果数据库没有缓存答案，则请求并缓存
  if (!obj.get('answers')) {        
      const questionnaireRes = await getQuestionnaire(questionnaireId)
      let answers = questionnaireRes.data.data.answerInfoList      
      if (!answers || !answers.length) {
        return false            
      } else {
        answers = answers.map(item => ({
          subjectId: item.subjectId,
          subjectType: item.subjectType,
          [item.subjectType]: item[item.subjectType]
        }))
        obj.set('answers', answers)
        obj.save()  
      }      
  } 
  return {
    "answerInfoList": obj.get('answers')      
  }
}

// 提交表单
const submitAnswersUrl = 'https://yfd.ly-sky.com/ly-pd-mb/form/api/answerSheet/saveNormal'
const submitAnswers = async (questionnaireId,answers) => {
  return axios({
      method: 'post',
      url: submitAnswersUrl,
      headers: commonHeaders,
      data: {
        "questionnairePublishEntityId": questionnaireId,
        ...answers
      }
  })
}

// 推送通知
const notifyUrl = 'http://www.pushplus.plus/send'
const notifyData = {
    "token": notifyToken,
    "title": "⏰ 奕辅导打卡结果通知",    
    "template": "json"
}
const notify = (result) => {
    return axios({
        method: 'post',
        url: notifyUrl,
        data: {
            "content": result,
            ...notifyData
        }
    })
}

exports.main_handler = async () => {
    const questionnaireIdRes = await getQuestionnaireId()
    const data = questionnaireIdRes.data
    const questionnaireId = data.data.questionnairePublishEntityId
    const answers = await getAnswers(questionnaireId)
    if (!answers) {
      notify('❌ 首次使用本脚本，请先手动打卡一次或者确保今天已经打卡，以便在数据库中存入打卡数据')
      return
    }
    if (data.code === 200) {
      // 打过卡了，无需再次打卡
      if (data.data.hadFill) {
        notify('✅ 你已经打卡了')
      } 
      // 否则打卡
      else {        
        // 问卷校验
        const questionnaireRes = await getQuestionnaire(questionnaireId)
        const subjectIdLists = questionnaireRes.data.data.questionnaireWithSubjectVo.subjectList.map(item => item.id)
        const _subjectIdLists = answers.answerInfoList.map(item => item.subjectId)
        // 如果问卷的子问题 id 不变，则正常打卡
        if (subjectIdLists.every((item,index) => item === _subjectIdLists[index])) {
          const submitRes = await submitAnswers(questionnaireId,answers)
          if (submitRes.data.code === 200) {
            notify('✅ 打卡成功')
          } else {
            notify(`❌ 打卡失败，原因是: ${submitRes.data.message}`)
          }
        } else {
          notify(`❌ 打卡失败，原因是: 问卷内容发生更改`)
        }     
      }
    } else {
      notify(`❌ 打卡失败，原因是${data.message}`)
    }   
}
