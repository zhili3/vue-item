<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="19">
            <el-button  @click="handleAdd()" type="primary" icon="plus">新增</el-button>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchKey">
          </el-input>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="头像" width="76">
          <template slot-scope="scope">
            <!-- <img :src='scope.row.avatar' style="height: 35px;vertical-align: middle;" alt=""> -->
            <avatar :username="scope.row.username" :size="34"></avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="username"
          label="登录用户名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          label="状态"
          width="100"
          >
          <template slot-scope="scope">
           <el-tag v-show="scope.row.status==1" type="success">激 活</el-tag>
           <el-tag v-show="scope.row.status==0" type="info">未 激 活</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="385">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="small"
              type="info"
              icon="setting"
              @click="handleAccessConfig(scope.$index, scope.row)">单独配置权限
            </el-button>
            <el-button
              size="small"
              type="info"
              icon="setting"
              @click="handleRoleConfig($event,scope.$index, scope.row)">配置角色
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">注销
            </el-button>
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

      <el-dialog title="单独配置用户权限" :visible.sync="dialogVisibleAccess" center>
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              ref="accessTree"
              :data="accessTree"
              show-checkbox
              check-strictly
              node-key="signid"
              default-expand-all
              v-loading="dialogLoading"
              :props="accessProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAccess = false">取 消</el-button>
          <el-button type="primary" @click="configUserAccess">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog title="配置用户角色" :visible.sync="dialogVisible" center>
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              ref="roleTree"
              :data="roleTree"
              show-checkbox
              check-strictly
              node-key="id"
              default-expand-all
              v-loading="dialogLoading"
              :props="roleProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog title="新增/修改用户" :visible.sync="dialogEditFormVisible">

        <el-form ref="form"  label-width="180px">
          <el-form-item v-if="form.id>0"  label="工号">
            <el-input v-model="form.id"></el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="登录用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input type='password' v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type='password' v-model="form.repass"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio-group v-model="form.status">

              <el-radio :label="1">激 活</el-radio>
              <el-radio :label="0">未 激 活</el-radio>

            </el-radio-group>
          </el-form-item>

          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="info" @click="onEditSubmit" v-if="form.id">保 存</el-button>
            <el-button type="primary" @click="onSubmit" v-else>立即创建</el-button>

          </el-form-item>
        </el-form>
      </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "./components/panel.vue"
  import * as userApi from "@/api/admin/user"
  import * as roleApi from "@/api/admin/role"
  import * as access_groupApi from "@/api/admin/access_group"
  import Avatar from 'vue-avatar'

  export default {
    name: 'User',
    components: {
      'imp-panel': panel,
      Avatar
    },
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        dialogVisibleAccess:false,
        dialogEditFormVisible: false,
        roleProps: {
          children: 'role_list',
          label: 'cname',
          id: "id",
        },
        accessProps: {
          children: 'access_list',
          label: 'cname',
          id: "id",
        },
        roleTree: [],
        accessTree: [],
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        form: {
          id: null,
          name: '',
          username: '',
          email: '',
          mobile: '',
          status: 1,
          description: '',
          password:'',
          sex:1
        }
      }
    },
    methods: {
      handleSelectionChange(val){

      },
      //给用户配置角色
      handleRoleConfig(event,index, row){
        this.currentRow = row
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          roleApi.RoleList('data',"sign=1")
            .then(res => {
              this.roleTree = res.data
            })
        }
        userApi.checkRoleList(this.currentRow ,'-').then(res=>{
          this.$refs.roleTree.setCheckedKeys(res.data);
        })
      },//修改角色
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
          userApi.editUserRoleList(checkedKeys,"userId=" + this.currentRow.id).then(res => {
              this.$message('修改成功');
              this.dialogVisible = false;
          })
      }, //给用户配置权限
      handleAccessConfig(index, row){
        this.currentRow = row
        this.dialogVisibleAccess = true;
        if (this.accessTree.length <= 0) {
          access_groupApi.AccessGroupList('data','_')
            .then(res => {
              this.accessTree = res.data
            })
        }
        userApi.checkAccessList(this.currentRow,'-').then(res=>{
          this.$refs.accessTree.setCheckedKeys(res.data);
        })
      },//修改权限
      configUserAccess(){
        let checkedKeys = this.$refs.accessTree.getCheckedKeys();
          userApi.editUserAccessList(checkedKeys,"userId=" + this.currentRow.id).then(res => {
              this.$message('修改成功');
              this.dialogVisibleAccess = false;
          })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleAdd(){
        this.form = {'status':1,'sex':1};
        this.dialogEditFormVisible = true
      },
      handleEdit(index, row){
        this.dialogEditFormVisible = true
        this.$nextTick(()=>{
          this.form = {...row,status:+row.status,sex:+row.sex,password:''}
        })
      },//删除
      handleDelete(index, row){
        this.$confirm('用户注销之后, 其所有权限全部清空?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning '
            }).then(() => {
               userApi.delUser(row,'_').then(res => {
                  this.loadData();
                });
            })
      },
      onSubmit(){
        this.form.id=null;
        userApi.EditUser(this.form,'-')
          .then(res => {
            this.form = res.data;
            this.$confirm('添加成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.dialogEditFormVisible = false
              this.loadData();
              // this.$tableData.push({path: 'getUserList'})
            })
          })
      },
      onEditSubmit(){
        userApi.EditUser(this.form , "_").then(res => {
            this.form = res.data;
            this.$confirm('修改成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.dialogEditFormVisible = false
              this.loadData();
              // this.$tableData.push({path: 'getUserList'})
            })
          })
      },
      loadData(){
          userApi.getUserList({
            key: this.searchKey,
            pageSize: this.tableData.pagination.pageSize,
            pageNo: this.tableData.pagination.pageNo
          }).then(res => {
            this.tableData.rows = res.records;
            this.tableData.pagination.total = +res.total;
          });
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
