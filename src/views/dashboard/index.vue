<template>
  <div class="dashboard-container">

    <!-- 地图显示 -->
    <div class="chart-wrapper">
      <cn-map-chart />
    </div>

    <!-- 资源中心总体显示卡片 -->
    <panel-group @handleSetBarChartData="handleSetBarChartData" />

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="24">
        &lt;!&ndash;资源中心曲线图&ndash;&gt;
        <div class="chart-wrapper" id="lineMain">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper" style="padding-top: 55px">
          <bar-chart :chart-data="lineChartData" />
        </div>
      </el-col>

    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="9">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="chart-wrapper">
          <box-card />
        </div>
      </el-col>
    </el-row>

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--<line-chart :chart-data="lineChartData" />-->
    <!--</el-row>-->

  </div>

</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import CnMapChart from './components/CnMapChart'
import PieChart from './components/PieChart'
import RaddarChart from './components/RaddarChart'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    txData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    txData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    txData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    txData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Dashboard',

  components: {
    CnMapChart,
    PanelGroup,
    BarChart,
    LineChart,
    PieChart,
    RaddarChart,
    BoxCard
  },

  data() {
    return {
      lineChartData: lineChartData.newVisitis,
    }
  },
  methods: {
    handleSetBarChartData(type) {
      this.lineChartData = lineChartData[type]
    },
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

/*以下为自定义布局样式*/

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}

</style>
