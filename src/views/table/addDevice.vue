<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item label="激励器固件版本" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="运营商" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="工作频点" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="输出功率" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="频谱模式" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择频谱模式">
          <el-option label="模式1" value="shanghai" />
          <el-option label="模式2" value="beijing" />
          <el-option label="模式3" value="beijing" />
          <el-option label="模式4" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="数据格式" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择数据格式">
          <el-option label="RTCM23_GPS" value="shanghai" />
          <el-option label="RTCM32_GGB" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="通道" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择通道类型">
          <el-option label="通道0" value="shanghai" />
          <el-option label="通道1" value="shanghai" />
          <el-option label="通道2" value="shanghai" />
          <el-option label="通道3" value="shanghai" />
          <el-option label="通道4" value="shanghai" />
        </el-select>
      </el-form-item>

      <el-form-item label="差分类型" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择差分类型">
          <el-option label="RTK" value="shanghai" />
          <el-option label="RTD" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="复用类型" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择复用类型">
          <el-option label="CDMA" value="shanghai" />
          <el-option label="TDMA" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="配置后重启" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DeviceDetails',
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
