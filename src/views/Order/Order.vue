<template>
  <div class="order-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-input
        placeholder="请输入搜索内容"
        v-model="inputContent"
        class="input-with-search"
        clearable
        @clear="searchOrder"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchOrder"
        ></el-button>
      </el-input>
      <!-- 订单列表 -->
      <el-table :data="ordersList" style="width: 100%" stripe border>
        <el-table-column prop="order_id" label="#" width="50">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="260"
        ></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.pay_status === '1'"
              effect="dark"
              size="mini"
            >
              已付款
            </el-tag>
            <el-tag v-else effect="dark" size="mini" type="danger">
              未付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAddrDialog(scope.row.order_id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="showProgressDialog(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址 dialog -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddrDialogVisible"
      width="50%"
      @close="editAddrHandleClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县 " prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息 dialog -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in progressList"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入城市数据
import cityData from './citydata.js'
import progressData from './progressData.js'

export default {
  name: 'Order',
  data() {
    return {
      // 搜索输入框内容
      inputContent: '',
      // 订单列表数据
      ordersList: [],
      // 订单请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单总条数
      total: null,
      // 修改地址面板
      editAddrDialogVisible: false,
      // 修改地址表单
      editForm: {
        address1: [],
        address2: ''
      },
      // 修改地址验证规则
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData,
      progressDialogVisible: false,
      // 物流原始数据
      progressData,
      // 物流数据
      progressList: []
    }
  },
  methods: {
    // 搜索订单
    searchOrder() {
      this.queryInfo.query = this.inputContent
      this.queryInfo.pagenum = 1
      this.initOrdersList()
    },
    async initOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.initOrdersList()
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.initOrdersList()
    },
    async showEditAddrDialog(id) {
      // TODO:修改地址请求
      // const { data: res } = await this.$http.get('orders/' + id)
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editAddrDialogVisible = true
    },
    // 关闭修改地址dialog处理函数
    editAddrHandleClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改地址函数
    editAddr() {
      this.editAddrDialogVisible = false
    },
    // 显示物流进度面板处理函数
    showProgressDialog(id) {
      // console.log(id)
      // api报错，故写死数据
      // const { data: res } = await this.$http.get('/kuaidi/SF1433289416347')
      this.progressList = this.progressData.data
      console.log(this.progressList)
      this.progressDialogVisible = true
    }
  },
  created() {
    this.initOrdersList()
  }
}
</script>

<style lang="less" scoped>
.input-with-search {
  width: 30%;
}
.el-cascader {
  width: 100%;
}
</style>
