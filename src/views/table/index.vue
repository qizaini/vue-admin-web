<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
                        :filters="[{ text: '备份', value: '备份' },
                        { text: '运行', value: '备用' },
                        { text: '错误', value: '错误' },
                        { text: '异常', value: '异常' },
                        { text: '升级', value: '升级' },
                        { text: '停止', value: '停止' },
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
            Edit
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        运行: 'success',
        升级: 'gray',
        异常: 'danger',
        备份: '',
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
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
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
