<template>
  <div class="home-notice-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input
              v-model="searchForm.noticeTitle"
              placeholder="请输入公告标题"
              clearable
              style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select
              v-model="searchForm.noticeType"
              placeholder="请选择公告类型"
              clearable
              style="width: 150px;"
          >
            <el-option label="通知" value="1" />
            <el-option label="公告" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getNoticeList">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 公告列表 -->
    <el-card shadow="never" class="notice-list-card">
      <div slot="header">
        <span>最新公告</span>
        <el-badge
            :value="total"
            type="primary"
            class="badge-count"
        />
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-tip">
        <el-loading-spinner></el-loading-spinner>
        <p>加载中...</p>
      </div>

      <!-- 列表为空时显示 -->
      <div v-else-if="noticeList.length === 0" class="empty-tip">
        <el-empty description="暂无符合条件的公告" />
      </div>

      <!-- 公告列表内容 -->
      <el-table
          v-else
          :data="noticeList"
          border
          stripe
          style="width: 100%;"
          @row-click="handleRowClick"
      >
        <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
        ></el-table-column>

        <el-table-column
            label="公告标题"
            prop="noticeTitle"
            align="center"
            :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column
            label="公告类型"
            prop="noticeType"
            align="center"
            width="100"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.noticeType === '1' ? 'info' : 'success'"
            >
              {{ scope.row.noticeType === '1' ? '通知' : '公告' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
            label="发布人"
            prop="createBy"
            align="center"
            width="120"
        ></el-table-column>

        <el-table-column
            label="发布时间"
            prop="createTime"
            align="center"
            width="180"
        ></el-table-column>

        <el-table-column
            label="状态"
            prop="status"
            align="center"
            width="100"
        >
          <template #default="scope">
            <el-tag type="success">已发布</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="pagination-container" v-if="total > 0 && !loading">
        <el-pagination
            background
            layout="prev, pager, next, sizes, total, jumper"
            :total="total"
            v-model:pageNum="pagination.pageNum"
            v-model:pageSize="pagination.pageSize"
            :page-sizes="[5, 10, 20, 50]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 公告详情弹窗 -->
    <el-dialog
        :title="currentNotice.noticeTitle || '公告详情'"
        v-model="dialogVisible"
        width="60%"
    >
      <div class="notice-detail">
        <div class="detail-header">
          <h3>{{ currentNotice.noticeTitle }}</h3>
          <div class="detail-meta">
            <span>发布人：{{ currentNotice.createBy }}</span>
            <span>发布时间：{{ currentNotice.createTime }}</span>
            <span>公告类型：{{ currentNotice.noticeType === '1' ? '通知' : '公告' }}</span>
          </div>
        </div>
        <div class="detail-content" v-html="currentNotice.noticeContent" />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice } from "@/api/system/notice";

export default {
  name: "HomeNotice",
  data() {
    return {
      // 搜索表单
      searchForm: {
        noticeTitle: "",
        noticeType: "",
        status: "0" // 只查已发布
      },
      // 分页参数
      pagination: {
        pageNum: 1,
        pageSize: 10
      },
      // 公告列表数据
      noticeList: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 详情弹窗
      dialogVisible: false,
      currentNotice: {}
    };
  },
  created() {
    this.getNoticeList();
  },
  methods: {
    /** 获取公告列表 */
    async getNoticeList() {
      this.loading = true;
      try {
        const params = {
          ...this.searchForm,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        };

        const response = await listNotice(params);

        if (response && response.code === 200) {
          this.noticeList = response.rows || [];
          this.total = response.total || 0;
        } else {
          this.noticeList = [];
          this.total = 0;
          this.$message.error("获取数据失败: " + (response?.msg || "未知错误"));
        }
      } catch (error) {
        this.noticeList = [];
        this.total = 0;
        this.$message.error("请求异常: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    /** 重置搜索 */
    resetSearch() {
      this.searchForm = {
        noticeTitle: "",
        noticeType: "",
        status: "0"
      };
      this.pagination.pageNum = 1;
      this.getNoticeList();
    },

    /** 分页：每页条数变化 */
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.pageNum = 1;
      this.getNoticeList();
    },

    /** 分页：当前页变化 */
    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum;
      this.getNoticeList();
    },

    /** 点击行查看详情 */
    handleRowClick(row) {
      this.currentNotice = row;
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>
.home-notice-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 180px);
}

.page-header {
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
  background-color: #fff;
}

.search-form {
  margin: 10px 0;
}

.notice-list-card {
  background-color: #fff;
}

.badge-count {
  margin-left: 10px;
}

/* 加载状态样式 */
.loading-tip {
  padding: 50px 0;
  text-align: center;
}

/* 空状态样式 */
.empty-tip {
  padding: 50px 0;
  text-align: center;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}

/* 详情弹窗样式 */
.notice-detail {
  padding: 10px 0;
}

.detail-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.detail-header h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.detail-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.detail-content {
  line-height: 1.8;
  color: #444;
  font-size: 15px;
  padding: 0 10px;
}
</style>
