<template>
  <div>
    <el-tabs type="border-card"  v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="article">
        <el-row class="gardener-title-nav">
          <el-col :span="24">
            <el-button type="primary" @click="generateArticleDocument" round>生成文章文档</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="article-form">
              <el-form ref="article" :model="article" label-width="120px">
                <el-form-item label="标签">
                  {{article.tagId}}
                </el-form-item>
                <el-form-item label="名称">
                  {{article.title}}
                </el-form-item>
                <el-form-item label="简介">
                  {{article.summary}}
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="关联碎片" name="articleRelation">
        <el-row class="gardener-title-nav">
          <el-col :span="24">
            <el-button type="primary" @click="addArticleRelation" round>添加</el-button>
            <el-button type="primary" @click="moveOn" round>上移</el-button>
            <el-button type="primary" @click="moveDown" round>下移</el-button>
            <el-button type="primary" @click="saveOrder" round>保存顺序</el-button>
            <el-button type="primary" @click="delArticleRelation" round>删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="articleRelation.articleRelationDetails" highlight-current-row
                @current-change="handleCurrentChange" style="width: 100%" :row-class-name="tableRowClassName" border>
              <el-table-column prop="title" label="标题" width="360">
              </el-table-column>
              <el-table-column prop="summary" label="简介">
              </el-table-column>
              <el-table-column prop="pos" label="位置" width="80">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-dialog title="添加文章关联碎片" :visible.sync="articleRelation.addArticleRelationVisible">
          <el-form :inline="true" :model="articleRelation.searchFragmentForm" class="demo-form-inline">
            <el-form-item label="标题">
              <el-input v-model="articleRelation.searchFragmentForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearchFragmentSubmit">查询</el-button>
            </el-form-item>
          </el-form>

          <el-table ref="singleSelectTable" :data="articleRelation.selectFragmentList" highlight-current-row 
              @current-change="handleSelectCurrentChange" style="width: 100%" border>
            <el-table-column prop="title" label="标题" width="360">
            </el-table-column>
            <el-table-column prop="summary" label="简介">
            </el-table-column>
          </el-table>

          <div slot="footer" class="dialog-footer">
            <el-button @click="articleRelation.addArticleRelationVisible = false">取 消</el-button>
            <el-button type="primary" @click="selectFragment">确定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="依赖文章" name="articleDependence">
        <el-row class="gardener-title-nav">
          <el-col :span="24">
            <el-button type="primary" @click="articleDependenceAdd" round>添加</el-button>
            <el-button type="primary" @click="articleDependenceMoveOn" round>上移</el-button>
            <el-button type="primary" @click="articleDependenceMoveDown" round>下移</el-button>
            <el-button type="primary" @click="articleDependenceSaveOrder" round>保存顺序</el-button>
            <el-button type="primary" @click="articleDependenceDel" round>删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="articleDependenceSingleTable" :data="articleDependence.articleDependenceDetails" highlight-current-row
                @current-change="articleDependenceHandleCurrentChange" style="width: 100%" :row-class-name="articleDependenceTableRowClassName" border>
              <el-table-column prop="title" label="标题" width="360">
              </el-table-column>
              <el-table-column prop="summary" label="简介">
              </el-table-column>
              <el-table-column prop="pos" label="位置" width="80">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-dialog title="添加依赖文章" :visible.sync="articleDependence.addArticleDependenceVisible">
          <el-form :inline="true" :model="articleDependence.searchArticleForm" class="demo-form-inline">
            <el-form-item label="标题">
              <el-input v-model="articleDependence.searchArticleForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearchArticleSubmit">查询</el-button>
            </el-form-item>
          </el-form>

          <el-table ref="articleDependenceSingleSelectTable" :data="articleDependence.selectArticleList" highlight-current-row 
              @current-change="articleDependenceHandleSelectCurrentChange" style="width: 100%" border>
            <el-table-column prop="title" label="标题" width="360">
            </el-table-column>
            <el-table-column prop="summary" label="简介">
            </el-table-column>
          </el-table>

          <div slot="footer" class="dialog-footer">
            <el-button @click="articleDependence.addArticleDependenceVisible = false">取 消</el-button>
            <el-button type="primary" @click="selectArticle">确定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
    
    
  </div>
</template>
<script>
export default {
  name: 'AdminArticleDetail',
  data() {
    return {
      activeName : 'article',
      article : {
        id : -1,
        tagId : -1,
        title : '',
        summary : ''
      },
      articleRelation:{
        loaded : 0,
        articleRelationList : {
          articleId : -1
        },
        articleRelationDetailForm : {
          articleId : -1,
          fragmentId : -1,
          pos : 0
        },
        articleRelationDetails:[],
        addArticleRelationVisible: false,
        searchFragmentForm : {
          title : '',
          tagId : -1
        },
        selectFragmentList : [],
        currentRow : null,
        currentselectRow : null
      },
      articleDependence:{
        loaded : 0,
        articleDependenceList : {
          articleId : -1
        },
        articleDependenceDetailForm : {
          articleId : -1,
          dependArticleId : -1,
          pos : 0
        },
        articleDependenceDetails:[],
        addArticleDependenceVisible: false,
        searchArticleForm : {
          title : '',
          tagId : -1
        },
        selectArticleList : [],
        currentRow : null,
        currentselectRow : null
      }
    };
  },
  created(){
    this.loadArticle();
  },
  methods: {
    loadArticle(){
      var params = this.gardener.getParams();
      var articleId = this.gardener.getParamInt(params['articleId'], -1);
      if(articleId == -1){
        this.$alert('获取文章ID异常', '参数异常', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return ;
      }

      this.articleRelation.articleRelationDetailForm.articleId = articleId;
      this.articleRelation.articleRelationList.articleId = articleId;
      this.articleDependence.articleDependenceDetailForm.articleId = articleId;
      this.articleDependence.articleDependenceList.articleId = articleId;

      this.axios.get(this.gardener.adminBackBaseURL + 'article/v1/detail', {
        params: {
          articleId : articleId
        }
      }).then((response) => {
        this.article = response.data;
        this.articleRelation.searchFragmentForm.tagId = this.article.tagId;
        this.articleDependence.articleDependenceDetailForm.dependTagId = this.article.tagId;
      }).catch((response)=>{
        
      })
    },
    generateArticleDocument(){
      this.axios.get(this.gardener.adminBackBaseURL + 'article/v1/document/generate', {
        params: {
          articleId : this.article.id
        }
      }).then((response) => {
        if(response.data === 1){
          this.$message({
            message: '生成文章文档成功',
            type: 'success'
          });
        }else{
          this.$message({
            message: '生成文章文档失败',
            type: 'error'
          });
        }
      }).catch((response)=>{
        
      })
    },
    handleCurrentChange(val){
      this.articleRelation.currentRow = val;
    },
    addArticleRelation(){
      this.articleRelation.addArticleRelationVisible = true;
    },
    handleTabClick(tab, event){
      if(this.articleRelation.loaded === 0 && this.activeName === 'articleRelation'){
        this.loadArticleRelationDetails();
        this.articleRelation.loaded = 1;
      }else if(this.articleDependence.loaded === 0 && this.activeName === 'articleDependence'){
        this.loadArticleDependenceDetails();
        this.articleDependence.loaded = 1;
      }

    },
    loadArticleRelationDetails(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/relation/v1/list', this.articleRelation.articleRelationList
      ).then((response) => {
        this.articleRelation.articleRelationDetails = response.data;
      }).catch((response)=>{
        
      })
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
    },
    moveOn(){
      if(this.articleRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleRelation.currentRow.index === 0){
        this.$message({
          message: '已经到达最上位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleRelation.articleRelationDetails, this.articleRelation.currentRow.index, this.articleRelation.articleRelationDetails[this.articleRelation.currentRow.index - 1]);
        this.$set(this.articleRelation.articleRelationDetails, this.articleRelation.currentRow.index - 1, this.articleRelation.currentRow);
        this.$refs.singleTable.setCurrentRow(this.articleRelation.currentRow);
      }
    },
    moveDown(){
      if(this.articleRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleRelation.currentRow.index === this.articleRelation.articleRelationDetails.length - 1){
        this.$message({
          message: '已经到达最下位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleRelation.articleRelationDetails, this.articleRelation.currentRow.index, this.articleRelation.articleRelationDetails[this.articleRelation.currentRow.index + 1]);
        this.$set(this.articleRelation.articleRelationDetails, this.articleRelation.currentRow.index + 1, this.articleRelation.currentRow);
        this.$refs.singleTable.setCurrentRow(this.articleRelation.currentRow);
      }
    },
    saveOrder(){
      for ( var i = 0; i < this.articleRelation.articleRelationDetails.length; i++){
        this.articleRelation.articleRelationDetails[i].pos = i;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/relation/v1/saveOrder', this.articleRelation.articleRelationDetails
      ).then((response) => {
        this.$message({
          message: '修改关联顺序成功',
          type: 'success'
        });
        this.loadArticleRelationDetails();
      }).catch((response)=>{
        
      })
    },
    delArticleRelation(){
      if(this.articleRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/relation/v1/delete?articleRelationId=' + this.articleRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticleRelationDetails();
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
    selectFragment(){
      this.articleRelation.articleRelationDetailForm.fragmentId = this.articleRelation.currentselectRow.id;
      this.articleRelation.articleRelationDetailForm.pos = this.articleRelation.articleRelationDetails.length;
      this.axios.post(this.gardener.adminBackBaseURL + 'article/relation/v1/save', this.articleRelation.articleRelationDetailForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加关联关系失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加关联关系成功',
            type: 'success'
          });
          this.loadArticleRelationDetails();
        }
      }).catch((response)=>{
        
      })
      this.articleRelation.addArticleRelationVisible = false;
    },
    onSearchFragmentSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/v1/list', this.articleRelation.searchFragmentForm
      ).then((response) => {
        this.articleRelation.selectFragmentList = response.data;
      }).catch((response)=>{
        
      });
    },
    handleSelectCurrentChange(val){
      this.articleRelation.currentselectRow = val;
    },
/** ------------------------------------------------------------------------------------------------------- */
    //依赖文章
    articleDependenceHandleCurrentChange(val){
      this.articleDependence.currentRow = val;
    },
    articleDependenceAdd(){
      this.articleDependence.addArticleDependenceVisible = true;
    },
    loadArticleDependenceDetails(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/dependence/v1/list', this.articleDependence.articleDependenceList
      ).then((response) => {
        this.articleDependence.articleDependenceDetails = response.data;
      }).catch((response)=>{
        
      })
    },
    articleDependenceTableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
    },
    articleDependenceMoveOn(){
      if(this.articleDependence.currentRow === null){
        this.checkRow();
      }else if(this.articleDependence.currentRow.index === 0){
        this.$message({
          message: '已经到达最上位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleDependence.articleDependenceDetails, this.articleDependence.currentRow.index, this.articleDependence.articleDependenceDetails[this.articleDependence.currentRow.index - 1]);
        this.$set(this.articleDependence.articleDependenceDetails, this.articleDependence.currentRow.index - 1, this.articleDependence.currentRow);
        this.$refs.articleDependenceSingleTable.setCurrentRow(this.articleDependence.currentRow);
      }
    },
    articleDependenceMoveDown(){
      if(this.articleDependence.currentRow === null){
        this.checkRow();
      }else if(this.articleDependence.currentRow.index === this.articleDependence.articleDependenceDetails.length - 1){
        this.$message({
          message: '已经到达最下位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleDependence.articleDependenceDetails, this.articleDependence.currentRow.index, this.articleDependence.articleDependenceDetails[this.articleDependence.currentRow.index + 1]);
        this.$set(this.articleDependence.articleDependenceDetails, this.articleDependence.currentRow.index + 1, this.articleDependence.currentRow);
        this.$refs.articleDependenceSingleTable.setCurrentRow(this.articleDependence.currentRow);
      }
    },
    articleDependenceSaveOrder(){
      for ( var i = 0; i < this.articleDependence.articleDependenceDetails.length; i++){
        this.articleDependence.articleDependenceDetails[i].pos = i;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/dependence/v1/saveOrder', this.articleDependence.articleDependenceDetails
      ).then((response) => {
        this.$message({
          message: '修改关联顺序成功',
          type: 'success'
        });
        this.loadArticleDependenceDetails();
      }).catch((response)=>{
        
      })
    },
    articleDependenceDel(){
      if(this.articleDependence.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/dependence/v1/delete?articleDependenceId=' + this.articleDependence.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticleDependenceDetails();
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
    selectArticle(){
      this.articleDependence.articleDependenceDetailForm.dependArticleId = this.articleDependence.currentselectRow.id;
      if(this.articleDependence.articleDependenceDetails === null){
        this.articleDependence.articleDependenceDetailForm.pos = 0;
      }else{
        this.articleDependence.articleDependenceDetailForm.pos = this.articleDependence.articleDependenceDetails.length;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/dependence/v1/save', this.articleDependence.articleDependenceDetailForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加关联关系失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加关联关系成功',
            type: 'success'
          });
          this.loadArticleDependenceDetails();
        }
      }).catch((response)=>{
        
      })
      this.articleDependence.addArticleDependenceVisible = false;
    },
    onSearchArticleSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/v1/list', this.articleDependence.searchArticleForm
      ).then((response) => {
        this.articleDependence.selectArticleList = response.data;
      }).catch((response)=>{
        
      });
    },
    articleDependenceHandleSelectCurrentChange(val){
      this.articleDependence.currentselectRow = val;
    },
    backToList(){},
    checkRow(){
      this.$message({
        message: '请选择数据后进行操作',
        type: 'warning'
      });
    }
  }
}
</script>