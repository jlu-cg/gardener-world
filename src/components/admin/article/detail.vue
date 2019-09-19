<template>
  <div>
    <el-card shadow="never">
      <el-row>
        <el-col :span="24">
          <el-page-header @back="backToList" content="详情页面">
          </el-page-header>
        </el-col>
      </el-row>
    </el-card>

    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">基本信息</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="generateArticleDocument" round>生成文章</el-button>
          <el-button type="primary" size="small" @click="viewArticleDocument" round>查看文章</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="article-form">
            <el-form ref="article" :model="article" label-width="120px">
              <el-form-item label="名称">
                {{article.title}}
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
<!-- ----------------------------------标签--------------------------------------------  -->
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">关联标签</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addArticleTagRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="delArticleTagRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleTagTable" :data="articleTagRelation.articleTagRelations" highlight-current-row
              @current-change="handleTagCurrentChange" style="width: 100%" :row-class-name="tableRowClassName" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加文章关联标签" :visible.sync="articleTagRelation.addArticleTagRelationListVisible">
        <el-form :inline="true" :model="articleTagRelation.searchTagForm" class="demo-form-inline">
          <el-form-item label="标签名">
            <el-input v-model="articleTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchTagSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleTagSelectTable" :data="articleTagRelation.selectTagList" highlight-current-row 
            @current-change="handleTagSelectCurrentChange" style="width: 100%" border>
          <el-table-column prop="name" label="标签名">
          </el-table-column>
          <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="articleTagRelation.addArticleTagRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectTag">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
<!-- ----------------------------------碎片--------------------------------------------  -->
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">关联碎片</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addArticleFragmentRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="moveOn" round>上移</el-button>
          <el-button type="primary" size="small" @click="moveDown" round>下移</el-button>
          <el-button type="primary" size="small" @click="saveOrder" round>保存顺序</el-button>
          <el-button type="primary" size="small" @click="delArticleFragmentRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleTable" :data="articleFragmentRelation.articleFragmentRelationDetails" highlight-current-row
              @current-change="handleCurrentChange" style="width: 100%" :row-class-name="tableRowClassName" border>
            <el-table-column prop="title" label="碎片标题">
            </el-table-column>
            <el-table-column prop="position" label="位置" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加文章关联碎片" :visible.sync="articleFragmentRelation.addArticleFragmentRelationVisible">
        <el-form :inline="true" :model="articleFragmentRelation.searchFragmentForm" class="demo-form-inline">
          <el-form-item label="碎片标题">
            <el-input v-model="articleFragmentRelation.searchFragmentForm.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchFragmentSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleSelectTable" :data="articleFragmentRelation.selectFragmentList" highlight-current-row 
            @current-change="handleSelectCurrentChange" style="width: 100%" border>
          <el-table-column prop="title" label="碎片标题">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="articleFragmentRelation.addArticleFragmentRelationVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectFragment">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
<!-- ----------------------------------文章--------------------------------------------  -->   
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">   
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">依赖文章</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="articleArticleRelationAdd" round>添加</el-button>
          <el-button type="primary" size="small" @click="articleArticleRelationMoveOn" round>上移</el-button>
          <el-button type="primary" size="small" @click="articleArticleRelationMoveDown" round>下移</el-button>
          <el-button type="primary" size="small" @click="articleArticleRelationSaveOrder" round>保存顺序</el-button>
          <el-button type="primary" size="small" @click="articleArticleRelationDel" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="articleArticleRelationSingleTable" :data="articleArticleRelation.articleArticleRelationDetails" highlight-current-row
              @current-change="articleArticleRelationHandleCurrentChange" style="width: 100%" :row-class-name="articleArticleRelationTableRowClassName" border>
            <el-table-column prop="title" label="文章标题">
            </el-table-column>
            <el-table-column prop="position" label="位置" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加依赖文章" :visible.sync="articleArticleRelation.addArticleArticleRelationVisible">
        <el-form :inline="true" :model="articleArticleRelation.searchArticleForm" class="demo-form-inline">
          <el-form-item label="标题">
            <el-input v-model="articleArticleRelation.searchArticleForm.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchArticleSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="articleArticleRelationSingleSelectTable" :data="articleArticleRelation.selectArticleList" highlight-current-row 
            @current-change="articleArticleRelationHandleSelectCurrentChange" style="width: 100%" border>
          <el-table-column prop="title" label="文章标题">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="articleArticleRelation.addArticleArticleRelationVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectArticle">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AdminArticleDetail',
  data() {
    return {
      article : {
        id : -1,
        tagId : -1,
        title : '',
        summary : ''
      },
      articleTagRelation:{
        articleTagRelationList : {
          articleId : -1
        },
        articleTagRelationForm : {
          articleId : -1,
          tagId : -1
        },
        searchTagForm : {
          name : ''
        },
        addArticleTagRelationListVisible: false,
        articleTagRelations : [],
        selectTagList : [],
        currentRow : null,
        currentSelectRow : null
      },
      articleFragmentRelation:{
        articleFragmentRelationList : {
          articleId : -1
        },
        articleFragmentRelationDetailForm : {
          articleId : -1,
          fragmentId : -1,
          position : 0
        },
        articleFragmentRelationDetails:[],
        addArticleFragmentRelationVisible: false,
        searchFragmentForm : {
          title : ''
        },
        selectFragmentList : [],
        currentRow : null,
        currentSelectRow : null
      },
      articleArticleRelation:{
        articleArticleRelationList : {
          articleId : -1
        },
        articleArticleRelationDetailForm : {
          articleId : -1,
          relateArticleId : -1,
          position : 0
        },
        articleArticleRelationDetails:[],
        addArticleArticleRelationVisible: false,
        searchArticleForm : {
          title : ''
        },
        selectArticleList : [],
        currentRow : null,
        currentSelectRow : null
      }
    };
  },
  created(){
    this.loadArticle();
    this.loadArticleTagRelations();
    this.loadArticleFragmentRelationDetails();
    this.loadArticleArticleRelationDetails();
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

      this.articleTagRelation.articleTagRelationForm.articleId = articleId;
      this.articleTagRelation.articleTagRelationList.articleId = articleId;
      this.articleFragmentRelation.articleFragmentRelationDetailForm.articleId = articleId;
      this.articleFragmentRelation.articleFragmentRelationList.articleId = articleId;
      this.articleArticleRelation.articleArticleRelationDetailForm.articleId = articleId;
      this.articleArticleRelation.articleArticleRelationList.articleId = articleId;

      this.axios.get(this.gardener.adminBackBaseURL + 'article/v1/detail', {
        params: {
          articleId : articleId
        }
      }).then((response) => {
        this.article = response.data;
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
    viewArticleDocument(){
      window.open('#/article/detail?articleId=' + this.article.id)
    },
    /** ------------------------------------------------------------------------------------------------------- */
    //标签相关
    loadArticleTagRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/tag/relation/v1/list', this.articleTagRelation.articleTagRelationList
      ).then((response) => {
        this.articleTagRelation.articleTagRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleTagCurrentChange(val){
      this.articleTagRelation.currentRow = val;
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.tagType);
    },
    onSearchTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.articleTagRelation.searchTagForm
      ).then((response) => {
        this.articleTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    addArticleTagRelation(){
      this.articleTagRelation.addArticleTagRelationListVisible = true;
    },
    delArticleTagRelation(){
      if(this.articleTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/tag/relation/v1/delete?articleTagRelationId=' + this.articleTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticleTagRelations();
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
    selectTag(){
      if(this.articleTagRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.articleTagRelation.articleTagRelationForm.tagId = this.articleTagRelation.currentSelectRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'article/tag/relation/v1/save', this.articleTagRelation.articleTagRelationForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加关联标签失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加关联标签成功',
            type: 'success'
          });
          this.loadArticleTagRelations();
        }
      }).catch((response)=>{
        
      })
      this.articleTagRelation.addArticleTagRelationListVisible = false;
    },
    handleTagSelectCurrentChange(val){
      this.articleTagRelation.currentSelectRow = val;
    },
    /** ------------------------------------------------------------------------------------------------------- */
    //碎片相关
    handleCurrentChange(val){
      this.articleFragmentRelation.currentRow = val;
    },
    addArticleFragmentRelation(){
      this.articleFragmentRelation.addArticleFragmentRelationVisible = true;
    },
    loadArticleFragmentRelationDetails(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/fragment/relation/v1/list', this.articleFragmentRelation.articleFragmentRelationList
      ).then((response) => {
        if(response.data != null){
          this.articleFragmentRelation.articleFragmentRelationDetails = response.data;
        }
      }).catch((response)=>{
        
      })
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
    },
    moveOn(){
      if(this.articleFragmentRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleFragmentRelation.currentRow.index === 0){
        this.$message({
          message: '已经到达最上位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleFragmentRelation.articleFragmentRelationDetails, this.articleFragmentRelation.currentRow.index, this.articleFragmentRelation.articleFragmentRelationDetails[this.articleFragmentRelation.currentRow.index - 1]);
        this.$set(this.articleFragmentRelation.articleFragmentRelationDetails, this.articleFragmentRelation.currentRow.index - 1, this.articleFragmentRelation.currentRow);
        this.$refs.singleTable.setCurrentRow(this.articleFragmentRelation.currentRow);
      }
    },
    moveDown(){
      if(this.articleFragmentRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleFragmentRelation.currentRow.index === this.articleFragmentRelation.articleFragmentRelationDetails.length - 1){
        this.$message({
          message: '已经到达最下位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleFragmentRelation.articleFragmentRelationDetails, this.articleFragmentRelation.currentRow.index, this.articleFragmentRelation.articleFragmentRelationDetails[this.articleFragmentRelation.currentRow.index + 1]);
        this.$set(this.articleFragmentRelation.articleFragmentRelationDetails, this.articleFragmentRelation.currentRow.index + 1, this.articleFragmentRelation.currentRow);
        this.$refs.singleTable.setCurrentRow(this.articleFragmentRelation.currentRow);
      }
    },
    saveOrder(){
      for ( var i = 0; i < this.articleFragmentRelation.articleFragmentRelationDetails.length; i++){
        this.articleFragmentRelation.articleFragmentRelationDetails[i].position = i;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/fragment/relation/v1/saveOrder', this.articleFragmentRelation.articleFragmentRelationDetails
      ).then((response) => {
        this.$message({
          message: '修改关联顺序成功',
          type: 'success'
        });
        this.loadArticleFragmentRelationDetails();
      }).catch((response)=>{
        
      })
    },
    delArticleFragmentRelation(){
      if(this.articleFragmentRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/fragment/relation/v1/delete?articleFragmentRelationId=' + this.articleFragmentRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticleFragmentRelationDetails();
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
      if(this.articleFragmentRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.articleFragmentRelation.articleFragmentRelationDetailForm.fragmentId = this.articleFragmentRelation.currentSelectRow.id;
      this.articleFragmentRelation.articleFragmentRelationDetailForm.position = this.articleFragmentRelation.articleFragmentRelationDetails.length;
      this.axios.post(this.gardener.adminBackBaseURL + 'article/fragment/relation/v1/save', this.articleFragmentRelation.articleFragmentRelationDetailForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加关联碎片失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加关联碎片成功',
            type: 'success'
          });
          this.loadArticleFragmentRelationDetails();
        }
      }).catch((response)=>{
        
      })
      this.articleFragmentRelation.addArticleFragmentRelationVisible = false;
    },
    onSearchFragmentSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/v1/list', this.articleFragmentRelation.searchFragmentForm
      ).then((response) => {
        this.articleFragmentRelation.selectFragmentList = response.data;
      }).catch((response)=>{
        
      });
    },
    handleSelectCurrentChange(val){
      this.articleFragmentRelation.currentSelectRow = val;
    },
/** ------------------------------------------------------------------------------------------------------- */
    //依赖文章
    articleArticleRelationHandleCurrentChange(val){
      this.articleArticleRelation.currentRow = val;
    },
    articleArticleRelationAdd(){
      this.articleArticleRelation.addArticleArticleRelationVisible = true;
    },
    loadArticleArticleRelationDetails(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/article/relation/v1/list', this.articleArticleRelation.articleArticleRelationList
      ).then((response) => {
        this.articleArticleRelation.articleArticleRelationDetails = response.data;
      }).catch((response)=>{
        
      })
    },
    articleArticleRelationTableRowClassName ({row, rowIndex}) {
      row.index = rowIndex;
    },
    articleArticleRelationMoveOn(){
      if(this.articleArticleRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleArticleRelation.currentRow.index === 0){
        this.$message({
          message: '已经到达最上位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleArticleRelation.articleArticleRelationDetails, this.articleArticleRelation.currentRow.index, this.articleArticleRelation.articleArticleRelationDetails[this.articleArticleRelation.currentRow.index - 1]);
        this.$set(this.articleArticleRelation.articleArticleRelationDetails, this.articleArticleRelation.currentRow.index - 1, this.articleArticleRelation.currentRow);
        this.$refs.articleArticleRelationSingleTable.setCurrentRow(this.articleArticleRelation.currentRow);
      }
    },
    articleArticleRelationMoveDown(){
      if(this.articleArticleRelation.currentRow === null){
        this.checkRow();
      }else if(this.articleArticleRelation.currentRow.index === this.articleArticleRelation.articleArticleRelationDetails.length - 1){
        this.$message({
          message: '已经到达最下位置',
          type: 'warning'
        });
      }else{
        this.$set(this.articleArticleRelation.articleArticleRelationDetails, this.articleArticleRelation.currentRow.index, this.articleArticleRelation.articleArticleRelationDetails[this.articleArticleRelation.currentRow.index + 1]);
        this.$set(this.articleArticleRelation.articleArticleRelationDetails, this.articleArticleRelation.currentRow.index + 1, this.articleArticleRelation.currentRow);
        this.$refs.articleArticleRelationSingleTable.setCurrentRow(this.articleArticleRelation.currentRow);
      }
    },
    articleArticleRelationSaveOrder(){
      for ( var i = 0; i < this.articleArticleRelation.articleArticleRelationDetails.length; i++){
        this.articleArticleRelation.articleArticleRelationDetails[i].position = i;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/article/relation/v1/saveOrder', this.articleArticleRelation.articleArticleRelationDetails
      ).then((response) => {
        this.$message({
          message: '修改关联顺序成功',
          type: 'success'
        });
        this.loadArticleArticleRelationDetails();
      }).catch((response)=>{
        
      })
    },
    articleArticleRelationDel(){
      if(this.articleArticleRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'article/article/relation/v1/delete?articleArticleRelationId=' + this.articleArticleRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadArticleArticleRelationDetails();
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
      if(this.articleArticleRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.articleArticleRelation.articleArticleRelationDetailForm.relateArticleId = this.articleArticleRelation.currentSelectRow.id;
      if(this.articleArticleRelation.articleArticleRelationDetails === null){
        this.articleArticleRelation.articleArticleRelationDetailForm.position = 0;
      }else{
        this.articleArticleRelation.articleArticleRelationDetailForm.position = this.articleArticleRelation.articleArticleRelationDetails.length;
      }
      this.axios.post(this.gardener.adminBackBaseURL + 'article/article/relation/v1/save', this.articleArticleRelation.articleArticleRelationDetailForm
      ).then((response) => {
        if(response.data === -1){
            this.$message({
            message: '添加依赖文章失败',
            type: 'error'
          });
        }else{
          this.$message({
            message: '添加依赖文章成功',
            type: 'success'
          });
          this.loadArticleArticleRelationDetails();
        }
      }).catch((response)=>{
        
      })
      this.articleArticleRelation.addArticleArticleRelationVisible = false;
    },
    onSearchArticleSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'article/v1/list', this.articleArticleRelation.searchArticleForm
      ).then((response) => {
        this.articleArticleRelation.selectArticleList = response.data;
      }).catch((response)=>{
        
      });
    },
    articleArticleRelationHandleSelectCurrentChange(val){
      this.articleArticleRelation.currentSelectRow = val;
    },
    backToList(){
      window.location.href = '#/admin/article/list';
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