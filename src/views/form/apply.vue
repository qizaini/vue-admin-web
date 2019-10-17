<template>
  <div class="app-container" style="background: #fff url(https://static0.qxwz.com/product/findu-bg.png) no-repeat top center; ">

    <div class="x-row">
      <div class="content">
        <h1 align="center">应用管理</h1>
        <span><h4 align="center">可为多个需要厘米级定位服务的行业提供实际应用</h4> </span>
      </div>
      <div class="el-row div-image">

      </div>
    </div>

    <div class="cover">
      <h3 class="title">覆盖范围</h3>
      <div class="all">
        <span class="title">全部覆盖</span>
        <ul class="slick-initialized slick-slider">
          <div aria-live="polite" class="slick-list draggable" tabindex="0">
            <div class="slick-track" style="opacity: 1; width: 1224px; transform: translate3d(0px, 0px, 0px);">
              <li class="slick-slide slick-active" data-slick-index="0" aria-hidden="false" style="width: 72px;">北京</li>
              <li class="slick-slide slick-active" data-slick-index="1" aria-hidden="false" style="width: 72px;">天津</li>
              <li class="slick-slide slick-active" data-slick-index="2" aria-hidden="false" style="width: 72px;">上海</li>
              <li class="slick-slide slick-active" data-slick-index="3" aria-hidden="false" style="width: 72px;">重庆</li>
              <li class="slick-slide slick-active" data-slick-index="4" aria-hidden="false" style="width: 72px;">江苏</li>
              <li class="slick-slide slick-active" data-slick-index="5" aria-hidden="false" style="width: 72px;">浙江</li>
              <li class="slick-slide slick-active" data-slick-index="6" aria-hidden="false" style="width: 72px;">安徽</li>
              <li class="slick-slide slick-active" data-slick-index="7" aria-hidden="false" style="width: 72px;">福建</li>
              <li class="slick-slide slick-active" data-slick-index="8" aria-hidden="false" style="width: 72px;">江西</li>
              <li class="slick-slide slick-active" data-slick-index="9" aria-hidden="false" style="width: 72px;">河南</li>
              <li class="slick-slide slick-active" data-slick-index="10" aria-hidden="false" style="width: 72px;">湖北</li>
              <li class="slick-slide slick-active" data-slick-index="11" aria-hidden="false" style="width: 72px;">湖南</li>
              <li class="slick-slide slick-active" data-slick-index="12" aria-hidden="false" style="width: 72px;">山西</li>
              <li class="slick-slide slick-active" data-slick-index="13" aria-hidden="false" style="width: 72px;">贵州</li>
              <li class="slick-slide slick-active" data-slick-index="14" aria-hidden="false" style="width: 72px;">宁夏</li>
              <li class="slick-slide slick-active" data-slick-index="15" aria-hidden="false" style="width: 72px;">香港</li>
              <li class="slick-slide slick-active" data-slick-index="16" aria-hidden="false" style="width: 72px;">澳门</li>
            </div>
          </div>
        </ul>
      </div>
    </div>

    <div class="doc-section x-center-block">
      <h3 class="title">帮助文档</h3>
        <div class="x-row">
          <div class="el-row">
            <div class="help">
              <div class="help-left">
                <img src="../../img/value-icon-12.png" />
              </div>
              <div class="help-center">产品试用及购买</div>
              <div class="help-right1">查看详情</div>
            </div>
            <div class="help">
              <div class="help-left">
                <img src="../../img/value-icon-6.png" />
              </div>
              <div class="help-center">产品配置</div>
              <div class="help-right">查看详情</div>
            </div>
            <div class="help">
              <div class="help-left">
                <img src="../../img/value-icon-19.png" />
              </div>
              <div class="help-center">常见问题</div>
              <div class="help-right">查看详情</div>
            </div>
          </div>
        </div>
    </div>

  </div>

</template>

<script>

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style src="../../product/apply.css"></style>

