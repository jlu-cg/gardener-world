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
          <el-form-item label="标签名">
            <el-input v-model="searchForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" clearable placeholder="请选择">
              <el-option
                v-for="item in gardener.tagType"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">标签列表</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="viewTagArticle" round>查看</el-button>
        <el-button type="primary" size="small" @click="addTagArticle" round>添加</el-button>
        <el-button type="primary" size="small" @click="editTagArticle" round>编辑</el-button>
        <el-button type="primary" size="small" @click="delTagArticle" round>删除</el-button>
        <el-button type="primary" size="small" @click="articleList" round>查看文章</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="infinite-list-wrapper" style="overflow:auto">
          <el-table ref="singleTable" :data="tagArticleList" highlight-current-row 
            @current-change="handleCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </div>
        <el-button type="success" size="small" @click="loadTagArticles" style="width: 100%">{{loadMoreMessage}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminTagArticleList',
  data() {
    return {
      searchForm : {
        name : '',
        type: '',
        lastId : 0
      },
      tagArticleList : [],
      currentRow : null,
      loadMoreMessage : "加载更多",
      hasMore : true, 
      pageSize : 20
    };
  },
  created(){
    this.loadTagArticles();
  },
  methods: {
    loadTagArticles(){
      if(!this.hasMore){
        return ;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/article/v1/list', this.searchForm
      ).then((response) => {
        if(response.data === null || response.data.length < this.pageSize){
          this.loadMoreMessage = '没有更多了';
          this.hasMore = false;
        }
        if(this.searchForm.lastId === 0){
          this.tagArticleList = response.data;
        }else{
          this.tagArticleList = this.tagArticleList.concat(response.data);
        }
        this.searchForm.lastId = this.tagArticleList[this.tagArticleList.length - 1].id;
      }).catch((response)=>{
        
      })
    },
    onSubmit(){
      this.hasMore = true;
      this.searchForm.lastId = 0;
      this.loadMoreMessage = '加载更多';
      this.tagArticleList = [];
      this.loadTagArticles();
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.type);
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    viewTagArticle(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/tag/article/detail?tagArticleId=' + this.currentRow.id;
      }
    },
    addTagArticle(){
      window.location.href = '#/admin/tag/article/add';
    },
    editTagArticle(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/tag/article/add?tagArticleId=' + this.currentRow.id;
      }
    },
    delTagArticle(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/article/v1/delete?tagArticleId=' + this.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.hasMore = true;
            this.searchForm.lastId = 0;
            this.loadMoreMessage = '加载更多';
            this.tagArticleList = [];
            this.loadTagArticles();
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
    articleList(){
      if(this.currentRow === null){
        this.checkRow();
      }else{
        window.location.href = '#/admin/article/list?tagArticleId=' + this.currentRow.id;
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

<style>
</style>