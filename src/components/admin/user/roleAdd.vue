<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="修改角色">
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
        <el-form ref="userRole" :model="userRole" label-width="180px">
          <el-form-item label="角色">
            <el-input v-model="userRole.name"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userRole.status" :label="1">有效</el-radio>
            <el-radio v-model="userRole.status" :label="2">无效</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminUserRoleAdd',
  data() {
    return {
      userRole : {
        id : -1,
        name : "",
        status : 1
      }
    };
  },
  created(){
    this.loadEdit();
  },
  methods: {
    loadEdit(){
      var params = this.gardener.getParams();
      var userRoleId = this.gardener.getParamInt(params['userRoleId'], -1);
      if(userInfoId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'user/role/v1/detail', {
        params: {
          userRoleId : userRoleId
        }
      }).then((response) => {
        this.userRole = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'user/role/v1/save', this.userRole)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加标签失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/user/role/list';
    }
  }
}
</script>