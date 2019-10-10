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
        <el-divider content-position="left">标签详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="tag" :model="tag" label-width="160px">
          <el-form-item label="名称">
            {{tag.name}}
          </el-form-item>
          <el-form-item label="标签分类">
            {{tag.tagTypeName}}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- -------------------------------------------------- 父标签 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">父标签</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addParentRelation" round>添加父标签</el-button>
        <el-button type="primary" size="small" @click="delParentRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleParentRelationTable" :data="parentTagRelation.tagTagRelation.tagTagRelationList" highlight-current-row 
          @current-change="handleParentRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="tagName" label="标签名">
          </el-table-column>
          <el-table-column prop="relateType" :formatter="formatterRelateType" label="关联关系" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联标签" :visible.sync="parentTagRelation.addTagTagRelation.addTagTagRelationVisible">
      <el-form :inline="true" :model="parentTagRelation.addTagTagRelation.searchTagForm" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="parentTagRelation.addTagTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchParentTagSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleParentTagTable" :data="parentTagRelation.addTagTagRelation.selectTagList" highlight-current-row 
          @current-change="handleParentTagCurrentChange" style="width: 100%" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="parentTagRelation.tagTagRelation.addTagTagRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectParentTagRelation">确定</el-button>
      </div>
    </el-dialog>
    <!-- -------------------------------------------------- 子标签 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">子标签</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addChildRelation" round>添加子标签</el-button>
        <el-button type="primary" size="small" @click="delChildRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleChildRelationTable" :data="childTagRelation.tagTagRelation.tagTagRelationList" highlight-current-row 
          @current-change="handleChildRelationCurrentChange" style="width: 100%;cursor:pointer;" border>
          <el-table-column prop="tagName" label="标签名">
          </el-table-column>
          <el-table-column prop="relateType" :formatter="formatterRelateType" label="关联关系" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联标签" :visible.sync="childTagRelation.addTagTagRelation.addTagTagRelationVisible">
      <el-form :inline="true" :model="childTagRelation.addTagTagRelation.searchTagForm" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="childTagRelation.addTagTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchChildTagSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleChildTagTable" :data="childTagRelation.addTagTagRelation.selectTagList" highlight-current-row 
          @current-change="handleChildTagCurrentChange" style="width: 100%;cursor:pointer;" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="childTagRelation.tagTagRelation.addTagTagRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectChildTagRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminTagDetail',
  data() {
    return {
      tag : {
        id : 0,
        name : "",
        tagType : 0,
        tagTypeName : ""
      },
      parentTagRelation : {
        tagTagRelation : {
          tagTagRelationList : [],
          tagRelation:{
            tagId : -1,
            relateType : 1
          },
          currentRow : null
        },
        addTagTagRelation : {
          addTagTagRelationVisible : false,
          selectTagList : [],
          searchTagForm : {
            name : ''
          },
          tagRelation:{
            relateType : 1
          },
          currentRow : null,
          tagIdStr : ','
        }
      },
      childTagRelation : {
        tagTagRelation : {
          tagTagRelationList : [],
          tagRelation:{
            tagId : -1,
            relateType : 2
          },
          currentRow : null
        },
        addTagTagRelation : {
          addTagTagRelationVisible : false,
          selectTagList : [],
          searchTagForm : {
            name : ''
          },
          tagRelation:{
            relateType : 2
          },
          currentRow : null,
          tagIdStr : ','
        }
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var tagId = this.gardener.getParamInt(params['tagId'], -1);
    if(tagId == -1){
      return ;
    }
    this.tag.id = tagId;
    this.parentTagRelation.tagTagRelation.tagRelation.tagId = tagId;
    this.parentTagRelation.addTagTagRelation.tagRelation.tagId = tagId;
    this.childTagRelation.tagTagRelation.tagRelation.tagId = tagId;
    this.childTagRelation.addTagTagRelation.tagRelation.tagId = tagId;
    this.loadTag();
    this.loadParnetTagTagRelation();
    this.loadChildTagTagRelation();
  },
  methods: {
    loadTag(){
      this.axios.get(this.gardener.adminBackBaseURL + 'tag/v1/detail', {
        params: {
          tagId : this.tag.id
        }
      }).then((response) => {
        this.tag = response.data;
        this.tag.tagTypeName = this.gardener.tagType.get(this.tag.tagType)
      }).catch((response)=>{
        
      })
    },
    //------------------------------------------ 父标签 ------------------------------------------
    loadParnetTagTagRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/list', this.parentTagRelation.tagTagRelation.tagRelation).then((response) => {
        this.parentTagRelation.tagTagRelation.tagTagRelationList = response.data;
        for(var i = 0; i < this.parentTagRelation.tagTagRelation.tagTagRelationList.length; i++){
          this.parentTagRelation.addTagTagRelation.tagIdStr += this.parentTagRelation.tagTagRelation.tagTagRelationList[i].relateTagId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addParentRelation(){
      this.parentTagRelation.addTagTagRelation.addTagTagRelationVisible = true;
    },
    delParentRelation(){
      if(this.parentTagRelation.tagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/delete?tagTagRelationId=' + this.parentTagRelation.tagTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadParnetTagTagRelation();
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
    selectParentTagRelation(){
      if(this.parentTagRelation.addTagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.parentTagRelation.addTagTagRelation.tagRelation.relateTagId = this.parentTagRelation.addTagTagRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/save', this.parentTagRelation.addTagTagRelation.tagRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.parentTagRelation.addTagTagRelation.addTagTagRelationVisible = false;
          this.loadParnetTagTagRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchParentTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.parentTagRelation.addTagTagRelation.searchTagForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.parentTagRelation.addTagTagRelation.tagIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.parentTagRelation.addTagTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleParentRelationCurrentChange(val){
      this.parentTagRelation.tagTagRelation.currentRow = val;
    },
    handleParentTagCurrentChange(val){
      this.parentTagRelation.addTagTagRelation.currentRow = val;
    },
    //------------------------------------------ 子标签 ------------------------------------------
    addChildRelation(){
      this.childTagRelation.addTagTagRelation.addTagTagRelationVisible = true;
    },
    loadChildTagTagRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/list', this.childTagRelation.tagTagRelation.tagRelation).then((response) => {
        this.childTagRelation.tagTagRelation.tagTagRelationList = response.data;
        for(var i = 0; i < this.childTagRelation.tagTagRelation.tagTagRelationList.length; i++){
          this.childTagRelation.addTagTagRelation.tagIdStr += this.childTagRelation.tagTagRelation.tagTagRelationList[i].relateTagId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addChildRelation(){
      this.childTagRelation.addTagTagRelation.addTagTagRelationVisible = true;
    },
    delChildRelation(){
      if(this.childTagRelation.tagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/delete?tagTagRelationId=' + this.childTagRelation.tagTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadChildTagTagRelation();
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
    selectChildTagRelation(){
      if(this.childTagRelation.addTagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.childTagRelation.addTagTagRelation.tagRelation.relateTagId = this.childTagRelation.addTagTagRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/save', this.childTagRelation.addTagTagRelation.tagRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.childTagRelation.addTagTagRelation.addTagTagRelationVisible = false;
          this.loadChildTagTagRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchChildTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.childTagRelation.addTagTagRelation.searchTagForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.childTagRelation.addTagTagRelation.tagIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.childTagRelation.addTagTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleChildRelationCurrentChange(val){
      this.childTagRelation.tagTagRelation.currentRow = val;
    },
    handleChildTagCurrentChange(val){
      this.childTagRelation.addTagTagRelation.currentRow = val;
    },
    formatterRelateType(row, column){
      return this.gardener.tagRelateType.get(row.relateType);
    },
    backToList(){
      window.location.href = '#/admin/tag/list';
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