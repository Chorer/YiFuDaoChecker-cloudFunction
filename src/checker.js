// 配置项
const accessToken = '在这里填入奕辅导的 accessToken'
const notifyToken = '在这里填入 pushplus 的 notifyToken'
const answers = [
  "NotThing",
  "广州",
  "flag1640743720931",
  "2",
  "无",
  "无",
  "1",
  "flag1640955958618"
]


const axios = require('axios')

// 公共请求头
const commonHeaders = {
  "accessToken": accessToken,
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
const getAnswers = () => {
  let location = null  
  if (answers[1] === '广州') {
    location = {
      "deviationDistance":10096,
      "locationRangeId":"1001640054768198000150000000001",
      "address":"广东省广州市海珠区赤沙西约石伦里横街",
      "city":"广州市",
      "province":"广东省",
      "area":"海珠区",
      "latitude":23.091564888,
      "longitude":113.35413091 
    }
  } 
  else if (answers[1] === '佛山') {
    location = {
      "deviationDistance":10096,
      "locationRangeId":"1001640309486435000430000000001",
      "address":"广东省佛山市三水区学海中路",
      "city":"佛山市",
      "province":"广东省",
      "area":"三水区",
      "latitude":23.2062,
      "longitude":112.86028
    }
  }
  return {
    "answerInfoList":[
        // 1.关于新冠肺炎，你当前的情况是
        {
            "subjectId":"1001640315554537000980000000001",
            "subjectType":"multiSelect",
            "multiSelect":{
                "optionAnswerList":[
                    {
                        "beSelectValue":answers[0],
                        "fillContent":""
                    }
                ]
            }
        },
        // 2.你的当前所在地
        {
            "subjectId":"1001640315554577000980000000001",
            "subjectType":"location",
            "location": location            
        },
        // 3.今日是否接触重点疫区人员
        {
            "subjectId":"1001640743741123000960000000001",
            "subjectType":"signleSelect",
            "signleSelect":{
                "beSelectValue":answers[2],
                "fillContent":""
            }
        },
        // 4.今日是否接触确诊新冠肺炎患者
        {
            "subjectId":"1001640743758116001000000000001",
            "subjectType":"signleSelect",
            "signleSelect":{
                "beSelectValue":answers[3],
                "fillContent":""
            }
        },
        // 5.接触详情
        {
            "subjectId":"1001640743801628001000000000001",
            "subjectType":"simpleFill",
            "simpleFill":{
                "inputContent":answers[4],
                "imgList":[
  
                ]
            }
        },
        // 6.需要特别说明的事项
        {
            "subjectId":"1001640743816621000960000000001",
            "subjectType":"simpleFill",
            "simpleFill":{
                "inputContent":answers[5],
                "imgList":[
  
                ]
            }
        },
        // 7.今日家庭成员健康状况
        {
            "subjectId":"1001640743859737000980000000001",
            "subjectType":"signleSelect",
            "signleSelect":{
                "beSelectValue":answers[6],
                "fillContent":""
            }
        },
        // 8.接种新冠疫苗情况
        {
            "subjectId":"1001640956029680001500000000001",
            "subjectType":"signleSelect",
            "signleSelect":{
                "beSelectValue":answers[7],                        
                "fillContent":""
            }
        }     
    ]
  }
}
const submitAnswers = (questionId) => {
  return axios({
      method: 'post',
      url: submitAnswersUrl,
      headers: commonHeaders,
      data: {
        "questionnairePublishEntityId": questionId,
        ...getAnswers()
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