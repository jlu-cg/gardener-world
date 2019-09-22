<template>
  <el-container class="index-con">
    <el-aside class="asideshow">
      <LeftNav></LeftNav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-header">
        <NavCon></NavCon>
      </el-header>
      <el-main clss="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavCon from '@/components/admin/nav/navCon.vue'
import LeftNav from '@/components/admin/nav/leftNav.vue'

export default {
  name: 'AdminIndex',
  data() {
    return {
    };
  },
  // 注册组件
  components: {
    NavCon,
    LeftNav
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.index-con {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.aside {
  width: 64px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.asideshow {
  width: 240px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.index-header, .index-main {
  padding: 0px;
  border-left: 2px solid #333;
}
</style>