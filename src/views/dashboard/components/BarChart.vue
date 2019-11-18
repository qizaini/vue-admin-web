<template>
  <div style="height:700px" ref="chart"></div>
</template>

<script>

/* eslint-disable */
var json = [
  {
    "provinceName": "广西",
    "provinceTotal": 100,
    "running": 50,
    "warning": 30,
    "shutdown": -20,
    "citys": [
      {
        "cityName": "南宁",
        "txId": "123456789",
        "total": 50,
        "running": 30,
        "warning": 15,
        "shutdown": 5
      },
      {
        "cityName": "玉林",
        "txId": "0007",
        "total": 20,
        "running": 10,
        "warning": 5,
        "shutdown": 5
      },
      {
        "cityName": "柳州",
        "txId": "0008",
        "total": 30,
        "running": 10,
        "warning": 10,
        "shutdown": 10
      }
    ]
  },
  {
    "provinceName": "北京",
    "provinceTotal": 36,
    "running": 30,
    "warning": 0,
    "shutdown": -6,
    "citys": [
      {
        "cityName": "朝阳",
        "txId": "0009",
        "total": 10,
        "running": 20,
        "warning": 0,
        "shutdown": 6
      },
      {
        "cityName": "海淀",
        "txId": "0010",
        "total": 5,
        "running": 20,
        "warning": 0,
        "shutdown": 0
      },
      {
        "cityName": "西域",
        "txId": "0011",
        "total": 15,
        "running": 10,
        "warning": 0,
        "shutdown": 0
      }
    ]
  },
  {
    "provinceName": "湖南",
    "provinceTotal": 50,
    "running": 50,
    "warning": 0,
    "shutdown": 0,
    "citys": [
      {
        "cityName": "长沙",
        "txId": "0009",
        "total": 20,
        "running": 20,
        "warning": 0,
        "shutdown": 0
      },
      {
        "cityName": "株洲",
        "txId": "0010",
        "total": 20,
        "running": 20,
        "warning": 0,
        "shutdown": 0
      },
      {
        "cityName": "湘潭",
        "txId": "0011",
        "total": 10,
        "running": 10,
        "warning": 0,
        "shutdown": 0
      }
    ]
  }
]

var provinceName_arr = []
var shutdown_arr = []
var running_arr = []
for (let i in json){
  var provinceName = json[i].provinceName
  var provinceTotal = json[i].provinceTotal
  var running = json[i].running
  var shutdown = json[i].shutdown
  provinceName_arr.push({name:provinceName, value:provinceName})
  shutdown_arr.push({name:shutdown, value:shutdown})
  running_arr.push({name:running, value:running})
}

export default {

  mounted () {
    this.initCharts();
  },

  methods: {
    initCharts () {
      let myChart = this.$echarts.init(this.$refs.chart);
      // console.log(this.$refs.chart)
      var xAxisData = provinceName_arr
      var data1 = running_arr;
      var data2 = shutdown_arr;

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
        tooltip: {
          formatter:function(value) {
            if (value.data.name < 0) {
                return '停止运行的激励器：' + -value.data.name;
            }else {
                return '正在运行的激励器：' + value.data.name;
            }
          }
        },
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
          splitArea: {show: false},
          axisLabel:{   //Y轴数据
            formatter:function(value){
              return Math.abs(value);   //负数取绝对值变正数
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
            data: data2
          },
          {
            name: '正在运行的激励器',
            type: 'bar',
            color: '#36a3f7',
            stack: 'one',
            itemStyle: itemStyle,
            barWidth: 50,
            data: data1
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
