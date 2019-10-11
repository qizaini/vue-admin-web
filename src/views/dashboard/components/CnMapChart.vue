<template>
  <div class="echarts">

    <el-drawer title="激励器信息" :visible.sync="drawer" :direction="direction" size="50%">

      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150" />
        <el-table-column property="name" label="姓名" width="200" />
        <el-table-column property="address" label="地址" />

      </el-table>
    </el-drawer>

    <!--<el-button @click=openAlert() type="primary" style="margin-left: 16px; position: absolute;top: 5px;left: 50px;text-align: center; ">-->
    <!--点击-->
    <!--</el-button>-->

    <!--<el-button @click=openAlert() type="pirmary" plain class="forward" style="margin: 0 0 0 20px; position: absolute;top: 5px;left: 50px;">返回</el-button>-->
    <div ref="myEchart" :style="{height:'800px',width:'100%'}" />

  </div>

</template>

<script>

import echarts from 'echarts'
import 'echarts/map/js/china.js'
import 'echarts/map/js/world.js'
// import 'echarts/map/js/china-contour.js'

import 'echarts/map/js/province/shanghai.js'
import 'echarts/map/js/province/hebei.js'
import 'echarts/map/js/province/shanxi.js'
import 'echarts/map/js/province/neimenggu.js'
import 'echarts/map/js/province/liaoning.js'
import 'echarts/map/js/province/jilin.js'
import 'echarts/map/js/province/heilongjiang.js'
import 'echarts/map/js/province/jiangsu.js'
import 'echarts/map/js/province/zhejiang.js'
import 'echarts/map/js/province/anhui.js'
import 'echarts/map/js/province/fujian.js'
import 'echarts/map/js/province/jiangxi.js'
import 'echarts/map/js/province/shandong.js'
import 'echarts/map/js/province/henan.js'
import 'echarts/map/js/province/hubei.js'
import 'echarts/map/js/province/hunan.js'
import 'echarts/map/js/province/guangdong.js'
import 'echarts/map/js/province/guangxi.js'
import 'echarts/map/js/province/hainan.js'
import 'echarts/map/js/province/sichuan.js'
import 'echarts/map/js/province/guizhou.js'
import 'echarts/map/js/province/yunnan.js'
import 'echarts/map/js/province/xizang.js'
import 'echarts/map/js/province/shanxi1.js'
import 'echarts/map/js/province/gansu.js'
import 'echarts/map/js/province/qinghai.js'
import 'echarts/map/js/province/ningxia.js'
import 'echarts/map/js/province/xinjiang.js'
import 'echarts/map/js/province/beijing.js'
import 'echarts/map/js/province/tianjin.js'
import 'echarts/map/js/province/chongqing.js'
import 'echarts/map/js/province/xianggang.js'
import 'echarts/map/js/province/aomen.js'

const geoCoordMap = {
  '北京': [116.46, 39.92],
  '内蒙古': [111.670801, 40.818311],
  '广西': [108.320004, 22.82402]

}

const provinces = ['shanghai', 'hebei', 'shanxi', 'neimenggu', 'liaoning', 'jilin', 'heilongjiang', 'jiangsu', 'zhejiang', 'anhui', 'fujian', 'jiangxi', 'shandong', 'henan', 'hubei', 'hunan', 'guangdong', 'guangxi', 'hainan', 'sichuan', 'guizhou', 'yunnan', 'xizang', 'shanxi1', 'gansu', 'qinghai', 'ningxia', 'xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen']
const provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门']

const sanData = [
  { name: '北京', value: 50 },
  { name: '内蒙古', value: 30 },
  { name: '广西', value: 100 }

]

export default {
  name: 'CnMapChart',
  // props: ["userJson"],
  data() {
    return {
      myMapName: 'china',
      drawer: false, // 抽屉
      direction: 'rtl', // 方位 ltr从左到右，rtl从右到左
      chart: null,
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },

  watch: {
    // 深度监听，可监听到对象、数组的变化
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
      this.initMap(this.myMapName)
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

    // 地图数据转换
    convertData: function(data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name] // 数据的名字对应的经纬度
        if (geoCoord) { // 如果数据data对应上，
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },

    initMap: function(mapName) {
      this.chart = echarts.init(this.$refs.myEchart, 'macarons')
      if (mapName === 'china') {
        this.setOptions(this.myMapName)
        this.chart.on('click', (params) => {
          // 销毁实例
          this.chart.dispose()
          this.$options.methods.openSubMap.bind(this)(params.name)
          this.$options.methods.initMap.bind(this)(params.name)

          // alert('yes')
        })
      } else {
        this.setOptionsSub(this.myMapName)
        this.chart.on('dblclick', () => {
          this.chart.dispose()
          this.$options.methods.openSubMap.bind(this)('china')
          this.$options.methods.initMap.bind(this)('china')

          // alert('yes')
        })

        this.chart.on('click', 'series', (params) => {
          // this.$options.methods.openDrawer.bind(this)()
          this.drawer = true
          // alert('yes')
        })
      }
    },

    // initChart() {
    //   this.chart = echarts.init(this.$refs.myEchart, 'macarons')
    //
    //   // this.loadBdScript('neimenggu.js','echarts/map/js/province',function() {})
    //
    //   if (this.myMapName == 'china')
    //     this.setOptions(this.myMapName)
    //   else
    //     // alert('meile')
    //     this.setOptionsSub(this.myMapName)
    //
    //
    //   // 点击【区域或者标签】触发，使用“=>”箭头函数才能使用this指向全局实例
    //   this.chart.on('click', (params)=> {
    //     // alert(params.name);
    //     // if(params.name != 'china'){
    //     //
    //     // }
    //       this.$options.methods.openSubMap.bind(this)(params.name)
    //       this.$options.methods.initChart.bind(this)()
    //   //   // for (var i = 0; i < provincesText.length; i++) {
    //   //   //   if (param.name === provincesText[i]) {
    //   //   //     mapName = provincesText[i];
    //   //   //     //显示对应t省份的方法
    //   //   //     showProvince(provinces[i], provincesText[i]);
    //   //   //     break;
    //   //   //   }
    //   //   // }
    //   } )
    //
    //   // this.chart.on('click', function(params) {
    //   //   if (params.componentType === 'series') {
    //   //     // aa = this.$refs.myDrawer.visible;
    //   //     alert(params.value[2] = true);
    //   //     // this.$options.methods.qwe();
    //   //   }
    //   // })
    //
    //   // 点击【标签】触发
    //   // this.chart.on('click', 'series', ()=> {
    //   //   // 要this指向全局实例，要在后面加.bind（this）
    //   //   this.$options.methods.openSubMap.bind(this)()
    //   //   this.$options.methods.initChart.bind(this)()
    //   //   // this.$options.methods.openDrawer.bind(this)()
    //   // } );
    //
    // },

    openSubMap: function(provinceName) {
      this.myMapName = provinceName
    },

    /* openDrawer: function(){
      this.drawer = true;
    },*/

    openAlert: function() {
      alert('hi~~')
    },

    setOptions(paraMapName) {
      this.chart.setOption({
        backgroundColor: 'rgba(2,175,219,0.9)', // #02AFDB
        title: {
          text: '激励器全国部署图',
          padding: 20,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 30
          }
        },

        // 鼠标移到图里面的浮动提示框
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name + ' : ' + params.value[2] + ' : ' + params.value[0] + ' : ' + params.value[1] + ' : ' + params.value[3]
          }
        },
        // 图例
        legend: {
          orient: 'vertical', // 图例列表的布局朝向，水平：'horizontal'，垂直：'vertical'
          left: 50,
          top: 50,
          selectedMode: 'single', // 图例选择的模式，单选：'single'，多选：'multiple'
          inactiveColor: '#E4E7ED', // 图例关闭时的颜色
          data: ['激励器总数', '停止的激励器数量'],
          textStyle: {
            fontStyle: 'normal',
            color: '#fff',
            fontSize: 20
          }
        },
        dataRange: {
          show: true,
          min: 0,
          max: 1000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        geo: { // 这个是重点配置区
          show: true,
          map: paraMapName, // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
            // emphasis: {
            //   show: true, // 鼠标移入的时候（强调）是否显示对应地名
            //   textStyle: {
            //     color: 'rgba(0,0,0,0.4)'
            //   }
            // }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [{
          name: '激励器总数',
          type: 'scatter',
          coordinateSystem: 'geo', // 对应上方配置
          symbol: 'pin', // 标签形状：圆形'circle', 方形'rect', 圆角方形'roundRect', 三角形'triangle', 菱形'diamond', 标记'pin', 箭头'arrow', 'none'
          symbolSize: '50',
          label: {
            normal: {
              show: true,
              formatter: function(params) {
                return params.data.value[2]
              },
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            }
          },
          data: this.convertData(sanData)
          // data:
          //   [['116.347927', '39.948795', 100, this.drawer],
          //    ['100.06376' , '30.554698', 75 , this.drawer],
          //    ['104.05325' , '29.646273', 50 , this.drawer],
          //    ['104.05325' , '25.646273', 25 , this.drawer],
          //    ['94.05325'  , '30.646273', 1  , this.drawer]]

        },
        {
          name: '停止的激励器数量',
          type: 'scatter',
          coordinateSystem: 'geo', // 对应上方配置
          symbol: 'diamond',
          symbolSize: '80',
          label: {
            normal: {
              show: true
            }
          },
          // data: this.convertData(sanData)
          data: [['116.347927', '39.948795', 100],
            ['100.06376', '30.554698', 75],
            ['108.320004', '22.82402', 50], ['104.05325', '25.646273', 25], ['94.05325', '30.646273', 1]]

        }
          // {
          //   name: '正在运行的激励器', // 浮动框的标题
          //   type: 'map',
          //   geoIndex: 0,
          //   data: [{
          //     'name': '北京',
          //     'value': 599
          //   }, {
          //     'name': '上海',
          //     'value': 142
          //   }, {
          //     'name': '黑龙江',
          //     'value': 44
          //   }, {
          //     'name': '深圳',
          //     'value': 92
          //   }, {
          //     'name': '湖北',
          //     'value': 810
          //   }, {
          //     'name': '四川',
          //     'value': 453
          //   }]
          // },
          // {
          //   name: '停止运行的激励器', // 浮动框的标题
          //   type: 'map',
          //   geoIndex: 0,
          //   data: [{
          //     'name': '新疆',
          //     'value': 599
          //   }]
          // },

        ]
      })
    },

    setOptionsSub(paraMapName) {
      this.chart.setOption({
        backgroundColor: 'rgba(2,175,219,0.9)', // #02AFDB
        title: {
          text: paraMapName + '   激励器部署图',
          padding: 20,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 20
          }
        },

        // 鼠标移到图里面的浮动提示框
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (params) {
        //     return params.name + ' : ' + params.value[2]+ ' : ' + params.value[0] + ' : ' + params.value[1]+ ' : ' + params.value[3];
        //   }
        // },
        // legend: {
        //   data: ['正在运行的激励器', '停止运行的激励器']
        // },
        dataRange: {
          show: true,
          min: 0,
          max: 1000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        geo: { // 这个是重点配置区
          show: true,
          map: paraMapName, // 表示中国地图
          // roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
            // emphasis: {
            //   show: true, // 鼠标移入的时候（强调）是否显示对应地名
            //   textStyle: {
            //     color: 'rgba(0,0,0,0.4)'
            //   }
            // }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [{
          name: '激励器总数',
          type: 'scatter',
          coordinateSystem: 'geo', // 对应上方配置
          symbol: 'pin',
          symbolSize: '50',
          label: {
            normal: {
              show: false
            }
          },
          data:
            [['108.320004', '22.82402', 80],
              ['109.119254', '21.473343', 20]]

        }

        ]
      })
    }

  }// End methods
}// End export

</script>

<style scoped>

</style>
