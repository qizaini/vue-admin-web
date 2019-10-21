<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="6">
          <span class="demonstration">部署地点</span>&nbsp;
          <el-input v-model="listQuery.location" placeholder="" size="medium" style="width: 200px;" class="filter-item" @keyup.enter.native="$event.target.blur" @change="handleFilter"/>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="5">
          <span class="demonstration">状态</span>&nbsp;
          <el-select v-model="listQuery.txState" placeholder="请选择" size="medium" clearable style="width: 170px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in txState" :key="item" :label="item.name" :value="item.value"/>
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="12">

          <span class="demonstration">部署时间</span>&nbsp;
          <el-date-picker
            v-model="listQuery.updateTime"
            type="daterange"
            size="medium"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :el-date-picker="pickerOptions"
            validate-event="true"
          />&nbsp;&nbsp;&nbsp;
          <el-button type="primary" size="medium" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button type="primary" size="medium" icon="el-icon-edit" @click="open">添加</el-button>
          <el-button type="primary" size="medium" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </el-col>

      </el-row>
    </div>
    <br>

    <!--列表-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column v-if="true" align="center" label="序号" width="70"><!--v-if="false" 隐藏列-->
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" prop="rowKey" label="rowKey" align="center" width="80px" :class-name="getSortClass('rowKey')">
        <template slot-scope="scope">
          <span>{{ scope.row.rowKey }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="部署地点" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avgPower" label="频点(MHz)" align="center" width="200px">
        <template slot-scope="scope">
          {{ scope.row.avgPower }}
        </template>
      </el-table-column>

      <el-table-column prop="freq" label="功率(w)" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.freq }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specMode" label="频谱模式" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.specMode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" sortable label="部署时间" width="280">
        <template slot-scope="scope">
          <!--<i class="el-icon-time"/>-->
          <!--<span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{scope.row.updateTime * 1000 | msgDateFormat('yyyy-mm-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="txState"
        lang="cn"
        class-name="status-col"
        label="状态"
        width="180"
        align="center"
        :filters="[{ text: '运行', value: 'running' },
                   { text: '升级', value: 'updating' },
                   { text: '故障', value: 'breakdown' },
                   { text: '备用', value: 'backups' },
                   { text: '停止', value: 'shutdown' },
                   { text: '警告', value: 'warning' },
        ]"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.txState | statusFilter">{{ scope.row.txState }}</el-tag>
        </template>
        <template slot-scope="scope" prop="txState">
          <el-tag v-if="scope.row.txState === 'shutdown'" :type="'info'" disable-transitions>停止</el-tag>
          <el-tag v-else-if="scope.row.txState === 'running'" :type="'success'" disable-transitions>运行</el-tag>
          <el-tag v-else-if="scope.row.txState === 'warning'" :type="'warning'" disable-transitions>警告</el-tag>
          <el-tag v-else-if="scope.row.txState === 'breakdown'" :type="'danger'" disable-transitions>故障</el-tag>
          <el-tag v-else-if="scope.row.txState === 'backups'" :type="'plain'" disable-transitions>备用</el-tag>
          <el-tag v-else-if="scope.row.txState === 'updating'" :type="'primary'" disable-transitions>升级</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" style="display: none">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleFetchDetail(row)">查看详情</el-button>

        </template>
      </el-table-column>

      <template slot="empty">
        <div class="nodataTip">
          <img src="#" alt="" />
            暂无数据
        </div>
      </template>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <!--查看详情-->
    <el-dialog :visible.sync="dialogTableVisible" title="查看详情">
      <el-table :data="txData" style=" width: 100%">
        <el-table-column prop="service1SealMode" label="控件版本"><!--controlVersion-->
        </el-table-column>
        <el-table-column prop="service1SealMode" label="运营商">
        </el-table-column>
        <el-table-column prop="avgPower" label="工作频点">
        </el-table-column>
        <el-table-column prop="freq" label="输出频率">
        </el-table-column>
        <el-table-column prop="location" label="部署地点">
        </el-table-column>
        <el-table-column prop="location" label="部署时间">
        </el-table-column>
        <el-table-column prop="freq" label="通道" ><!--gallery-->
        </el-table-column>
        <el-table-column prop="specMode" label="频谱模式">
        </el-table-column>
        <el-table-column prop="freq" label="数据格式"><!--dataFormat-->
        </el-table-column>
        <el-table-column prop="freq" label="复用类型"><!--reuseType-->
        </el-table-column>
        <el-table-column prop="freq" label="差分数据"><!--differentialData-->
        </el-table-column>
        <el-table-column prop="txState" label="状态">
        </el-table-column>
      </el-table>
      <div style="display: flex">
        <!--<div style="width:85px">{{txData.service1SealMode}}</div>
        <div style="width:85px">{{txData.service1SealMode}}</div>
        <div style="width:85px">{{txData.avgPower}}</div>
        <div style="width:85px">{{txData.freq}}</div>
        <div style="width:85px">{{txData.location}}</div>
        <div style="width:85px">{{txData.updateTime}}</div>
        <div style="width:85px">{{txData.freq}}</div>
        <div style="width:85px">{{txData.specMode}}</div>
        <div style="width:85px">{{txData.freq}}</div>
        <div style="width:85px">{{txData.freq}}</div>
        <div style="width:85px">{{txData.freq}}</div>
        <div style="width:85px">{{txData.txState}}</div>-->
      </div>
        <template slot="empty">
          <div class="nodataTip">
            <img src="#" alt="" />
            暂无数据
          </div>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">确定</el-button>
        </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog :title="textMap[dialogStatus]+this.temp.rowKey" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="11">
            <el-form-item label="控件版本" prop="power">
              <el-input v-model="temp.service1SealMode" style="width: 80%"/><!--controlVersion-->
            </el-form-item>
            <el-form-item label="运营商" prop="power">
              <el-input v-model="temp.service1SealMode" style="width: 80%"/><!--operator-->
            </el-form-item>
            <el-form-item label="工作频点" prop="power">
              <el-input v-model="temp.avgPower" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="输出频率" prop="power">
              <el-input v-model="temp.freq" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="部署地点" prop="power">
              <el-input v-model="temp.location" style="width: 80%"/>
            </el-form-item>
            <!-- <el-form-item label="部署地点" prop="power">&lt;!&ndash;输入后匹配输入建议&ndash;&gt;
               <el-autocomplete
                 v-model="location"
                 style="width: 80%"
                 class="inline-input"
                 :fetch-suggestions="querySearch"
                 placeholder="请输入内容"
                 :trigger-on-focus="false"
                 @select="handleSelect"
               />
             </el-form-item>-->
            <el-form-item label="部署时间" prop="updateTime">
              <el-date-picker v-model="temp.updateTime" type="datetime" placeholder="请选择一个日期" style="width: 80%"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="12">
            <el-form-item label="状态" prop="power">
              <el-input v-model="temp.txState" style="width: 62%" disabled="disabled"/>
            </el-form-item>
            <el-form-item label="通道" prop="power">
              <el-select v-model="temp.specMode" placeholder="请选择通道类型"><!--gallery-->
              </el-select>
            </el-form-item>
            <el-form-item label="频谱模式" prop="power">
              <el-select v-model="temp.specMode" placeholder="请选择频谱模式">
              </el-select>
            </el-form-item>
            <el-form-item label="数据格式" prop="power">
              <el-select v-model="temp.specMode" placeholder="请选择数据格式"><!--dataFormat-->
                <el-option label="RTCM23_GPS" value="shanghai"/>
                <el-option label="RTCM32_GGB" value="beijing"/>
              </el-select>
            </el-form-item>
            <el-form-item label="差分类型" prop="power">
              <el-select v-model="temp.specMode" placeholder="请选择差分类型"><!--differentialData-->
                <el-option label="RTK" value="shanghai"/>
                <el-option label="RTD" value="beijing"/>
              </el-select>
            </el-form-item>
            <el-form-item label="复用类型" prop="power">
              <el-select v-model="temp.specMode" placeholder="请选择复用类型"><!--reuseType-->
                <el-option label="CDMA" value="shanghai"/>
                <el-option label="TDMA" value="beijing"/>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
  import { fetchList, fetchTx, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves'
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination'
  import axios from 'axios'

  export default {

    components: { Pagination },
    directives: { waves },
    filters: {
      msgDateFormat: function(msg, pattern = '') {
        // 将字符串转换为Date类型
        var mt = new Date(msg)
        if (mt.toString() == 'Invalid Date') {
          return ''
        }

        // 获取年份
        var y = mt.getFullYear()
        // 获取月份 从0开始
        var m = (mt.getMonth() + 1).toString().padStart(2, '0')
        // 获取天数
        var d = mt.getDate()
        if (pattern === 'yyyy-mm-dd') {
          return y + '-' + m + '-' + d
        }
        // 获取小时
        var h = mt.getHours().toString().padStart(2, '0')
        // 获取分钟
        var mi = mt.getMinutes().toString().padStart(2, '0')
        // 获取秒
        var s = mt.getSeconds().toString().padStart(2, '0')
        // 拼接为我们需要的各式
        return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s
      },
      statusFilter(txState) {
        // '运行running', '备用backups', '警告warning','停止shutdown','故障breakdown'，'升级updating'
        const statusMap = {
          running: 'success',
          updating: 'primary',
          breakdown: 'danger',
          backups: 'plain',
          shutdown: 'info',
          warning: 'warning'
        }
        return statusMap[txState]
      }
    },
    data() {
      return {
        location: '',
        dialogVisible: false,
        tableKey: 0,
        list: [],
        total: 0,
        txState: [],
        updateTime: [],
        listLoading: true,
        listQuery: {
          // page: 1,
          // limit: 20,
          location: '',
          rowKey: '',
          avgPower: '',
          freq: '',
          service1SealMode: '',
          txState: '',
          updateTime: '',
          sort: '+rowKey'
        },
        dialogTableVisible: false,
        txData: [],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        showReviewer: false,
        temp: {
          id: undefined,
          rowKey: '',
          location: '',
          avgPower: '',
          freq: '',
          service1SealMode: '',
          txState : '',
          specMode: '',
          updateTime: ''
        },
        /*txData: {
          id: undefined,
          location: '',
          avgPower: '',
          freq: '',
          service1SealMode: '',
          txState : '',
          specMode: '',
          updateTime: ''
        },*/
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑激励器',
          create: '添加',
          detail: '查看详情'
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        /*rules: {
          updateTime: [{ type: 'date', required: true, message: 'updateTime is required', trigger: 'blur' }],
          power: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          status: [{ required: true, message: 'status is required', trigger: 'blur' }],
          service1SealMode: [{ required: true, message: 'service1SealMode is required', trigger: 'blur' }]
        },*/
        downloadLoading: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
      }
    },
    created() {
      this.getList()
    },
    mounted() {

    },
    methods: {
      /* txList(){
      let that = this;
      axios.get('v1/device')
        .then(function (res) {
          that.list = res.data
        })
        .catch(function (error) {
          console.log(error);
        });
    },*/
      open() {
        this.$prompt('请输入激励器ID', '添加', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:'',
          inputErrorMessage: '激励器ID格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的激励器ID是: ' + value
          });
        })
      },
      getList() {
        this.listLoading = false
        if (this.listQuery.updateTime !== '') {
          console.log(this.listQuery.updateTime)
          var time_arr = this.listQuery.updateTime.toString().split(',')
          var start_time = new Date(time_arr[0]).getTime() / 1000
          var end_time = new Date(time_arr[1]).getTime() / 1000
          this.listQuery.updateTime = [start_time, end_time]
        }
        fetchList(this.listQuery).then(response => {
          this.list = response.result
          this.total = response.result.length

          var result = response.result
          var state_arr = []
          var news_arr = []
          for (let i in result) {
            let state = result[i].txState
            if (!state_arr.includes(state)) {
              state_arr.push(state)
            }
            if (result[i].service1SealMode === '1'){
              result[i].service1SealMode = '业务流'
            }
            else if (result[i].service1SealMode === '2'){
              result[i].service1SealMode = '业务包'
            }
          }

          for (let i = 0; i < state_arr.length; i++) {
            var s = state_arr[i]
            if (s === 'shutdown') {
              news_arr.push({ name: '停止', value: s })
              continue
            }
            if (s === 'running') {
              news_arr.push({ name: '运行', value: s })
              continue
            }
            if (s === 'updating') {
              news_arr.push({ name: '升级', value: s })
              continue
            }
            if (s === 'backups') {
              news_arr.push({ name: '备用', value: s })
              continue
            }
            if (s === 'warning') {
              news_arr.push({ name: '警告', value: s })
              continue
            }
            if (s === 'breakdown') {
              news_arr.push({ name: '故障', value: s })
            }
          }
          //绑定txState下拉框
          this.txState = news_arr
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      querySearch(queryString, cb) {
        var location = this.location
        // console.log(location)
        var results = queryString ? location.filter(this.createFilter(queryString)) : location
        // console.log(results)
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      loadAll() {
        return [
          { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
          { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
          { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' }
        ]
      },
      handleSelect(item) {
        // console.log(item);
      },
      mounted() {
        this.location = this.loadAll()
      },

      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      //搜索
      handleFilter() {
        // this.listQuery.page = 1
        if (this.listQuery.updateTime === '' && this.listQuery.location === '' && this.listQuery.txState === '' ){
          // 后期可以提醒用户输入查询条件
        }else {
          this.getList()
        }
      },
      //状态筛选
      filterTag(value, row) {
        return row.status === value
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          location: '',
          avgPower: '',
          freq: '',
          service1SealMode: '',
          txState: '',
          updateTime: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        //默认状态为备用
        this.temp.txState = 'backups'
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          // console.log(this.$refs['dataForm'])
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        var status = row.txState
        if (status === 'shutdown') {
          this.temp.txState = "停止"
        }
        if (status === 'running') {
          this.temp.txState = "运行"
        }
        if (status === 'updating') {
          this.temp.txState = "升级"
        }
        if (status === 'backups') {
          this.temp.txState = "备用"
        }
        if (status === 'warning') {
          this.temp.txState = "警告"
        }
        if (status === 'breakdown') {
          this.temp.txState = "故障"
        }
        var nowTime = this.temp.updateTime
        this.temp.updateTime = parseInt(nowTime + "000")

        var rowKey = this.temp.rowKey
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // const tempData = Object.assign({}, this.temp)
            // console.log(this.temp)
            // tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(this.temp).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleFetchDetail(row) {
        this.temp = Object.assign({}, row)
        let rowKey = this.temp.rowKey
        fetchTx(rowKey).then(response => {
          this.txData  = response.result

          console.log(this.txData)
          this.dialogTableVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['部署地点', '部署时间', '功率', '频谱模式', '频点', '状态']
          const filterVal = ['location', 'updateTime', 'freq', 'service1SealMode', 'avgPower', 'txState']
          console.log(filterVal)
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '资源列表'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'updateTime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}`
          ? 'ascending'
          : sort === `-${key}`
            ? 'descending'
            : ''
      }
    }
  }
</script>
