<template>
  <div>

    <div class="content-monitoring">
      <div class="content-bottom">
        <img src="../../img/solution-freeTrial-2.png" />
        <h1>物联网节点监控</h1>
        <span>无线传感器网络</span><br><br>
        <span>实现主从节点之间的数据采集与传输</span>
      </div>
    </div>

    <div class="div-monitoring-top">
      <div class="monitoring-left">
        <h2>方案介绍</h2>
        <span>
          而库区内部的所有要素，包括人员、叉车、货物、托盘等都需要佩戴UWB定位标签，
          所有的定位数据都回被输送到定位引擎通过外部接口提供给WMS仓储管理系统进行进一步整合。
        </span>
      </div>
      <div class="monitoring-right">
        <img src="../../img/carouselMap3.png" height="150"/>
      </div>
    </div>

    <div class="div-monitoring-center">
      <div class="monitoring-left">
        <h2>方案介绍</h2>
        <span>
          而库区内部的所有要素，包括人员、叉车、货物、托盘等都需要佩戴UWB定位标签，
          所有的定位数据都回被输送到定位引擎通过外部接口提供给WMS仓储管理系统进行进一步整合。
        </span>
      </div>
      <div class="monitoring-right">
        <img src="../../img/carouselMap2.png" height="150"/>
      </div>
    </div>

    <div class="div-monitoring-bottom">
      <div class="monitoring-left">
        <h2>方案介绍</h2>
        <span>
          而库区内部的所有要素，包括人员、叉车、货物、托盘等都需要佩戴UWB定位标签，
          所有的定位数据都回被输送到定位引擎通过外部接口提供给WMS仓储管理系统进行进一步整合。
        </span>
      </div>
      <div class="monitoring-right">
        <img src="../../img/carouselMap5.png" height="150"/>
      </div>
    </div>

    <h3>
      正在开发中。。。
      <img src="../../icons/svg/Delivery.png" /><br/>
      敬请期待！
      <img src="../../icons/svg/goodNews.png" />
    </h3>

  </div>

</template>

<script>
/* eslint-disable */
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        this.$message('submit!')
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      }
    }
  }
</script>

<style src="../../product/monitoring.css"></style>

