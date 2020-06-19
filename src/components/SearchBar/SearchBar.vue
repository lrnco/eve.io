<template>
  <div class="search-bar">
    <a-form-model ref="form" :model="form" :rules="rules" @submit="onSubmit">
      <a-form-model-item ref="search" prop="search">
        <a-auto-complete
          v-model="form.search"
          size="large"
          class="input"
          :placeholder="placeholder"
          autoFocus
          allowClear
          @select="onSelect"
          @search="onSearch"
          @blur="onBlur"
          option-label-prop="label"
        >
          <a-input>
            <a-icon
              slot="prefix"
              :type="loading ? 'loading' : 'search'"
              class="search-icon"
            />
          </a-input>
          <template slot="dataSource" v-if="locations.length > 0">
            <a-select-option
              v-for="item in locations"
              :key="`${item.id}`"
              :value="`${item.id}`"
              :label="
                `${item.name}, ${item.adminName1 + ', '}${item.countryName}`
              "
            >
              <div class="search-detail">
                <a-icon type="environment" />
                <div class="search-detail-text">
                  <p>{{ item.name }}</p>
                  <span v-if="item.adminName1">{{ item.adminName1 }}, </span>
                  <span v-if="item.countryName"> {{ item.countryName }} </span>
                </div>
              </div>
            </a-select-option>
          </template>
        </a-auto-complete>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LocationEntity } from "../../types/locations";
import { Icon, Input, AutoComplete, FormModel, Select } from "ant-design-vue";
import { FormItem } from "ant-design-vue/types/form/form-item";

const placeholders = [
  "Munich",
  "London",
  "São Paulo",
  "Paris",
  "New York City",
  "Amsterdam",
];

@Component({
  components: {
    [AutoComplete.name]: AutoComplete,
    [Icon.name]: Icon,
    [Input.name]: Input,
    [FormModel.name]: FormModel,
    [FormModel.Item.name]: FormModel.Item,
    [Select.Option.name]: Select.Option,
  },
})
export default class SearchBar extends Vue {
  private placeholder = placeholders[0];
  private form = {
    search: "",
  };
  private rules = {
    search: [
      { required: true, message: "Search for a city", trigger: "blur" },
      { min: 3, message: "Length should at least be 2", trigger: "blur" },
    ],
  };

  @Prop() private loading!: boolean;
  @Prop() private searchResults!: LocationEntity[];
  get locations() {
    return this.form.search &&
      this.form.search.length > 2 &&
      this.searchResults.length > 0
      ? this.searchResults
      : [];
  }

  mounted() {
    let i = 0;
    let curr: any = placeholders[0];
    let key = 0;
    setInterval(() => {
      i = i >= placeholders.length - 1 ? 0 : i + 1;
      curr = placeholders[i];
      key = 0;
      const write = () => {
        if (key < curr.length) {
          key++;
          this.placeholder = curr.slice(0, key);
        }
      };
      write();
      const len: number[] = new Array(curr.length);
      setInterval(() => write(), 220);
    }, 4000);
  }

  onSearch(searchText: string) {
    const form: FormModel | any = this.$refs.form;
    form.clearValidate();
    if (searchText && searchText.length > 2)
      return this.$emit("search", searchText);
  }

  onBlur() {
    const search: FormItem | any = this.$refs.search;
    search.onFieldBlur();
  }

  onSelect(value: string) {
    const selected = this.searchResults.find(
      (item) => item.id === Number(value)
    );
    return this.$emit("select", selected);
  }

  onSubmit(value: string) {
    const form: FormModel | any = this.$refs.form;
    form.validate((valid: boolean) => {
      if (valid) this.onSearch(this.form.search);
    });
  }
}
</script>

<style scoped lang="less">
@import "./searchbar";
</style>
