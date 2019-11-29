<template>
  <div>
    <!--Carousel 走马灯-->
    <div class="block">
      <el-carousel trigger="click" height="300px">
        <el-carousel-item v-for="item in text" :key="item" :name="item.value">
          <h3 class="small">质量检查</h3>
          <div class="demonstration">
            <span>{{ item.name }}</span>
          </div>
          <img :src="item.url" class="img-url"/>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="div-bigcolor">
      <div class="big-title">
        解决方案
      </div>

      <div class="div-bgcolor">
        <div class="bgcolor-content">
          <div class="content-top1">
            质量检查
          </div>
          <div class="content-bottom">
              <span>
                通过对山体地表位移、房屋沉降、高铁桥梁位移等持续静态监测，
                守护人民生命财产安全；赋能城市智能终端高精度，实现安全管理。
              </span>
          </div>
        </div>

        <div class="bgcolor-content">
          <div class="content-top2">
            质量检查
          </div>
          <div class="content-bottom">
              <span>
                通过对山体地表位移、房屋沉降、高铁桥梁位移等持续静态监测，
                守护人民生命财产安全；赋能城市智能终端高精度，实现安全管理。
              </span>
          </div>
        </div>

        <div class="bgcolor-content">
          <div class="content-top3">
            质量检查
          </div>
          <div class="content-bottom">
              <span>
                通过对山体地表位移、房屋沉降、高铁桥梁位移等持续静态监测，
                守护人民生命财产安全；赋能城市智能终端高精度，实现安全管理。
              </span>
          </div>
        </div>

        <div class="bgcolor-content">
          <div class="content-top4">
            质量检查
          </div>
          <div class="content-bottom">
              <span>
                通过对山体地表位移、房屋沉降、高铁桥梁位移等持续静态监测，
                守护人民生命财产安全；赋能城市智能终端高精度，实现安全管理。
              </span>
          </div>
        </div>
      </div>

    </div>


    <h3>
      正在开发中。。。
      <img src="../../icons/svg/Delivery.png" /><br/>
      敬请期待！
      <img src="../../icons/svg/goodNews.png" />
    </h3>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        text:[]
      }
    },
    created(){
      var text_arr = this.text
      for (let i=1 ; i<5 ; i++){
        if (i === 1){
          text_arr.push({name:'通过对山体地表位移、房屋沉降、高铁桥梁位移等持续静态监测，守护人民生命财产安全；赋能城市智能终端高精度，实现安全管理。',
            url: require('../../img/data1.png'),
            value:1})
        }
        if (i === 2){
          text_arr.push({name:'摄像头精准时空标签解决方案' +
              '提升管理水平\n' +
              '\n' +
              '精准授时、精准还原\n' +
              '\n' +
              '机器智能',
            url: require('../../img/data2.png'), value:2})
        }
        if (i === 3){
          text_arr.push({name:'地质灾害滑坡监测解决方案\n' +
              '毫米级高精度监测\n' +
              '\n' +
              '高性价比\n' +
              '\n' +
              '高可用性、高可扩展性', url: require('../../img/data3.png'), value:3})
        }
        if (i === 4){
          text_arr.push({name:'高铁线路及桥梁位移监测解决方案\n' +
              '毫米级高精度监测\n' +
              '\n' +
              '自动化监测\n' +
              '\n' +
              '绝对基准、数据智能', url: require('../../img/data4.png'), value:4})
        }
      }
    },
  }
</script>
dataSecurity
<style scoped>
  .small{
    width: 500px;
    height: 120px;
  }
  .demonstration{
    margin: 0 0 0 100px;
    font-size: 20px;
  }
  .el-carousel__item h3 {
    background-image: url("../../img/data1.png");
    color: #475669;
    font-size: 38px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0 0 0 200px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #d3dce6;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .img-url{
    height: 270px;
    margin: -120px 0 50px 600px;
  }

  .demonstration{
    margin: 0 800px 0 200px;
    font-size: 16px;
    line-height: 30px;
  }

  .div-bigcolor{
    background: #F9F9F9;
    text-align: center;
    height: 500px;
  }
  .big-title{
    padding-top: 70px;
    font-size: 24px;
  }
  .div-bgcolor{
    display: flex;
    padding: 30px 0 0 210px;
  }
  .bgcolor-content{
    width: 300px;
    margin: 0 10px;
  }
  .content-top1{
    font-size: 18px;
    height: 100px;
    line-height: 100px;
    background: #f9ba4b;
  }
  .content-top2{
    font-size: 18px;
    height: 100px;
    line-height: 100px;
    background: #e78482;
  }
  .content-top3{
    font-size: 18px;
    height: 100px;
    line-height: 100px;
    background: #98c4fe;
  }
  .content-top4{
    font-size: 18px;
    height: 100px;
    line-height: 100px;
    background: #A584D6;
  }
  .content-bottom{
    padding: 20px 20px;
    height: 200px;
    line-height: 30px;
    background: #ffffff;
  }
</style>
