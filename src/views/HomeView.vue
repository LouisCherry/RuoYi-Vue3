<!-- html部分 -->
<template>
  <div class="container">
    <div class="em_top">
      <div class="em_top_head">
        <img class="em_headtop" src="@/assets/img/img_headtop.png" alt="">
        <img :src="personalInfo.photoUrl" alt="">
      </div>
      <div class="em_name">{{ personalInfo.fullName }}</div>
      <div class="em_tips">{{ personalInfo.occupation }}</div>
      <ul class="em_list">
        <li class="em_item">
          <div><img src="@/assets/img/icon_11.png" alt=""></div>
          <span>{{ personalInfo.age }}</span>
        </li>
        <li class="em_item">
          <div><img src="@/assets/img/icon_12.png" alt=""></div>
          <span>{{ personalInfo.zodiac }}</span>
        </li>
        <li class="em_item">
          <div><img src="@/assets/img/icon_13.png" alt=""></div>
          <span>{{ personalInfo.constellation }}</span>
        </li>
        <li class="em_item">
          <div><img src="@/assets/img/icon_14.png" alt=""></div>
          <span>{{ personalInfo.province }}</span>
        </li>
        <li class="em_item">
          <div><img src="@/assets/img/icon_15.png" alt=""></div>
          <span>{{ personalInfo.ethnicGroup }}</span>
        </li>
        <li class="em_item">
          <div><img src="@/assets/img/icon_16.png" alt=""></div>
          <span>{{ personalInfo.education }}</span>
        </li>
        <li class="em_item em_item_more">
          <div><img src="@/assets/img/icon_17.png" alt=""></div>
          <span>{{ personalInfo.workExperience }}</span>
        </li>
        <li class="em_item em_item_more">
          <div><img src="@/assets/img/icon_18.png" alt=""></div>
          <span>{{ personalInfo.skillsAndStrengths }}</span>
        </li>
      </ul>
      <div class="em_img">
        <img src="@/assets/img/img_content.png" alt="">
      </div>
    </div>
    <!-- 内容展示区域 -->
    <div class="em_content">
      <div class="em_show_my">
        <div class="em_title">个人简介</div>
        <div class="em_content_text" v-html="selfIntroduction"></div>
        <div class="em_bgbottom"></div>
      </div>
      <div class="em_show_my">
        <div class="em_title">我的证书</div>
        <div class="em_my_card">
          <ul class="em_card_list" >
            <li class="em_card_item" v-for="( item,index ) in certificateList" :key="index">
              <span>◎</span>{{ item }}
            </li>
          </ul>
        </div>
        <div class="em_bgbottom"></div>
      </div>
      <div class="em_show_my" v-for="( item,index ) in portfolio" :key="index">
        <div class="em_title">{{ item.title }}</div>
        <div class="em_my_book">
          <ul class="em_book_list">
            <li class="em_book_item" v-for="( it,ind ) in item.photoUrls" :key="ind">
              <img @click="preViewImg(it)" :src="it" alt="">
            </li>
          </ul>
        </div>
        <div class="em_bgbottom"></div>
      </div>
    </div>
  </div>
</template>

<!-- js部分 -->
<script>
import { fetchData } from '../api/api'
import { Toast, ImagePreview } from 'vant'
import 'vant/lib/toast/index.css'
import 'vant/lib/image-preview/index.css'
export default {
  name: 'indexName',
  components: { },
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
    this.resumeId = this.$route.query.resumeId || ''
    fetchData('api/privateresumeinfo', { resumeId: this.resumeId }).then(res => {
      console.log(res)
      if (res.success) {
        // 正确回调
        this.personalInfo = res.data.personalInfo
        this.selfIntroduction = res.data.selfIntroduction
        this.portfolio = res.data.portfolio
        this.certificateList = res.data.certificateList
      } else {
        Toast(res.errorMessage)
      }
    })
  },
  // 实例DOM被挂载后调用
  mounted () { },
  methods: {
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
@import './css/index.scss';
</style>
