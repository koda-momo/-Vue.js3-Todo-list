<template>
  <div class="all">
    <span class="header"> <Header /></span>
    <div class="main"><router-view /></div>
    <div class="footer"><Footer class="footermain" /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default defineComponent({
  components: {
    Header,
    Footer,
  },
});
</script>

<style scoped>
.all {
  width: 100%;
}

.footer {
  min-height: 50vh; /* ←コンテンツの高さの最小値＝ブラウザの高さに指定 */
  position: relative; /* ←相対位置 */
  padding-bottom: 60px; /* ←フッターの高さを指定 */
  box-sizing: border-box;
}
.footermain {
  position: absolute; /* ←絶対位置 */
  bottom: 0;
  width: 100%;
}
</style>
