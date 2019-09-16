<template>
  <div class="fragment-form">
    <el-form ref="fragment" :model="fragment" label-width="120px">
      <el-form-item label="名称">
        {{fragment.title}}
      </el-form-item>
      <el-form-item label="内容">
        <div v-html="fragment.content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="backToList">回到首页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AdminFragmentDetail',
  data() {
    return {
      fragment : {
        id : -1,
        title : "",
        content : ""
      }
    };
  },
  created(){
    this.loadData();
  },
  methods:{
    loadData(){
      var params = this.gardener.getParams();
      if(params['fragmentId'] === undefined || params['fragmentId'] === ''){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'fragment/v1/detail', {
        params: {
          fragmentId : params['fragmentId']
        }
      }).then((response) => {
        this.fragment = response.data;
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/fragment/list';
    }
  }
}
</script>

<style>
.market-form{
  width: 800px;
  min-height: 600px;
}
</style>