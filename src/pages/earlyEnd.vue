<!--
 * @Author: your name
 * @Date: 2021-08-12 15:35:26
 * @LastEditTime: 2021-08-13 17:13:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hls-contract-change\src\pages\earlyEnd.vue
-->
<template>
  <h-view>
    <h-header>
      <div slot="left" class="h-header-btn" @click="$routeGo(-1)">
        <i class="ion-ios-arrow-back"/>
      </div>
      <div slot="center">
        合同终止
      </div>
    </h-header>
    <scroll>
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item title="基本信息" name="1">
          <list-item>
            <section>
              <item :proportion="[1,1]">
                <div slot="name">合同编号</div>
                <div slot="content">{{ changeBaseInfo.contractNumber }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">合同名称</div>
                <div slot="content">{{ changeBaseInfo.contractName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">项目编号</div>
                <div slot="content">{{ changeBaseInfo.projectNumber }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">商业模式</div>
                <div slot="content">{{ changeBaseInfo.leaseChannel }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">业务类型</div>
                <div slot="content">{{ changeBaseInfo.businessTypeName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">产品线</div>
                <div slot="content">{{ changeBaseInfo.divisionName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">承租人名称</div>
                <div slot="content">{{ changeBaseInfo.bpName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">合同状态</div>
                <div slot="content">{{ changeBaseInfo.contractStatusN }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">起租日期</div>
                <div slot="content">{{ changeBaseInfo.inceptionOfLease }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">项目经理</div>
                <div slot="content">{{ changeBaseInfo.employeeName }}</div>
              </item>
            </section>
          </list-item>
        </van-collapse-item>
        <van-collapse-item title="变更信息" name="2">
          <list-item>
            <section>
              <DateField
                :proportion="[1,1]"
                v-model="changeInfo.changeReqDate" label="终止日期" required placeholder="选择终止日期" />
              <h-field
                v-model="changeInfo.description"
                :proportion="[1,1]"
                :autosize="true"
                :word-limit="true"
                label="终止原因" type="textarea" maxlength="100"
                inputAlign="left"
                clearable error
                required
                class="reason"
                placeholder="请输入终止原因"
              />
            </section>
          </list-item>
        </van-collapse-item>
      </van-collapse>
    </scroll>
    <bottom-tab class="btn">
      <h-button @click.native="submit">提交申请</h-button>
      <h-button @click.native="cancel">取消</h-button>
      <h-button @click.native="save">保存</h-button>
    </bottom-tab>
  </h-view>
</template>
<script>
export default {
  data () {
    return {
      activeName: '2',
      tenantId: window.localStorage.getItem('tenantId'),
      changeBaseInfo: '',
      changeInfo: '',
      changeReqId: this.$route.params.changeReqId,
      contractId: this.$route.params.contractId,
    }
  },
  created () {
    this.queryInfo()
  },
  methods: {
    queryInfo () {
      var vm = this
      var p1 = vm.hlsHttp.get($config.basePath + `hlct/v1/${this.tenantId}/contracts?page=0&size=10&changeReqId=${this.changeReqId}&layoutCode=CONT002F11&contractId=${this.contractId}`)
      var p2 = vm.hlsHttp.get($config.basePath + `hlct/v1/${this.tenantId}/contract-change-reqs?page=0&size=10&changeReqId=${this.changeReqId}&layoutCode=CONT002F11`)
      Promise.all([p1, p2]).then(res => {
        vm.hlsPopup.hideLoading()
        console.log(res)
        this.changeBaseInfo = res[0].content[0]
        this.changeInfo = res[1].content[0]
      })
    },
    // 保存  http://devapi.leafhzero.hand-china.com/hlct/v1/0/contract-change-reqs/update
    save () {
      var vm = this
      const params = {
        changeReqDate: vm.changeInfo.changeReqDate,
        description: vm.changeInfo.description,
        changeReqId: vm.changeInfo.changeReqId,
      }
      vm.hlsHttp.post($config.basePath + `hlct/v1/${this.tenantId}/contract-change-reqs/update`, params)
      vm.hlsPopup.showSuccess('操作成功')
      vm.$router.push('/')
    },
    // 取消变更申请
    // http://devapi.leafhzero.hand-china.com/hlct/v1/0/contract-change-reqs/cancel
    cancel () {
      var vm = this
      const params =  {
        user_id: '30734',
        changeReqId: this.changeInfo.changeReqId,
      }
      debugger
      vm.hlsHttp.post($config.basePath + `hlct/v1/${this.tenantId}/contract-change-reqs/cancel`, params)
      vm.hlsPopup.showSuccess('操作成功')
    },
    // 提交审批
    //  http://devapi.leafhzero.hand-china.com/hlct/v1/0/contract-change-reqs/submit
    submit () {
      this.save()
      var vm = this
      const params = {
        user_id: '30734',
        changeReqId: this.changeInfo.changeReqId,
      }
      vm.hlsHttp.post($config.basePath + `hlct/v1/${this.tenantId}/contract-change-reqs/submit`, params)
      vm.hlsPopup.showSuccess('操作成功')
    },
  },
}
</script>
<style lang="less" scoped type='text/less'>
</style>
