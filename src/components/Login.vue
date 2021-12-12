<template>
  <div class="container">
    <div class="loginBox">
      <div class="avatarBox">
        <img src="../assets/logo1.png" alt="logo" />
      </div>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="info" @click="login">登录</el-button>
          <el-button type="info" plain @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('🤯 ' + `${res.meta.msg}`)
          return
        }
        this.$message({
          message: '🎉 ' + `${res.meta.msg}`,
          type: 'success',
        })
        //保存token
        sessionStorage.setItem('token', res.data.token)
        //通过编程式导航跳转界面
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #434343,
    #000000
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #434343,
    #000000
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .loginBox {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: relative;

    .avatarBox {
      width: 130px;
      height: 130px;
      padding: 15px;
      // border: 1px solid rgb(36, 35, 35);
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 1px 0 8px rgb(58, 57, 57);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}

.el-input.is-active .el-input__inner,
::v-deep .el-input__inner:focus {
  border-color: #000;
  outline: 0;
}
</style>
