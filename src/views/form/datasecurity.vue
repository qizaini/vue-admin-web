<template>
  <!--Carousel 走马灯-->

  <!--轮播图-->
  <!--<div class="slide">
    <ul class="slide-auto">
      <li><img src="../../img/carouselMap1.png" /></li>
      <li><img src="../../img/carouselMap2.png" /></li>
      <li><img src="../../img/carouselMap3.png" /></li>
    </ul>
  </div>-->
  <div class="div-carouselMap">
    <div>
      <div id="frame" >
        <a id="a1" class="num"></a>
        <a id="a2" class="num"></a>
        <a id="a3" class="num"></a>
        <a id="a4" class="num"></a>
        <a id="a5" class="num"></a>
        <div id="photos" class="play">
          <img src="../../img/carouselMap1.png" >
          <img src="../../img/carouselMap2.png" >
          <img src="../../img/carouselMap3.png" >
          <img src="../../img/carouselMap4.png" >
          <img src="../../img/carouselMap5.png" >
          <!--<ul id="dis">
            <li>中国标志性建筑：天安门</li>
            <li>中国标志性建筑：东方明珠</li>
            <li>中国标志性建筑：布达拉宫</li>
            <li>中国标志性建筑：长城</li>
            <li>中国标志性建筑：天坛</li>
          </ul>-->
        </div>
      </div>
    </div>
    <div class="title">
      <h2>数据安全</h2>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'datasecurity'
  }
</script>

<style scoped>

  .div-carouselMap{
    background: #e7eaf1;
    height: 400px;
  }
  #frame {/*----------图片轮播相框容器----------*/
    position: absolute; /*--绝对定位，方便子元素的定位*/
    width: 300px;
    height: 300px;
    overflow: hidden;/*--相框作用，只显示一个图片---*/
    border-radius:5px;
    margin: 50px 660px;
  }
  #dis {/*--绝对定位方便li图片简介的自动分布定位---*/
    position: absolute;
    left: -50px;
    top: -10px;
    opacity: 0.5;
  }
  #dis li {
    display: inline-block;
    width: 200px;
    height: 50px;
    margin: 0 50px;
    float: left;
    text-align: center;
    color: #fff;
    border-radius: 10px;
    background: #000;
  }
  #photos img {
    float: left;
    width:300px;
    height:300px;
  }
  #photos {/*---设置总的图片宽度--通过位移来达到轮播效果----*/
    position: absolute;z-index:9px;
    width: calc(500px * 5);/*---修改图片数量的话需要修改下面的动画参数*/
  }
  .play{
    animation: ma 20s ease-out infinite alternate;/**/
  }
  @keyframes ma {/*---每图片切换有两个阶段：位移切换和静置。中间的效果可以任意定制----*/
    0%,20% {		margin-left: 0px;		}
    25%,40% {		margin-left: -300px;	}
    45%,60% {		margin-left: -600px;	}
    65%,80% {		margin-left: -900px;	}
    85%,100% {		margin-left: -1200px;	}
  }
  .num{
    position:absolute;z-index:10;
    display:inline-block;
    right:82px;top:280px;
    border-radius:100%;
    background:#281302;
    width:15px;height:15px;
    line-height:15px;
    cursor:pointer;
    color:#fff;
    text-align:center;
    opacity:0.8;
  }
  .num:hover{background:#1FA5AD;}
  .num:hover,#photos:hover{animation-play-state:paused;}
  .num:nth-child(2){margin-right:30px}
  .num:nth-child(3){margin-right:60px}
  .num:nth-child(4){margin-right:90px}
  .num:nth-child(5){margin-right:120px}
  #a1:hover ~ #photos{animation: ma1 .5s ease-out forwards;}
  #a2:hover ~ #photos{animation: ma2 .5s ease-out forwards;}
  #a3:hover ~ #photos{animation: ma3 .5s ease-out forwards;}
  #a4:hover ~ #photos{animation: ma4 .5s ease-out forwards;}
  #a5:hover ~ #photos {animation: ma5 .5s ease-out forwards;}
  @keyframes ma1 {0%{margin-left:-1200px;}100%{margin-left:-0px;}	}
  @keyframes ma2 {0%{margin-left:-1200px;}100%{margin-left:-300px;}	}
  @keyframes ma3 {100%{margin-left:-600px;}	}
  @keyframes ma4 {100%{margin-left:-900px;}	}
  @keyframes ma5 {100%{margin-left:-1200px;}	}

  /*轮播图*/
  /*.slide {
    position: relative;
    margin: auto;
    width: 600px;
    height: 200px;
    text-align: center;
    font-family: Arial;
    color: #FFF;
    overflow: hidden;
  }

  .slide ul {
    margin: 10px 0;
    padding: 0;
    width: 9999px;
    transition: all 0.5s;
  }

  !*!/自动播放*!
  .slide .slide-auto {
    animation: marginLeft 10.5s infinite;
  }

  .slide li {
    float: left;
    width: 600px;
    height: 200px;
    list-style: none;
    line-height: 200px;
    font-size: 36px;
  }

  .slide li:nth-child(1) {
    background: #9fa8ef;
  }

  .slide li:nth-child(2) {
    background: #ef9fb1;
  }

  .slide li:nth-child(3) {
    background: #9fefc3;
  }

  @keyframes marginLeft {
    0% {
      margin-left: 0;
    }

    28.5% {
      margin-left: 0;
    }

    33.3% {
      margin-left: -600px;
    }

    62% {
      margin-left: -600px;
    }

    66.7% {
      margin-left: -1200px;
    }

    95.2% {
      margin-left: -1200px;
    }

    100% {
      margin-left: 0;
    }
  }*/
</style>
