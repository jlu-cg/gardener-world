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
          <el-form-item label="用户名">
            <el-input v-model="searchForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="searchForm.nickName" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="searchForm.email" placeholder="电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.mobilePhone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="viewUserInfo" round>查看</el-button>
        <el-button type="primary" size="small" @click="addUserInfo" round>添加</el-button>
        <el-button type="primary" size="small" @click="editUserInfo" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delUserInfo" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="userInfoList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" width="160">
            </el-table-column>
            <el-table-column prop="email" label="电子邮件" width="280">
            </el-table-column>
            <el-table-column prop="mobilePhone" label="手机号" width="280">
            </el-table-column>
            <el-table-column prop="status" :formatter="formatterUserInfoStatus" label="状态" width="80">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadUserInfos" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminUserInfoList',
  data() {
    return {
      searchForm : {
        userName : '',
        nickName : '',
        email : '',
        mobilePhone : '',
        lastId : 0
      },
      userInfoList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadUserInfos();
  },
  methods: {
    loadUserInfos(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'user/info/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.userInfoList = response.data;
        }else{
          this.userInfoList = this.userInfoList.concat(response.data);
        }
        this.searchForm.lastId = this.userInfoList[this.userInfoList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.userInfoList = [];
      this.loadUserInfos();
    },
    formatterUserInfoStatus(row, column){
      return this.gardener.userInfoStatus.get(row.status);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    viewUserInfo(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/user/info/detail?userInfoId=' + this.currentRow.id;
      }
    },
    addUserInfo(){
      window.location.href = '#/admin/user/info/add';
    },
    editUserInfo(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/user/info/add?userInfoId=' + this.currentRow.id;
      }
    },
    delUserInfo(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'user/info/v1/delete?userInfoId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.userInfoList = [];
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
