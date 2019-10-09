<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="修改用户">
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
        <el-form ref="userInfo" :model="userInfo" label-width="180px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.userName"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nickName"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.mobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input placeholder="请输入密码" v-model="userInfo.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userInfo.status" :label="1">有效</el-radio>
            <el-radio v-model="userInfo.status" :label="2">无效</el-radio>
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
  name: 'AdminUserInfoAdd',
  data() {
    return {
      userInfo : {
        id : -1,
        userName : "",
        password : "",
        nickName : "",
        email : "",
        mobilePhone : "",
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
      var userInfoId = this.gardener.getParamInt(params['userInfoId'], -1);
      if(userInfoId == -1){
        return ;
      }

      this.axios.get(this.gardener.adminBackBaseURL + 'user/info/v1/detail', {
        params: {
          userInfoId : userInfoId
        }
      }).then((response) => {
        this.userInfo = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'user/info/v1/save', this.userInfo)
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
      window.location.href = '#/admin/user/info/list';
    }
  }
}
</script>