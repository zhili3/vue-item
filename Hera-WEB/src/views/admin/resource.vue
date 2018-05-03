<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-button type="primary" icon="el-icon-plus" @click="newAddAccess">新增权限</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="newAddGroup">新增权限组</el-button>
    </h3>
    <div slot="body">
      <el-row :gutter="10" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" style="margin-bottom: 20px;">
          <el-card class="box-card">
            <el-tree v-if="AccessTree"
                    :data="AccessTree"
                    ref="AccessTree"
                    show-checkbox
                    highlight-current
                    @node-click="handleNodeClick" clearable node-key="id" :props="accessProps"></el-tree>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" style="margin-bottom: 20px;">
          <el-card class="box-card">
            <div class="text item">
              <el-form :model="form" ref="form" :rules="loginRules">
                <el-form-item v-show="form.sign=='Access'" label="父级" prop="parentId" :label-width="formLabelWidth">
                  <el-select-tree v-model="form.parentId" :treeData="AccessTree" :propNames="accessProps" clearable
                                  placeholder="请选择父级">
                  </el-select-tree>
                </el-form-item>

                <el-form-item v-show="form.id==null" label="类型" prop="sign" :label-width="formLabelWidth">
                  <el-radio class="radio" border size="medium"   v-model="form.sign" label="AccessGroup">资源组</el-radio>
                  <el-radio class="radio" border size="medium"   v-model="form.sign" label="Access">资源</el-radio>
                </el-form-item>

                <el-form-item v-show="form.sign!=''" label="名称" prop="cname" :label-width="formLabelWidth">
                  <el-input v-model="form.cname" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item v-show="form.sign=='AccessGroup'" prop="name" label="英文名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item v-show="form.sign=='Access'" label="路由" prop="route_name" :label-width="formLabelWidth">
                  <el-input v-model="form.route_name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item v-show="form.sign=='AccessGroup'" label="描述" :label-width="formLabelWidth">
                  <el-input type="textarea" v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item v-show="form.sign=='AccessGroup'" label="是否生效" :label-width="formLabelWidth">
                  <el-radio class="radio" v-model="form.status" label="1">是</el-radio>
                  <el-radio class="radio" v-model="form.status" label="0">否</el-radio>
                </el-form-item>

                <el-form-item label="" :label-width="formLabelWidth">
                  <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'"></el-button>
                  <el-button type="danger" @click="deleteSelected($event,form.id,form.sign)" icon="el-icon-delete" v-show="form.id && form.id!=null">删除
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>

          <!-- <el-dialog title="配置资源" :visible.sync="dialogVisible">
            <div class="select-tree">
              <el-scrollbar
                tag="div"
                class='is-empty'
                wrap-class="el-select-dropdown__wrap"
                view-class="el-select-dropdown__list">
                <el-tree
                  :data="resourceTree"
                  ref="resourceTree"
                  show-checkbox
                  check-strictly
                  node-key="signid"
                  v-loading="dialogLoading"
                  :props="accessProps">
                </el-tree>
              </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="configRoleResources">确 定</el-button>
            </span>
          </el-dialog> -->
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="10" style="margin-bottom: 20px;">
          <el-card class="box-card">
            <el-table
            :data="tableData.rows"
              style="width: 100%"
              height="">
              <el-table-column
                prop="cname"
                label="资源名称"
                >
              </el-table-column>
              <el-table-column
                prop="route_name"
                label="路由"
                >
              </el-table-column>
              <el-table-column
                prop="group_name"
                label="所属资源组"
                >
                <template slot-scope="scope">
                <el-tag v-show="scope.row.group_name!=null" type="success">{{scope.row.group_name}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.pagination.pageNo"
              :page-sizes="[5, 10, 20]"
              :page-size="tableData.pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.pagination.total">
            </el-pagination>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </imp-panel>

</template>
<script>
  import panel from "./components/panel"
  import selectTree from "./components/selectTree"
  import treeter from "./components/treeter"
  import {RoleList,EditAccessToDep,CheckDepAccess,AddDepOrRole,DelDepOrRole,DelsDepOrRole} from "@/api/admin/role"
  import * as accessApi from "@/api/admin/access_group"
  export default {
    name: 'Role',
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
    },
    data(){
      return {
        dialogLoading:false,
        dialogVisible:false,
        formLabelWidth: '80px',
        accessProps: {
          children: 'access_list',
          label: 'cname',
          id: "id",
          signid:"signid",
          sign:"sign"
        },
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        AccessTree: [],
        resourceTree:[],
        maxId:700000,
        form: {
          id: null,
          parentId: null,
          cname: '',
          name: '',
          signid:"signid",
          sign: '',
          // sort: 0,
          status: '1'
        },
        loginRules: {
          parentId: [{ required: true, trigger: 'blur', message: '请输入父级Id' }],
          cname: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          name: [{ required: true, trigger: 'blur', message: '请输入英文名称' }],
          sign: [{ required: true, trigger: 'change', message: '请选择类型' }],
          route_name: [{ required: true, trigger: 'blur', message: '请输入路由' }]
        }
      }
    },
    methods: {
      //添加资源组 及资源
      configRoleResources(){
        // console.log(this.$refs.resourceTree.getCheckedKeys());
        let checkedns = this.$refs.resourceTree.getCheckedNodes();
        var params = "sign="+this.form.sign+"&id=" + this.form.id;
        this.$nextTick(function(){
          EditAccessToDep(checkedns,params).then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
         });
        })
      },
      handleNodeClick(data){
        this.form = data;
      },
      newAddAccess(){
        this.form = {
          id: null,
          parentId: null,
          sign:'Access',
          cname: '',
          route_name: ''
        };
      },
      newAddGroup(){
        this.form = {
          id: null,
          name: '',
          sign:'AccessGroup',
          cname: '',
          status: '1',
          description: ''
        };
      },
      //批量删除
      // batchDelete(){
      //   var checkKeys = this.$refs.roleTree.getCheckedNodes();
      //   if (checkKeys == null || checkKeys.length <= 0) {
      //     this.$message.warning('请选择要删除的资源');
      //     return;
      //   }
      //   this.$confirm('确定删除?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     //批量删除
      //       DelsDepOrRole(checkKeys,'_').then(res => {
      //         this.$message('操作成功');
      //         this.load();
      //       }).catch(e => {
      //       this.$message('操作成功');
      //       this.batchDeleteFromTree(this.roleTree, checkKeys);
      //     })
      //   });
      // },
      onSubmit(){
        this.$refs.form.validate(valid => {
          if(valid){
            this.form.parentId = this.form.parentId;
            if (this.form.id==null) {
              //添加
              if(this.form.sign=="Access"){
                //添加资源
                  accessApi.addAccess(this.form,'_').then(res => {
                    this.form.id = res.data.id;
                    this.appendTreeNode(this.AccessTree, res.data);
                  }).catch(e => {
                    Info()
                  })

              }else{
                //添加资源组
                  accessApi.addAccessGroup(this.form,'_').then(res => {
                    this.form.id = res.data.id;
                    this.appendTreeNode(this.AccessTree, res.data);
                  }).catch(e => {
                    Info()
                  })

              }

            }else{
              //修改
              if(this.form.sign=="Access"){
                //添加资源
                  accessApi.editAccess(this.form,'_').then(res => {
                    this.form.id = res.data.id;
                    this.appendTreeNode(this.AccessTree, res.data);
                  }).catch(e => {
                    Info()
                  })

              }else{
                //添加资源组
                accessApi.editAccessGroup(this.form,'_').then(res => {
                    this.form.id = res.data.id;
                    this.appendTreeNode(this.AccessTree, res.data);
                  }).catch(e => {
                    Info()
                  })
              }
            }
          }else{
            console.log('error submit!!')
            return false
          }
        })
      },
      Info(){
        this.maxId += 1;
        this.$message('操作成功');
        this.form.id = this.maxId;
          if (this.form.sign=="Access") {
            var  ddd = {
                id: this.form.id,
                cname: this.form.cname,
                route_name:this.form.route_name,
                parentId: this.form.parentId
              }
          }else{
            var  ddd = {
                id: this.form.id,
                name: this.form.name,
                // sort: this.form.sort,
                cname:this.form.cname,
                parentId: this.form.parentId,
                status: this.form.status,
                description: this.form.description,
                access_list:[]
              }
          }

        this.appendTreeNode(this.AccessTree, ddd);
        this.AccessTree.push({});
        this.AccessTree.pop();
      },
      deleteSelected(event,id,sign){
        if(this.form.sign=="Access"){
            this.$confirm('权限删除之后会影响用户已绑定权限，确定要删除吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning '
            }).then(() => {
               accessApi.delAccess(this.form,'_').then(res => {
                  this.$message('操作成功');
                  this.deleteFromTree(this.AccessTree, id);
                  this.newAddAccess();
                  this.load()
                }).catch(e =>{
                  console.log(e)
              })
            }).catch(() =>{
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
            })
          }else{
            this.$confirm('权限组删除之后会影响用户已绑定权限组，确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning '
              }).then(() => {
                accessApi.delAccessGroup(this.form,'_').then(res => {
                    this.$message('操作成功');
                    this.deleteFromTree(this.AccessTree, id);
                    this.newAddGroup();
                  }).catch(e =>{
                    console.log(e)
                })
            }).catch(() =>{
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
            })

          }
      },

      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.load();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.load();
      },

      load(){
        accessApi.AccessGroupList('data',"sign=1").then(response => {
            var res = response.data;
            this.AccessTree = [];
            this.AccessTree.push(...res)
        })
        accessApi.getAccessList({
            pageSize: this.tableData.pagination.pageSize,
            pageNo: this.tableData.pagination.pageNo
          }).then(response => {
            this.tableData.rows = [];
            this.tableData.rows.push(...response.records)
            this.tableData.pagination.total = 0;
            this.tableData.pagination.total = +response.total;
        })
      }
    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .render-content {
    float: right;
    margin-right: 20px
  }
  .render-content i.fa {
    margin-left: 10px;
  }
  .render-content i.fa:hover{
    color: #e6000f;
  }
  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }
  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }
  .select-tree .el-tree{
    border:0;
  }
</style>
