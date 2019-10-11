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
        <el-divider content-position="left">文章标签详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="tagArticle" :model="tagArticle" label-width="160px">
          <el-form-item label="名称">
            {{tagArticle.name}}
          </el-form-item>
          <el-form-item label="标签分类">
            {{tagArticle.typeName}}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- -------------------------------------------------- 碎片标签 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">碎片标签</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addTagFragmentRelation" round>添加碎片标签</el-button>
        <el-button type="primary" size="small" @click="delTagFragmentRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleTagFragmentRelationTable" :data="tagFragmentRelation.tagFragmentRelation.tagFragmentRelationList" highlight-current-row 
          @current-change="handleTagFragmentRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="tagName" label="标签名">
          </el-table-column>
          <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联碎片标签" :visible.sync="tagFragmentRelation.addTagFragmentRelation.addTagFragmentRelationVisible">
      <el-form :inline="true" :model="tagFragmentRelation.addTagFragmentRelation.searchTagFragmentForm" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="tagFragmentRelation.addTagFragmentRelation.searchTagFragmentForm.name" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchTagFragmentSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleTagFragmentTable" :data="tagFragmentRelation.addTagFragmentRelation.selectTagFragmentList" highlight-current-row 
          @current-change="handleTagFragmentCurrentChange" style="width: 100%" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
        <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="tagFragmentRelation.addTagFragmentRelation.addTagFragmentRelationVisible = false">取消</el-button>
        <el-button type="primary" @click="selectTagFragmentRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminTagArticleDetail',
  data() {
    return {
      tagArticle : {
        id : 0,
        name : "",
        type : 0,
        typeName : ""
      },
      tagFragmentRelation : {
        tagFragmentRelation : {
          tagFragmentRelationList : [],
          tagFragmentRelation:{
            tagArticleId : -1,
            tagFragmentId : -1
          },
          currentRow : null
        },
        addTagFragmentRelation : {
          addTagFragmentRelationVisible : false,
          selectTagFragmentList : [],
          searchTagFragmentForm : {
            name : ''
          },
          tagFragmentRelation:{
          },
          currentRow : null,
          tagFragmentIdStr : ','
        }
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var tagArticleId = this.gardener.getParamInt(params['tagArticleId'], -1);
    if(tagArticleId == -1){
      return ;
    }
    this.tagArticle.id = tagArticleId;
    this.tagFragmentRelation.tagFragmentRelation.tagFragmentRelation.tagArticleId = tagArticleId;
    this.tagFragmentRelation.addTagFragmentRelation.tagFragmentRelation.tagArticleId = tagArticleId;
    this.loadTagArticle();
    this.loadTagFragmentRelation();
  },
  methods: {
    loadTagArticle(){
      this.axios.get(this.gardener.adminBackBaseURL + 'tag/article/v1/detail', {
        params: {
          tagArticleId : this.tagArticle.id
        }
      }).then((response) => {
        this.tagArticle = response.data;
        this.tagArticle.typeName = this.gardener.tagType.get(this.tagArticle.type)
      }).catch((response)=>{
        
      })
    },
    //------------------------------------------ 碎片标签 ------------------------------------------
    loadTagFragmentRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/article/fragment/relation/v1/list', this.tagFragmentRelation.tagFragmentRelation.tagFragmentRelation).then((response) => {
        this.tagFragmentRelation.tagFragmentRelation.tagFragmentRelationList = response.data;
        for(var i = 0; i < this.tagFragmentRelation.tagFragmentRelation.tagFragmentRelationList.length; i++){
          this.tagFragmentRelation.addTagFragmentRelation.tagFragmentIdStr += this.tagFragmentRelation.tagFragmentRelation.tagFragmentRelationList[i].tagFragmentId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addTagFragmentRelation(){
      this.tagFragmentRelation.addTagFragmentRelation.addTagFragmentRelationVisible = true;
    },
    delTagFragmentRelation(){
      if(this.tagFragmentRelation.tagFragmentRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/article/fragment/relation/v1/delete?tagArticleFragmentRelationId=' + this.tagFragmentRelation.tagFragmentRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadTagFragmentRelation();
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
    selectTagFragmentRelation(){
      if(this.tagFragmentRelation.addTagFragmentRelation.currentRow === null){
        this.checkRow();
      }else{
        this.tagFragmentRelation.addTagFragmentRelation.tagFragmentRelation.tagFragmentId = this.tagFragmentRelation.addTagFragmentRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'tag/article/fragment/relation/v1/save', this.tagFragmentRelation.addTagFragmentRelation.tagFragmentRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.tagFragmentRelation.addTagFragmentRelation.addTagFragmentRelationVisible = false;
          this.loadTagFragmentRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchTagFragmentSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/fragment/v1/list', this.tagFragmentRelation.addTagFragmentRelation.searchTagFragmentForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.tagFragmentRelation.addTagFragmentRelation.tagFragmentIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.tagFragmentRelation.addTagFragmentRelation.selectTagFragmentList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleTagFragmentRelationCurrentChange(val){
      this.tagFragmentRelation.tagFragmentRelation.currentRow = val;
    },
    handleTagFragmentCurrentChange(val){
      this.tagFragmentRelation.addTagFragmentRelation.currentRow = val;
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.type);
    },
    backToList(){
      window.location.href = '#/admin/tag/article/list';
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