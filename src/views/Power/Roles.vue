<template>
  <div class="roles-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- TODO:添加角色 -->
      <!-- 添加角色 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 列表 -->
      <el-table :data="rolesList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand" width="50">
          <template slot-scope="props">
            <div class="expand-table">
              <el-row v-for="item1 in props.row.children" :key="item1.id">
                <!-- 一级权限列 -->
                <el-col :span="5">
                  <el-tag
                    effect="dark"
                    closable
                    @close="removeRightById(props.row, item3.id)"
                    >{{ item1.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级、三级权限列 -->
                <el-col :span="19">
                  <el-row
                    v-for="item2 in item1.children"
                    :key="item2.id"
                    class="subrow"
                  >
                    <el-col :span="5">
                      <el-tag
                        effect="dark"
                        closable
                        type="success"
                        @close="removeRightById(props.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        effect="dark"
                        closable
                        type="warning"
                        @close="removeRightById(props.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <!-- TODO:编辑角色 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!-- 删除 -->
            <!-- TODO:删除角色 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="isSetRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isSetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 分配权限对话框显示
      isSetRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 权限树形控件的属性绑定对象
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id数组
      defKeys: [],
      // 点击分配权限时的 角色id
      roleId: null
    }
  },
  methods: {
    async initRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 发起删除请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 重新为当前角色赋值权限，防止更新这个角色列表数据，关闭展开列表
      role.children = res.data
      this.$message.success('确认了删除')
    },
    async showSetRightDialog(role) {
      // 点击分配权限按钮时，保存roleId，以便后续分配权限请求时使用
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data

      // 调用递归函数，获取权限id数组
      this.getLeafKeys(role, this.defKeys)
      this.isSetRightDialogVisible = true
    },
    // 通过递归形式获取角色下所有3级权限的id
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 分配权限 dialog 关闭重新赋值
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 拼接成字符串形式
      const keysStr = keys.join(',')
      // 发起请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keysStr
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功')
      this.isSetRightDialogVisible = false
      this.initRolesList()
    }
  },
  created() {
    this.initRolesList()
  }
}
</script>

<style lang="less" scoped>
.expand-table {
  width: 90%;
  margin: 10px auto;
}
.el-row {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-top: none;
  &:first-child {
    border-top: 1px solid #eee;
  }
  .el-tag {
    margin: 7px;
  }
  .subrow {
    border: none;
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;
    &:last-child {
      border-bottom: none;
    }
  }
}
.el-col {
  &:first-child {
    text-align: center;
    height: 100%;
  }
}
</style>
