<template>
  <!--饼状图-->
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'

import { fetchMap } from '@/api/article'

var provinceData = []

function initPieChat() {
  return fetchMap().then(response => {
    provinceData = response.data
  })
}
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      provinceName: '',
      total: ''
    }
  },
  async mounted() {
    await initPieChat()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      for (let i = 0; i < provinceData.length; i++) {
        let province = provinceData[i]
        // 省份名称
        let provinceName = province.provinceName
        // 激励器省份总数
        let total = province.total
        this.provinceName = provinceName
        this.total = total
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: [this.provinceName]
        },
        series: [
          {
            name: '激励器总数',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              {name:this.provinceName, value:this.total}
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
