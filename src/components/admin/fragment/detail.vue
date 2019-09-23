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
          <el-button type="primary" size="small" @click="addFragmentTagRelation" round>添加</el-button>
          <el-button type="primary" size="small" @click="delFragmentTagRelation" round>删除</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="singleTagTable" :data="fragmentTagRelation.fragmentTagRelations" highlight-current-row
              @current-change="handleFragmentCurrentChange" style="width: 100%;cursor:pointer;" border>
            <el-table-column prop="name" label="标签名">
            </el-table-column>
            <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="添加碎片关联标签" :visible.sync="fragmentTagRelation.addFragmentTagRelationListVisible">
        <el-form :inline="true" :model="fragmentTagRelation.searchTagForm" class="demo-form-inline">
          <el-form-item label="标签名">
            <el-input v-model="fragmentTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchTagSubmit">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="singleTagSelectTable" :data="fragmentTagRelation.selectTagList" highlight-current-row 
            @current-change="handleFragmentSelectCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
          <el-table-column prop="name" label="标签名">
          </el-table-column>
          <el-table-column prop="tagType" :formatter="formatterTagType" label="标签类型" width="260">
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="fragmentTagRelation.addFragmentTagRelationListVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectTag">确定</el-button>
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
      fragmentTagRelation : {
        fragmentTagRelationList : {
          fragmentId : -1
        },
        fragmentTagRelationForm : {
          fragmentId : -1,
          tagId : -1
        },
        fragmentTagRelations : [],
        searchTagForm : {
          name : ''
        },
        addFragmentTagRelationListVisible : false,
        selectTagList : [],
        currentRow : null,
        currentSelectRow : null
      }
    };
  },
  created(){
    this.loadData();
    this.loadFragmentTagRelations();
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
      this.fragmentTagRelation.fragmentTagRelationList.fragmentId = fragmentId;
      this.fragmentTagRelation.fragmentTagRelationForm.fragmentId = fragmentId;
      this.axios.get(this.gardener.adminBackBaseURL + 'fragment/v1/detail', {
        params: {
          fragmentId : fragmentId
        }
      }).then((response) => {
        this.fragment = response.data;
      }).catch((response)=>{
        
      })
    },
    loadFragmentTagRelations(){
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/list', this.fragmentTagRelation.fragmentTagRelationList
      ).then((response) => {
        this.fragmentTagRelation.fragmentTagRelations = response.data;
      }).catch((response)=>{
        
      })
    },
    handleFragmentCurrentChange(val){
      this.fragmentTagRelation.currentRow = val;
    },
    handleFragmentSelectCurrentChange(val){
      this.fragmentTagRelation.currentSelectRow = val;
    },
    formatterTagType(row, column){
      return this.gardener.tagType.get(row.tagType);
    },
    selectTag(){
      if(this.fragmentTagRelation.currentSelectRow === null){
        this.checkRow();
        return ;
      }
      this.fragmentTagRelation.fragmentTagRelationForm.tagId = this.fragmentTagRelation.currentSelectRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/save', this.fragmentTagRelation.fragmentTagRelationForm
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
          this.loadFragmentTagRelations();
        }
      }).catch((response)=>{
        
      })
      this.fragmentTagRelation.addFragmentTagRelationListVisible = false;
    },
    onSearchTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.fragmentTagRelation.searchTagForm
      ).then((response) => {
        this.fragmentTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    addFragmentTagRelation(){
      this.fragmentTagRelation.addFragmentTagRelationListVisible = true;
    },
    delFragmentTagRelation(){
      if(this.fragmentTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'fragment/tag/relation/v1/delete?fragmentTagRelationId=' + this.fragmentTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadFragmentTagRelations();
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

<style>
</style>