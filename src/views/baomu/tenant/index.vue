<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="截止时间" prop="tenantEndTime">
        <el-date-picker clearable
          v-model="queryParams.tenantEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择截止时间">
        </el-date-picker>
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
          v-hasPermi="['baomu:tenant:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['baomu:tenant:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['baomu:tenant:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['baomu:tenant:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="编号" align="center" prop="id" />-->
      <el-table-column label="用户" align="center" prop="userName" />
      <el-table-column label="租户截止时间" align="center" prop="tenantEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.tenantEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['baomu:tenant:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['baomu:tenant:remove']">删除</el-button>
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

    <!-- 添加或修改租户清单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="tenantRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择用户" prop="userId">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input
                  v-model="form.userName"
                  placeholder="请选择系统用户"
                  readonly
                  style="cursor: pointer"
              />
              <!-- 存储实际提交的用户ID（隐藏） -->
              <el-input
                  v-model="form.userId"
                  type="hidden"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                  type="primary"
                  icon="User"
                  @click="openSelectUserDialog"
              >选择用户</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="截止时间" prop="tenantEndTime">
          <el-date-picker clearable
            v-model="form.tenantEndTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择租户截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>



    <!-- 系统用户选择弹窗（复用角色授权的用户选择组件逻辑） -->
    <el-dialog
        title="选择系统用户"
        v-model="selectUserVisible"
        width="800px"
        top="5vh"
        append-to-body
    >
      <!-- 搜索区域 -->
      <el-form :model="userQueryParams" ref="userQueryRef" :inline="true">
        <el-form-item label="用户名称" prop="userName">
          <el-input
              v-model="userQueryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 180px"
              @keyup.enter="getUserList"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
              v-model="userQueryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              style="width: 180px"
              @keyup.enter="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="getUserList">搜索</el-button>
          <el-button icon="Refresh" @click="resetUserQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table
          @row-click="clickUserRow"
          ref="userTableRef"
          :data="userList"
          @selection-change="handleUserSelectionChange"
          height="300px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
          v-show="userTotal > 0"
          :total="userTotal"
          v-model:page="userQueryParams.pageNum"
          v-model:limit="userQueryParams.pageSize"
          @pagination="getUserList"
      />

      <!-- 弹窗按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmSelectUser">确 定</el-button>
          <el-button @click="selectUserVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>



<script setup name="Tenant">
import { listTenant, getTenant, delTenant, addTenant, updateTenant } from "@/api/baomu/tenant"
import { listUser } from "@/api/system/user"; // 导入系统用户查询接口
import { getCurrentInstance } from "vue";

// 组件实例
const { proxy } = getCurrentInstance();
// 状态字典（启用/禁用）
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");


// 用户选择弹窗相关变量
const selectUserVisible = ref(false); // 弹窗显示状态
const userList = ref([]); // 系统用户列表
const userTotal = ref(0); // 用户总数
const selectedUser = ref(null); // 选中的用户


const tenantList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    tenantEndTime: null,
    userName: null
  },
  rules: {
    userId: [
      { required: true, message: "用户不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)


// 用户查询参数
const userQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined
});

// 打开用户选择弹窗
function openSelectUserDialog() {
  selectUserVisible.value = true;
  getUserList(); // 加载用户列表
}

// 查询系统用户列表
function getUserList() {
  listUser(userQueryParams).then(res => {
    userList.value = res.rows;
    userTotal.value = res.total;
  });
}

// 重置用户查询条件
function resetUserQuery() {
  proxy.resetForm("userQueryRef");
  userQueryParams.pageNum = 1;
  getUserList();
}

// 选中用户行
function clickUserRow(row) {
  proxy.$refs["userTableRef"].toggleRowSelection(row);
}

// 处理用户选择
function handleUserSelectionChange(selection) {
  if (selection.length > 0) {
    selectedUser.value = selection[0]; // 仅支持单选
  } else {
    selectedUser.value = null;
  }
}

// 确认选择用户
function confirmSelectUser() {
  if (!selectedUser.value) {
    proxy.$modal.msgError("请选择用户");
    return;
  }
  // 赋值给表单
  form.value.userId = selectedUser.value.userId;
  form.value.userName = selectedUser.value.userName;
  selectUserVisible.value = false;
}

// 在表单验证规则中添加（如果需要）
// const rules = reactive({
//   // 其他规则...
//   userId: [{ required: true, message: "请选择关联用户", trigger: "blur" }]
// });

/** 查询租户清单列表 */
function getList() {
  loading.value = true
  listTenant(queryParams.value).then(response => {
    tenantList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    userId: null,
    tenantEndTime: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    userName: null
  }
  proxy.resetForm("tenantRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加租户清单"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getTenant(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改租户清单"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["tenantRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTenant(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTenant(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除租户清单编号为"' + _ids + '"的数据项？').then(function() {
    return delTenant(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('baomu/tenant/export', {
    ...queryParams.value
  }, `tenant_${new Date().getTime()}.xlsx`)
}

getList()
</script>
