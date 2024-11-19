
// 模拟数据
export const getPrivateresumeinfoData = () => {
  return {
    success: true,
    data: {
      personalInfo: {
        fullName: '姓名',
        occupation: '主要职业类型',
        salaryRange: '￥15000-18000',
        age: 45,
        zodiac: '牛',
        province: '北京',
        ethnicGroup: '汉',
        constellation: '金牛座',
        education: '本科',
        phone: '1822222222',
        workExperience: '7年',
        skillsAndStrengths: '技能与优势',
        photoUrl: 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641'
      },
      selfIntroduction: '这是自我介绍，要返回富文本',
      certificates: ['证书1', '证书2', '证书3', '证书4', '证书5', '证书6'],
      portfolio: [
        {
          title: '爱好',
          photoUrls: ['https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641']
        },
        {
          title: '技能',
          photoUrls: ['https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641']
        }
      ]
    },
    errorMessage: '这是错误信息'
  }
}
export const getPublicresumeinfoData = () => {
  return {
    success: true,
    data: {
      personalInfo: {
        fullName: '姓名',
        occupation: '主要职业类型',
        salaryRange: '￥15000-18000',
        age: 45,
        zodiac: '牛',
        province: '北京',
        ethnicGroup: '汉',
        constellation: '金牛座',
        education: '本科',
        phone: '1822222222',
        workExperience: '7年',
        skillsAndStrengths: '技能与优势',
        photoUrl: 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641'
      },
      selfIntroduction: '这是自我介绍，要返回富文本',
      certificates: ['证书1', '证书2', '证书3', '证书4', '证书5', '证书6'],
      portfolio: [
        {
          title: '爱好',
          photoUrls: ['https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641']
        },
        {
          title: '技能',
          photoUrls: ['https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641', 'https://inews.gtimg.com/om_bt/OE8piEBa-tbqn-wNvWZl8coi4AlzoUD43upEkoAnIkYL8AA/641']
        }
      ]
    },
    errorMessage: '这是错误信息'
  }
}

// 拦截请求，配置 mock 数据
// module.exports = {
//   getPrivateresumeinfoData,
//   getPublicresumeinfoData
// }
