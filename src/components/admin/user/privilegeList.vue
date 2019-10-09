<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">查询</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="权限">
            <el-input v-model="searchForm.name" placeholder="权限"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">权限列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addUserPrivilege" round>添加</el-button>
        <el-button type="primary" size="small" @click="editUserPrivilege" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delUserPrivilege" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="userPrivilegeList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="权限">
            </el-table-column>
            <el-table-column prop="status" :formatter="formatterUserPrivilegeStatus" label="状态" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadUserPrivileges" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminUserPrivilegeList',
  data() {
    return {
      searchForm : {
        name : '',
        status : -1,
        lastId : 0
      },
      userPrivilegeList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadUserPrivileges();
  },
  methods: {
    loadUserPrivileges(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'user/privilege/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.userPrivilegeList = response.data;
        }else{
          this.userPrivilegeList = this.userPrivilegeList.concat(response.data);
        }
        this.searchForm.lastId = this.userPrivilegeList[this.userPrivilegeList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.userPrivilegeList = [];
      this.loadUserPrivileges();
    },
    formatterUserPrivilegeStatus(row, column){
      return this.gardener.userPrivilegeStatus.get(row.status);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    addUserPrivilege(){
      window.location.href = '#/admin/user/privilege/add';
    },
    editUserPrivilege(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/user/privilege/add?userPrivilegeId=' + this.currentRow.id;
      }
    },
    delUserPrivilege(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'user/privilege/v1/delete?userPrivilegeId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.userPrivilegeList = [];
            this.loadUserPrivileges();
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
    checkRow(){
      this.$message({
        message: '请选择数据后进行操作',
        type: 'warning'
      });
    }
  }
}
</script>
