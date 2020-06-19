<template>
  <div :class="{ 'has-data': points.length > 0, 'data-tabs': true }">
    <a-tabs v-if="points.length > 0" :active-key="selected" @change="onChange">
      <a-tab-pane v-for="item in datatypes" :key="item.id">
        <span slot="tab">
          <a-icon :type="item.loading ? 'loading' : item.icon" />
          {{ item.title }}
        </span>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { LocationEntity } from "../../types/locations";
import { Icon, Tabs } from "ant-design-vue";
import { FormItem } from "ant-design-vue/types/form/form-item";

@Component({
  components: {
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [Tabs.TabPane.name]: Tabs.TabPane,
  },
})
export default class DataTabs extends Vue {
  private datatypes = [
    {
      id: "population",
      title: "Population",
      icon: "team",
      loading: true,
    },
    {
      id: "temperature",
      title: "Temperature",
      icon: "fire",
      loading: true,
    },
    {
      id: "humidity",
      title: "Humidity",
      icon: "cloud",
      loading: true,
    },
    {
      id: "windSpeed",
      title: "Wind Speed",
      icon: "dashboard",
      loading: true,
    },
  ];
  @Prop() private points!: LocationEntity[];
  @Prop() private selected!: string;

  @Watch("points")
  onPointsChange(value: any) {
    if (value) {
      console.log({ value });
      this.datatypes = this.datatypes.map((item) => ({
        ...item,
        loading: !value.reduce(
          (dict: boolean, curr: any) => dict || curr[item.id] !== null,
          false
        ),
      }));
    }
  }

  onChange(value: string) {
    return this.$emit("select", value);
  }
}
</script>

<style scoped lang="less">
@import "./datatabs";
</style>
