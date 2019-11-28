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
        <div class="chart-wrapper" id="lineMain" style="padding-top: 55px">
          <!-- <bar-chart :chart-data="barChartData" />-->
          <div style="height:700px" ref="chart" :chart-data="barChartData"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <!--激励器省份总数-->
      <el-col :xs="24" :sm="24" :lg="8">
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
import LineChart from './components/LineChart'
import CnMapChart from './components/CnMapChart'
import PieChart from './components/PieChart'
import RaddarChart from './components/RaddarChart'
import BoxCard from './components/BoxCard'

import { fetchMap } from '@/api/article'

var provinceData = []

function initBarChat() {
  return fetchMap().then(response => {
    provinceData = response.data
  })
}

export default {
  name: 'Dashboard',

  components: {
    CnMapChart,
    PanelGroup,
    LineChart,
    PieChart,
    RaddarChart,
    BoxCard
  },

  data() {
    return {
      type: '',
      provinceData: [],
      xAxisData: [],
      running: [],
      warning: [],
      shutdown: [],
      breakdown: [],
      backup: [],
      updating: []
    }
  },
  async mounted () {
    await initBarChat()
    this.initCharts()
  },
  methods: {
    handleSetBarChartData(type) {
      this.type = type
      this.initCharts();
    },
    //初始化上下柱状图
    initCharts () {
      let myChart = this.$echarts.init(this.$refs.chart);
      //显示柱状图省份状态的数量
      for (let i = 0; i < provinceData.length; i++) {
        let province = provinceData[i]
        // 省份名称
        let xAxisData = province.provinceName
        // 省份关机总数
        let shutdown = province.shutdown
        // 省份故障总数
        let warning = province.warning
        // 省份运行总数
        let running = province.running
        // 省份停止总数
        let breakdown = province.breakdown
        // 省份备用总数
        let backup = province.backup
        // 省份升级总数
        let updating = province.updating
        this.xAxisData = []
        this.breakdown = []
        this.shutdown = []
        this.backup = []
        this.updating = []
        this.xAxisData.push({name: xAxisData, value: xAxisData})
        this.warning.push({name:warning, value:warning})
        //value:(-(xxx)) 把正数变为负数
        this.running.push({name:running, value:-(running)})
        if (this.type === 'running') {
          this.xAxisData = []
          this.breakdown = []
          this.shutdown = []
          this.backup = []
          this.updating = []
          this.xAxisData.push({name: xAxisData, value: xAxisData})
          this.warning.push({name:warning, value:warning})
          this.running.push({name:running, value:-(running)})
        }
        if (this.type === 'breakdown') {
          this.xAxisData = []
          this.running = []
          this.warning = []
          this.backup = []
          this.updating = []
          this.xAxisData.push({name: xAxisData, value: xAxisData})
          this.breakdown.push({name:breakdown, value:breakdown})
          this.shutdown.push({name:shutdown, value:-(shutdown)})
        }
        if (this.type === 'backup') {
          this.xAxisData = []
          this.running = []
          this.warning = []
          this.shutdown = []
          this.breakdown = []
          this.xAxisData.push({name: xAxisData, value: xAxisData})
          this.updating.push({name:updating, value:updating})
          this.backup.push({name:backup, value:-(backup)})
        }
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
          data: ['正在运行的激励器', '发生故障的激励器', '已经关机的激励器', '停止运行的激励器',  '正在备份的激励器', '正在升级的激励器'],
          align: 'left',
          left: 10
        },
        tooltip: {
          formatter:function(value) {
            if (value.seriesName === '正在运行的激励器'){
              return '正在运行的激励器：' + value.data.name;
            }
            if (value.seriesName === '发生故障的激励器'){
              return '发生故障的激励器：' + value.data.name;
            }
            if (value.seriesName === '已经关机的激励器'){
              return '已经关机的激励器：' + value.data.name;
            }
            if (value.seriesName === '停止运行的激励器'){
              return '停止运行的激励器：' + value.data.name;
            }
            if (value.seriesName === '正在备份的激励器'){
              return '正在备份的激励器：' + value.data.name;
            }
            if (value.seriesName === '正在升级的激励器'){
              return '正在升级的激励器：' + value.data.name;
            }
          }
        },
        xAxis: {
          data: this.xAxisData,
          name: '',
          silent: false,
          axisLine: {onZero: true},
          splitLine: {show: false},
          splitArea: {show: false}
        },
        yAxis: {
          inverse: true,
          splitArea: {show: false},
          axisLabel:{   //Y轴数据
            formatter:function(value){
              //负数取绝对值变正数
              return Math.abs(value);
              // if (value<0) {  //另一写法
              //     return -value;
              //           }else {
              //     return value;
              // }
            },
            textStyle: {   //Y轴数据字体设置
              color: '#666'
            }
          },
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
          min: 0,
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
            color: '#36a3f7',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.running
          },
          {
            name: '发生故障的激励器',
            type: 'bar',
            color: '#f4516c',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.warning
          },
          {
            name: '已经关机的激励器',
            type: 'bar',
            color: '#36a3f7',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.shutdown
          },
          {
            name: '停止运行的激励器',
            type: 'bar',
            color: '#f4516c',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.breakdown
          },
          {
            name: '正在备份的激励器',
            type: 'bar',
            color: '#36a3f7',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.backup
          },
          {
            name: '正在升级的激励器',
            type: 'bar',
            color: '#f4516c',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.updating
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
