<template>
  <div class="home-container">
    <el-button plain @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // 退出登录
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>>
