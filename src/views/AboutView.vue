<!-- html部分 -->
<template>
  <!-- 合并服务到期和链接失效的判断逻辑，统一显示提示 -->
  <div v-if="showExpiredMessage" class="expired-container">
    <div class="expired-message">{{ expiredMessage }}</div>
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
        <!-- 调用处代码（已修改） -->
        <ul class="em_book_list">
          <li class="em_book_item" v-for="(it, ind) in item.photoUrls" :key="ind">
            <!-- 为每个缩略图传入当前图片作为src，完整列表通过自定义属性传递 -->
            <ImagePreview
                :src="item.photoUrls.join(',')"
                :initial-index="ind"
                width="100px"
                height="100px"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- 电话咨询：无电话号码时不显示 -->
    <div v-if="personalInfo.phone" class="em_call" @click="openCall(personalInfo.phone)">
      <img src="@/assets/img/img_phone.png" alt="">
      电话咨询
    </div>

  </div>
</template>

<!-- js部分 -->
<script>
import {publicresumeinfo, publicresumeinfobyshortid} from "@/api/baomu/personinfo";
import { Toast} from 'vant'
import { isExternal } from "@/utils/validate"; // 引入外部链接判断工具
import 'vant/lib/toast/index.css'
import ImagePreview from "@/components/ImagePreview/index.vue";
import {createUniqueString} from "@/utils/index.js";

export default {
  name: 'aboutName',
  components: {
    ImagePreview
  },
  // 定义用到的数据，在template中使用{{ }}包裹，自动实现绑定
  data () {
    return {
      certificateList: '',
      personalInfo: {},
      portfolio: '',
      selfIntroduction: '',
      // 新增状态变量
      showExpiredMessage: false,
      expiredMessage: ''
    }
  },
  created () {
    this.resumeId = this.$route.query.resumeId || '1';
    this.shortid = this.$route.query.shortid;
    if(this.shortid){
      publicresumeinfobyshortid(this.shortid).then(res => {
        console.log(res)
        if (res.code === 200) {
          // 检查服务到期状态（isenable为0或false）
          const isServiceExpired = res.data.personalInfo.isenable !== undefined &&
                                 (res.data.personalInfo.isenable === '0' || !res.data.personalInfo.isenable);

          // 检查链接是否失效（超过7天）
          let isLinkExpired = false;
          if(res.data.personalInfo.shortdate){
            const lastDate = new Date(res.data.personalInfo.shortdate);
            const now = new Date();
            const timeDiff = now - lastDate;
            const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
            isLinkExpired = dayDiff > 7;
          }

          // 优先级：服务到期 > 链接失效
          if (isServiceExpired) {
            this.showExpiredMessage = true;
            this.expiredMessage = "您的服务到期";
          } else if (isLinkExpired) {
            this.showExpiredMessage = true;
            this.expiredMessage = "链接已失效";
            }else{
            // 正常显示数据
              this.personalInfo = res.data.personalInfo;
            this.selfIntroduction = res.data.selfIntroduction;
            this.portfolio = res.data.portfolio;
            this.certificateList = res.data.certificateList;
            }
        } else {
          Toast(res.errorMessage);
        }
      })
    }else{
      publicresumeinfo(this.resumeId).then(res => {
        console.log(res)
        if (res.code === 200) {
          // 检查服务到期状态
          const isServiceExpired = res.data.personalInfo.isenable !== undefined &&
                                 (res.data.personalInfo.isenable === '0' || !res.data.personalInfo.isenable);

          if (isServiceExpired) {
            this.showExpiredMessage = true;
            this.expiredMessage = "您的服务到期";
        } else {
            // 正常显示数据
            this.personalInfo = res.data.personalInfo;
            this.selfIntroduction = res.data.selfIntroduction;
            this.portfolio = res.data.portfolio;
            this.certificateList = res.data.certificateList;
          }
        } else {
          Toast(res.errorMessage);
        }
      })
    }
  },
  methods: {
    // 将 getRealPhotoUrl 定义在 methods 中，确保能访问到 import 的变量
    getRealPhotoUrl(url) {
      if (!url) return "";
      return isExternal(url) ? url : import.meta.env.VITE_APP_BASE_API + url;
    },
    openCall (phone) {
      if (phone) {
        window.location.href = 'tel:' + phone;
      } else {
        Toast('暂无联系方式');
      }
    },

  }
};

</script>

<!-- css部分 -->
<style lang="scss" scoped>
@import '@/assets/css/common.css';
@import './css/about.scss';

// 统一过期提示样式
.expired-container {
  color: #f56c6c;
  font-size: 18px;
  text-align: center;
  padding: 50px 0;
  min-height: 300px; // 确保有足够高度显示提示
}
</style>
