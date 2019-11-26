<!-- 资源中心总体显示卡片 -->

  <template>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel scrollBottom" @click="scrollBottom">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="tx-sum" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              激励器总数
            </div>
            <div class="sum-num-color">
              <count-to :start-val="0" :end-val="total" :duration="5000" class="card-panel-num" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('breakdown')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="tx-running" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              关机/停止的激励器
            </div>
            <div class="running-num-color">
              <count-to :start-val="0" :end-val="shutdown" :duration="3000" class="card-panel-num" />
              <span>/</span>
              <count-to :start-val="0" :end-val="breakdown" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('running')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="tx-stop" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              运行/故障的激励器
            </div>
            <div class="stop-num-color">
              <count-to :start-val="0" :end-val="running" :duration="3200" class="card-panel-num" />
              <span>/</span>
              <count-to :start-val="0" :end-val="warning" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetBarChartData('backup')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="tx-warning" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              备份/升级的激励器
            </div>
            <div class="warning-num-color">
              <count-to :start-val="0" :end-val="backup" :duration="3600" class="card-panel-num" />
              <span>/</span>
              <count-to :start-val="0" :end-val="updating" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </template>

<script>
/* eslint-disable */
import CountTo from 'vue-count-to'
import PieChart from './PieChart'
import { fetchMap } from '@/api/article'

export default {
  name: 'ScrollTop',
  data() {
    return {
      total: '',
      running: '',
      warning: '',
      shutdown: '',
      breakdown: '',
      backup: '',
      updating: '',
      // 定义滚动条默认位置
      scrollTop: null,
      // 定义按钮默认状态
      isScrollTop: false
    }
  },
  props: {
    el: String
  },
  components: {
    CountTo,
    PieChart
  },
  created() {
    this.getList()
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', () => {
      this.scrollTop = document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop ||
        document.querySelector(this.el).scrollTop;

      // 控制滚动按钮的隐藏或显示
      if (this.scrollTop > 150) {
        this.isScrollTop = true;
      } else {
        this.isScrollTop = false;
      }
    }, true);
  },
  methods: {
    getList(){
      fetchMap().then(response => {
        this.total = response.data[0].total
        this.running = response.data[0].running
        this.warning = response.data[0].warning
        this.shutdown = response.data[0].shutdown
        this.breakdown = response.data[0].breakdown
        this.backup = response.data[0].backup
        this.updating = response.data[0].updating
      })
    },
    handleSetBarChartData(type) {
      //$emit:触发自定义事件 'handleSetBarChartData',type为参数
      this.$emit('handleSetBarChartData', type)
    },

    //滚动到顶部
   /* scrollBottom() {
      let $this = this;
      // 返回顶部动画特效
      setTimeout(function animation() {
        if ($this.scrollTop > 0) {
          setTimeout(() => {
            // 步进速度
            $this.scrollTop = $this.scrollTop - 15;
            // 返回顶部
            if(document.documentElement.scrollTop > 0) {
              document.documentElement.scrollTop = $this.scrollTop - 15;
            } else if (window.pageYOffset > 0) {
              window.pageYOffset = $this.scrollTop - 15;
            } else if (document.body.scrollTop > 0) {
              document.body.scrollTop = $this.scrollTop - 15;
            } else if (document.querySelector($this.el).scrollTop) {
              document.querySelector($this.el).scrollTop = $this.scrollTop - 15;
            }
            animation();
          }, 1);
        }
      }, 1);
    },*/
    // 滚动到底部
    scrollBottom() {
      let $this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          $this.scrollTop = $this.scrollTop - 150;
          window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight);
        }, 300)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }

      .sum-num-color{
        color: #34bfa3;
      }

      .running-num-color{
        color: #409EFF;
      }

      .stop-num-color{
        color: #F56C6C;
      }

      .warning-num-color{
        color: #E6A23C;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
