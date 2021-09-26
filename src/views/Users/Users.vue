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
          <el-input placeholder="输入搜索内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary">添加用户</el-button></el-col
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
        <el-table-column prop="my_state" label="状态" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.my_state"> </el-switch>
          </template>
        </el-table-column>
        <!-- TODO:操作渲染 -->
        <el-table-column prop="" label="操作"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      usersList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 0
    }
  },
  methods: {
    async initUserList() {
      // 复习：get 请求时传参使用 params，或者 查询字符串
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return
      this.usersList = res.data.users
      this.total = res.data.total
    }
  },
  created() {
    this.initUserList()
  }
}
</script>

<style lang="less" scoped></style>
