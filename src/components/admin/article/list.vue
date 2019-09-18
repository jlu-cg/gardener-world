<template>
  <div>
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
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addArticle" round>添加</el-button>
        <el-button type="primary" size="small" @click="editArticle" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delArticle" round>删除</el-button>
        <el-button type="primary" size="small" @click="articleRelate" round>关联碎片</el-button>
        <el-button type="primary" size="small" @click="cancelSelect" round>取消选择</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleTable" :data="articleList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%" border>
          <el-table-column prop="title" label="标题">
          </el-table-column>
        </el-table>
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
        title : ''
      },
      articleList : [],
      currentRow : null,
      loading: false,
      count : -1
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
      this.axios.post(this.gardener.adminBackBaseURL + 'article/v1/list', this.searchForm
      ).then((response) => {
        this.articleList = response.data;
        this.count = this.articleList.length;
      }).catch((response)=>{
        
      })
    },
    load () {
      if(this.count === 0){
        return ;
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    onSubmit(){
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