<template>
  <div>
    <el-container>
      <el-header height="40px">
        <el-row>
          <el-col :span="24">
            {{document.name}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            {{document.summary}}
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-main>
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(component, index) in components" :key="index" :title="component.title" :name="component.pos">
              <div v-html="component.content"></div>
            </el-collapse-item>
          </el-collapse>
        </el-main>
        <el-aside>
          <el-container>
            <el-main>
              <el-row>
                <el-col :span="24">
                  <div class="gardener-title gardener-right-title">依赖组件</div>
                </el-col>
              </el-row>
              <el-row v-for="(component, index) in dependentComponents" :key="index">
                <el-col :span="24">
                  <div class="gardener-text gardener-right-text">{{component.title}}</div>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'DocumentDetail',
  data(){
    return {
      activeNames : ["1"],
      document : {"id":-1, "name":"安装", "summary":"如何安装"},
      components : [{"title":"配置环境变量", "pos":1, "content":"<div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>"}],
      dependentComponents : [{"title":"详细说明"}]
    }
  },
  created () {
    var params = this.getParams();
    this.documentId = params['documentId'];
  },
  methods: {
    getParams() {
      var url = window.location.href;
      var obj = {};
      var reg = /[?&][^?&]+=[^?&]+/g;
      var arr = url.match(reg);
      if (arr === null) return obj;
      arr.forEach(function (item) {
        var tempArr = item.substring(1).split('=');
        var key = decodeURIComponent(tempArr[0]);
        var val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
      return obj;
    }
  }
}
</script>

<style>
.gardener-right-title{
  border-bottom: 1px #909399 solid;
}
.gardener-right-text{
  margin: 8px 0px 0px 6px;
}
</style>