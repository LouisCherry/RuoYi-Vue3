<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="附件名称" prop="attachfilename">
        <el-input
          v-model="queryParams.attachfilename"
          placeholder="请输入附件名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附件标签" prop="CLIENGTAG">
        <el-input
          v-model="queryParams.CLIENGTAG"
          placeholder="请输入附件标签"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传人名称" prop="UPLOADUSERDISPLAYNAME">
        <el-input
          v-model="queryParams.UPLOADUSERDISPLAYNAME"
          placeholder="请输入上传人名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传时间" prop="UPLOADDATETIME">
        <el-date-picker clearable
          v-model="queryParams.UPLOADDATETIME"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择上传时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['baomu:attachinfo:add']"
        >新增</el-button>
      </el-col>-->
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['baomu:attachinfo:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['baomu:attachinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['baomu:attachinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="attachinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="ATTACHGUID" />-->
      <el-table-column label="附件名称" align="center" prop="attachfilename" />
      <el-table-column label="附件类型" align="center" prop="CONTENTTYPE" />
      <el-table-column label="附件大小" align="center" prop="ATTACHLENGTH" />
      <el-table-column label="附件标签" align="center" prop="CLIENGTAG" />
      <el-table-column label="附件路径" align="center" prop="FILEPATH" />
<!--
      <el-table-column label="上传人guid" align="center" prop="UPLOADUSERGUID" />
-->
      <el-table-column label="上传人名称" align="center" prop="UPLOADUSERDISPLAYNAME" />
      <el-table-column label="上传时间" align="center" prop="UPLOADDATETIME" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.UPLOADDATETIME, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
<!--
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['baomu:attachinfo:edit']">修改</el-button>
-->
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['baomu:attachinfo:remove']">删除</el-button>
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

    <!-- 添加或修改附件对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="attachinfoRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Attachinfo">
import { listAttachinfo, getAttachinfo, delAttachinfo, addAttachinfo, updateAttachinfo } from "@/api/baomu/attachinfo";

const { proxy } = getCurrentInstance();

const attachinfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    attachfilename: null,
    CONTENTTYPE: null,
    CLIENGTAG: null,
    FILEPATH: null,
    UPLOADUSERDISPLAYNAME: null,
    UPLOADDATETIME: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询附件列表 */
function getList() {
  loading.value = true;
  listAttachinfo(queryParams.value).then(response => {
    attachinfoList.value = response.rows;
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
    ATTACHGUID: null,
    attachfilename: null,
    CONTENTTYPE: null,
    ATTACHLENGTH: null,
    CLIENGTAG: null,
    CLIENGGUID: null,
    FILEPATH: null,
    UPLOADUSERGUID: null,
    UPLOADUSERDISPLAYNAME: null,
    UPLOADDATETIME: null
  };
  proxy.resetForm("attachinfoRef");
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
  ids.value = selection.map(item => item.ATTACHGUID);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加附件";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _ATTACHGUID = row.ATTACHGUID || ids.value
  getAttachinfo(_ATTACHGUID).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改附件";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["attachinfoRef"].validate(valid => {
    if (valid) {
      if (form.value.ATTACHGUID != null) {
        updateAttachinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAttachinfo(form.value).then(response => {
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
  const _ATTACHGUIDs = row.ATTACHGUID || ids.value;
  proxy.$modal.confirm('是否确认删除附件编号为"' + _ATTACHGUIDs + '"的数据项？').then(function() {
    return delAttachinfo(_ATTACHGUIDs);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('baomu/attachinfo/export', {
    ...queryParams.value
  }, `attachinfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
