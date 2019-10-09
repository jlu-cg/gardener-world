<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="修改权限">
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
        <el-form ref="userPrivilege" :model="userPrivilege" label-width="180px">
          <el-form-item label="权限">
            <el-input v-model="userPrivilege.name"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userPrivilege.status" :label="1">有效</el-radio>
            <el-radio v-model="userPrivilege.status" :label="2">无效</el-radio>
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
  name: 'AdminUserPrivilegeAdd',
  data() {
    return {
      userPrivilege : {
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
      var userPrivilegeId = this.gardener.getParamInt(params['userPrivilegeId'], -1);
      if(userPrivilegeId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'user/privilege/v1/detail', {
        params: {
          userPrivilegeId : userPrivilegeId
        }
      }).then((response) => {
        this.userPrivilege = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'user/privilege/v1/save', this.userPrivilege)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加权限失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/user/privilege/list';
    }
  }
}
</script>