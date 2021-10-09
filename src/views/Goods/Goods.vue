<template>
  <div class="goods-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-input
        placeholder="请输入搜索内容"
        v-model="inputContent"
        class="input-with-search"
        clearable
        @clear="searchGoods"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchGoods"
        ></el-button>
      </el-input>
      <!-- 添加商品按钮 -->
      <el-button
        type="primary"
        class="add-button"
        @click="$router.push('/goods/add')"
        >添加商品</el-button
      >
      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="480">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- TODO:编辑商品 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      // 搜索输入内容
      inputContent: '',
      // 商品列表数据
      goodsList: [],
      // 获取商品列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据总条数
      total: null
    }
  },
  methods: {
    // 获取商品列表数据方法
    async initGoodsList() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.initGoodsList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.initGoodsList()
    },
    searchGoods() {
      this.queryInfo.query = this.inputContent
      this.queryInfo.pagenum = 1
      this.initGoodsList()
    },
    // 删除商品
    async removeById(id) {
      const confirmText = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmText === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/goods/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除商品成功')
      if (this.goodsList.length === 1 && this.queryInfo.pagenum !== 1) {
        this.queryInfo.pagenum = this.queryInfo.pagenum - 1
      }
      this.initGoodsList()
    }
  },
  created() {
    this.initGoodsList()
  }
}
</script>

<style lang="less" scoped>
.input-with-search {
  width: 30%;
}
.add-button {
  margin-left: 10px;
}
</style>
