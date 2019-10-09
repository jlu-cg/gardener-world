//头部菜单
<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff" router>
    <el-submenu index="2" class="submenu">
      <!-- <template slot="title">{{user.userRealName}}</template> -->
      <template slot="title">超级管理员</template>
      <el-menu-item index="/admin/user/info/detail">设置</el-menu-item>
      <el-menu-item index="/admin/user/info/detail">个人中心</el-menu-item>
      <el-menu-item index="/admin/login">退出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'NavCon',
  data() {
    return {
    };
  }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>