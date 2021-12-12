<template>
  <div class="container">
    <el-button type="info" @click="logOut"> 登出 </el-button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {
    logOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
  },
}
</script>
<style lang="scss" scoped></style>
