<template>
  <div class="dashboard-container">

    <!-- 地图显示 -->
    <div class="chart-wrapper">
      <cn-map-chart />
    </div>

    <!-- 资源中心总体显示卡片 -->
    <panel-group @handleSetBarChartData="handleSetBarChartData" />

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="12">
        &lt;!&ndash;资源中心曲线图&ndash;&gt;
        <div class="chart-wrapper" id="lineMain">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper" style="padding-top: 55px">
          <bar-chart :chart-data="lineChartData" />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="24">
        <div style="height:700px" ref="chart"></div>
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
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetBarChartData(type) {
      this.lineChartData = lineChartData[type]
    },

    initCharts () {
      let myChart = this.$echarts.init(this.$refs.chart);
      console.log(this.$refs.chart)
      var xAxisData = [];
      var data1 = [];
      var data2 = [];
      var data3 = [];
      var data4 = [];

      for (var i = 0; i < 10; i++) {
        xAxisData.push('Class' + i);
        data1.push((Math.random() * 2).toFixed(2));
        data2.push(-Math.random().toFixed(2));
        data3.push((Math.random() * 5).toFixed(2));
        data4.push((Math.random() + 0.3).toFixed(2));
      }

      var itemStyle = {
        normal: {
        },
        emphasis: {
          barBorderWidth: 1,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      };

      // 绘制图表
      myChart.setOption({
        legend: {
          data: ['正在运行的激励器', '停止运行的激励器'],
          align: 'left',
          left: 10
        },
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {}
          }
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: 'X Axis',
          silent: false,
          axisLine: {onZero: true},
          splitLine: {show: false},
          splitArea: {show: false}
        },
        yAxis: {
          inverse: true,
          splitArea: {show: false}
        },
        grid: {
          left: 100
        },
        visualMap: {
          type: 'continuous',
          dimension: 1,
          text: ['High', 'Low'],
          inverse: true,
          itemHeight: 200,
          calculable: true,
          min: -2,
          max: 6,
          top: 60,
          left: 10,
          inRange: {
            colorLightness: [0.4, 0.8]
          },
          outOfRange: {
            color: '#bbb'
          },
          controller: {
            inRange: {
              color: '#2f4554'
            }
          }
        },
        series: [
          {
            name: '正在运行的激励器',
            type: 'bar',
            color: '#ffcb8c',
            stack: 'one',
            itemStyle: itemStyle,
            data: data1
          },
          {
            name: '停止运行的激励器',
            type: 'bar',
            color: '#32dadd',
            stack: 'one',
            itemStyle: itemStyle,
            data: data2
          }
        ]
      });
      myChart.on('brushSelected', renderBrushed);

      function renderBrushed(params) {
        var brushed = [];
        var brushComponent = params.batch[0];

        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          var rawIndices = brushComponent.selected[sIdx].dataIndex;
          brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
        }

        myChart.setOption({
          title: {
            backgroundColor: '#333',
            text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
            bottom: 0,
            right: 0,
            width: 100,
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          }
        });
      }
    },

  },

  mounted () {
    this.initCharts();
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
