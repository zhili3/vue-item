<template>
  <div class="container">
    <div>
      <strong style="font-size: 26px;">{{data.view.order_num}}</strong>&nbsp;
      <span style="color: #798c9c;font-size: 16px;">{{data.view.created_at}}</span>
    </div>
    <el-row :gutter="20" v-loading="infoLoading" style="margin: 40px 0;">
      <el-col :xs="24" :sm="24" :md="17" :lg="17">
        <el-card>
          <div slot="header">
            <span>{{$t('order.detail')}}&nbsp;<el-tag type="info" size="small">{{data.view.order_status_id}}</el-tag></span>
          </div>
          <el-row type="flex" align="middle" :gutter="20" v-for="item in data.item" :key="item.id" style="padding: 15px 0;border-bottom: 1px solid #dfe3e8;">
            <!-- <img :src="item.icon" width="50" height="50"> -->
            <el-col :span="10">
              <el-row>
                  <el-col :span="24">
                    <p class="product-title">{{item.product_name}}</p>
                  </el-col>
                  <el-col :span="24">
                    <span>SKU: {{item.sku}}</span>
                  </el-col>
                </el-row>
            </el-col>
            <el-col :span="5">
              <span>${{item.price}}</span>&nbsp;&nbsp;x&nbsp;&nbsp;<span>{{item.quantity}}</span>
            </el-col>
            <el-col :span="5">
              <span>${{item.price*item.quantity}}</span>
            </el-col>
          </el-row>

          <el-row style="padding: 20px 0;border-bottom: 1px solid #dfe3e8;">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <p>{{$t('order.note')}}</p>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="textarea"
                style="margin-bottom: 15px;"
                >
              </el-input>
              <el-button type="primary">{{$t('tool.save')}}</el-button>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-row type="flex" align="middle" style="margin: 20px 0;">
                <el-col align="right">Subtotal</el-col>
                <el-col align="right">${{data.view.base_total_local_amount}}</el-col>
              </el-row>
              <el-row type="flex" align="middle" style="margin: 20px 0;">
                <el-col align="right">Tax</el-col>
                <el-col align="right">${{data.view.tax}}</el-col>
              </el-row>
              <el-row type="flex" align="middle" style="margin: 20px 0;">
                <el-col align="right"><strong>Total</strong></el-col>
                <el-col align="right"><strong>${{data.view.base_total_local_amount}}</strong></el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" style="padding: 20px 0;border-bottom: 1px solid #dfe3e8;">
            <el-col>PAYMENT OF ${{data.view.base_total_local_amount}} WAS ACCEPTED.</el-col>
            <el-col align="right">
              <el-button type="primary">{{$t('order.refund')}}</el-button>
            </el-col>
          </el-row>

        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="7" :lg="7">
        <el-card>
          <div style="padding: 0 0 10px;border-bottom: 1px solid #dfe3e8;">
            <h4>{{$t('order.customer')}}</h4>
            <p>{{data.address.firstname}} {{data.address.lastname}}</p>
            <p>{{data.item.length}} order</p>
          </div>

          <div style="padding: 10px 0;border-bottom: 1px solid #dfe3e8;">
            <h4>{{$t('order.contact')}}</h4>
            <p>{{data.address.email}}</p>
          </div>

          <div style="padding: 10px 0;border-bottom: 1px solid #dfe3e8;">
            <el-row type="flex" align="middle">
              <el-col><h4>{{$t('order.shipping')}}</h4></el-col>
              <el-col align="right">
                <el-button type="text" @click="handleAssressEidt">{{$t('tool.edit')}}</el-button>
              </el-col>
            </el-row>
            <p>{{data.address.firstname}} {{data.address.lastname}}</p>
            <p>{{data.address.address}}</p>
            <p>{{data.address.city}}</p>
            <p>{{data.address.state}}</p>
            <p>{{data.address.country}}</p>
            <p>{{data.address.phone}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="修改地址" :visible.sync="dialogEditAddressVisible">
      <el-form ref="addressForm"  label-width="180px">
        <el-form-item label="UserName">
          <el-col :span="11">
            <el-input v-model="addressForm.firstname" placeholder="Firstname"></el-input>
          </el-col>
          <el-col :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="addressForm.lastname" placeholder="Lastname"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="City">
          <el-input v-model="addressForm.city"></el-input>
        </el-form-item>
        <el-form-item label="State">
          <el-input v-model="addressForm.state"></el-input>
        </el-form-item>
        <el-form-item label="Country">
          <el-input v-model="addressForm.country"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="addressForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="addressForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogEditAddressVisible = false">取 消</el-button>
          <el-button type="info" @click="onAddressEditSubmit">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {orderInfo, orderAddressEdit} from '@/api/order.js'
  export default{
    name: 'OrderInfo',
    data() {
      return{
        infoLoading: false,
        dialogEditAddressVisible: false,
        textarea: '',
        data: {
          address: {},
          item: [],
          view: {}
        },
        addressForm: {
          firstname: '',
          lastname: '',
          city: '',
          country: '',
          email: '',
          phone: '',
          state: ''
        }
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      // 地址修改弹窗
      handleAssressEidt() {
        this.dialogEditAddressVisible = true
        this.addressForm = {...this.data.address}
      },
      // 地址修改提交
      onAddressEditSubmit() {
        let params = {
          site: 'nf',
          order_num: this.data.view.order_num,
          ...this.addressForm
        }
        orderAddressEdit(params).then(response => {
          this.data.address = {...this.data.address, ...this.addressForm}
        }).catch(err => {
          console.log(err)
        })
      },
      loadData() {
        this.infoLoading=true
        let params={
          id: this.$route.params.id,
          site: 'nf'
        }
        orderInfo(params).then(response =>{
          console.log(response)
          this.data=response.data
          this.infoLoading=false
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .container{width: 94%;margin: 30px auto 0;font-size: 14px;}

</style>
