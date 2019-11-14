<template>
  <div style="height:700px" ref="chart"></div>
</template>

<script>

/* eslint-disable */
export default {
  methods: {
    initCharts () {
      let myChart = this.$echarts.init(this.$refs.chart);
      // console.log(this.$refs.chart)
      var xAxisData = ['南宁', '柳州', '北海', '桂林', '崇左', '百色', '钦州','南宁', '柳州', '北海', '桂林', '崇左', '百色', '钦州'];
      var data1 = [];
      var data2 = [];

      for (var i = 1; i <= 15; i++) {
        data1.push((Math.random() * 2).toFixed(2));
        data2.push(-Math.random().toFixed(2));
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
            name: '停止运行的激励器',
            type: 'bar',
            color: '#ffcb8c',
            stack: 'one',
            itemStyle: itemStyle,
            data: data1
          },
          {
            name: '正在运行的激励器',
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

}
</script>
