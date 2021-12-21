<template>
  <el-container>
    <el-header>
      <div class="title">
        <img src="../assets/logo1.png" alt="logo" width="50px" height="50px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut"> 登出 </el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          class="el-menu"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#039be5"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="selectIndex"
          @select="saveSelect"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="toggle">
          <i class="el-icon-s-fold" @click="toggleCollapse"></i>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
    }
  },
  computed: {
    selectIndex: {
      get: function () {
        return this.$route.path
      },
      set: function (newVal) {
        return newVal
      },
    },
  },
  methods: {
    logOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveSelect(index) {
      console.log(index)
      this.selectIndex = index
    },
  },
  created() {
    this.getMenuList()
    this.selectIndex = this.$route.path
    console.log(this.selectIndex)
  },
}
</script>
<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: #535255;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;

    .title {
      display: flex;
      align-items: center;
      span {
        color: #fff;
        font-size: 20px;
        margin-left: 10px;
        letter-spacing: 1.5px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    transition: width 0.2s ease-in-out;

    .toggle {
      height: 30px;
      color: #909399;
      background-color: #292c36;
      font-size: 20px;
      // text-align: center;
      padding-left: 20px;

      i {
        cursor: pointer;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: rgb(248, 245, 245);
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }

  .iconfont {
    margin-right: 10px;
    font-size: 20px;
  }
}
</style>
