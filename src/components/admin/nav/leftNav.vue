//左侧导航
<template>
  <el-menu default-active="1" :collapse="isCollapse" class="el-menu-vertical-demo"  background-color="#334157" text-color="#fff" active-text-color="#ffd04b" router>
    <div class="logobox"></div>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-s-flag"></i>
        <span slot="title">标签</span>
      </template>
      <el-menu-item index="/admin/tag/list">标签</el-menu-item>
      <el-menu-item index="/admin/environment/label/list">环境</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">知识</span>
      </template>
      <el-menu-item index="/admin/article/list">文章</el-menu-item>
      <el-menu-item index="/admin/fragment/list">碎片</el-menu-item>
      <el-menu-item index="/admin/detail/introduction/list">详细介绍</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-question"></i>
        <span slot="title">问题</span>
      </template>
      <el-menu-item index="/admin/question/list">问题</el-menu-item>
      <el-menu-item index="/admin/question/solution/list">问题解决</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户</span>
      </template>
      <el-menu-item index="/admin/user/info/list">用户管理</el-menu-item>
      <el-menu-item index="/admin/question/solution/list">角色管理</el-menu-item>
      <el-menu-item index="/admin/question/solution/list">权限管理</el-menu-item>
      <el-menu-item index="/admin/question/solution/list">当前用户信息管理</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'LeftNav',
  data() {
    return {
      isCollapse: false
    };
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 600px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>