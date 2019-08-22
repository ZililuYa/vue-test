<template>
  <div>
    <Card v-if="showChart" style="width:400px">
      <Row class="tac">
        <Col span="8" offset="3" style="text-align:left;height: 100px;line-height: 50px;">
          <b>全部设备：<span>{{ allDevice }}</span></b><br>
          <b>在线设备：<span>{{ onLineDevice }}</span></b><br>
          <b>离线设备：<span>{{ offLineDevice }}</span></b><br>
        </Col>
        <Col span="12">
         <chart-pie style="width:250px;height: 150px;" name="在线设备" type="circlePro" :onLineRate="onLineRate"></chart-pie>
        </Col>
      </Row>
    </Card>
    <Row :gutter="8" class-name="mb10">
      <Col class-name="mt10" :xxl="5" :xl="6" :lg="8" :md="12" :xs="24">
        设备编号：<Input v-model="serialNum" :maxlength="32" style="width: 160px" />
      </Col>
      <Col class-name="mt10" :xxl="2" :xl="2" :lg="3" :md="4" :xs="24">
       <Button @click="getDeviceList(1)" :loading="loading" type="primary" icon="search">查询</Button>
      </Col>
      <Col class-name="mt10" :xxl="2" :xl="2" :lg="3" :md="4" :xs="24">
        <Button @click="importModal = true" type="primary">导入新设备</Button>
      </Col>
    </Row>
    <Modal v-model="importModal" :mask-closable="false" width="400">
      <p slot="header" class="tac">批量导入</p>
      <div class="tac">
        <Upload
          :action="uploadUrl"
          :max-size="2048"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :before-upload="handleUpload"
          :format="['xls', 'xlsx', 'xlsm', 'xml', 'xltx', 'xltm']"
          :on-success="uploadSuccess">
          <span class="mr10">请上传文件:</span>
          <Button icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
        <div v-if="file !== null">当前上传文件名称: {{file.name}}</div>
        <div v-if="!file" class="ml10 cp" @click="downloadExcelTem">下载格式模板</div>
      </div>
      <div slot="footer">
        <Button class="tc" type="primary" size="large" :loading="modalLoading" @click="importSubmit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="showImportInfo" :mask-closable="false" width="400">
      <p slot="header" class="tac">批量导入</p>
      <div class="tac">
          <div>成功 <span style="color: green; font-weight: 700">{{successSize}}</span> 台</div>
          <div>未成功 <span style="color: red; font-weight: 700">{{failSize}}</span> 台</div>
      </div>
      <div slot="footer">
        <Button type="primary" v-if="failSize && successSize" :loading="exportLoading " @click="exportFailList">导出未成功的设备编号</Button>
        <Button type="primary" @click="cancel">确定</Button>
      </div>
    </Modal>
    <Tables v-model="tableData" :loading="loading" :columns="tableColumns" ref="table"></Tables>
    <Page
      :current="pageNum"
      :total="dataCount"
      :page-size="pageSize"
      :page-size-opts="pageSizes"
      show-total
      show-sizer
      show-elevator
      class="paging"
      @on-change="changepage"
      @on-page-size-change="changePageSize"
    >
    </Page>
  </div>
</template>
<script>
import Tables from '@/components/tables'
import { ChartPie } from '_c/charts'
import { getDeviceList, deviceOnlineStatus } from '@/api/data'
import { getDate, tableToExcel } from '@/libs/util'
import paginationMixin from '@/mixins/paginationMixin'
export default {
  // name: 'deviceList',
  mixins: [paginationMixin],
  components: {
    Tables,
    ChartPie
  },
  data () {
    return {
      showChart: true,
      allDevice: 0,
      onLineDevice: 0,
      offLineDevice: 0,
      serialNum: '',
      importModal: false,
      showImportInfo: false,
      loading: false,
      exportLoading: false,
      modalLoading: false,
      file: null,
      resolve: null,
      successSize: 0,
      failSize: 0,
      failList: [],
      tableColumns: [
        {
          'title': '设备编号',
          'key': 'serialNum',
          'align': 'center'
        },
        {
          'title': '创建时间',
          'key': 'createdTime',
          'align': 'center'
        },
        {
          'title': '产品类型',
          'key': 'baseName',
          'align': 'center'
        },
        {
          'title': '设备类型',
          'key': 'modelName',
          'align': 'center'
        },
        {
          'title': '设备状态',
          'key': 'onlineStatus',
          'align': 'center'
        }
      ],
      tableData: []
    }
  },
  computed: {
    onLineRate () {
      return isNaN(this.onLineDevice / this.allDevice) ? 0 : Number(((this.onLineDevice / this.allDevice) * 100).toFixed(2))
    },
    uploadUrl () {
      return process.env.NODE_ENV !== 'production' ? '/api/speakeradmin/device/addList' : '/speakeradmin/device/addList'
    }
  },
  methods: {
    deviceOnlineStatus () {
      deviceOnlineStatus()
        .then(res => {
          const { data, code } = res
          if (data && code === 0) {
            this.allDevice = data.All
            this.onLineDevice = data.OnLine
            this.offLineDevice = data.OffLine
          }
        })
    },
    getDeviceList (pageNum) {
      if (this.serialNum && !/^[a-z0-9]+$/i.test(this.serialNum)) return this.$Message.error('请正确输入设备编号')
      this.pageNum = pageNum
      this.loading = true
      const data = {
        serialNum: this.serialNum,
        pageNum,
        pageSize: this.pageSize
      }
      getDeviceList(data)
        .then(res => {
          const { data, code } = res
          if (data && code === 0) {
            data.list.forEach(item => {
              item.createdTime = getDate(0, item.createdTime)
              item.baseName = '音箱'
              item.modelName = 'V2-2G'
              item.onlineStatus = item.onlineStatus === false ? '离线' : '在线'
            })
            this.tableData = data.list
            this.dataCount = data.total
          } else {
            this.$Message.error(res.message)
          }
          this.loading = false
        }, err => {
          // 接口错误
          console.log(err)
        })
        .catch((err) => {
          // 处理逻辑出错
          console.log(err.message)
        })
    },
    downloadExcelTem () {
      window.location = 'https://inspiry-product.oss-cn-beijing.aliyuncs.com/template/speakerLocalAdminImportDevice.xlsx'
    },
    // 阻止文件上传
    handleUpload (file) {
      this.file = file
      return new Promise(resolve => {
        this.resolve = resolve
      })
    },
    uploadSuccess (res) {
      this.modalLoading = false
      if (res.code !== 0) {
        this.$Message.error(res.message)
        this.file = null
      } else {
        this.$Message.success('上传成功')
        this.successSize = res.data.successSize
        this.failSize = res.data.failSize
        this.failList = res.data.failList
        this.importModal = false
        this.showImportInfo = true
        if (this.successSize) {
          this.getDeviceList(1)
        }
      }
    },
    importSubmit () {
      this.modalLoading = true
      if (this.file === null) {
        this.$Message.error('请先上传文件')
        this.modalLoading = false
      } else {
        this.resolve()
      }
    },
    exportFailList () {
      this.exportLoading = true
      tableToExcel('设备编号', 1, this.failList, '失败列表')
      this.exportLoading = false
    },
    cancel () {
      this.showImportInfo = false
    }
  },
  created () {
    // this.deviceOnlineStatus()
    // this.getDeviceList(1)
  }
}
</script>
<style lang="less">

</style>
