<template>
  <!--PageHeader 页头-->
  <div class="echarts">

    <el-drawer title="激励器信息" :visible.sync="drawer" :direction="direction" size="50%">
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150" />
        <el-table-column property="name" label="姓名" width="200" />
        <el-table-column property="address" label="地址" />
      </el-table>
    </el-drawer>

    <div ref="myEchart" :style="{height:'800px',width:'100%'}" />
    </div>

</template>

<script>
/* eslint-disable */
import { fetchMap } from '@/api/article'
import axios from 'axios'

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

const provinces = ['shanghai', 'hebei', 'shanxi', 'neimenggu', 'liaoning', 'jilin', 'heilongjiang', 'jiangsu', 'zhejiang', 'anhui', 'fujian', 'jiangxi', 'shandong', 'henan', 'hubei', 'hunan', 'guangdong', 'guangxi', 'hainan', 'sichuan', 'guizhou', 'yunnan', 'xizang', 'shanxi1', 'gansu', 'qinghai', 'ningxia', 'xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen']
const provincesText = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门']

var provinceData = []
// 中国地图经纬度： https://www.echartsjs.com/examples/zh/editor.html?c=map-polygon
const geoCoordMap = {
    '北京': [116.46,39.92],
    '广东':[113.27324,23.15792],
    '朝阳': [116.46,39.92],
    '海淀': [116.29845,39.95933],
    '西域': [116.32434357617186,39.914025397993264],
    '湖南': [113,28.21],
    '海门':[121.15,31.89],
    '鄂尔多斯':[109.781327,39.608266],
    '招远':[120.38,37.35],
    '舟山':[122.207216,29.985295],
    '齐齐哈尔':[123.97,47.33],
    '盐城':[120.13,33.38],
    '赤峰':[118.87,42.28],
    '青岛':[120.33,36.07],
    '乳山':[121.52,36.89],
    '金昌':[102.188043,38.520089],
    '泉州':[118.58,24.93],
    '莱西':[120.53,36.86],
    '日照':[119.46,35.42],
    '胶南':[119.97,35.88],
    '南通':[121.05,32.08],
    '拉萨':[91.11,29.97],
    '云浮':[112.02,22.93],
    '梅州':[116.1,24.55],
    '文登':[122.05,37.2],
    '上海':[121.48,31.22],
    '攀枝花':[101.718637,26.582347],
    '威海':[122.1,37.5],
    '承德':[117.93,40.97],
    '厦门':[118.1,24.46],
    '汕尾':[115.375279,22.786211],
    '潮州':[116.63,23.68],
    '丹东':[124.37,40.13],
    '太仓':[121.1,31.45],
    '曲靖':[103.79,25.51],
    '烟台':[121.39,37.52],
    '福州':[119.3,26.08],
    '瓦房店':[121.979603,39.627114],
    '即墨':[120.45,36.38],
    '抚顺':[123.97,41.97],
    '玉溪':[102.52,24.35],
    '张家口':[114.87,40.82],
    '阳泉':[113.57,37.85],
    '莱州':[119.942327,37.177017],
    '湖州':[120.1,30.86],
    '汕头':[116.69,23.39],
    '昆山':[120.95,31.39],
    '宁波':[121.56,29.86],
    '湛江':[110.359377,21.270708],
    '揭阳':[116.35,23.55],
    '荣成':[122.41,37.16],
    '连云港':[119.16,34.59],
    '葫芦岛':[120.836932,40.711052],
    '常熟':[120.74,31.64],
    '东莞':[113.75,23.04],
    '河源':[114.68,23.73],
    '淮安':[119.15,33.5],
    '泰州':[119.9,32.49],
    '广西': [108.320004,22.82402],
    '南宁':[108.33,22.84],
    '玉林':[110.05125, 22.57957],
    '营口':[122.18,40.65],
    '惠州':[114.4,23.09],
    '江阴':[120.26,31.91],
    '蓬莱':[120.75,37.8],
    '韶关':[113.62,24.84],
    '嘉峪关':[98.289152,39.77313],
    '广州':[113.23,23.16],
    '延安':[109.47,36.6],
    '太原':[112.53,37.87],
    '清远':[113.01,23.7],
    '中山':[113.38,22.52],
    '昆明':[102.73,25.04],
    '寿光':[118.73,36.86],
    '盘锦':[122.070714,41.119997],
    '长治':[113.08,36.18],
    '深圳':[114.07,22.62],
    '珠海':[113.52,22.3],
    '宿迁':[118.3,33.96],
    '咸阳':[108.72,34.36],
    '铜川':[109.11,35.09],
    '平度':[119.97,36.77],
    '佛山':[113.11,23.05],
    '海口':[110.35,20.02],
    '江门':[113.06,22.61],
    '章丘':[117.53,36.72],
    '肇庆':[112.44,23.05],
    '大连':[121.62,38.92],
    '临汾':[111.5,36.08],
    '吴江':[120.63,31.16],
    '石嘴山':[106.39,39.04],
    '沈阳':[123.38,41.8],
    '苏州':[120.62,31.32],
    '茂名':[110.88,21.68],
    '嘉兴':[120.76,30.77],
    '长春':[125.35,43.88],
    '胶州':[120.03336,36.264622],
    '银川':[106.27,38.47],
    '张家港':[120.555821,31.875428],
    '三门峡':[111.19,34.76],
    '锦州':[121.15,41.13],
    '南昌':[115.89,28.68],
    '柳州':[109.4,24.33],
    '三亚':[109.511909,18.252847],
    '自贡':[104.778442,29.33903],
    '吉林':[126.57,43.87],
    '阳江':[111.95,21.85],
    '泸州':[105.39,28.91],
    '西宁':[101.74,36.56],
    '宜宾':[104.56,29.77],
    '呼和浩特':[111.65,40.82],
    '成都':[104.06,30.67],
    '大同':[113.3,40.12],
    '镇江':[119.44,32.2],
    '桂林':[110.28,25.29],
    '张家界':[110.479191,29.117096],
    '宜兴':[119.82,31.36],
    '北海':[109.12,21.49],
    '西安':[108.95,34.27],
    '金坛':[119.56,31.74],
    '东营':[118.49,37.46],
    '牡丹江':[129.58,44.6],
    '遵义':[106.9,27.7],
    '绍兴':[120.58,30.01],
    '扬州':[119.42,32.39],
    '常州':[119.95,31.79],
    '潍坊':[119.1,36.62],
    '重庆':[106.54,29.59],
    '台州':[121.420757,28.656386],
    '南京':[118.78,32.04],
    '滨州':[118.03,37.36],
    '贵阳':[106.71,26.57],
    '无锡':[120.29,31.59],
    '本溪':[123.73,41.3],
    '克拉玛依':[84.77,45.59],
    '渭南':[109.5,34.52],
    '马鞍山':[118.48,31.56],
    '宝鸡':[107.15,34.38],
    '焦作':[113.21,35.24],
    '句容':[119.16,31.95],
    '徐州':[117.2,34.26],
    '衡水':[115.72,37.72],
    '包头':[110,40.58],
    '绵阳':[104.73,31.48],
    '乌鲁木齐':[87.68,43.77],
    '枣庄':[117.57,34.86],
    '杭州':[120.19,30.26],
    '淄博':[118.05,36.78],
    '鞍山':[122.85,41.12],
    '溧阳':[119.48,31.43],
    '库尔勒':[86.06,41.68],
    '安阳':[114.35,36.1],
    '开封':[114.35,34.79],
    '济南':[117,36.65],
    '德阳':[104.37,31.13],
    '温州':[120.65,28.01],
    '九江':[115.97,29.71],
    '邯郸':[114.47,36.6],
    '临安':[119.72,30.23],
    '兰州':[103.73,36.03],
    '沧州':[116.83,38.33],
    '临沂':[118.35,35.05],
    '南充':[106.110698,30.837793],
    '天津':[117.2,39.13],
    '富阳':[119.95,30.07],
    '泰安':[117.13,36.18],
    '诸暨':[120.23,29.71],
    '郑州':[113.65,34.76],
    '哈尔滨':[126.63,45.75],
    '聊城':[115.97,36.45],
    '芜湖':[118.38,31.33],
    '唐山':[118.02,39.63],
    '平顶山':[113.29,33.75],
    '邢台':[114.48,37.05],
    '德州':[116.29,37.45],
    '济宁':[116.59,35.38],
    '荆州':[112.239741,30.335165],
    '宜昌':[111.3,30.7],
    '义乌':[120.06,29.32],
    '丽水':[119.92,28.45],
    '洛阳':[112.44,34.7],
    '秦皇岛':[119.57,39.95],
    '株洲':[113.16,27.83],
    '石家庄':[114.48,38.03],
    '莱芜':[117.67,36.19],
    '常德':[111.69,29.05],
    '保定':[115.48,38.85],
    '湘潭':[112.91,27.87],
    '金华':[119.64,29.12],
    '岳阳':[113.09,29.37],
    '长沙':[113,28.21],
    '衢州':[118.88,28.97],
    '廊坊':[116.7,39.53],
    '菏泽':[115.480656,35.23375],
    '合肥':[117.27,31.86],
    '武汉':[114.31,30.52],
    '大庆':[125.03,46.58]
  }

function initMapInfo() {
  return fetchMap().then(response => {
    provinceData = response.data
  })
}

export default {
  name: 'CnMapChart',
  // props: ["userJson"],
  data() {
    return {
      provinceData: [],
      provinceName: '',
      comeBack: '返回',
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
    },
  },

  async mounted() {
    await initMapInfo()
    this.$nextTick(() => {
      // this.initChart()
      this.initMap(this.myMapName)
    })
  },

  async beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    // 地图数据转换
    convertData: function(flag) {
      let resProvince = []
      let resCity = []
      // 如果flag == true 表示渲染省份
        if (flag === true) {
          for (let i = 0; i < provinceData.length; i++) {
            let province = provinceData[i]
            // 省份 geo
            let pGeo = geoCoordMap[province.provinceName]
            // 省份总数
            let pTotal = province.total
            let shutdown = province.shutdown
            // 省份名称
            let pName = province.provinceName
            resProvince.push({
              name: pName,
              value: pGeo.concat(pTotal, shutdown)
            })
          }
        return resProvince
      }

      // 渲染城市
      // 获得当前点击的省份名称
      let currentProvinceName = this.provinceName
      for (let i = 0; i < provinceData.length; i++) {
        let province = provinceData[i]
        if (province.provinceName === currentProvinceName) {
          for (let j = 0; j < province.cities.length; j++) {
            let city = province.cities[j]
            // 城市 geo
            let cityGeo = geoCoordMap[city.cityName]
            // 城市名称
            let cityName = city.cityName
            // 城市总数
            let cityTotal = city.total
            resCity.push({
              name: cityName,
              value: cityGeo.concat(cityTotal)
            })
          }
        }
      }
      return resCity
    },

      initMap: function(mapName) {
        this.chart = echarts.init(this.$refs.myEchart, 'macarons')
        if (mapName === 'china') {
          this.setOptions(this.myMapName)
          this.chart.on('click', (params) => {
            var pName = params.name
            // 给省份名称赋值
            this.provinceName = pName
            // 销毁实例
            this.chart.dispose()
            this.$options.methods.openSubMap.bind(this)(params.name)
            this.$options.methods.initMap.bind(this)(params.name)
          })
        } else {
          this.setOptionsSub(this.myMapName)
          this.chart.on('dblclick', () => {
            this.chart.dispose()
            this.$options.methods.openSubMap.bind(this)('china')
            this.$options.methods.initMap.bind(this)('china')
          })
          this.chart.on('click', 'series', (params) => {
            // this.$options.methods.openDrawer.bind(this)()
            this.drawer = true
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

    setOptions(paraMapName) {
      this.chart.setOption({
        backgroundColor: 'rgba(2,175,219,0.9)', // #02AFDB
        title: {
          text: '基合系统部署图',
          padding: 20,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 30
          }
        },

        // 鼠标移到图里面的浮动提示框
        /*tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name + ' : ' + params.value[2] + ' : ' + params.value[0] + ' : ' + params.value[1] + ' : ' + params.value[3]
          }
        },*/

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
                //激励器省份的经纬度
                //激励器省份的总数
                return params.data.value[2]
              },
              textStyle: {
                color: '#fff',
                fontSize: 20
              }
            }
          },
          data: this.convertData(true)
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
              show: true,
              formatter: function(params) {
                //负数改为正数
                if (params.data.value[3] < 0) {
                  return -params.data.value[3];
                }else {
                  return params.data.value[3]
                }
              },
            }
          },
          data: this.convertData(true)
        }
      ]
    })
    },

    setOptionsSub(paraMapName) {
      let _self = this
      this.chart.setOption({
        backgroundColor: 'rgba(2,175,219,0.9)', // #02AFDB
        title: {
          text: paraMapName + '   激励器部署图',
          padding: 20,
          left: 700,
          textStyle: {
            color: '#fff',
            fontSize: 20
          },
        },
        toolbox: {
          itemSize: 40,
          right: 50,
          feature: {
            dataView: {//数据视图
              show: false
            },
            dataZoom: {//数据区域缩放
              show: false
            },
            saveAsImage: {//保存为图片
              show: false
            },
            myTool1: {
              show: true,
              title: '按钮',
              icon: 'image://image/pre.png',// icon : ' image://图片／图标的路径'  icon:'image://image/restore.png'
              onclick: function (){
                _self.chart.dispose()
                _self.$options.methods.openSubMap.bind(_self)('china')
                _self.$options.methods.initMap.bind(_self)('china')
              }
            },
            myTool2: {
              show: true,
              title: '返回',
              icon: 'image://http://echarts.baidu.com/images/favicon.png',
              onclick: function (){
                _self.chart.dispose()
                _self.$options.methods.openSubMap.bind(_self)('china')
                _self.$options.methods.initMap.bind(_self)('china')
              },
              }
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
        series: [
            {
            name: '激励器总数',
            type: 'scatter',
            coordinateSystem: 'geo', // 对应上方配置
            symbol: 'pin',
            symbolSize: '50',
            label: {
              normal: {
                show:  true,
                  formatter: function(params) {
                    return params.data.value[2]
                },
              }
            },
            data: this.convertData(false)
          }
        ]
      })
    }

  }// End methods
}// End export

</script>

<style scoped>

</style>
