<template>
  <Page
    :current="current"
    :total="dataCount"
    :page-size="pageSize"
    :page-size-opts="pageSizeOpts"
    :placement="placement"
    :size="size"
    :simple="simple"
    :show-total="showTotal"
    :show-elevator="showElevator"
    :show-sizer="showSizer"
    :class-name="className"
    :styles="styles"
    :transfer="transfer"
    :prev-text="prevText"
    :next-text="nextText"
    @on-change="onChange"
    @on-page-size-change="onPageSizeChange"
  >
  </Page>
</template>

<script>
export default {
  name: 'Page',
  computed: {},
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOpts: {
      type: Array,
      default: () => {
        return [10, 15, 25, 50, 100]
      }
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    size: String,
    simple: {
      type: Boolean,
      default: false
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    showElevator: {
      type: Boolean,
      default: false
    },
    showSizer: {
      type: Boolean,
      default: false
    },
    className: String,
    styles: Object,
    transfer: {
      type: Boolean,
      default: false
    },
    prevText: String,
    nextText: String
  },
  methods: {
    onChange (current) {
      this.$emit('on-current-change', currentRow)
    },
    onPageSizeChange (pageSize) {
      this.$emit('on-page-size-change', pageSize)
    }
  },
  mounted () {}
}
</script>

<style lang="less">

</style>
