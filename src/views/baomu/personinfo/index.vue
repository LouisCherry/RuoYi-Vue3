<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="fullName">
        <el-input
          v-model="queryParams.fullName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职业类型" prop="occupation">
        <el-input
          v-model="queryParams.occupation"
          placeholder="请输入职业类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="薪资范畴" prop="salaryRange">
        <el-input
          v-model="queryParams.salaryRange"
          placeholder="请输入薪资范畴"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input
          v-model="queryParams.age"
          placeholder="请输入年龄"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生肖" prop="zodiac">
        <el-input
          v-model="queryParams.zodiac"
          placeholder="请输入生肖"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在省份" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入所在省份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="民族" prop="ethnicGroup">
        <el-input
          v-model="queryParams.ethnicGroup"
          placeholder="请输入民族"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="星座" prop="constellation">
        <el-input
          v-model="queryParams.constellation"
          placeholder="请输入星座"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-input
          v-model="queryParams.education"
          placeholder="请输入学历"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['baomu:personinfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['baomu:personinfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['baomu:personinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['baomu:personinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="personinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="fullName" />
      <el-table-column label="职业类型" align="center" prop="occupation" />
      <el-table-column label="薪资范畴" align="center" prop="salaryRange" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="生肖" align="center" prop="zodiac" />
      <el-table-column label="所在省份" align="center" prop="province" />
      <el-table-column label="民族" align="center" prop="ethnicGroup" />
      <el-table-column label="星座" align="center" prop="constellation" />
      <el-table-column label="学历" align="center" prop="education" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="工作经验" align="center" prop="workExperience" />
      <el-table-column label="技能与优势" align="center" prop="skillsAndStrengths" />
      <el-table-column label="自我介绍" align="center" prop="selfIntroduction" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['baomu:personinfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['baomu:personinfo:remove']">删除</el-button>
          <el-button link type="primary" icon="Link" @click="handleOpenLink(scope.row)">打开链接</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改保姆个人信息对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="personinfoRef" :model="form" :rules="rules" label-width="80px">
        <!-- 头像上传区域 -->
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-upload-container">
            <image-upload
                :action="uploadUrl"
                :data="{
                  'clientguid': '',
                  'rowguid': avatarRowguid || (avatarRowguid = createUniqueString()),
                  'tag': 'avatar'
                }"
                v-model="form.params.avatarurl"
                :limit="1"
            />
          </div>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职业类型" prop="occupation">
          <el-input v-model="form.occupation" placeholder="请输入职业类型" />
        </el-form-item>
        <el-form-item label="薪资范畴" prop="salaryRange">
          <el-input v-model="form.salaryRange" placeholder="请输入薪资范畴" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="生肖" prop="zodiac">
          <el-input v-model="form.zodiac" placeholder="请输入生肖" />
        </el-form-item>
        <el-form-item label="所在省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入所在省份" />
        </el-form-item>
        <el-form-item label="民族" prop="ethnicGroup">
          <el-input v-model="form.ethnicGroup" placeholder="请输入民族" />
        </el-form-item>
        <el-form-item label="星座" prop="constellation">
          <el-input v-model="form.constellation" placeholder="请输入星座" />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="工作经验" prop="workExperience">
          <el-input v-model="form.workExperience" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="技能与优势" prop="skillsAndStrengths">
          <el-input v-model="form.skillsAndStrengths" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="自我介绍" prop="selfIntroduction">
          <el-input v-model="form.selfIntroduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>

        <!-- 证书信息区域 -->
        <el-divider content-position="center">证书信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddCertificate">添加证书</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteCertificate">删除选中</el-button>
          </el-col>
        </el-row>
        <el-table
            :data="certificateList"
            :row-class-name="rowCertificateIndex"
            @selection-change="handleCertificateSelectionChange"
            ref="certificates"
            border
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" type="index" width="60" align="center" />
          <el-table-column label="证书名称" prop="certificateName" width="400">
            <template #default="scope">
              <el-input v-model="scope.row.certificateName" placeholder="请输入证书名称" />
            </template>
          </el-table-column>
        </el-table>

        <el-divider content-position="center">作品集合信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddPortfolio">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeletePortfolio">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="portfolioList" :row-class-name="rowPortfolioIndex" @selection-change="handlePortfolioSelectionChange" ref="portfolio">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="作品标题" prop="title" width="250">
            <template #default="scope">
              <el-input v-model="scope.row.title" placeholder="请输入作品标题" />
            </template>
          </el-table-column>
          <el-table-column label="图片上传" prop="photo_url_id" width="250">
            <template #default="scope">
              <image-upload :action="uploadUrl" :data="{
              'clientguid': scope.row.photoUrlId,
              'rowguid': '',
              'tag': 'portfolio'
            }" v-model="scope.row.params.imagelist" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Personinfo">
import { listPersoninfo, getPersoninfo, delPersoninfo, addPersoninfo, updatePersoninfo } from "@/api/baomu/personinfo";
import { ref } from 'vue';
import { createUniqueString } from '@/utils/index'


const { proxy } = getCurrentInstance();

const personinfoList = ref([]);
const portfolioList = ref([]);
// 证书相关数据
const certificateList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedPortfolio = ref([]);
const checkedCertificates = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

// 存储头像上传时的rowguid
const avatarRowguid = ref('');







const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/baomu/personinfo/upload');

const clientguid='';
const uploadData = ref({
  "clientguid": clientguid,
  "rowguid": "",
  "tag":"portfolio"
});

const data = reactive({
  form: {
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    fullName: null,
    occupation: null,
    salaryRange: null,
    age: null,
    zodiac: null,
    province: null,
    ethnicGroup: null,
    constellation: null,
    education: null,
    phone: null,
    workExperience: null,
    skillsAndStrengths: null,
    selfIntroduction: null
  },
  rules: {
    fullName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询保姆个人信息列表 */
function getList() {
  loading.value = true;
  listPersoninfo(queryParams.value).then(response => {
    personinfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    avatar: null,
    fullName: null,
    occupation: null,
    salaryRange: null,
    age: null,
    zodiac: null,
    province: null,
    ethnicGroup: null,
    constellation: null,
    education: null,
    phone: null,
    workExperience: null,
    skillsAndStrengths: null,
    selfIntroduction: null,
    params : {}
  };
  portfolioList.value = [];
  certificateList.value = []; // 重置证书列表
  // initAvatar('');  // 重置头像
  proxy.resetForm("personinfoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加保姆个人信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPersoninfo(_id).then(response => {
    form.value = response.data;
    form.value.params=response.data.params ? response.data.params:{};
    portfolioList.value = response.data.portfolioList || [];
    certificateList.value = response.data.certificateList || [];
    // // 初始化头像
    // initAvatar(response.data.avatar,response.data.params,avatarurl);
    open.value = true;
    title.value = "修改保姆个人信息";
  });
}

// 打开链接
function handleOpenLink(row) {
  // 构建新页面地址，使用当前域名拼接路径和参数
  const url = `${window.location.origin}/about?resumeId=${row.id}`;
  // 打开新页面
  window.open(url, '_blank');
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["personinfoRef"].validate(valid => {
    if (valid) {
      //头像图片
      form.value.avatar=avatarRowguid.value;
      form.value.portfolioList = portfolioList.value;
      // 处理证书数据（与作品集合格式保持一致）
      form.value.certificateList = certificateList.value
          .filter(item => item.certificateName?.trim()) // 过滤空值
          .map(item => ({
            id: item.id,
            person_info_id: form.value.id, // 关联当前人员ID
            certificateName: item.certificateName.trim() // 去除首尾空格
          }));
      if (form.value.id != null) {
        updatePersoninfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPersoninfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除？').then(function() {
    return delPersoninfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 作品集合序号 */
function rowPortfolioIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 作品集合添加按钮操作 */
function handleAddPortfolio() {
  let obj = {};
  obj.id = crypto.randomUUID();
  obj.title = "";
  obj.photoUrlId = crypto.randomUUID();
  obj.params ={};
  portfolioList.value.push(obj);
}

/** 作品集合删除按钮操作 */
function handleDeletePortfolio() {
  if (checkedPortfolio.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的作品集合数据");
  } else {
    const portfolios = portfolioList.value;
    const checkedPortfolios = checkedPortfolio.value;
    portfolioList.value = portfolios.filter(function(item) {
      return checkedPortfolios.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handlePortfolioSelectionChange(selection) {
  checkedPortfolio.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('baomu/personinfo/export', {
    ...queryParams.value
  }, `personinfo_${new Date().getTime()}.xlsx`)
}




/** 证书序号维护 */
function rowCertificateIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 证书选择变更事件 */
function handleCertificateSelectionChange(selection) {
  checkedCertificates.value = selection.map(item => item.index);
}

/** 证书添加按钮操作 */
function handleAddCertificate() {
  let obj = {};
  obj.id = crypto.randomUUID(); // 生成唯一ID
  obj.certificateName = ""; // 证书名称初始为空
  certificateList.value.push(obj);
}

/** 证书删除按钮操作 */
function handleDeleteCertificate() {
  if (checkedCertificates.value.length === 0) {
    proxy.$modal.msgError("请先选择要删除的证书数据");
  } else {
    const certificateList = certificateList.value;
    const checked = checkedCertificates.value;
    // 过滤掉选中的证书（通过序号匹配）
    certificateList.value = certificateList.filter(item => {
      return checked.indexOf(item.index) === -1;
    });
    // 清空选中状态
    checkedCertificates.value = [];
  }
}




getList();
</script>
