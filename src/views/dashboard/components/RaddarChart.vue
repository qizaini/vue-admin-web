<template>
  <!--柱状图：数据的动态更新-->
  <div style="height:400px" ref="chart"></div>
</template>

<script>
/* eslint-disable */
// 所有数据的更新都通过 setOption实现，你只需要定时获取数据，setOption 填入数据，
// 而不用考虑数据到底产生了那些变化，ECharts 会找到两组数据之间的差异然后通过合适的动画去表现数据的变化。
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

var base = +new Date(2014, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 150];
var now = new Date(base);

export default {

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      let myChart = this.$echarts.init(this.$refs.chart);

      function addData(shift) {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
        date.push(now);
        data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);
        if (shift) {
          date.shift();
          data.shift();
        }
        now = new Date(+new Date(now) + oneDay);
      }
      for (var i = 1; i < 100; i++) {
        addData();
      }

      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          boundaryGap: [0, '50%'],
          type: 'value'
        },
        series: [
          {
            name:'成交',
            type:'line',
            smooth:true,
            symbol: 'none',
            stack: 'a',
            areaStyle: {
              normal: {}
            },
            data: data
          }
        ]
      });

      setInterval(function() {
        addData(true);
        myChart.setOption({
          xAxis: {
            data: date
          },
          series: [{
            name: '成交',
            data: data
          }]
        });
      }, 800);
    },
  },

}
</script>
