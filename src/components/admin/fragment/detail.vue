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
          <el-divider content-position="left">碎片详情</el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form ref="fragment" :model="fragment" label-width="120px">
            <el-form-item label="名称">
              {{fragment.title}}
            </el-form-item>
            <el-form-item label="内容">
              <div v-html="fragment.content" />
            </el-form-item>
          </el-form>
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
          <el-button type="primary" size="small" @click="addTagRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="delTagRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleTagTable" :data="tagRelation.tagRelations" highlight-current-row
              @current-change="handleTagCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加碎片关联标签" :visible.sync="tagRelation.addTagRelationListVisible">
        <el-form :inline="true" :model="tagRelation.searchTagForm" class="demo-form-inline">
          <el-form-item label="标签名">
            <el-input v-model="tagRelation.searchTagForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchTagSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleTagSelectTable" :data="tagRelation.selectTagList" highlight-current-row 
            @current-change="handleTagSelectCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
          <el-table-column prop="name" label="标签名">
          </el-table-column>
          <el-table-column prop="type" :formatter="formatterTagType" label="标签类型" width="260">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="tagRelation.addTagRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectTag">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
<!-- ----------------------------------相关介绍--------------------------------------------  -->
    <el-row>
      <el-col :span="24">
        <div class="gardener-height-6"></div>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <el-row>
        <el-col :span="24">
          <el-divider content-position="left">关联介绍</el-divider>
        </el-col>
      </el-row>
      <el-row class="gardener-title-nav">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="addIntroductionRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="delIntroductionRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleIntroductionTable" :data="introductionRelation.introductionRelations" highlight-current-row
              @current-change="handleIntroductionCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="summary" label="简介">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加碎片关联介绍" :visible.sync="introductionRelation.addIntroductionRelationListVisible">
        <el-form :inline="true" :model="introductionRelation.searchIntroductionForm" class="demo-form-inline">
          <el-form-item label="简介">
            <el-input v-model="introductionRelation.searchIntroductionForm.summary" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchIntroductionSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleIntroductionSelectTable" :data="introductionRelation.selectIntroductionList" highlight-current-row 
            @current-change="handleIntroductionSelectCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
          <el-table-column prop="summary" label="简介">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="introductionRelation.addIntroductionRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectIntroduction">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AdminFragmentDetail',
  data() {
    return {
      fragment : {
        id : -1,
        title : "",
        content : ""
      },
      tagRelation : {
        tagRelationList : {
          fragmentId : -1
        },
        tagRelationForm : {
          fragmentId : -1,
          tagFragmentId : -1
        },
        tagRelations : [],
        searchTagForm : {
          name : ''
        },
        addTagRelationListVisible : false,
        selectTagList : [],
        currentRow : null,
        currentSelectRow : null
      },
      introductionRelation : {
        introductionRelationList : {
          fragmentId : -1
        },
        introductionRelationForm : {
          fragmentId : -1,
          detailIntroductionId : -1
        },
        introductionRelations : [],
        searchIntroductionForm : {
          summary : ''
        },
        addIntroductionRelationListVisible : false,
        selectIntroductionList : [],
        currentRow : null,
        currentSelectRow : null
      }
    };
  },
  created(){
    this.loadData();
    this.loadTagRelations();
    this.loadIntroductionRelations();
  },
  methods:{
    loadData(){
      var params = this.gardener.getParams();
      var fragmentId = this.gardener.getParamInt(params['fragmentId'], -1);
      if(fragmentId == -1){
        this.$alert('获取碎片ID异常', '参数异常', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return ;
      }
      this.tagRelation.tagRelationList.fragmentId = fragmentId;
      this.tagRelation.tagRelationForm.fragmentId = fragmentId;
      this.introductionRelation.introductionRelationList.fragmentId = fragmentId;
      this.introductionRelation.introductionRelationForm.fragmentId = fragmentId;
      this.axios.get(this.gardener.adminBackBaseURL + 'fragment/v1/detail', {
        params: {
          fragmentId : fragmentId
        }
      }).then((response) => {
        this.fragment = response.data;
      }).catch((response)=>{
        
      })
    },
//----------------------------------标签--------------------------------------------
    loadTagRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/list/tag', this.tagRelation.tagRelationList
      ).then((response) => {
        this.tagRelation.tagRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleTagCurrentChange(val){
      this.tagRelation.currentRow = val;
    },
    handleTagSelectCurrentChange(val){
      this.tagRelation.currentSelectRow = val;
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.type);
    },
    selectTag(){
      if(this.tagRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.tagRelation.tagRelationForm.tagFragmentId = this.tagRelation.currentSelectRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/save', this.tagRelation.tagRelationForm
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
          this.loadTagRelations();
        }
      }).catch((response)=>{
        
      })
      this.tagRelation.addTagRelationListVisible = false;
    },
    onSearchTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/fragment/v1/list', this.tagRelation.searchTagForm
      ).then((response) => {
        this.tagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    addTagRelation(){
      this.tagRelation.addTagRelationListVisible = true;
    },
    delTagRelation(){
      if(this.tagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/delete?fragmentTagRelationId=' + this.tagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadTagRelations();
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
//----------------------------------介绍--------------------------------------------
    loadIntroductionRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/introduction/relation/v1/list', this.introductionRelation.introductionRelationList
      ).then((response) => {
        this.introductionRelation.introductionRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleIntroductionCurrentChange(val){
      this.introductionRelation.currentRow = val;
    },
    handleIntroductionSelectCurrentChange(val){
      this.introductionRelation.currentSelectRow = val;
    },
    selectIntroduction(){
      if(this.introductionRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.introductionRelation.introductionRelationForm.detailIntroductionId = this.introductionRelation.currentSelectRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/introduction/relation/v1/save', this.introductionRelation.introductionRelationForm
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
          this.loadIntroductionRelations();
        }
      }).catch((response)=>{
        
      })
      this.introductionRelation.addIntroductionRelationListVisible = false;
    },
    onSearchIntroductionSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'detail/introduction/v1/list', this.introductionRelation.searchIntroductionForm
      ).then((response) => {
        this.introductionRelation.selectIntroductionList = response.data;
      }).catch((response)=>{
        
      })
    },
    addIntroductionRelation(){
      this.introductionRelation.addIntroductionRelationListVisible = true;
    },
    delIntroductionRelation(){
      if(this.introductionRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'fragment/introduction/relation/v1/delete?fragmentIntroductionRelationId=' + this.introductionRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadIntroductionRelations();
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
    backToList(){
      window.location.href = '#/admin/fragment/list';
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