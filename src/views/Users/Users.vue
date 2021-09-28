<template>
  <div class="users-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="搜索姓名"
            v-model="queryInfo.query"
            clearable
            @clear="initUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="initUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="usersList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">
            <!-- 过滤器格式化时间 -->
            <span>{{ scope.row.create_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="clickEditBtn(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="clickDelBtn(scope.row.id)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="clickRightsBtn(scope.row.id, scope.row.role_name)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      @close="rightsDialogClosed"
    >
      <!-- 表单区域 -->

      <el-form
        ref="rightsFormRef"
        :model="rightsForm"
        :rules="rightsFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名称">
          <span>{{ rightsForm.username }}</span>
        </el-form-item>
        <el-form-item label="用户角色">
          <span>{{ rightsForm.roleName }}</span>
        </el-form-item>
        <el-form-item label="分配角色" prop="rid">
          <el-select v-model="rightsForm.rid" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRights(rightsForm.id)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义 email 校验规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义 mobile 校验规则

    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    // data 返回数据
    return {
      usersList: [],
      // 查询参数
      queryInfo: {
        query: '',
        // 当前页码值
        pagenum: 1,
        // 每页显示数据条数
        pagesize: 2
      },
      total: 0,
      // 控制添加用户对话框显示隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 用户信息
      userInfo: {},
      // 编辑用户表单
      editForm: {},
      // 编辑用户校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户 dialog 开关
      editDialogVisible: false,
      // 分配权限 dialog 开关
      rightsDialogVisible: false,
      // 角色列表
      rolesList: [],
      // 权限分配 dialog 表单
      rightsForm: {},
      // 分配权限表单验证规则
      rightsFormRules: {
        rid: [{ required: true, message: '请选择分配角色', trigger: 'change' }]
      }
    }
  },
  methods: {
    async initUserList() {
      // 复习：get 请求时传参使用 params，或者 查询字符串
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.initUserList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.initUserList()
    },
    // 监听用户状态 switch
    async stateChange(uid, newState) {
      // 发起请求修改服务器端状态
      const { data: res } = await this.$http.put(
        `users/${uid}/state/${newState}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改状态成功')
    },
    // 添加用户 dialog 关闭的处理函数
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      // 请求前预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 预验证通过，发起请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加用户成功')
        // 隐藏 dialog
        this.addDialogVisible = false
        // 刷新列表
        this.initUserList()
      })
    },
    // 点击编辑按钮获取用户信息
    async clickEditBtn(id) {
      const { data: res } = await this.$http.get(`/users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑用户 diglog 关闭的处理函数
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUser() {
      // 表单提交预校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过发起请求
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('编辑用户信息成功')
        this.editDialogVisible = false
        this.initUserList()
      })
    },
    // 删除用户
    async clickDelBtn(id) {
      // $confirm 返回一个promise，如果用户确定则返回内容 confirm，取消则返回 cancel
      const confirmResult = await this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 没有确认删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      // 确认了删除，发起请求，根据id删除用户信息
      const { data: res } = await this.$http.delete(`/users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        type: 'success',
        message: '删除用户成功!'
      })
      this.initUserList()
    },
    // 获取角色列表
    async initRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 根据角色id查询角色信息
    async getRoleById(rid) {
      const { data: res } = await this.$http.get(`/roles/${rid}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsForm.roleName = res.data.roleName
    },
    // 点击分配权限按钮处理函数
    async clickRightsBtn(id, rName) {
      const { data: res } = await this.$http.get(`/users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsForm = res.data
      this.rightsForm.roleName = rName
      // 清空默认选项
      this.rightsForm.rid = null
      this.initRolesList()
      this.rightsDialogVisible = true
    },
    // TODO:分配权限代码优化
    // 分配权限处理函数
    editRights(uid) {
      // 请求前表单预校验
      this.$refs.rightsFormRef.validate(async valid => {
        if (!valid) return
        // 预校验通过，发起请求
        const { data: res } = await this.$http.put(`users/${uid}/role`, {
          rid: this.rightsForm.rid
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('分配权限成功')
        this.initUserList()
        this.rightsDialogVisible = false
      })
    },
    // 关闭分配权限 dialog 时重置表单
    rightsDialogClosed() {
      this.$refs.rightsFormRef.resetFields()
    }
  },
  created() {
    this.initUserList()
  }
}
</script>

<style lang="less" scoped></style>
