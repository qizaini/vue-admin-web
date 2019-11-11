<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="6">
          <span class="demonstration">部署地点</span>&nbsp;
          <el-input v-model="listQuery.location" placeholder="请输入部署地点" size="medium" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" @change="getList"/>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="5">
          <span class="demonstration">状态</span>&nbsp;
          <el-select v-model="listQuery.txState" placeholder="请选择" size="medium" clearable style="width: 170px" class="filter-item" @change="getList">
            <el-option v-for="item in txState" :key="item" :label="item.name" :value="item.value"/>
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="13">

          <span class="demonstration">激活时间</span>&nbsp;
          <!--validate-event="true" 输入时是否触发表单的校验	-->
          <el-date-picker
            v-model="listQuery.activeTime"
            type="daterange"
            align="right"
            size="medium"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>&nbsp;&nbsp;&nbsp;
          <el-button type="primary" size="medium" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button type="primary" size="medium" icon="el-icon-edit" @click="open">添加</el-button>
          <!--<el-button type="primary" size="medium" icon="el-icon-download" @click="handleDownload">导出</el-button>-->
          <!--关闭、重启、关闭服务、重启服务-->
          <el-button type="info" icon="el-icon-circle-close" circle @click="closeTx"></el-button>
          <el-button type="info" icon="el-icon-refresh" circle @click="restartTx"></el-button>
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

      <el-table-column type="selection" :indeterminate="isIndeterminate" :class="checkbox" @change="handleCheckAllChange">
        <el-checkbox>
          <template slot-scope="scope">
            <span>{{ scope.row.rowKey }}</span>
          </template>
        </el-checkbox>
      </el-table-column>

      <!--<el-table-column type="selection" :indeterminate="isIndeterminate" :class="checkbox" @change="handleCheckAllChange"></el-table-column>-->
      <el-table-column v-if="true" align="center" label="序号" width="70"><!--v-if="false" 隐藏列-->
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="true" prop="rowKey" label="激励器" align="center" :class-name="getSortClass('rowKey')">
        <template slot-scope="scope">
          <span>{{ scope.row.rowKey }}</span>
        </template>
      </el-table-column>
        <el-table-column prop="location" label="部署地点" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.location }}</span>
          </template>
        </el-table-column>
      <el-table-column prop="freq" label="频点(MHz)" align="center" >
        <template slot-scope="scope">
          {{ scope.row.freq }}
        </template>
      </el-table-column>

      <el-table-column prop="avgPower" label="功率(w)" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.avgPower }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specMode" label="频谱模式" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.specMode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" sortable label="激活时间" width="180px">
        <template slot-scope="scope">
          <!--<i class="el-icon-time"/>-->
          <!--<span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{scope.row.activeTime | msgDateFormat('yyyy-mm-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" align="center" sortable label="开机时间" width="180px">
        <template slot-scope="scope">
          <span>{{scope.row.lastPowerOnTime | msgDateFormat('yyyy-mm-dd HH:mm:ss') }}</span>
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

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="270px">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" style="display: none">
            删除
          </el-button>
          <!--普通用户禁止编辑 disabled="false"-->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑信息</el-button>
          <!--<el-button type="warning" size="mini" @click="handleSingle(row)">编辑地点</el-button>-->
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确定编辑
          </el-button>
          <el-button type="warning" size="mini" @click="handleFetchDetail(row) ">查看详情</el-button>
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

    <!--查看日志-->
    <el-dialog
      title="查看日志"
      :visible.sync="dialogVisible"
      width="30%">
      <span>this is log.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--查看详情-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="outerVisible">
        <el-form :rules="rules" :model="temp" label-width="120px">
          <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :lg="12">
              <el-form-item label="工作频点:" prop="avgPower">
                {{temp.avgPower}}
              </el-form-item>
              <el-form-item label="输出频率:" prop="freq">
                {{temp.freq}}
              </el-form-item>
              <el-form-item label="工作频点:" prop="avgPower">
                {{temp.avgPower}}
              </el-form-item>
              <el-form-item label="频谱模式:" prop="specMode">
                {{temp.specMode}}
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12">
              <el-form-item label="激活时间:" prop="activeTime">
                {{temp.activeTime | msgDateFormat('yyyy-mm-dd HH:mm:ss')}}
              </el-form-item>
              <el-form-item label="配置更新时间:" prop="updateTime">
                {{temp.updateTime | msgDateFormat('yyyy-mm-dd HH:mm:ss')}}
              </el-form-item>
              <el-form-item label="上次开机时间:" prop="lastPowerOnTime">
                {{temp.lastPowerOnTime | msgDateFormat('yyyy-mm-dd HH:mm:ss')}}
              </el-form-item>
              <el-form-item label="状态:" prop="txState">
                {{temp.txState}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = true">查看日志</el-button>
        </div>
      </el-dialog>

      <!--编辑信息-->
      <el-dialog :title="textMap[dialogStatus]+this.temp.txId" :visible.sync="dialogFormVisible" custom-class="editMessage" v-dialogDrag :close-on-click-modal="false" width="40%">
        <div style="height: 300px;">
            <el-form ref="dataForm" :rules="rules" :model="temp" :label-position="labelPosition" label-width="120px">

            <el-tabs :tab-position="tabPosition">
              <!--第一个tabs-->
              <el-tab-pane label="基本配置">

                  <el-row :gutter="32">

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="部署地点" prop="power">
                        <el-input v-model="temp.location" style="width: 65%"/>
                      </el-form-item>
                    </el-col>

                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="发射频点(MHz)" prop="power">
                          <el-input v-model="temp.freq" style="width: 65%"/>
                        </el-form-item>
                      </el-col>

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="发射功率(w)" prop="power">
                        <!--Slider滑块  set(handles.slider1,'Max',100,'Min',1,'Value',1)-->
                        <el-slider v-model="temp.avgPower" :max="1000" show-input>
                        </el-slider>
                      </el-form-item>
                      <el-form-item label="模数功率比(dB)" prop="power">
                        <el-slider v-model="temp.adPowerRatio" :min='10' :max='30' show-input>
                        </el-slider>
                      </el-form-item>
                      <!--1->A1  2->A2  3->A3  4->A4 || 5->B1  6->B2  7->B3  8->B4-->
                      <el-form-item label="频谱模式" prop="power">
                        <el-radio v-model="temp.specMode" label="1">SBM1</el-radio>
                        <el-radio v-model="temp.specMode" label="2">SBM2</el-radio>
                        <el-radio v-model="temp.specMode" label="3">SBM3</el-radio>
                        <el-radio v-model="temp.specMode" label="4">SBM4</el-radio>
                        <el-radio v-model="temp.specMode" label="5">FBM1</el-radio>
                        <el-radio v-model="temp.specMode" label="6">FBM2</el-radio>
                        <el-radio v-model="temp.specMode" label="7">FBM3</el-radio>
                        <el-radio v-model="temp.specMode" label="8">FBM4</el-radio>
                      </el-form-item>
                    </el-col>

                  </el-row>
              </el-tab-pane>

              <!--第二个tabs-->
              <el-tab-pane label="高级配置">

                  <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="硬件版本" prop="power">
                        <el-input v-model="temp.hardVersion" disabled="false" style="width: 65%"/>
                      </el-form-item>
                      <el-form-item label="软件版本" prop="power">
                        <el-input v-model="temp.softVersion" disabled="false" style="width: 65%"/>
                      </el-form-item>
                      <!--<el-form-item label="定时启动时间" prop="power">
                        <el-date-picker placeholder="选择日期时间" type="datetime" style="width: 65%"/>
                      </el-form-item>-->
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="通道数量" prop="power">
                        <el-input v-model="temp.serviceNum" style="width: 65%"/>
                      </el-form-item>
                      <el-form-item label="时延补偿(ns)" prop="power">
                        <el-input v-model="temp.timeDelayCompensation" style="width: 65%"/>
                      </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="超帧长度" prop="power">
                        <!--Slider滑块-->
                        <el-slider v-model="temp.subFrameNum" :min='2' :max='255' show-input>
                        </el-slider>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="CDRadio" prop="power">
                        <el-tooltip :content="'Switch value: ' + temp.cDRadioEnable" placement="top">
                          <el-switch
                            v-model="temp.cDRadioEnable"
                            inactive-color="grey"
                            active-text="开启"
                            inactive-text="关闭"
                            active-value="01"
                            inactive-value="00">
                          </el-switch>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="预失真" prop="power">
                        <el-tooltip :content="'Switch value: ' + temp.dpdEnable" placement="top">
                          <el-switch
                            v-model="temp.dpdEnable"
                            inactive-color="grey"
                            active-text="开启"
                            inactive-text="关闭"
                            active-value="01"
                            inactive-value="00">
                          </el-switch>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="22">
                      <el-form-item label="授时" prop="power">
                        <el-tooltip :content="'Switch value: ' + temp.timeServiceEnable" placement="top">
                          <el-switch
                            v-model="temp.timeServiceEnable"
                            inactive-color="grey"
                            active-text="开启"
                            inactive-text="关闭"
                            active-value="01"
                            inactive-value="00">
                          </el-switch>
                        </el-tooltip>
                      </el-form-item>
                    </el-col>

                  </el-row>
                <!--</el-form>-->

              </el-tab-pane>

              <!--第三个tabs/Collapse 折叠面板-->
              <el-tab-pane label="FM    配置">
                <el-row :gutter="32">
                  <el-col :xs="24" :sm="24" :lg="24">
                    <el-form-item label="FM" prop="power">
                      <el-tooltip :content="'Switch value: ' + temp.fMEnable" placement="top">
                        <el-switch
                          v-model="temp.fMEnable"
                          @change="fmEnable"
                          inactive-color="grey"
                          active-text="开启"
                          inactive-text="关闭"
                          active-value="01"
                          inactive-value="00">
                        </el-switch>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :sm="24" :lg="24">
                    <el-form-item label="FM声道" prop="power">
                      <el-radio v-model="temp.vocalTract" :disabled="closePre" label="02">立体声</el-radio>
                      <el-radio v-model="temp.vocalTract" :disabled="closePre" label="01">单声道</el-radio>
                    </el-form-item>
                    <!--暂定只有以下值可选：自动（01），数字（01），模拟（00）;自动：不可选，手动：可选数字、模拟-->
                    <el-form-item label="FM音频输入源" prop="power">
                      <el-radio v-if="((temp.audioSource === '0101') || (temp.audioSource === '0000') || (temp.audioSource === '0001'))" v-model="temp.audioSource" label="0101" @change="audioSourceEvent" :disabled="closePre" >自动</el-radio>
                      <el-radio v-if="temp.audioSource === '0100'" v-model="temp.audioSource" label="0100" @change="audioSourceEvent" :disabled="closePre" >自动</el-radio>
                      <el-radio v-model="temp.audioSource" label="0001" :disabled="closePre" >数字</el-radio>
                      <el-radio v-model="temp.audioSource" label="0000" :disabled="closePre" >模拟</el-radio>
                    </el-form-item>
                    <el-form-item label="FM预加重" prop="power">
                      <el-radio v-model="temp.preAggravation" label="00" :disabled="closePre" class="radio">关闭</el-radio>
                      <el-radio v-model="temp.preAggravation" label="01" :disabled="closePre" class="radio">50us</el-radio>
                      <el-radio v-model="temp.preAggravation" label="02" :disabled="closePre" class="radio">75us</el-radio>
                    </el-form-item> </el-col>

                  <el-col :xs="24" :sm="24" :lg="22">
                    <el-form-item label="FM调制度" prop="power">
                      <!--Slider滑块-->
                      <el-slider v-model="temp.modulation" :min='10' :max='150' show-input :disabled="closePre" >
                      </el-slider>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-tab-pane>

              <!--四个tabs/Collapse 折叠面板-->
              <el-tab-pane label="业务配置">

                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="业务1" name="1">
                      <el-row :gutter="32">
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="LDPC块数" prop="power">
                            <el-slider v-model="temp.service1LdpcNum" :min='1' :max='31' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="交织深度" prop="power">
                            <el-slider v-model="temp.service1IntvNum" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="扩展倍率" prop="power">
                            <el-slider v-model="temp.service1ExpandTime" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="24">
                          <el-form-item label="LDPC码率" prop="power">
                            <el-select v-model="temp.service1LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                              <el-option
                                v-for="item in service1LdpcRate"
                                :key="item.service1LdpcRate"
                                :label="item.name"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                          <el-col :xs="24" :sm="24" :lg="24">
                          <el-form-item label="映射方式" prop="power">
                            <el-select v-model="temp.service1MapMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in service1MapMode"
                                :key="item.service1MapMode"
                                :label="item.name"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="封装格式" prop="power">
                            <el-select v-model="temp.service1SealMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in service1SealMode"
                                :key="item"
                                :label="item.name"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                            <el-form-item label="授权序列" prop="power">
                            <el-input v-model="temp.service1AuthorList" style="width: 60%"/>
                          </el-form-item>
                        </el-col>

                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="业务2" name="2">
                      <el-row :gutter="32">
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="LDPC块数" prop="power">
                            <el-slider v-model="temp.service2LdpcNum" :min='1' :max='31' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="交织深度" prop="power">
                            <el-slider v-model="temp.service2IntvNum" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="扩展倍率" prop="power">
                            <el-slider v-model="temp.service2ExpandTime" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="24">
                          <el-form-item label="LDPC码率" prop="power">
                            <el-select v-model="temp.service2LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service2LdpcRate"
                                :label="item.label"
                                :value="item.service2LdpcRate">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="映射方式" prop="power">
                            <el-select v-model="temp.service2MapMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service2MapMode"
                                :label="item.label"
                                :value="item.service2MapMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="封装格式" prop="power">
                            <el-select v-model="temp.service2SealMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service2SealMode"
                                :label="item.label"
                                :value="item.service2SealMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="授权序列" prop="power">
                            <el-input v-model="temp.service2AuthorList" style="width: 60%"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="业务3" name="3">
                      <el-row :gutter="32">
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="LDPC块数" prop="power">
                            <el-slider v-model="temp.service3LdpcNum" :min='1' :max='31' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="交织深度" prop="power">
                            <el-slider v-model="temp.service3IntvNum" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="扩展倍率" prop="power">
                            <el-slider v-model="temp.service3ExpandTime" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="24">
                          <el-form-item label="LDPC码率" prop="power">
                            <el-select v-model="temp.service3LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service3LdpcRate"
                                :label="item.label"
                                :value="item.service3LdpcRate">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="映射方式" prop="power">
                            <el-select v-model="temp.service3MapMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service3MapMode"
                                :label="item.label"
                                :value="item.service3MapMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="封装格式" prop="power">
                            <el-select v-model="temp.service3SealMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service3SealMode"
                                :label="item.label"
                                :value="item.service3SealMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="授权序列" prop="power">
                            <el-input v-model="temp.service3AuthorList" style="width: 60%"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="业务4" name="4">
                      <el-row :gutter="32">
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="LDPC块数" prop="power">
                            <el-slider v-model="temp.service4LdpcNum" :min='1' :max='31' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="交织深度" prop="power">
                            <el-slider v-model="temp.service4IntvNum" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="22">
                          <el-form-item label="扩展倍率" prop="power">
                            <el-slider v-model="temp.service4ExpandTime" :min='1' :max='16' show-stops show-input>
                            </el-slider>
                          </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="24">
                          <el-form-item label="LDPC码率" prop="power">
                            <el-select v-model="temp.service4LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service4LdpcRate"
                                :label="item.label"
                                :value="item.service4LdpcRate">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="映射方式" prop="power">
                            <el-select v-model="temp.service4MapMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service4MapMode"
                                :label="item.label"
                                :value="item.service4MapMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="封装格式" prop="power">
                            <el-select v-model="temp.service4SealMode" placeholder="请选择映射方式" style="width: 60%">
                              <el-option
                                v-for="item in options"
                                :key="item.service4SealMode"
                                :label="item.label"
                                :value="item.service4SealMode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="授权序列" prop="power">
                            <el-input v-model="temp.service4AuthorList" style="width: 60%"/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-collapse-item>

                  <el-collapse-item title="业务5" name="5">
                    <el-row :gutter="32">
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="LDPC块数" prop="power">
                          <el-slider v-model="temp.service5LdpcNum" :min='1' :max='31' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="交织深度" prop="power">
                          <el-slider v-model="temp.service5IntvNum" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="扩展倍率" prop="power">
                          <el-slider v-model="temp.service5ExpandTime" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="24">
                        <el-form-item label="LDPC码率" prop="power">
                          <el-select v-model="temp.service5LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service5LdpcRate"
                              :label="item.label"
                              :value="item.service5LdpcRate">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="映射方式" prop="power">
                          <el-select v-model="temp.service5MapMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service5MapMode"
                              :label="item.label"
                              :value="item.service5MapMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="封装格式" prop="power">
                          <el-select v-model="temp.service5SealMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service5SealMode"
                              :label="item.label"
                              :value="item.service5SealMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="授权序列" prop="power">
                          <el-input v-model="temp.service5AuthorList" style="width: 60%"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>

                  <el-collapse-item title="业务6" name="6">
                    <el-row :gutter="32">
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="LDPC块数" prop="power">
                          <el-slider v-model="temp.service6LdpcNum" :min='1' :max='31' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="交织深度" prop="power">
                          <el-slider v-model="temp.service6IntvNum" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="扩展倍率" prop="power">
                          <el-slider v-model="temp.service6ExpandTime" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="24">
                        <el-form-item label="LDPC码率" prop="power">
                          <el-select v-model="temp.service6LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service6LdpcRate"
                              :label="item.label"
                              :value="item.service6LdpcRate">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="映射方式" prop="power">
                          <el-select v-model="temp.service6MapMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service6MapMode"
                              :label="item.label"
                              :value="item.service6MapMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="封装格式" prop="power">
                          <el-select v-model="temp.service6SealMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service6SealMode"
                              :label="item.label"
                              :value="item.service6SealMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="授权序列" prop="power">
                          <el-input v-model="temp.service6AuthorList" style="width: 60%"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>

                  <el-collapse-item title="业务7" name="7">
                    <el-row :gutter="32">
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="LDPC块数" prop="power">
                          <el-slider v-model="temp.service7LdpcNum" :min='1' :max='31' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="交织深度" prop="power">
                          <el-slider v-model="temp.service7IntvNum" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="22">
                        <el-form-item label="扩展倍率" prop="power">
                          <el-slider v-model="temp.service7ExpandTime" :min='1' :max='16' show-stops show-input>
                          </el-slider>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :lg="24">
                        <el-form-item label="LDPC码率" prop="power">
                          <el-select v-model="temp.service7LdpcRate" placeholder="请选择LDPC码率" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service7LdpcRate"
                              :label="item.label"
                              :value="item.service7LdpcRate">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="映射方式" prop="power">
                          <el-select v-model="temp.service7MapMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service7MapMode"
                              :label="item.label"
                              :value="item.service7MapMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="封装格式" prop="power">
                          <el-select v-model="temp.service7SealMode" placeholder="请选择映射方式" style="width: 60%">
                            <el-option
                              v-for="item in options"
                              :key="item.service7SealMode"
                              :label="item.label"
                              :value="item.service7SealMode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="授权序列" prop="power">
                          <el-input v-model="temp.service7AuthorList" style="width: 60%"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>

                  </el-collapse>

              </el-tab-pane>
            </el-tabs>

          </el-form>
        </div>

       <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus===updateData()">
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
  import Vue from 'vue'

  export default {
    showFullScreenLoading,
    hideFullScreenLoading,
    components: { Pagination },
    directives: { waves },
    filters: {
      msgDateFormat: function(msg, pattern = '') {
        // 将字符串转换为Date类型
        var mt = new Date(msg * 1000)
        if (mt.toString() === 'Invalid Date') {
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
        labelPosition: 'left',
        tabPosition: 'left',// tabs位置
        location: '',
        activeNames: ['1'],
        dialogVisible: false,
        innerVisible: false,
        outerVisible: false,
        dialogFormVisible: false,
        dialogSingleVisible: false,
        tableKey: 0,
        list: [],
        total: 0,
        txState: [],
        service1SealMode: [],
        service1MapMode: [],
        service1LdpcRate: [],
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
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        showReviewer: false,
        closePre: false,
        temp: {
          id: undefined,
          rowKey: '',
          txId: '',
          location: '',
          avgPower: '',
          freq: '',
          aDPowerRatio: '',
          txState : '',
          specMode: '',
          updateTime: '',
          hardVersion: '',
          softVersion: '',
          cDRadioEnable: '',
          fMEnable: '',
          dpdEnable: '',
          timeServiceEnable: '',
          reportEnable: '',
          subFrameNum: '',
          serviceNum: '',
          audioSource: '',
          vocalTract: '',
          preAggravation: '',
          modulation: '',
          startTimeStamp: '',
          timeDelayCompensation: '',
          service1LdpcNum: '',
          service1IntvNum: '',
          service1LdpcRate: '',
          service1MapMode: '',
          service1ExpandTime: '',
          service1SealMode: '',
          service1AuthorList: '',
          service2LdpcNum: '',
          service2IntvNum: '',
          service2LdpcRate: '',
          service2MapMode: '',
          service2ExpandTime: '',
          service2SealMode: '',
          service2AuthorList: '',
          service3LdpcNum: '',
          service3IntvNum: '',
          service3LdpcRate: '',
          service3MapMode: '',
          service3ExpandTime: '',
          service3SealMode: '',
          service3AuthorList: '',
          service4LdpcNum: '',
          service4IntvNum: '',
          service4LdpcRate: '',
          service4MapMode: '',
          service4ExpandTime: '',
          service4SealMode: '',
          service4AuthorList: '',
          service5LdpcNum: '',
          service5IntvNum: '',
          service5LdpcRate: '',
          service5MapMode: '',
          service5ExpandTime: '',
          service5SealMode: '',
          service5AuthorList: '',
          service6LdpcNum: '',
          service6IntvNum: '',
          service6LdpcRate: '',
          service6MapMode: '',
          service6ExpandTime: '',
          service6SealMode: '',
          service6AuthorList: '',
          service7LdpcNum: '',
          service7IntvNum: '',
          service7LdpcRate: '',
          service7MapMode: '',
          service7ExpandTime: '',
          service7SealMode: '',
          service7AuthorList: '',
          activeTime: '',
          lastPowerOnTime: ''
        },
        cloneTemp: {},
        diffTemp: null,
        dialogStatus: '',
        textMap: {
          update: '正在编辑激励器',
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
        checkAll: false,
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
      closeTx(){
        this.$confirm('此操作将关闭激励器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '关闭成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          });
        });
      },
      restartTx(){
        this.$confirm('此操作将重启激励器, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '重启成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重启'
          });
        });
      },
      getList() {
        this.listLoading = false
        if (this.listQuery.updateTime !== '') {
          var time_arr = this.listQuery.updateTime.toString().split(',')
          var start_time = new Date(time_arr[0]).getTime() / 1000
          var end_time = new Date(time_arr[1]).getTime() / 1000
          this.listQuery.updateTime = [start_time, end_time]
        }
        fetchList(this.listQuery).then(response => {
          // this.list = response.result
          // this.total = response.result.length
          this.list = response
          this.total = response.length

          this.$set(response, 'edit', false)
          this.listQuery.location = response.location
          var result = response
          var state_arr = []
          var news_arr = []
          for (let i in result) {
            let state = result[i].txState
            if (!state_arr.includes(state)) {
              state_arr.push(state)
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
        var results = queryString ? location.filter(this.createFilter(queryString)) : location
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
        return row.txState === value
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
      /*handleCreate() {
        this.resetTemp()
        //默认状态为备用
        this.temp.txState = 'backups'
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },*/
    //当FM为关闭，则其他FM相关属性禁用
    fmEnable(){
      if (this.temp.fMEnable === '00'){
        this.closePre = true
      }else {
        this.closePre = false

      }
    },
  //进入编辑信息dialog
  handleUpdate(row) {
    this.temp = Object.assign({}, row) // copy obj
    var avg = this.temp.avgPower
    var ad = this.temp.adPowerRatio
    var sub = this.temp.subFrameNum
    var mo = this.temp.modulation
    var s1sRow = row.service1SealMode
    var s1sRow_arr = []
    var s1mRow = row.service1MapMode
    var s1mRow_arr = []
    var s1lRow = row.service1LdpcRate
    var s1lRow_arr = []

    //将滑块字符串转int类型
    this.temp.avgPower = parseInt(avg)   //模数功率比
    this.temp.adPowerRatio = parseInt(ad)//发射功率
    this.temp.subFrameNum = parseInt(sub)//子帧长度
    this.temp.modulation = parseInt(mo)  //调制度

    //备份一份原始数据
    this.cloneTemp = Object.assign({}, row)

    // 乘以1000让组件日期显示正常
    var nowTime = this.temp.startTimeStamp
    this.temp.startTimeStamp = nowTime * 1000

    //service1SealMode为1业务流，service1SealMode为2业务包
    if (s1sRow === '2'){
      s1sRow_arr.push({name:'业务包', value:s1sRow})
    }else if (s1sRow === '1') {
      s1sRow_arr.push({name:'业务流', value:s1sRow})
    }

    if (s1mRow === '0'){
      s1mRow_arr.push({name:'0', value:s1mRow})
    }else if (s1mRow === 'QPSK') {
      s1mRow_arr.push({name:'QPSK', value:s1mRow})
    }

    if (s1lRow === '0.4'){
      s1mRow_arr.push({name:'0.4', value:s1lRow})
    }else if (s1lRow === '0.5') {
      s1lRow_arr.push({name:'0.5', value:s1lRow})
    } else if (s1lRow === '0.6') {
      s1lRow_arr.push({name:'0.6', value:s1lRow})
    }

    this.service1SealMode = s1sRow_arr
    this.service1MapMode = s1mRow_arr
    this.service1LdpcRate = s1lRow_arr

    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  },
  updateData() {
    this.$refs['dataForm'].validate((valid) => {
      if (valid) {
        var nowTime = this.temp.startTimeStamp
        this.temp.startTimeStamp = nowTime / 1000

        for(let k in  this.temp) {
          //判断当前表单数据不等于克隆数据
          if(this.temp[k]  !=  this.cloneTemp[k]) {
            if (!this.diffTemp) {
              this.diffTemp = {};
            }

            this.diffTemp[k] = this.temp[k];
            this.diffTemp['rowKey'] = this.temp.rowKey;
          }
        }
        // console.log(this.diffTemp)
        showFullScreenLoading('.editMessage')
        // 1.克隆原始数据
        updateArticle(this.diffTemp).then(response => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          hideFullScreenLoading()
          this.getList()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    })
  },
  //进入查看详情dialog
  handleFetchDetail(row) {
    this.temp = Object.assign({}, row)
    let rowKey = this.temp.rowKey

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
    this.dialogStatus = 'detail'
    this.outerVisible = true
  },
  handleDownload() {
    this.downloadLoading = true
    import('@/vendor/Export2Excel').then(excel => {
      const tHeader = ['部署地点', '激活时间', '发射频点', '频谱模式', '发射功率', '状态']
      const filterVal = ['location', 'updateTime', 'freq', 'service1SealMode', 'avgPower', 'txState']
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
  // loading框设置局部刷新，且所有请求完成后关闭loading框
  let loading
  let needLoadingRequestCount = 0 // 声明一个对象用于存储请求个数
  function startLoading(targetdq) {
    loading = Vue.prototype.$loading({
      lock: true,
      text: '努力加载中...',
      background: 'rgba(255,255,255,.4)',
      target: document.querySelector(targetdq) // 设置加载动画区域
    })
  }

  function endLoading() {
    loading.close()
  }
  export function showFullScreenLoading(targetdq) {
    if (needLoadingRequestCount === 0) {
      startLoading(targetdq)
    }
    needLoadingRequestCount++
  }
  export function hideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
      endLoading()
    }
  }
</script>

