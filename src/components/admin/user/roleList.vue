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
          <el-form-item label="角色">
            <el-input v-model="searchForm.name" placeholder="角色"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">角色列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="viewUserRole" round>查看</el-button>
        <el-button type="primary" size="small" @click="addUserRole" round>添加</el-button>
        <el-button type="primary" size="small" @click="editUserRole" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delUserRole" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="userRoleList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="角色">
            </el-table-column>
            <el-table-column prop="status" :formatter="formatterUserRoleStatus" label="状态" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadUserRoles" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminUserRoleList',
  data() {
    return {
      searchForm : {
        name : '',
        status : -1,
        lastId : 0
      },
      userRoleList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadUserRoles();
  },
  methods: {
    loadUserRoles(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'user/role/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.userRoleList = response.data;
        }else{
          this.userRoleList = this.userRoleList.concat(response.data);
        }
        this.searchForm.lastId = this.userRoleList[this.userRoleList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.userRoleList = [];
      this.loadUserInfos();
    },
    formatterUserRoleStatus(row, column){
      return this.gardener.userRoleStatus.get(row.status);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    viewUserRole(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/user/role/detail?userRoleId=' + this.currentRow.id;
      }
    },
    addUserRole(){
      window.location.href = '#/admin/user/role/add';
    },
    editUserRole(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/user/role/add?userRoleId=' + this.currentRow.id;
      }
    },
    delUserRole(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'user/role/v1/delete?userRoleId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.userRoleList = [];
            this.loadUserInfos();
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
