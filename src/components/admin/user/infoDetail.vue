<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="详情页面">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="userInfo" :model="userInfo" label-width="180px">
          <el-form-item label="用户名">
            {{userInfo.userName}}
          </el-form-item>
          <el-form-item label="昵称">
            {{userInfo.nickName}}
          </el-form-item>
          <el-form-item label="电子邮件">
            {{userInfo.email}}
          </el-form-item>
          <el-form-item label="手机号">
            {{userInfo.mobilePhone}}
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userInfo.status" :label="1">有效</el-radio>
            <el-radio v-model="userInfo.status" :label="2">无效</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- -------------------------------------------------- 用户角色 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户角色</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addUserRoleRelation" round>添加角色</el-button>
        <el-button type="primary" size="small" @click="delUserRoleRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleRelationTable" :data="userRoleRelation.userRoleRelation.userRoleRelationList" highlight-current-row 
          @current-change="handleRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="roleName" label="角色">
          </el-table-column>
          <el-table-column prop="status" :formatter="formatterUserRoleStatus" label="状态" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联角色" :visible.sync="userRoleRelation.addUserRoleRelation.addUserRoleRelationVisible">
      <el-form :inline="true" :model="userRoleRelation.addUserRoleRelation.searchRoleForm" class="demo-form-inline">
        <el-form-item label="角色">
          <el-input v-model="userRoleRelation.addUserRoleRelation.searchRoleForm.name" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchRoleSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleRoleTable" :data="userRoleRelation.addUserRoleRelation.selectRoleList" highlight-current-row 
          @current-change="handleRoleCurrentChange" style="width: 100%" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="userRoleRelation.addUserRoleRelation.addUserRoleRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectUserRoleRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminUserInfoDetail',
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
      },
      userRoleRelation : {
        userRoleRelation : {
          userRoleRelationList : [],
          roleRelation:{
            userId : -1,
            roleId : -1
          },
          currentRow : null
        },
        addUserRoleRelation : {
          addUserRoleRelationVisible : false,
          selectRoleList : [],
          searchRoleForm : {
            name : ''
          },
          roleRelation:{
            userId : -1,
            roleId : -1
          },
          currentRow : null,
          roleIdStr : ','
        }
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var userInfoId = this.gardener.getParamInt(params['userInfoId'], -1);
    if(userInfoId == -1){
      return ;
    }
    this.userInfo.id = userInfoId;
    this.userRoleRelation.userRoleRelation.roleRelation.userId = userInfoId;
    this.userRoleRelation.addUserRoleRelation.roleRelation.userId = userInfoId;
    this.loadUserInfo();
    this.loadUserRoleRelation();
  },
  methods: {
    loadUserInfo(){
      this.axios.get(this.gardener.adminBackBaseURL + 'user/info/v1/detail', {
        params: {
          userInfoId : this.userInfo.id
        }
      }).then((response) => {
        this.userInfo = response.data;
      }).catch((response)=>{
        
      })
    },
    //------------------------------------------ 用户角色 ------------------------------------------
    loadUserRoleRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'user/role/relation/v1/list', this.userRoleRelation.userRoleRelation.roleRelation).then((response) => {
        this.userRoleRelation.userRoleRelation.userRoleRelationList = response.data;
        for(var i = 0; i < this.userRoleRelation.userRoleRelation.userRoleRelationList.length; i++){
          this.userRoleRelation.addUserRoleRelation.roleIdStr += this.userRoleRelation.userRoleRelation.userRoleRelationList[i].roleId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addUserRoleRelation(){
      this.userRoleRelation.addUserRoleRelation.addUserRoleRelationVisible = true;
    },
    delUserRoleRelation(){
      if(this.userRoleRelation.userRoleRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'user/role/relation/v1/delete?userRoleRelationId=' + this.userRoleRelation.userRoleRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadUserRoleRelation();
          }).catch((response)=>{
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    selectUserRoleRelation(){
      if(this.userRoleRelation.addUserRoleRelation.currentRow === null){
        this.checkRow();
      }else{
        this.userRoleRelation.addUserRoleRelation.roleRelation.roleId = this.userRoleRelation.addUserRoleRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'user/role/relation/v1/save', this.userRoleRelation.addUserRoleRelation.roleRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.userRoleRelation.addUserRoleRelation.addUserRoleRelationVisible = false;
          this.loadUserRoleRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchRoleSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'user/role/v1/list', this.userRoleRelation.addUserRoleRelation.searchRoleForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.userRoleRelation.addUserRoleRelation.roleIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.userRoleRelation.addUserRoleRelation.selectRoleList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleRelationCurrentChange(val){
      this.userRoleRelation.userRoleRelation.currentRow = val;
    },
    handleRoleCurrentChange(val){
      this.userRoleRelation.addUserRoleRelation.currentRow = val;
    },
    formatterUserRoleStatus(row, column){
      return this.gardener.userRoleStatus.get(row.status);
    },
    backToList(){
      window.location.href = '#/admin/user/info/list';
    },
    checkRow(){
      this.$message({
        message: '请选择数据后进行操作',
        type: 'warning'
      });
    }
  }
}
</script>