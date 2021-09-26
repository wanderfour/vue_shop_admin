<template>
  <el-container class="home-container">
    <!-- header -->
    <el-header>
      <div class="logo-box" @click="$router.push('/welcome')">
        <img src="@/assets/panda_logo.jpeg" alt="" class="logo-img" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" size="medium" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠菜单按钮 -->
        <div class="fold-btn" @click="toggleFold">|||</div>
        <!-- 菜单 -->
        <!-- TODO:default-active 的值，教程通过点击事件获取被点击菜单的路由，而不是 $route.path，后续需要验证 -->
        <el-menu
          background-color="#343743"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id.toString()"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconsObj[item.id]" id="menuIcon"></i>
              <!-- 一级菜单名称 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="'/' + subitem.path.toString()"
            >
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级菜单名称 -->
                <span>{{ subitem.authName }}</span>
              </template>
              <!-- <span slot="title">{{ subitem.authName }}</span> -->
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      // menu 的图标
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧导航菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    },
    toggleFold() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #383d41;
  color: white;
  line-height: 60px;
  .logo-box {
    display: inline-block;
    font-size: 20px;
    cursor: pointer;
    .logo-img {
      margin-right: 12px;
      height: 38px;
      vertical-align: middle;
      border-radius: 50%;
    }
  }
}

.el-aside {
  background-color: #343743;
  color: white;
  text-align: center;
  height: 100%;
  .el-menu {
    border-right: none;
    .el-submenu {
      text-align: left;
    }
    #menuIcon {
      margin-right: 12px;
    }
  }
  .fold-btn {
    background-color: #4b5062;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    letter-spacing: 1px;
    cursor: pointer;
  }
}

.el-main {
  background-color: #ebedf1;
  color: #333;
  height: 100%;
}
</style>
