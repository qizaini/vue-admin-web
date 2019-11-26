<template>
  <div style="height:700px" ref="chart"></div>
</template>

<script>
/* eslint-disable */
import { fetchMap } from '@/api/article'

var provinceData = []

function initBarChat() {
  return fetchMap().then(response => {
    provinceData = response.data
  })
}

export default {
  data() {
    return {
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
    this.initCharts();
  },

  methods: {
    initCharts () {
      let myChart = this.$echarts.init(this.$refs.chart);
      //显示柱状图省份正在运行和停止运行的数量
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
        this.xAxisData.push({name: xAxisData, value: xAxisData})
        this.running.push({name:running, value:running})
        this.shutdown.push({name:shutdown, value:shutdown})
        this.backup.push({name:backup, value:backup})
        //value:(-(xxx)) 把正数变为负数
        this.warning.push({name:warning, value:-(warning)})
        this.breakdown.push({name:breakdown, value:-(breakdown)})
        this.updating.push({name:updating, value:-(updating)})
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
          data: ['已经关机的激励器','停止运行的激励器', '正在运行的激励器', '发生故障的激励器',  '正在备份的激励器', '正在升级的激励器'],
          align: 'left',
          left: 10
        },
        tooltip: {
          formatter:function(value) {
            //负数改为正数
            if (value.data.value < 0) {
                return '发生故障的激励器：' + value.data.name;
            }else {
                return '正在运行的激励器：' + value.data.name;
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
            name: '停止运行的激励器',
            type: 'bar',
            color: '#f4516c',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.breakdown
          },
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
            color: '#627380',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.warning
          },
          {
            name: '已经关机的激励器',
            type: 'bar',
            color: '#f4516c',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.shutdown
          },
          {
            name: '正在备份的激励器',
            type: 'bar',
            color: '#E6A23C',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: this.backup
          },
          {
            name: '正在升级的激励器',
            type: 'bar',
            color: '#E6A23C',
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

}
</script>
