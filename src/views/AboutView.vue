<!-- html部分 -->
<template>
  <!-- 当 isenable 为 0 时显示服务到期提示 -->
  <div v-if="personalInfo.isenable !== undefined && (!personalInfo.isenable || personalInfo.isenable === '0')" class="expired-container">
    <div class="expired-message">您的服务到期</div>
  </div>
  <div v-else class="container">
    <!-- 顶部用户展示 -->
    <div class="em-content">
      <!-- 顶部展示 -->
      <div class="em_top">
        <div class="em_top_left">
          <!-- 基本信息 -->
          <div class="em_user">
            <!-- 姓名：无值时不显示 -->
            <div v-if="personalInfo.fullName" class="em_name">{{ personalInfo.fullName }}</div>
            <!-- 职业：无值时不显示 -->
            <div v-if="personalInfo.occupation" class="em_p1">{{ personalInfo.occupation }}</div>
            <!-- 薪资：无值时不显示 -->
            <div v-if="personalInfo.salaryRange" class="em_p2">¥{{ personalInfo.salaryRange }}</div>
          </div>
          <!-- 头像：无图片路径时不显示 -->
          <div v-if="personalInfo.photoUrl" class="em_head">
            <img :src="getRealPhotoUrl(personalInfo.photoUrl)" alt="">
          </div>
        </div>
        <div class="em_top_right">
          <ul class="em_list">
            <!-- 年龄：无值时不显示 -->
            <li v-if="personalInfo.age" class="em_item">
              <div><img src="@/assets/img/icon_1.png" alt=""></div>
              <span>{{ personalInfo.age }}</span>
            </li>
            <!-- 民族：无值时不显示 -->
            <li v-if="personalInfo.ethnicGroup" class="em_item">
              <div><img src="@/assets/img/icon_2.png" alt=""></div>
              <span>{{ personalInfo.ethnicGroup }}</span>
            </li>
            <!-- 生肖：无值时不显示 -->
            <li v-if="personalInfo.zodiac" class="em_item">
              <div><img src="@/assets/img/icon_5.png" alt=""></div>
              <span>{{ personalInfo.zodiac }}</span>
            </li>
            <!-- 星座：无值时不显示 -->
            <li v-if="personalInfo.constellation" class="em_item">
              <div><img src="@/assets/img/icon_3.png" alt=""></div>
              <span>{{ personalInfo.constellation }}</span>
            </li>
            <!-- 省份：无值时不显示 -->
            <li v-if="personalInfo.province" class="em_item">
              <div><img src="@/assets/img/icon_4.png" alt=""></div>
              <span>{{ personalInfo.province }}</span>
            </li>
            <!-- 学历：无值时不显示 -->
            <li v-if="personalInfo.education" class="em_item">
              <div><img src="@/assets/img/icon_6.png" alt=""></div>
              <span>{{ personalInfo.education }}</span>
            </li>
            <li v-if="personalInfo.workExperience" class="em_item em_item_more">
              <div><img src="@/assets/img/icon_7.png" alt=""></div>
              <span>{{ personalInfo.workExperience }}</span>
            </li>
            <!-- 技能特长：无值时不显示 -->
            <li v-if="personalInfo.skillsAndStrengths" class="em_item em_item_more">
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

    <!-- 我的证书：无证书列表时不显示整个区块 -->
    <div v-if="certificateList && certificateList.length" class="em_show_my">
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
            <ImagePreview :src="it" width="100px" height="100px" />
          </li>
        </ul>
      </div>
    </div>

    <!-- 电话咨询：无电话号码时不显示 -->
    <div v-if="personalInfo.phone" class="em_call" @click="openCall(personalInfo.phone)">
      <img src="@/assets/img/img_phone.png" alt="">
      电话咨询
    </div>
    <!-- 放在页面底部，隐藏不显示，仅用于调用预览逻辑 -->
<!--
    <ImagePreview ref="imagePreview" style="display: none;" />
-->
    <!-- 使用别名进行调用 -->
    <van-image-preview :show="isPreviewVisible" :images="imageList" />

  </div>
</template>

<!-- js部分 -->
<script>
import {publicresumeinfo} from "@/api/baomu/personinfo";
import { Toast} from 'vant'
import { isExternal } from "@/utils/validate"; // 引入外部链接判断工具
import 'vant/lib/toast/index.css'
import 'vant/lib/image-preview/index.css'
import ImagePreview from "@/components/ImagePreview/index.vue";
// import { ImagePreview as VanImagePreview } from 'vant';


export default {
  name: 'aboutName',
  components: {
    ImagePreview
  },
  // 定义用到的数据，在template中使用{{ }}包裹，自动实现绑定
  data () {
    return {
      certificateList: '',
      personalInfo: {}, // 初始化为空对象，避免 undefined 报错
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
    // 将 getRealPhotoUrl 定义在 methods 中，确保能访问到 import 的变量
    getRealPhotoUrl(url) {
      if (!url) return "";
      // 若为外部链接（如 http:// 开头），直接返回
      if (isExternal(url)) return url;
      // 否则拼接基础 API 地址
      return import.meta.env.VITE_APP_BASE_API + url;
    },
    openCall (phone) {
      if (phone) {
        window.location.href = 'tel:' + phone
      } else {
        Toast('暂无联系方式')
      }
    },
  }
};
</script>

<!-- css部分 -->
<style lang="scss" scoped>
@import '@/assets/css/common.css';
@import './css/about.scss';
</style>
