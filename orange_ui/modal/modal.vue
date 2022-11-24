<template>
  <teleport to="body">
    <transition :name="maskTransition">
      <div v-show="show && mask"
           :class="[className,'c-modal-mask']"
           :style="{zIndex:z}"></div>
    </transition>
    <transition :name="bodyTransition">
      <div v-show="show"
           :class="[className,'c-modal']"
           :style="{zIndex:z+1}"
           @click.self="warpClick"
           @keydown.esc="close">
        <div class="c-modal-body">
          <div v-if="showTitle"
               class="c-modal-header f ai-c jc-between">
            <div class="c-modal-title"
                 v-html="title"></div>
            <div class="f ai-c jc-between c-modal-title-btn-line">
<!--              <div class="c-modal-title-btn-line-icon"-->
<!--                   @click="changeMax()"-->
<!--                   :style="getMaxBtnStyle()" ></div>-->
<!--              <div class="c-modal-title-btn-line-icon cmt-close" ></div>-->
              <div class="c-modal-close-btn" @click="close"></div>
            </div>
          </div>
          <div class="c-modal-content" :style="GetWindowInfo">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

</template>

<script>
import fullScreen from "./fullScreen.vue";
import btnIconSet from '@/assets/btn_icon_set.png'
export default {
  name: "modal",
  components: {fullScreen},
  props: {
    maskTransition: {default: 'mask'},     //遮蔽动画
    bodyTransition: {default: 'modal'},    //窗口开启关闭动画
    mask: {default: true},                 //是否有遮蔽
    z: {default: 5600},                    //窗口z-index值
    warpClose: {default: false},           //点击mask 是否关闭关闭

    showTitle: {default: true},            //显示标题
    title: {default: ''},

    className: {default: ''},
    show: {default: true},
    full: {default: false},
    Maximize:{default: false},
  },
  data() {return {
    GetWindowInfo: {
      // paddingBottom: '10px',
      overflow: 'auto',
      // maxHeight: '',     //动态获取content高度
      // maxWidth: '',   	 //动态获取content宽度
    },
    isMaxSize: false,
  }},
  methods: {
    close() {
      this.$emit('update:show', false)
    },
    warpClick() {
      if (this.warpClose) {
        this.close()
      }
    },
    GetWindow() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）,再减去head-DIV高度值80
      this.GetWindowInfo.maxHeight = (window.innerHeight - 100) + 'px'
      this.GetWindowInfo.maxWidth = window.innerWidth + 'px'
    },
    getMaxBtnStyle(){
      let style = {}
      style.background = this.isMaxSize ?
       `url(${btnIconSet}) no-repeat -31px 0` :
       `url(${btnIconSet}) no-repeat -80px 0`
      return style
    },

    changeMax(){
      this.isMaxSize = ! this.isMaxSize
      if(this.isMaxSize){}
      else{}
    }
  },
  created(){
    window.addEventListener('resize', this.GetWindow) //注册监听器
    this.GetWindow() //页面创建时先调用一次
  },
  destroyed(){
    window.removeEventListener('resize', this.GetWindow)
  }

}
</script>

<style lang="scss">
/*窗口遮蔽动画*/
.c-modal-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  /*background-color: rgba(248,249,250,.75);*/
  background-color: rgba(100, 100, 100, 0.75);
}

/*窗口样式*/
.c-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-modal-body {
  display: inline-flex;
  flex-direction: column;

  //padding: 20px;
  //min-width: 30rem;
  position: relative;
  /* transform: translateY(-10rem); */

  background-color: #fff;
  border-radius: 5px;
  font-size: 1.6rem;
}

.c-modal-header {
  width: 100%;
  font-size: 1.4rem;
  line-height: 1.4rem;
  position: relative;
  padding: 20px 20px 15px 20px;
}

.c-modal-title::after {
  content: "";
  height: 0.1rem;
  background-color: #0fc19f;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.c-modal-close-btn {
  //color: cornflowerblue;
  color: #2e2d3c;
  cursor: pointer;
  font-weight: bold;
  margin-left: 16px;
}

.c-modal-close-btn::before {
  content: "\2715";
  font-size: 20px;
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}

.mask-enter-active,
.mask-leave-active {
  transition: all 0.25s ease;
}

.c-modal-title-btn-line{
  color: #676a6c;
  &-icon{
    width: 16px;
    height: 16px;
    text-decoration: none;
    margin-left: 16px;
    color: #676a6c;
    cursor: pointer;
  }
  .cmt-close{
    background: url('@/assets/btn_icon_set.png') 0 0;
    width: 16px;
    height: 16px;
  }
  .cmt-close:hover{
    background: url('@/assets/btn_icon_set.png') -48px 0;
  }
}

/*窗口动画*/
.modal-enter-from,
.modal-leave-to {
  transform: translateY(-1rem);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modalRightPopup-enter-from,
.modalRightPopup-leave-to {
  transform: translateX(100rem);
  opacity: 0;
}

.modalRightPopup-enter-active,
.modalRightPopup-leave-active {
  transition: all .5s ease;

}

.right-popup-box {
  .c-modal-body {
    height: 100%;
    width: 80%;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
