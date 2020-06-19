<template>
  <div id="app">
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script>
import Layout from "@/components/layout";

export default {
  name: "app",
  components: {
    Layout
  }
};
</script>

<style lang="less">
@import "./app";
</style>
