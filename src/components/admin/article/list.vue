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
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">文章列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addArticle" round>添加</el-button>
        <el-button type="primary" size="small" @click="editArticle" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delArticle" round>删除</el-button>
        <el-button type="primary" size="small" @click="articleRelate" round>关联</el-button>
        <el-button type="primary" size="small" @click="cancelSelect" round>取消选择</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="overflow:auto">
          <el-table ref="singleTable" :data="articleList" highlight-current-row 
              @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="status" :formatter="formatterArticleStatusType" label="发布状态" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadArticles" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminArticleList',
  data() {
    return {
      searchForm : {
        title : '',
        lastId : 0
      },
      articleList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadArticles();
  },
  methods:{
    cancelSelect(row){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$refs.singleTable.setCurrentRow(row);
      }
    },
    loadArticles(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/v1/list', this.searchForm
      ).then((response) => {
        if(response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.articleList = response.data;
        }else{
          this.articleList = this.articleList.concat(response.data);
        }
        this.searchForm.lastId = this.articleList[this.articleList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    formatterArticleStatusType(row, column){
      return this.gardener.articleStatus.get(row.status);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.loadArticles();
    },
    articleRelate(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/article/detail?articleId=' + this.currentRow.id;
      }
    },
    addArticle(){
      window.location.href = '#/admin/article/add';
    },
    editArticle(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/article/add?articleId=' + this.currentRow.id;
      }
    },
    delArticle(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/v1/delete?articleId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticles();
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