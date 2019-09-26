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
          <el-form-item label="简介">
            <el-input v-model="searchForm.summary" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">详细介绍列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addDetailIntroduction" round>添加</el-button>
        <el-button type="primary" size="small" @click="editDetailIntroduction" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delDetailIntroduction" round>删除</el-button>
        <el-button type="primary" size="small" @click="detailIntroductionRelate" round>关联</el-button>
        <el-button type="primary" size="small" @click="cancelSelect" round>取消选择</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="overflow:auto">
          <el-table ref="singleTable" :data="detailIntroductionList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="summary" label="简介">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadDetailIntroductions" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminDetailIntroductionList',
  data() {
    return {
      searchForm : {
        summary : '',
        lastId : 0
      },
      detailIntroductionList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadDetailIntroductions();
  },
  methods:{
    cancelSelect(row){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$refs.singleTable.setCurrentRow(row);
      }
    },
    loadDetailIntroductions(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'detail/introduction/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.detailIntroductionList = response.data;
        }else{
          this.detailIntroductionList = this.detailIntroductionList.concat(response.data);
        }
        this.searchForm.lastId = this.detailIntroductionList[this.detailIntroductionList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.detailIntroductionList = [];
      this.loadDetailIntroductions();
    },
    addDetailIntroduction(){
      window.location.href = '#/admin/detail/introduction/add';
    },
    editDetailIntroduction(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/detail/introduction/add?detailIntroductionId=' + this.currentRow.id;
      }
    },
    delDetailIntroduction(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该碎片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'detail/introduction/v1/delete?detailIntroductionId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.detailIntroductionList = [];
            this.loadFragments();
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
    detailIntroductionRelate(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/detail/introduction/detail?detailIntroductionId=' + this.currentRow.id;
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