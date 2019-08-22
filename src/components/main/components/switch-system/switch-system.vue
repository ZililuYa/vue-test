<template>
  <div class="switch-system">
    <span class="switch-system-text">系统切换：</span>
    <Select class="switch-system-list" v-model="platform" style="width:200px;" :placeholder='placeholder' :filterable="filterable">
      <Option v-for="item in systemList" :key="item.value" :label="item.serviceInfoName" :value="item.url" @click.native="clickSkipSystem(item.url)">
      </Option>
    </Select>
  </div>
</template>

<script>
// import { showTitle } from '@/libs/util'
import { getTableData } from '@/api/data'
// console.log(showTitle) // 引用正常不报错
console.log(getTableData) // 报错
export default {
  name: 'SwitchSystem',
  data () {
    return {
      platform: 'https://www.baidu.com'
    }
  },
  computed: {},
  props: {
    systemList: {
      type: Array,
      default: () => {
        return [
          {
            icon: 'icon-device',
            serviceInfoCode: 'dm',
            serviceInfoName: '谷歌',
            sort: 1,
            status: 1,
            url: 'https://www.google.com'
          },
          {
            icon: 'icon-device',
            serviceInfoCode: 'mes',
            serviceInfoName: '百度',
            sort: 1,
            status: 1,
            url: 'https://www.baidu.com'
          }
        ]
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleGetData () {
      getSystemList().then(res => {
        console.log(res)
      })
    },
    async getTopBarList () {
      const nowCode = sessionStorage.getItem('serviceInfoCode')
      const { data: { data, code } } = await this.$axios.get(`/topBar/list?loginRoleId=&status=1`)
      if (code === 200) {
        data.forEach((x, y, z) => {
          if (x.serviceInfoCode === nowCode) {
            this.platform = x.url
          }
          this.systemList.push(x)
        })
      }
    },
    clickSkipSystem (target) {
      window.location.href = target
    }
  },
  mounted () {},
  created () {
    // this.handleGetData()
  }
}
</script>

<style lang="less">
.switch-system {
  .switch-system-text {
    font-size: 14px;
    font-weight: 700;
    .switch-system-list {
      a {
        color: black;
      }
    }
  }
}
</style>
