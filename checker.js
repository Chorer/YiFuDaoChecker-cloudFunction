const axios = require('axios')

// 奕辅导的 token
const yiToken = 'xxxxxxxx'
// 推送通知的 token
const notifyToken = 'xxxxxxxx'

// 公共请求头
const commonHeaders = {
  "accessToken": yiToken,
  "Host": "yfd.ly-sky.com",
  "Connection": "keep-alive",
  "Accept-Encoding": "gzip, deflate, br",
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat",
  "userAuthType": "MS",
  "Referer": "https://servicewechat.com/wx217628c7eb8ec43c/20/page-frame.html"
}

// 获取自己问卷的 id
const getQuestionIdUrl = 'https://yfd.ly-sky.com/ly-pd-mb/form/api/healthCheckIn/client/stu/index'
const getQuestionId = () => {
  return axios({
    method: 'get',
    url: getQuestionIdUrl,
    headers: commonHeaders
  })
}

// 提交表单
const submitAnswersUrl = 'https://yfd.ly-sky.com/ly-pd-mb/form/api/answerSheet/saveNormal'
const answers = {
  // 默认只提交必选题
  "answerInfoList":[
      {
          "subjectId":"1001640315554537000980000000001",
          "subjectType":"multiSelect",
          "multiSelect":{
              "optionAnswerList":[
                  {
                      "beSelectValue":"NotThing",
                      "fillContent":""
                  }
              ]
          }
      },
      {
          "subjectId":"1001640315554577000980000000001",
          "subjectType":"location",
          "location":{
              "deviationDistance":10096,
              "locationRangeId":"1001640054768198000150000000001",
              "address":"广东省广州市海珠区赤沙西约石伦里横街",
              "city":"广州市",
              "province":"广东省",
              "area":"海珠区",
              "latitude":23.092281,
              "longitude":113.354187
          }
      },
      {
          "subjectId":"1001640743741123000960000000001",
          "subjectType":"signleSelect",
          "signleSelect":{
              "beSelectValue":"flag1640743720931",
              "fillContent":""
          }
      },
      {
          "subjectId":"1001640743758116001000000000001",
          "subjectType":"signleSelect",
          "signleSelect":{
              "beSelectValue":"2",
              "fillContent":""
          }
      },
      {
          "subjectId":"1001640743801628001000000000001",
          "subjectType":"simpleFill",
          "simpleFill":{
              "inputContent":"无",
              "imgList":[

              ]
          }
      },
      {
          "subjectId":"1001640743816621000960000000001",
          "subjectType":"simpleFill",
          "simpleFill":{
              "inputContent":"无",
              "imgList":[

              ]
          }
      },
      {
          "subjectId":"1001640743859737000980000000001",
          "subjectType":"signleSelect",
          "signleSelect":{
              "beSelectValue":"1",
              "fillContent":""
          }
      },
      {
          "subjectId":"1001640743897278001000000000001",
          "subjectType":"signleSelect",
          "signleSelect":{
              "beSelectValue":"flag1640743866638",
              "fillContent":""
          }
      }     
  ]
}
const submitAnswers = (questionId) => {
  return axios({
      method: 'post',
      url: submitAnswersUrl,
      headers: commonHeaders,
      data: {
        "questionnairePublishEntityId": questionId,
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
    const res = await getQuestionId()
    const data = res.data
    if (data.code === 200) {
      // 打过卡了，无需再次打卡
      if (data.data.hadFill) {
        notify('✅ 你已经打卡了')
      } 
      // 否则打卡
      else {
        const res = await submitAnswers(data.data.questionnairePublishEntityId)
        if (res.data.code === 200) {
          notify('✅ 打卡成功')
        } else {
          notify(`❌ 打卡失败，原因是${res.data.message}`)
        }
      }
    } else {
      notify(`❌ 打卡失败，原因是${data.message}`)
    }   
}