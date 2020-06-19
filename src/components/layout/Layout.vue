<template>
  <a-layout
    id="layout"
    :class="{ 'has-header': hasHeaderSlot, 'has-footer': hasFooterSlot }"
  >
    <a-layout-header class="header" v-if="hasHeaderSlot">
      <slot name="header"></slot>
    </a-layout-header>
    <a-layout-content class="content-wrapper">
      <div class="content">
        <slot />
      </div>
    </a-layout-content>
    <a-layout-footer class="footer" v-if="hasFooterSlot">
      <slot name="footer"></slot>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Layout } from "ant-design-vue";

@Component({
  components: {
    [Layout.name]: Layout,
    [Layout.Header.name]: Layout.Header,
    [Layout.Content.name]: Layout.Content,
    [Layout.Footer.name]: Layout.Footer
  }
})
export default class LayoutComponent extends Vue {
  public get hasHeaderSlot(): boolean {
    return this.$slots["header"] !== undefined;
  }
  public get hasFooterSlot(): boolean {
    return this.$slots["footer"] !== undefined;
  }
}
</script>

<style scoped lang="less">
@import "./layout";
</style>
