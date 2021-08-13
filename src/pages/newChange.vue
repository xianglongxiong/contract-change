<!--
 * @Author: your name
 * @Date: 2021-08-10 19:39:21
 * @LastEditTime: 2021-08-11 17:22:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hls-contract-change\src\pages\newChange.vue
-->
<template>
  <h-view id="detail-info" class="public-style" title="合同变更创建">
    <h-header>
      <div slot="left" class="h-header-btn" @click="$routeGo(-1)">
        <i class="ion-ios-arrow-back"/>
      </div>
      <div slot="center"><b>合同变更创建</b></div>
    </h-header>
    <h-content>
      <!-- 基本信息 -->
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
                <van-radio v-for="(item, key ) in changeTypeList" :value="item.value" :key="key" :name="item.orderSeq" shape="square">{{ item.meaning }}</van-radio>
              </van-radio-group>

              <h-select
                :dataArray="pricePro"
                :proportion="[1,1]" v-model="quotationNumber"
                label="报价编号"
                required
                value-key="quotationId" value-name="quotationNumber"
              />
              <DateField
                :proportion="[1,1]"
                v-model="changeReqDate" label="变更日期" required placeholder="选择变更日" />
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
    </h-content>

  </h-view>
</template>
<script>
