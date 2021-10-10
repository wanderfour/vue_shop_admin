<template>
  <div class="add-goods-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="parseInt(activeName)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品信息表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="add-form"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          tab-position="left"
          style="height: 200px;"
          v-model="activeName"
          :stretch="true"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catesList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单 item 项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyAttrList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, i1) in item.attr_vals"
                  :key="i1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单 item 项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyAttrList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传的api地址 -->
            <el-upload
              :action="uploadURL"
              :headers="headerObj"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="5"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog
              title="图片预览"
              :visible.sync="dialogVisible"
              width="50%"
            >
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="add-btn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入 lodash
import _ from 'lodash'

export default {
  name: 'AddGoods',
  data() {
    return {
      // 激活的标签页
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品内容
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catesList: [],
      // 商品分类级联样式表配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表
      manyAttrList: [],
      // 静态属性列表
      onlyAttrList: [],
      // 上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片路径
      imageUrl: '',
      // 预览图片路径
      dialogImageUrl: '',
      // 预览图片dialog显示
      dialogVisible: false
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类列表方法
    async initCatesList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catesList = res.data
    },
    // 商品分类选择处理函数
    handleChange(val) {
      if (val.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.warning('只能选择三级商品分类')
      }
    },
    // 切换标签页处理函数
    beforeTabLeave(oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 切换tab时获取动态参数和静态属性数据
    async tabClicked() {
      let sel = ''
      if (this.activeName === '1' || this.activeName === '2') {
        // 面板name为1，访问的动态参数tab，发起动态参数请求
        if (this.activeName === '1') {
          sel = 'many'
        } else if (this.activeName === '2') {
          sel = 'only'
        }
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes/`,
          {
            params: { sel: sel }
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        if (this.activeName === '1') {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length !== 0 ? item.attr_vals.split(',') : []
          })
          this.manyAttrList = res.data
        } else if (this.activeName === '2') {
          this.onlyAttrList = res.data
        }
      }
    },
    // 限制上传图片的大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 监听图片上传成功
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      // 将每次上传成功的图片路径拼接到图片数组
      this.addForm.pics.push(picInfo)
    },
    // 移除图片
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中，找到这个图片对应的索引值
      const fileIndex = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(fileIndex, 1)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 执行添加商品的业务逻辑
        // lodash 深拷贝
        const form = _.cloneDeep(this.addForm)
        // 将商品分类拼接成字符串
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyAttrList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyAttrList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 发起添加商品的请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.initCatesList()
  }
}
</script>

<style lang="less" scoped>
.el-step {
  margin: 20px 0;
}
/deep/ .el-step__title {
  font-size: 12px;
}
/deep/ .el-tabs {
  height: 100% !important;
}
.add-btn {
  margin-top: 15px;
}
</style>
