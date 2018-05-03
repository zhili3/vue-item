<template>
  <div class="container">
    <el-row type="flex" class="header" align="middle">
      <el-col :span="24">
        <h1>{{$t('route.'+this.$route.meta.title)}}</h1>
      </el-col>
    </el-row>
    <el-card class="box-card" style="margin: 40px 0;">
      <div class="toolbar" style="margin-bottom: 15px;">
        <!-- <el-dropdown v-show="operationView" style="margin-right: 20px;">
          <span class="el-dropdown-link">
            Actions<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><i class="el-icon-delete"></i>&nbsp;删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button type="text" @click="handleExportCustomer"><i class="el-icon-download"></i>&nbsp;{{$t('tool.export')}}</el-button>
        <el-button type="text" @click="handleRefresh"><i class="el-icon-refresh"></i>&nbsp;{{$t('tool.refresh')}}</el-button>
      </div>
      <div class="search">
        <el-form :inline="true" :model="params" ref="searchForm">
          <el-form-item prop="query.keyword">
            <el-input v-model="params.query.keyword" placeholder="keywords"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('tool.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReset('searchForm')">{{$t('tool.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="userTable">
        <el-table
          :data="tableData.records"
          @selection-change="handleSelectionChange"
          @sort-change="handleSort"
          @filter-change="handleFilter"
          v-loading="listLoading"
          element-loading-text="Loading"
          ref="userTable"
          :header-row-style="{background: '#f2f2f2'}"
          style="width: 100%;"
          >
          <el-table-column
            type="selection"
            width="35"
            >
          </el-table-column>
          <el-table-column
            fixed
            :label="$t('customer.id')"
            prop="id"
            width="80"
            >
          </el-table-column>
          <el-table-column
            :label="$t('customer.avatar')"
            width="80"
            >
            <template slot-scope="scope">
              <avatar :username="scope.row.name" :src="scope.row.avatar" :size="40"></avatar>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.userInfo')"
            >
            <template slot-scope="scope">
              <strong>{{scope.row.name}}</strong>&nbsp;
              <el-tag>{{scope.row.country}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.userType')"
            column-key="guest"
            prop="guest"
            width="100"
            :filters="[{ text: '注册用户', value: '0' }, { text: '游客', value: '1' }]"
            :filter-multiple="false"
            >
            <template slot-scope="scope">
              <el-tag :type="scope.row.guest==0 ? 'success' : 'warning'">
                {{'userType'+scope.row.guest | statusFilter}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.subscribe')"
            column-key="isSubscription"
            prop="isSubscription"
            width="110"
            :filters="[{ text: '未订阅', value: 'N' }, { text: '订阅', value: 'Y' }]"
            :filter-multiple="false"
            >
            <template slot-scope="scope">
              <el-tag :type="scope.row.isSubscription=='Y' ? 'success' : 'warning'">
                {{'subscription'+scope.row.isSubscription | statusFilter}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.status')"
            column-key="banned"
            prop="banned"
            width="80"
            :filters="[{ text: '禁用', value: 'Y' }, { text: '正常', value: 'N' }]"
            :filter-multiple="false"
            >
            <template slot-scope="scope">
              <el-tag :type="scope.row.banned=='N' ? 'success' : 'warning'">
                {{'banned'+scope.row.banned | statusFilter}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.orderCount')"
            prop="order_count"
            sortable="custom"
            width="130"
            >
            <template slot-scope="scope">
              {{scope.row.order_count ? scope.row.order_count : 0}}&nbsp;orders
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.spent')"
            prop="order_total_paid"
            sortable="custom"
            width="110"
            >
            <template slot-scope="scope">
              ${{scope.row.order_total_paid ? scope.row.order_total_paid : '0.00'}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('customer.operation')"
            width="100"
            >
            <template slot-scope="scope">
              <el-button size="mini">
                <router-link :to="{name: 'CustomerInfo', params: { userId: scope.row.id }}">View</router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNo"
          :page-sizes="[10,20,30]"
          :total="+tableData.total"
          style="margin-top: 15px;"
          >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {customerForm} from '@/api/customer.js'
  import Avatar from 'vue-avatar'
  export default{
    name: 'Customers',
    components: {
      Avatar
    },
    data() {
      return{
        listLoading: false,
        operationView: false,
        tableData: {
          total: 0,
          records: [{
            id: '0',
            avatar: '',
            name:'',
            country: '',
            guest: '',
            banned: '',
            isSubscription: '',
            order_count: 0,
            order_total_paid: 0
          }]
        },
        params: {
          pageNo: 1,
          pageSize: 10,
          sort: {},
          query: {
            keyword: ''
          }
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap={
          userType0: '注册用户',
          userType1: '游客',
          subscriptionY: 'YES',
          subscriptionN: 'NO',
          bannedY: '禁用',
          bannedN: '正常'
        }
        return statusMap[status]
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      // 查询
      handleQuery() {
        this.loadData()
      },
      // 重置
      handleReset(formName) {
        this.$refs[formName].resetFields()
        this.$refs.userTable.clearFilter()
        this.params.query = {}
        this.loadData()
      },
      handleSelectionChange(val){
        // val.length>0 ? this.operationView=true : this.operationView=false
      },
      handleExportCustomer() {

      },
      // 刷新
      handleRefresh() {
        this.loadData()
      },
      // 排序
      handleSort(column) {
        this.params.sort={}
        let sortName = column.prop
        if(column.order=='ascending'){
          this.params.sort[sortName]= 'asc'
        }else if(column.order=='descending'){
          this.params.sort[sortName] = 'desc'
        }
        this.loadData()
      },
      // 筛选
      handleFilter(filters) {
        // console.log(filters)
        let query=this.params.query

        filterFn('guest')
        filterFn('isSubscription')
        filterFn('banned')
        function filterFn(columnKey) {
          if(filters[columnKey]){
            query[columnKey] = filters[columnKey][0]
            if(!filters[columnKey].length){
              delete query[columnKey]
            }
          }
        }

        this.loadData()
      },
      // 用户详情
      // handleRowClick(row, event, column) {
      //   let userId=row.id
      //   this.$router.push({name: 'CustomerInfo', params: { userId }})
      // },
      // 每页显示数据量
      handleSizeChange(val) {
        this.params.pageSize = val
        this.loadData()
      },
      // 分页
      handleCurrentChange(val) {
        this.params.pageNo = val
        this.loadData()
      },
      loadData() {
        this.listLoading=true
        customerForm(this.params).then(response => {
          // console.log(response)
          this.tableData=response.data
          this.listLoading=false
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .container{width: 94%;margin: 30px auto 0;}
</style>
