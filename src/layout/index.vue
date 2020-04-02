<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div class="drawer-bg" /> -->
    <sidebar class="sidebar-container" @add="isCollapse($event)"/>
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <keep-alive include="Customer">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
export default {
  name: "Layout",
  components: {
    Sidebar
  },
  data(){
    return {
      needTagsView: true,
      isWidth: true,
    }
  },
  computed: {
    classObj() {
      return {
        hideSidebar: this.isWidth,
        openSidebar: !this.isWidth,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      };
    }
  },
  methods: {
    isCollapse(isWidth){
      console.log(isWidth)
      this.isWidth = isWidth
    }
  },
  mounted() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
