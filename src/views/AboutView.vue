<!-- html部分 -->
<template>
  <div class="container">
    <!-- 顶部用户展示 -->
    <div class="em-content">
      <!-- 顶部展示 -->
      <div class="em_top">
        <div class="em_top_left">
          <!-- 基本信息 -->
          <div class="em_user">
            <div class="em_name">{{ personalInfo.fullName }}</div>
            <div class="em_p1">{{ personalInfo.occupation }}</div>
            <div class="em_p2">¥{{ personalInfo.salaryRange }}</div>
          </div>
          <!-- 头像 -->
          <div class="em_head">
            <img :src="personalInfo.photoUrl" alt="">
          </div>
        </div>
        <div class="em_top_right">
          <ul class="em_list">
            <li class="em_item">
              <div><img src="@/assets/img/icon_1.png" alt=""></div>
              <span>{{ personalInfo.age }}</span>
            </li>
            <li class="em_item">
              <div><img src="@/assets/img/icon_2.png" alt=""></div>
              <span>{{ personalInfo.ethnicGroup }}</span>
            </li>
            <li class="em_item">
              <div><img src="@/assets/img/icon_5.png" alt=""></div>
              <span>{{ personalInfo.zodiac }}</span>
            </li>
            <li class="em_item">
              <div><img src="@/assets/img/icon_3.png" alt=""></div>
              <span>{{ personalInfo.constellation }}</span>
            </li>
            <li class="em_item">
              <div><img src="@/assets/img/icon_4.png" alt=""></div>
              <span>{{ personalInfo.province }}</span>
            </li>
            <li class="em_item">
              <div><img src="@/assets/img/icon_6.png" alt=""></div>
              <span>{{ personalInfo.education }}</span>
            </li>
            <li class="em_item em_item_more">
              <div><img src="@/assets/img/icon_7.png" alt=""></div>
              <span>{{ personalInfo.workExperience }}</span>
            </li>
            <li class="em_item em_item_more">
              <div><img src="@/assets/img/icon_8.png" alt=""></div>
              <span>{{ personalInfo.skillsAndStrengths }}</span>
            </li>
          </ul>
        </div>

      </div>
      <div class="em_bottom">
        <ul class="em_name_list">
          <li class="em_name_item">身份认证</li>
          <li class="em_name_item">技能认证</li>
          <li class="em_name_item">健康体检</li>
          <li class="em_name_item">信用调查</li>
          <li class="em_name_item">背景调查</li>
        </ul>
      </div>
      <div class="em_clain"></div>
    </div>
    <!-- 用户技能展示 -->
    <div class="em_show_my">
      <div class="em_my_title">
        自我介绍
      </div>
      <div class="em_my_content" v-html="selfIntroduction"></div>
    </div>
    <div class="em_show_my">
      <div class="em_my_title">
        我的证书
      </div>
      <div class="em_my_card">
        <ul class="em_card_list">
          <li class="em_card_item" v-for="( item, index ) in certificateList" :key="index">
            <span>◎</span>{{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div class="em_show_my" v-for="( item, index ) in portfolio" :key="index">
      <div class="em_my_title">
        {{ item.title }}
      </div>
      <div class="em_my_book">
        <ul class="em_book_list">
          <li class="em_book_item" v-for="( it, ind ) in item.photoUrls" :key="ind">
            <img @click="preViewImg(it)" :src="it" alt="">
          </li>
        </ul>
      </div>
    </div>
    <!-- 电话 -->
    <div class="em_call" @click="openCall(personalInfo.phone)">
      <img src="@/assets/img/img_phone.png" alt="">
      电话咨询
    </div>
  </div>
</template>

<!-- js部分 -->
<script>
import {publicresumeinfo} from "@/api/baomu/personinfo";
import { Toast, ImagePreview } from 'vant'
import 'vant/lib/toast/index.css'
import 'vant/lib/image-preview/index.css'
export default {
  name: 'aboutName',
  components: {},
  // 定义用到的数据，在template中使用{{ }}包裹，自动实现绑定
  data () {
    return {
      certificateList: '',
      personalInfo: '',
      portfolio: '',
      selfIntroduction: ''
    }
  },
  // 计算属性
  computed: {},
  // 侦听属性
  watch: {},
  // 实例数据创建完成后调用
  created () {
    // 获取数据
    this.resumeId = this.$route.query.resumeId || '1'
    publicresumeinfo(this.resumeId).then(res => {
      console.log(res)
      if (res.code=200) {
        // 正确回调
        this.personalInfo = res.data.personalInfo
        this.selfIntroduction = res.data.selfIntroduction
        this.portfolio = res.data.portfolio
        this.certificateList = res.data.certificateList
      } else {
        Toast(res.errorMessage)
      }
    })
    // fetchData('baomu/personinfo/publicresumeinfo', { resumeId: this.resumeId }).then(res => {
    //   console.log(res)
    //   if (res.success) {
    //     // 正确回调
    //     this.personalInfo = res.data.personalInfo
    //     this.selfIntroduction = res.data.selfIntroduction
    //     this.portfolio = res.data.portfolio
    //     this.certificateList = res.data.certificateList
    //   } else {
    //     Toast(res.errorMessage)
    //   }
    // })
  },
  // 实例DOM被挂载后调用
  mounted () { },
  methods: {
    openCall (phone) {
      if (phone) {
        window.location.href = 'tel:' + phone
      } else {
        Toast('暂无联系方式')
      }
    },
    preViewImg (it) {
      ImagePreview(
        {
          images: [it],
          showIndex: false
        })
    }
  }
}
</script>

<!-- css部分 -->
<style lang="scss" scoped>
@import '@/assets/css/common.css';
@import './css/about.scss';
</style>
