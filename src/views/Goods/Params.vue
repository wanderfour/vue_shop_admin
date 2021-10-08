<template>
  <div class="params-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 注意提示信息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        effect="dark"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-form label-width="100px">
        <el-form-item label="选择商品分类">
          <el-cascader
            :options="catesList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 参数列表区域 -->
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            @click="addManyDialogVisible = true"
            :disabled="addButtonStatus"
            >添加参数</el-button
          >
          <el-table
            :data="manyAttributes"
            style="width: 100%"
            stripe
            border
            row-key="attr_id"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 复习：解决input显示独立控制的问题 -->
                <div class="expand-box">
                  <el-tag
                    v-for="(tag, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="removeTag(i, scope.row)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50">
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editManyAttr(scope.row.attr_id)"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteManyAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="addButtonStatus"
            @click="addManyDialogVisible = true"
            >添加属性</el-button
          >
          <el-table
            :data="onlyAttributes"
            style="width: 100%"
            stripe
            border
            row-key="attr_id"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- TODO:解决input显示独立控制的问题 -->
                <div class="expand-box">
                  <el-tag
                    v-for="(tag, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="removeTag(i, scope.row)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="50">
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editManyAttr(scope.row.attr_id)"
                  >修改</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteManyAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/添加静态属性 dialog -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addManyDialogVisible"
      width="50%"
      @close="addManyDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="addManyFormRef"
        :model="addManyForm"
        :rules="addManyFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addManyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addManyAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑动态参数 dialog -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editManyDialogVisible"
      width="50%"
      @close="editManyDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        ref="editManyFormRef"
        :model="editManyForm"
        :rules="addManyFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editManyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditManyAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 选择分类表单
      selectedCateId: null,
      // 分类列表
      catesList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name'
      },
      // 激活的标签页
      activeName: 'many',
      // 动态参数列表
      manyAttributes: [],
      // 静态参数列表
      onlyAttributes: [],
      // 添加参数dialog显示
      addManyDialogVisible: false,
      addManyForm: {
        attr_name: ''
      },
      addManyFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      addButtonStatus: true,
      editManyDialogVisible: false,
      editManyForm: {}
    }
  },
  computed: {
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    // 获取所有商品分类列表
    async initCatesList() {
      const { data: res } = await this.$http.get('/categories', { type: 3 })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catesList = res.data
    },
    // 获取参数列表
    async initManyAttributes() {
      const { data: res } = await this.$http.get(
        `categories/${parseInt(this.selectedCateId)}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示和隐藏
        item.inputVisible = false
        // 控制文本框输入值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyAttributes = res.data
      } else {
        this.onlyAttributes = res.data
      }
    },
    // 级联样式表选择改变
    handleChange(value) {
      if (!value) return
      this.addButtonStatus = false
      // this.$refs.addAttrButtonRef.disabled = false
      if (value.length >= 3) {
        this.selectedCateId = value[value.length - 1]
        this.initManyAttributes()
      } else {
        this.$message.error('只允许为第三级分类设置相关参数!')
        // 没有选择3级分类时，情况列表数据
        this.selectedCateId = null
        this.manyAttributes = []
        this.onlyAttributes = []
      }
    },
    // 切换tab
    handleClick() {
      this.initManyAttributes()
    },

    showInput(attr) {
      attr.inputVisible = true
      // 自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加动态参数
    addManyAttr() {
      // 预校验
      this.$refs.addManyFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加参数请求
        const { data: res } = await this.$http.post(
          `categories/${this.selectedCateId}/attributes`,
          {
            attr_name: this.addManyForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加参数成功')
        this.addManyDialogVisible = false
        this.initManyAttributes()
      })
    },
    addManyDialogClosed() {
      this.$refs.addManyFormRef.resetFields()
    },

    // 编辑参数
    async editManyAttr(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editManyForm = res.data
      this.editManyDialogVisible = true
    },
    editManyDialogClosed() {
      this.$refs.editManyFormRef.resetFields()
    },
    // 确认修改参数
    confirmEditManyAttr() {
      // 预校验
      this.$refs.editManyFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editManyForm.cat_id}/attributes/${this.editManyForm.attr_id}`,
          {
            attr_name: this.editManyForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改动态参数成功')
        this.initManyAttributes()
        this.editManyDialogVisible = false
      })
    },
    async deleteManyAttr(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除')
      }
      // 确认删除，发起请求
      const { data: res } = await this.$http.delete(
        `categories/${this.selectedCateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除参数成功')
      this.initManyAttributes()
    },
    // 更新参数tag
    async saveAttrVal(attr) {
      // 发起添加参数请求
      const { data: res } = await this.$http.put(
        `categories/${attr.cat_id}/attributes/${attr.attr_id}`,
        {
          attr_name: attr.attr_name,
          attr_sel: this.activeName,
          attr_vals: attr.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.initManyAttributes()
    },
    // 添加动态参数tag函数
    async handleInputConfirm(attr) {
      const inputValue = attr.inputValue
      if (inputValue.trim().length !== 0) {
        attr.attr_vals.push(inputValue.trim())
        // 发起添加参数请求
        this.saveAttrVal(attr)
      }
      attr.inputVisible = false
      attr.inputValue = ''
    },
    // 删除参数tag
    removeTag(i, attr) {
      console.log('remove')
      attr.attr_vals.splice(i, 1)
      this.saveAttrVal(attr)
    }
  },
  created() {
    this.initCatesList()
  }
}
</script>

<style lang="less" scoped>
.el-form {
  margin-top: 20px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 160px;
}
.expand-box {
  margin: 10px 0 20px;
  margin-left: 50px;
}
.el-tag {
  margin-bottom: 10px;
}
</style>
