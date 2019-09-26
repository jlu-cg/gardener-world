<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="修改环境标签">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
        <el-form ref="environmentLabel" :model="environmentLabel" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="environmentLabel.name"></el-input>
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="environmentLabel.version"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminEnvironmentLabelAdd',
  data() {
    return {
      environmentLabel : {
        id : -1,
        name : "",
        version : ""
      }
    };
  },
  created(){
    this.loadEdit();
  },
  methods:{
    loadEdit(){
      var params = this.gardener.getParams();
      var environmentLabelId = this.gardener.getParamInt(params['environmentLabelId'], -1);
      if(environmentLabelId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'environment/label/v1/detail', {
        params: {
          environmentLabelId : environmentLabelId
        }
      }).then((response) => {
        this.environmentLabel = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'environment/label/v1/save', this.environmentLabel)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加碎片失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/environment/label/list';
    }
  }
}
</script>

<style>
.fragment-form{
  width: 800px;
  min-height: 600px;
}
</style>