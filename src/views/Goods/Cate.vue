<template>
  <div class="container-cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 列表 -->
      <el-table
        :data="catesList"
        row-key="cat_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :indent="16"
        stripe
        border
      >
        <!-- 索引列 -->
        <el-table-column label="#" type="index">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <!-- 可展开行列 -->
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" class="cat-deleted-col">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              style="color:#7ec050;"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" style="color: #e47470;" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag
              type=""
              effect="dark"
              size="mini"
              v-if="scope.row.cat_level === 0"
            >
              一级
            </el-tag>
            <el-tag
              type="success"
              effect="dark"
              size="mini"
              v-else-if="scope.row.cat_level === 1"
            >
              二级
            </el-tag>
            <el-tag
              type="warning"
              effect="dark"
              size="mini"
              v-else-if="scope.row.cat_level === 2"
            >
              三级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类 dialog -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      @close="addCateDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        :model="addForm"
        :rules="addCateRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <!-- props 用于指定配置对象 -->
          <el-cascader
            v-model="selectPid"
            :options="allcatesList"
            :props="cascaderProps"
            style="width: 100%;"
            ref="addCascaderRef"
            collapse-tags
            @change="pidChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 获取商品分类列表的查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      // 商品分类数据列表
      catesList: [],
      // 总数据条数
      total: 0,
      // 添加分类 dialog 显示
      addDialogVisible: false,
      // 添加分类表单数据
      addForm: {
        cat_pid: 0, // 分类父id
        cat_name: '', // 分类名称
        cat_level: 0 // 分类层级
      },
      // 添加分类校验规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' }
        ]
      },
      // 不分页分类列表
      allcatesList: [],
      // 选中的父级分类id
      selectPid: [],
      // 级联选择器 prop内容
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    async initCatesList() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catesList = res.data.result
      this.total = res.data.total
      // 自定义索引
      if (this.catesList.length > 0) this.indexMethod(this.catesList)
    },
    // 自定义索引方法
    indexMethod(arr) {
      arr.forEach((item, key) => {
        item.index = key + 1
      })
    },
    // pageSize 改变时会触发，回调参数为每页条数
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
      this.initCatesList()
    },
    // currentPage 改变时会触发，回调参数是当前页码
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
      this.initCatesList()
    },
    // 点击添加分类按钮
    async showAddCateDialog() {
      // 获取父级分类列表
      const { data: res } = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$http.error(res.meta.msg)
      this.allcatesList = res.data
      this.addDialogVisible = true
    },
    // 选择了父级分类
    pidChange() {
      // 如果 selectedKeys 数组中的length大于0，证明选中的父级分类，反之，没有选中任何分类
      if (this.selectPid.length > 0) {
        // 获得父级id
        this.addForm.cat_pid = this.selectPid[this.selectPid.length - 1]
        // 当前分类的等级
        this.addForm.cat_level = this.selectPid.length
      } else {
        // 如果没有选择任何父级节点，则默认为添加一级分类
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 添加分类对话框关闭重置表单内容
    addCateDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectPid = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    },
    // 确认添加分类
    submitCate() {
      // 预验证表单
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加分类请求
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功')
        this.initCatesList()
        this.addDialogVisible = false
      })
    }
  },
  created() {
    this.initCatesList()
  }
}
</script>

<style lang="less" scoped></style>
