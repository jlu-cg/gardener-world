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
        <el-divider content-position="left">角色详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="userRole" :model="userRole" label-width="180px">
          <el-form-item label="角色">
            {{userRole.name}}
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userRole.status" :label="1">有效</el-radio>
            <el-radio v-model="userRole.status" :label="2">无效</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- -------------------------------------------------- 用户权限 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户权限</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addUserRolePrivilegeRelation" round>添加权限</el-button>
        <el-button type="primary" size="small" @click="delUserRolePrivilegeRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleRelationTable" :data="userRolePrivilegeRelation.userRolePrivilegeRelation.userRolePrivilegeRelationList" highlight-current-row 
          @current-change="handleRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="privilegeName" label="权限">
          </el-table-column>
          <el-table-column prop="status" :formatter="formatterUserPrivilegeStatus" label="状态" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联权限" :visible.sync="userRolePrivilegeRelation.addUserRolePrivilegeRelation.addUserRolePrivilegeRelationVisible">
      <el-form :inline="true" :model="userRolePrivilegeRelation.addUserRolePrivilegeRelation.searchPrivilegeForm" class="demo-form-inline">
        <el-form-item label="权限">
          <el-input v-model="userRolePrivilegeRelation.addUserRolePrivilegeRelation.searchPrivilegeForm.name" placeholder="权限"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchPrivilegeSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singlePrivilegeTable" :data="userRolePrivilegeRelation.addUserRolePrivilegeRelation.selectPrivilegeList" highlight-current-row 
          @current-change="handlePrivilegeCurrentChange" style="width: 100%" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="权限">
        </el-table-column>
        <el-table-column prop="status" :formatter="formatterUserPrivilegeStatus" label="状态" width="260">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="userRolePrivilegeRelation.addUserRolePrivilegeRelation.addUserRolePrivilegeRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectUserRolePrivilegeRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminUserRoleDetail',
  data() {
    return {
      userRole : {
        id : -1,
        name : "",
        status : 1
      },
      userRolePrivilegeRelation : {
        userRolePrivilegeRelation : {
          userRolePrivilegeRelationList : [],
          privilegeRelation:{
            roleId : -1,
            privilegeId : -1
          },
          currentRow : null
        },
        addUserRolePrivilegeRelation : {
          addUserRolePrivilegeRelationVisible : false,
          selectPrivilegeList : [],
          searchPrivilegeForm : {
            name : ''
          },
          privilegeRelation:{
            roleId : -1,
            privilegeId : -1
          },
          currentRow : null,
          privilegeIdStr : ','
        }
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var userRoleId = this.gardener.getParamInt(params['userRoleId'], -1);
    if(userRoleId == -1){
      return ;
    }
    this.userRole.id = userRoleId;
    this.userRolePrivilegeRelation.userRolePrivilegeRelation.privilegeRelation.roleId = userRoleId;
    this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.privilegeRelation.roleId = userRoleId;
    this.loadUserRole();
    this.loadUserRolePrivilegeRelation();
  },
  methods: {
    loadUserRole(){
      this.axios.get(this.gardener.adminBackBaseURL + 'user/role/v1/detail', {
        params: {
          userRoleId : this.userRole.id
        }
      }).then((response) => {
        this.userRole = response.data;
      }).catch((response)=>{
        
      })
    },
    //------------------------------------------ 用户角色 ------------------------------------------
    loadUserRolePrivilegeRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'user/role/privilege/relation/v1/list', this.userRolePrivilegeRelation.userRolePrivilegeRelation.privilegeRelation).then((response) => {
        this.userRolePrivilegeRelation.userRolePrivilegeRelation.userRolePrivilegeRelationList = response.data;
        for(var i = 0; i < this.userRolePrivilegeRelation.userRolePrivilegeRelation.userRolePrivilegeRelationList.length; i++){
          this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.privilegeIdStr += this.userRolePrivilegeRelation.userRolePrivilegeRelation.userRolePrivilegeRelationList[i].roleId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addUserRolePrivilegeRelation(){
      this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.addUserRolePrivilegeRelationVisible = true;
    },
    delUserRolePrivilegeRelation(){
      if(this.userRolePrivilegeRelation.userRolePrivilegeRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'user/role/privilege/relation/v1/delete?userRolePrivilegeRelationId=' + this.userRolePrivilegeRelation.userRolePrivilegeRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadUserRolePrivilegeRelation();
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
    selectUserRolePrivilegeRelation(){
      if(this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.currentRow === null){
        this.checkRow();
      }else{
        this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.privilegeRelation.privilegeId = this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'user/role/privilege/relation/v1/save', this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.privilegeRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.addUserRolePrivilegeRelationVisible = false;
          this.loadUserRolePrivilegeRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchPrivilegeSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'user/privilege/v1/list', this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.searchPrivilegeForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.privilegeIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.selectPrivilegeList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleRelationCurrentChange(val){
      this.userRolePrivilegeRelation.userRolePrivilegeRelation.currentRow = val;
    },
    handlePrivilegeCurrentChange(val){
      this.userRolePrivilegeRelation.addUserRolePrivilegeRelation.currentRow = val;
    },
    formatterUserPrivilegeStatus(row, column){
      return this.gardener.userPrivilegeStatus.get(row.status);
    },
    backToList(){
      window.location.href = '#/admin/user/role/list';
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