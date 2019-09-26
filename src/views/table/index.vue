<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="6">
          <span class="demonstration">部署地点</span>&nbsp;
          <el-input v-model="listQuery.title" placeholder="" size="medium" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :xs="24" :sm="24" :lg="5">
          <span class="demonstration">状态</span>&nbsp;
          <el-select v-model="listQuery.importance" placeholder="" size="medium" clearable style="width: 170px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="12">
            <span class="demonstration">部署时间</span>&nbsp;
            <el-date-picker
              v-model="value2"
              type="daterange"
              size="medium"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>&nbsp;&nbsp;&nbsp;
            <el-button v-waves class="filter-item" size="medium"type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button class="filter-item" size="medium" style="margin-left: 10px;size: landscape" type="primary" icon="el-icon-edit" @click="handleCreate">
              添加
            </el-button>
            <el-button v-waves :loading="downloadLoading" size="medium" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
              导出
            </el-button>
        </el-col>

      </el-row>
    </div><br>

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
      <el-table-column align="center" label="序号" width="70" style="display: none">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="部署地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.use_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频点(MHz)" align="center">
        <template slot-scope="scope">
          {{ scope.row.frequency }}
        </template>
      </el-table-column>

      <el-table-column label="功率(w)" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.power }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务模式" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.form_code }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center"  sortable prop="created_at" label="部署时间" width="200">-->
      <el-table-column align="center"  sortable prop="display_time" label="部署时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column  lang="cn" class-name="status-col" label="状态" width="110" align="center"
                        :filters="[{ text: '运行', value: '运行' },
                        { text: '升级', value: '升级' },
                        { text: '异常', value: '异常' },
                        { text: '备用', value: '备用' },
                        { text: '停止', value: '停止' },
                        { text: '警告', value: '警告' },
                        ]"
                        :filter-method="filterTag"

      >
        <template slot-scope="scope">
          <el-tag   effect="dark" :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          &lt;!&ndash;<router-link :to="'/table/edit/'+scope.row.id">&ndash;&gt;

          &lt;!&ndash;<router-link :to="'/example/edit/'+scope.$index">&ndash;&gt;
          <router-link :to="{name: 'table_edit', params: {id: scope.row.cdradio_id}}">
            &lt;!&ndash;<router-link :to="'/example/edit'">&ndash;&gt;
            &lt;!&ndash;<el-button type="primary" size="small" icon="el-icon-edit">&ndash;&gt;
            <el-button type="primary" size="small" icon="el-icon-view">
              查看详情
            </el-button>
          </router-link>

        </template>
      </el-table-column>-->

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini">
            删除
          </el-button>
          <el-button type="warning" size="mini">
            导出
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="部署地点" prop="deployAdress">
          <el-select v-model="temp.deployAdress" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="部署时间" prop="deployTime">
          <el-date-picker v-model="temp.deployTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="功率" prop="power">
          <el-input v-model="temp.power" />
        </el-form-item>
        <el-form-item label="业务模式" prop="businessModel">
          <el-input v-model="temp.businessModel" />
        </el-form-item>
        <el-form-item label="频率" prop="frequency">
          <el-input v-model="temp.frequency" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style=" width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, createArticle, updateArticle } from '@/api/article'
  import { getList } from '@/api/table'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      // '运行running', '备用backups', '警告warning','停止stop','异常exception'，'升级update'
      const statusMap = {
        运行: 'success',
        升级: 'primary',
        异常: 'danger',
        备份: 'plain',
        停止: 'info',
        警告: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['update', 'backups', 'stop', 'running', 'exception', "warning"],
      statusOptions: ["运行", "升级", "异常", "备用", "停止", "警告"],
      showReviewer: false,
      temp: {
        id: undefined,
        frequency: "",
        businessModel: '',
        deployTime: new Date(),
        power: '',
        deployAdress: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        deployAdress: [{ required: true, message: 'deployAdress is required', trigger: 'change' }],
        deployTime: [{ type: 'date', required: true, message: 'deployTime is required', trigger: 'blur' }],
        power: [{ required: true, message: 'power is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'blur' }],
        businessModel: [{ required: true, message: 'businessModel is required', trigger: 'blur'}],
        frequency: [{ required: true, message: 'frequency is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value1: '',
      value2: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
        // this.fetchData()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    //状态筛选
    filterTag(value, row) {
      return  row.status === value;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: "",
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
