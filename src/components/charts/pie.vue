<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String,
    name: String,
    type: String,
    onLineRate: Number
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    onLineRate () {
      this.circle()
    },
    value: {
      handler (newV, oldV) { // 不要用箭头函数 要不然this指向全局
        this.circle()
      },
      deep: true
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    circle () {
      this.$nextTick(() => {
        let option
        let legend = this.value ? this.value.map(_ => _.name) : []
        if (this.type === 'circlePro') { // 在线设备率
          option = {
            color: ['#3AA1FE', '#F0F2F5'],
            series: [{
              name: this.name,
              type: 'pie',
              radius: ['60%', '75%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                  position: 'center',
                  textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                  },
                  formatter: '{b}\n{c}%'
                }
              },
              data: [{
                value: this.onLineRate,
                name: this.name,
                label: {
                  normal: {
                    show: true
                  }
                }
              },
              {
                value: 100 - this.onLineRate,
                name: ''
              }
              ]
            }]
          }
        } else if (this.type === 'msgCircle') { // 消息占比
          option = {
            color: ['#F2A695', '#8693F3', '#FCC667', '#FA76CD'],
            title: {
              text: this.text,
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              itemGap: 20,
              top: '40%',
              right: '20%',
              icon: 'circle',
              data: legend
            },
            formatter: function (name) {
              let _index = 0
              let _dataList = option.series[0].data
              let arr
              _dataList.forEach((item, i) => {
                if (item.name === name) {
                  _index = i
                }
              })
              arr = [
                name + ' |   ',
                _dataList[_index].value + '条'
              ]
              // 注意，换行仍是使用 '\n'。
              return arr.join('')
            },
            series: [
              {
                name: this.text,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { // 图形样式
                  normal: {
                    borderColor: '#ffffff',
                    borderWidth: 5
                  }
                },
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    formatter: '{text|{b}}\n{value|{c}}',
                    rich: {
                      text: {
                        color: '#666',
                        fontSize: 14,
                        align: 'center',
                        verticalAlign: 'middle',
                        padding: 5
                      },
                      value: {
                        color: '#8693F3',
                        fontSize: 24,
                        align: 'center',
                        verticalAlign: 'middle'
                      }
                    }
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: this.value
              }
            ]
          }
        } else { // 通用
          option = {
            title: {
              text: this.text,
              subtext: this.subtext,
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: legend
            },
            series: [
              {
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: this.value,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option, true)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.circle()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
