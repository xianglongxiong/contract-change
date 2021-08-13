<!--
 * @Author: your name
 * @Date: 2021-08-09 18:50:15
 * @LastEditTime: 2021-08-13 20:01:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hls-contract-change\src\pages\home.vue
-->
<template>
  <h-view class="home public-style" title="合同变更" >
    <h-header>
      <div slot="left" class="h-header-btn">
        <i class="ion-ios-arrow-back"/>
      </div>
      <div slot="center">合同变更</div>
      <div slot="right" class="h-header-btn" @click="showAddPopup()">
        <i class="icon ion-plus-round"/>
      </div>
    </h-header>
    <s-tab :show-divider="true" v-model="showListName" @tabClick="tabClick">
      <tab-item>待创建合同清单</tab-item>
      <tab-item>已创建变更申请</tab-item>
    </s-tab>
    <div>
      <img v-if="topFlag" src="@/assets/image/return.png" class="to-top" @click="scrollToTop">
    </div>
    <scroll
      v-if="showListName===0"
      ref="scroll" :updateData="[contractList]" :pullUp="true" :listenScroll="true"
      :probeType="2" :pullUpConfig="{txt: {more: '上拉加载', noMore: '— 没有更多数据 —'}}" class="scroll"
      @pullingUp="loadMore">
      <div v-for="(item,index) in contractList" ref="contractItem" :key="index" class="list">
        <div class="title vue-1px-b">
          <div class="title-code"><b>{{ item.contractNumber }}</b></div>
          <div :class="item.contractStatus" class="title-state"><b class="span" >{{ item.contractStatusN }}</b></div>
        </div>
        <div class="item">
          <div v-if="showRadio" class="select">
            <van-radio-group v-model="contractId">
              <van-radio :name="item.contractId" icon-size="20px" />
            </van-radio-group>
          </div>
          <div class="leftimg">
            <img src="@/assets/image/user.png" alt="user">
          </div>
          <div class="center">
            <div class="name"><span>合同名称:</span> <span>{{ item.contractName }}</span></div>
            <div class="name"><span>项目编号:</span>   <span>{{ item.projectNumber }}</span></div>
            <div class="name"><span>合同创建时间:</span> <span>{{ item.creationDate | date('yyyy-MM-dd') }}</span></div>
          </div>
        </div>
      </div>
    </scroll>

    <div>
      <img v-if="topFlag" src="@/assets/image/return.png" class="to-top" @click="scrollToTop">
    </div>
    <scroll
      v-if="showListName===1"
      ref="scroll2" :updateData="[applyList]" :pullUp="true" :listenScroll="true"
      :probeType="2" :pullUpConfig="{txt: {more: '上拉加载', noMore: '— 没有更多数据 —'}}" class="scroll"
      @pullingUp="loadMoreChange">
      <div v-for="(item,index) in applyList" :key="index" class="list" @click="goDetail(item)">
        <div class="title vue-1px-b">
          <div class="title-code"><b>{{ item.changeReqNumber }}</b></div>
          <div :class="item.contractStatus" class="title-state"><b class="span" >{{ item.status }}</b></div>
        </div>
        <div class="item">
          <div class="leftimg">
            <img src="@/assets/image/user.png" alt="user">
          </div>
          <div class="center">
            <div class="name"><span>变更类型:</span> <span>{{ item.changeType }}</span></div>
            <div class="name"><span>合同名称:</span>   <span>{{ item.contractName }}</span></div>
            <div class="name"><span>合同创建时间:</span> <span>{{ item.changeReqDate | date('yyyy-MM-dd') }}</span></div>
          </div>
        </div>
      </div>
    </scroll>
    <van-popup
      v-model="addPopup"
      :close-on-click-overlay="false"
      position="bottom"
      round
      safe-area-inset-bottom
    >
      <h-header>
        <div slot="center">
          创建融资合同
        </div>
      </h-header>
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item title="基本信息" name="1">
          <list-item>
            <section>
              <item :proportion="[1,1]">
                <div slot="name">合同编号</div>
                <div slot="content">{{ baseInfo.contractNumber }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">合同名称</div>
                <div slot="content">{{ baseInfo.contractName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">项目编号</div>
                <div slot="content">{{ baseInfo.projectNumber }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">合同类型</div>
                <div slot="content">{{ baseInfo.documentCategoryDesc }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">业务模式</div>
                <div slot="content">{{ baseInfo.businessTypeName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">产品线</div>
                <div slot="content">{{ baseInfo.divisionName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">承租人编号</div>
                <div slot="content">{{ baseInfo.bpCode | currency }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">承租人名称</div>
                <div slot="content">{{ baseInfo.bpName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">合同状态</div>
                <div slot="content">{{ baseInfo.contractStatusN }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">起租日期</div>
                <div slot="content">{{ baseInfo.inceptionOfLease }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">项目经理</div>
                <div slot="content">{{ baseInfo.employeeName }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">租赁物总价款</div>
                <div slot="content">{{ baseInfo.leaseItemAmount }}</div>
              </item>
              <item :proportion="[1,1]">
                <div slot="name">融资金额</div>
                <div slot="content">{{ baseInfo.financeAmount }}</div>
              </item>
            </section>
          </list-item>
        </van-collapse-item>
        <!-- 变更信息 -->
        <van-collapse-item title="变更信息" name="2">
          <list-item>
            <section>
              <van-radio-group v-model="changeType" direction="horizontal">
                <van-radio
                  v-for="(item, key ) in array" :value="item.value" :key="key" :name="item.value"
                  shape="square" >{{ item.meaning }}</van-radio>
              </van-radio-group>

              <h-select
                :dataArray="pricePro"
                :proportion="[1,1]" v-model="quotationNumber"
                :disabled="selectQuotation"
                label="报价编号"
                required value-key="quotationId"
                value-name="quotationNumber"
              />
              <DateField
                :proportion="[1,1]"
                v-model="changeReqDate" format label="变更日期" required
                placeholder="选择变更日" />
              <h-field
                v-model="description"
                :proportion="[1,1]"
                :autosize="true"
                :word-limit="true"
                label="变更原因" type="textarea" maxlength="100"
                inputAlign="left"
                clearable error
                required
                class="reason"
                placeholder="请输入变更原因"
              />
            </section>
          </list-item>
        </van-collapse-item>
      </van-collapse>
      <bottom-tab class="btn">
        <h-button @click.native="cancel">取消</h-button>
        <h-button @click.native="save">下一步</h-button>
      </bottom-tab>
    </van-popup>
  </h-view>
</template>
<script>
export default {
  data () {
    return {
      showListName: 0,
      showRadio: true,
      contractList: [],
      applyList: [],
      array: [],
      selectQuotation: true,
      page: 0,
      applypage: 0,
      pageSize: 10,
      topFlag: false,
      addPopup: false,
      tenantId: window.localStorage.getItem('tenantId'),
      baseInfo: {},
      activeName: '2',
      changeTypeList: [],
      pricePro: [],
      changeType: '',
      changeReqDate: '',
      description: '',
      quotationId: '',
      quotationNumber: '',
      contractId: '',
    }
  },
  created () {
    this.loadRefresh()
    this.queryPricePro()
    this.queryChangeList()
  },
  activated () {
    this.loadRefresh()
  },
  methods: {
    tabClick (index) {
      this.showListName = index
    },
    scrollToTop () {
      this.$refs.scroll.scrollTo(0, 0)
    },
    scroll (position) {
      if (position && position.y < 0) {
        this.topFlag = true
      } else {
        this.topFlag = false
      }
    },
    /* 初始化更新
    */
    loadRefresh () {
      this.queryContract().then(data => {
        this.contractList = data
      })
      this.changeApply().then(data => {
        this.applyList = data
      })
    },
    /*  合同下拉更新
    */
    loadMore () {
      const vm = this
      this.page++
      this.queryContract().then(data => {
        // 判断是否已达最后一页
        vm.contractList.push(...data)
        if (data.length < vm.pageSize) {
          // 如果没有新数据，不用强制更新滚轮
          vm.$refs.scroll.update(true)
        }
      })
    },
    /*  申请下拉更新
    */
    loadMoreChange () {
      const vm = this
      this.applypage++
      this.changeApply().then(data => {
        // 判断是否已达最后一页
        vm.applyList.push(...data)
        if (data.length < vm.pageSize) {
          // 如果没有新数据，不用强制更新滚轮
          vm.$refs.scroll2.update(true)
        }
      })
    },
    /*
    *   变更申请创建
    */
    showAddPopup () {
      const vm = this
      vm.showListName = 0
      vm.showRadio = true
      if (vm.contractId) {
        vm.addPopup = true
        this.queryContract_id().then(data => {
          vm.baseInfo = data[0]
        })
      } else {
        vm.hlsPopup.showError('请先选中一条数据')
      }
      vm.array = vm.changeTypeList
      if (vm.baseInfo.contractStatus === 'SIGN') {
        vm.array = vm.changeTypeList.splice(0, 1)
      } else {
        vm.array = vm.changeTypeList.splice(1, 6)
      }
      if (vm.changeType === 'EARLY_TERMINATION' || vm.changeType === 'TENANT' || vm.changeType === 'LEASE_ITEM') {
        this.selectQuotation = false
      }
    },
    /**
     * 待创建合同查询
     */
    // financial-contracts?page=${vm.page}&size=10${vm.searchValue ? '&financialContractName=' + vm.searchValue : ''}`
    // http://devapi.leafhzero.hand-china.com/hlct/v1/0/contracts/queryListForChange?page=0&size=10&layoutCode=CONT002
    queryContract () {
      const vm = this
      vm.hlsPopup.showLoading()
      return new Promise((resolve, reject) => {
        vm.hlsHttp.get($config.basePath + `hlct/v1/${vm.tenantId}/contracts/queryListForChange?page=${vm.page}&size=10&layoutCode=CONT002`)
          .then(res => {
            vm.hlsPopup.hideLoading()
            if (res && res.content) {
              resolve(res.content)
            } else {
              resolve([])
            }
          }).catch(err => {
            vm.hlsPopup.showError(err.message)
          })
      })
    },
    /**
     * 变更申请查询  /contract-change-reqs?page=0&size=10&layoutCode=CONT002
   */
    changeApply () {
      const vm = this
      vm.hlsPopup.showLoading()
      return new Promise((resolve, reject) => {
        vm.hlsHttp.get($config.basePath + `hlct/v1/${vm.tenantId}/contract-change-reqs?page=${vm.applypage}&size=10&layoutCode=CONT002`)
          .then(res => {
            vm.hlsPopup.hideLoading()
            if (res && res.content) {
              resolve(res.content)
            } else {
              resolve([])
            }
          }).catch(err => {
            vm.hlsPopup.showError(err.message)
          })
      })
    },
    // 根据id 查询基本信息  hlct/v1/0/contracts/queryListForChange?contractId=150
    queryContract_id () {
      const vm = this
      vm.hlsPopup.showLoading()
      return new Promise((resolve, reject) => {
        vm.hlsHttp.get($config.basePath + `hlct/v1/${this.tenantId}/contracts/queryListForChange?contractId=${this.contractId}`)
          .then(res => {
            vm.hlsPopup.hideLoading()
            if (res && res.content) {
              resolve(res.content)
            } else {
              resolve([])
            }
          }).catch(err => {
            vm.hlsPopup.showError(err.message)
          })
      })
    },
    //  查询变更类型列表  http://devapi.leafhzero.hand-china.com/hpfm/v1/0/lovs/data?lovCode=HLCT.CONTRACT_CHANGE_TYPE
    queryChangeList () {
      const vm = this
      vm.hlsPopup.showLoading()
      vm.hlsHttp.get($config.basePath + 'hpfm/v1/0/lovs/data?lovCode=HLCT.CONTRACT_CHANGE_TYPE').then(res => {
        vm.hlsPopup.hideLoading()
        if (res.length > 0) {
          vm.changeTypeList = res
        }
      }).catch(err => {
        vm.hlsPopup.showError(err.message)
      })
    },
    //  查询报价编号 contract-quotations?page=0&size=10&sourceDocumentId=150&enabledFlag=1
    // http://devapi.leafhzero.hand-china.com/hlct/v1/0/contract-quotations?page=0&size=10&sourceDocumentId=150&enabledFlag=1
    queryPricePro () {
      const vm = this
      vm.hlsPopup.showLoading()
      // eslint-disable-next-line no-template-curly-in-string
      vm.hlsHttp.get($config.basePath + 'hlct/v1/0/contract-quotations?page=0&size=10&sourceDocumentId=150&enabledFlag=1').then(res => {
        vm.hlsPopup.hideLoading()
        if (res.totalElements > 0) {
          vm.pricePro = res.content
          console.log(res.content[0])
        }
      }).catch(err => {
        vm.hlsPopup.showError(err.message)
      })
    },
    goDetail (item) {
      const vm = this
      if (this.changeType === 'EARLY_TERMINATION' || item.changeType === 'EARLY_TERMINATION') {
        vm.$router.push({
          name: 'EarlyEnd',
          params: item,
        })
      }
    },
    cancel () {
      this.addPopup = false
      this.array = this.changeTypeList
    },
    save () {
      const vm = this
      if (!this.changeType) {
        vm.hlsPopup.showError('变更类型必填')
      } else if (!this.changeReqDate) {
        vm.hlsPopup.showError('变更日期必填')
      } else if (!this.description) {
        vm.hlsPopup.showError('变更原因必填')
      } else if (!this.quotationNumber) {
        vm.hlsPopup.showError('报价编号必填')
      } else {
        const param = {
          'changeReqDate': this.changeReqDate + ` 00:00:00`,
          'description': this.description,
          'changeType': this.changeType,
          'contractId': this.baseInfo.contractId,
          'sourceContractStatus': this.baseInfo.contractStatus,
          'quotationId': this.quotationNumber,
          'quotationNumber': this.baseInfo.quotationNumber,
          '_status': 'create',
        }
        return new Promise((resolve, reject) => {
          vm.hlsPopup.showLoading()
          vm.hlsHttp.post($config.basePath + `hlct/v1/${this.tenantId}/contract-change-reqs`, param)
            .then(res => {
              vm.hlsPopup.hideLoading()
              if (res.response && res.response.data) {
                vm.hlsPopup.showError(res.message || '保存失败')
              } else if (res.failed) {
                vm.hlsPopup.showError(res.message || '保存失败')
              } else {
                vm.hlsPopup.showSuccess('执行成功')
                vm.goDetail(res)
                vm.addPopup = false
                // 保存执行后会返回reqchanageId,根据reqchangeId查询数据
              }
            }).catch(err => {
              vm.hlsPopup.hideLoading()
              vm.hlsPopup.showError(err.message)
            })
        })
      }
    },
  },
}
</script>
<style lang="less"  type="text/less">
  .home {
    .van-overlay{
      z-index: 99 !important ;
     }
    .van-popup{
       padding-bottom: 20%;
       z-index: 100 !important;
       .reason{
               .field-value{
                 flex: 4 1 0% !important;
               }
           }
    }
    .content{
      .to-top {
        position: fixed;
        z-index: 10;
        width: 30px;
        bottom: 10px;
        right: 20px;
        border-radius:15px;
        background: @theme-color;
      }
      .title{
        display: flex;
        justify-content: space-between;
        line-height: 18px;
        padding: 8px 15px;
      }
      .item{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        font-size: 14px;
        height: auto;
        .leftimg{
          flex: 2;
        }
        .select{
          flex: 1;
        }
        .center{
          flex: 6;
          padding-right: 15px;
          >div{
            margin: 8px 0;
          }
        }
      }
    }
  }
  // iPhoneX适配
  @media (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio: 3) {
    .platform-ios {
      .home{
      }
    }
  }

  // iPhoneX Max适配
  @media (device-width: 414px) and (device-height: 896px) {
    .platform-ios {
      .platform-ios {
        .home{
        }
      }
    }
  }
</style>
