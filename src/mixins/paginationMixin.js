export default {
  data () {
    return {
      pageNum: 1, // 当前页码
      pageSize: 20, // 每页显示多少条
      pageTotal: null, // 总页数
      pageSizes: [10, 20, 50, 100], // 每页条数切换的配置
      dataCount: 0 // 查询总数
    }
  },
  methods: {
    // 页码改变的回调event
    async changepage (page) {
      this.pageNum = page
      await this.getDeviceList(page)
    },
    // 显示条数改变的回调
    async changePageSize (pageSize) {
      this.pageSize = pageSize
      await this.getDeviceList(this.pageNum)
    }
  }
}
