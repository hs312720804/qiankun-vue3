<template>
  <div class="content detail">
    <!-- {{ selectedServicer }} -->
    <!-- {{selectedScene}} -->
    <!-- canUse：{{ canUse }}
    <br/>

    havePermissionsToUse: {{ havePermissionsToUse}} -->
    <!-- {{ allChartData }} -->
    <!-- 复用接待员（ isCopiedServicer: true ）不允许编辑：
      【我的任务】、
      【入口条件】：-新建，编辑、删除、粘贴 不可用；  -多选、复制可用
      【出口条件】：-新建，编辑、删除、粘贴 不可用；  -多选、复制可用
      【擅长】、
      接待员dropdown: 【重命名】、【复用】、【复制】
    -->

    <!-- 没有权限的（ canUse：false ）不允许编辑：
      【我的任务】、
      【入口条件】：-新建，编辑、删除、粘贴 不可用；  -多选、复制可用
      【出口条件】：-新建，编辑、删除、粘贴 不可用；  -多选、复制可用
      【擅长】、
      接待员dropdown：【重命名】、【下架】、【删除】
      场景dropdown：【重命名】、【下架】、【投放】、【删除】
      【绩效目标】所有编辑功能
    -->

    <!-- <div class="detail-box top-div">
      <span class="detail-name">
        <span>
          {{ selectedServicer.receptionist }}
        </span>
      </span>

      <template v-if="isCopiedServicer">
        <div class="top-box">
          <div class="top-box-title">复用自</div>
          <el-button class="top-line" type="text" @click="redirctToScene(selectedServicer.refSceneId, selectedServicer.referenceId)" style="text-align: left; color: #66b1ff">{{ selectedServicer.refSceneName }} - {{ selectedServicer.receptionist }}</el-button>
        </div>
        <div class="top-box">
          <div class="top-box-title">复用时间</div>
          <div class="top-line"><span class="border-style">{{ selectedServicer.createTime || '-'}}</span></div>
        </div>

      </template>

      <template v-else>
        <div class="top-box">
          <div class="top-box-title">创建人</div>
          <div class="top-line" ><span class="border-style">{{ selectedServicer.userName || '-'}}</span></div>
        </div>
        <div class="top-box">
          <div class="top-box-title">创建时间</div>
          <div class="top-line" ><span class="border-style">{{ selectedServicer.createTime || '-'}}</span></div>
        </div>
      </template>
      <div class="top-box">
        <div class="top-box-title">业务范围</div>
        <div class="top-line" ><span class="border-style">方案： {{ selectedServicer.planId || '-' }} {{ selectedServicer.planName || '-' }}</span></div>
      </div>
    </div> -->
    <!-- <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;"> -->
    <!-- <div style="display: grid; grid-template-columns:2fr 250px; grid-template-rows: auto; gap: 16px;"> -->
      <!-- <div style="display: flex; gap: 16px;"> -->
        <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;">
          <div style="display: flex;flex-direction: column; gap: 16px; flex: 1; margin-right: 255px;" >
            <div class="detail-box">

              <div class="detail-name">
                <span class="detail-name-title" :title="selectedServicer.receptionist">
                  {{ selectedServicer.receptionist }}
                </span>
                <span style="font-size: 14px; color: #666; margin-left: 20px">
                  人群ID:
                  {{ selectedServicer.planId || '-' }}
                  <!-- {{ selectedServicer.planName || '-' }} -->
                </span>
              </div>

              </div>

              <!-- 绩效目标 -->
              <performanceGoalData
                v-if="isDoudi"
                :selectedServicer="selectedServicer"
                :selectedScene="selectedScene"
              >
              </performanceGoalData>
              <!-- 当选择兜底接待员时，不展示入口条件、推荐绑定内容、出口条件 -->
              <div v-if="selectedServicer.type !== 1" class="detail-box">
                <div class="title2">
                  入口条件
                  <tooltip
                    v-if="!havePermissionsToUse"
                    :disabled="false"
                    :content="!canUse ? '仅创建人、上级才可编辑入口条件' : '复用接待员不支持修改入口条件'"
                    type="icon">
                  </tooltip>

                </div>
                <el-button v-if="havePermissionsToUse" type="text" @click="pasteRules('entry')" class="position-right" icon="el-icon-document-copy">粘贴条件</el-button>
                <div v-if="entryList.length > 0" class="position-left">
                  <!-- {{ checkList }} -->
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <el-button :disabled="checkList.length === 0" type="text" @click="copyRules(entryList, 'entry')" style="margin-left: 15px">复制</el-button>
                </div>
                <div class="set-start">

                  <div v-if="entryList.length === 0" class="no-data-wrap">
                    <div class="noData"></div>
                    <!-- 暂时木有内容呀～～ -->
                  </div>

                  <div v-for="entry in entryList" :key="entry.id" class="info-class">
                    <el-checkbox-group v-model="checkList" @change="checkListChange('entry')">
                      <el-checkbox :label="entry.id" :key="entry.id">
                      </el-checkbox>
                    </el-checkbox-group>

                    <!-- <div class="item-id">{{ entry.id }}</div> -->
                    <showAndUpdateRule
                      v-if="entry.id"
                      :ruleItem="{...entry, ruleType: 'entry'}"
                      :conditionEnum="conditionEnum"
                      :soureceSignList="soureceSignList"
                      :servicer="servicer"
                      :havePermissionsToUse="havePermissionsToUse"
                      :isCopiedServicer="isCopiedServicer"
                      :canUse="canUse"
                      @selectServicer="(id) => $emit('selectServicer', id)"
                      :servicerListFilterSelect="servicerListFilterSelect"
                      :selectedScene="selectedScene"
                      :selectedServicer="selectedServicer"
                      @updataExportList="$emit('updataExportList'); getFlowChart()"
                      @updataEntryList="$emit('updataEntryList')"
                    >
                    </showAndUpdateRule>

                    <!-- <div v-if="havePermissionsToUse" class="drop-class" >
                      <el-dropdown @command="handleCommand" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
                        <span class="el-dropdown-link" >
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" :command="['editEntry', entry]">
                            编辑
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['deleteEntry', entry]">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div> -->

                  </div>

                  <!-- 选择了接待员时 且 不是复用的 且 有权限 显示-->
                  <div class="box-fotter addRule" v-if="havePermissionsToUse">
                    <!-- <el-button>添加</el-button> -->
                    <!-- <el-button type="text" icon="el-icon-plus" @click="createClient">新建入口条件</el-button> -->
                    <el-button type="primary" icon="el-icon-plus" @click="createClient">新建入口条件</el-button>
                  </div>
                </div>
              </div>

              <!-- 当选择兜底接待员时，不展示入口条件、推荐绑定内容、出口条件 -->
              <!-- 推荐绑定内容 -->
              <div v-if="selectedServicer.type !== 1 &&entryList && entryList.length > 0 && tagCodeList.length > 0"  class="detail-box">
                <div class="title2">
                  内容推荐
                  <tooltip
                    v-if="!havePermissionsToUse"
                    :disabled="false"
                    :content="!canUse ? '仅创建人、上级才可编辑内容推荐' : '复用接待员不支持修改内容推荐'"
                    type="icon">
                  </tooltip>
                </div>
                <div class="border-line info-class" style="display: block" v-loading="recommendLoading">

                  <div class="bav-wrap" style="overflow: hidden;">
                    内容源：
                    <el-select v-model="selectSourceCode" :disabled="!havePermissionsToUse" @change="getUptmRecommendResourceList" class="select-source-sty">
                      <el-option
                        v-for="item in sourceList"
                        :label="item.sourceTitle"
                        :value="item.sourceCode"
                        :key="item.sourceCode">
                      </el-option>
                    </el-select>
                  </div>

                  <div v-for="(arr, key) in recommendResourceList" :key="key" class="recommend-list" >
                    <span class="border-title" >{{ getKeyName(key) }}：</span>
                    <!-- {{ arr }} -->
                    <template v-if="arr && arr.length > 0">
                      <span
                        v-for="film in arr"
                        :key="film.id"
                        class="film-btn"
                        title="双击复制"
                        @dblclick="copyText(film.id + '-' + film.title)"
                      >
                        <!-- <el-popover
                          placement="top"
                          width="150px"
                          trigger="manual"
                          content="复制成功"
                          :value="popoverVisible === film.id + '-' + film.title">
                          <span slot="reference">{{ film.id }} - {{ film.title }}</span>
                        </el-popover> -->
                        <span>{{ film.id }} - {{ film.title }}</span>
                        <div class="tip" v-if="popoverVisible === film.id + '-' + film.title">
                          <div class="tip-trangle-bottom"></div>
                          复制成功
                        </div>
                      </span>
                    </template>
                    <span v-else class="no-data-text">暂无推荐</span>
                  </div>
                  <!-- {{ recommendResourceList }} -->
                </div>
              </div>

              <!-- 当选择兜底接待员时，不展示入口条件、推荐绑定内容、出口条件 -->
              <div v-if="selectedServicer.type !== 1" class="detail-box">
                <div class="title2">
                  出口条件
                  <tooltip
                    v-if="!havePermissionsToUse"
                    :disabled="false"
                    :content="!canUse ? '仅创建人、上级才可编辑出口条件' : '复用接待员不支持修改出口条件'"
                    type="icon">
                  </tooltip>
                </div>
                <el-button v-if="havePermissionsToUse" type="text" @click="pasteRules('export')" class="position-right" icon="el-icon-document-copy">粘贴条件</el-button>
                <div v-if="exportList.length > 0" class="position-left">
                  <!-- {{ exportCheckList }} -->
                  <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
                  <el-button :disabled="exportCheckList.length === 0" type="text" @click="copyRules(exportList, 'export')" style="margin-left: 15px">复制</el-button>
                </div>
                <div class="set-end">
                  <div v-if="exportList.length === 0" class="no-data-wrap">
                    <div class="noData"></div>
                    <!-- 暂时木有内容呀～～ -->
                  </div>
                  <div v-for="exportItem in exportList" :key="exportItem.id" class="info-class" :id="exportItem.id"  ref="exportRef">
                    <el-checkbox-group v-model="exportCheckList" @change="checkListChange('export')">
                      <el-checkbox :label="exportItem.id" :key="exportItem.id" >
                      </el-checkbox>
                    </el-checkbox-group>
                    <!-- <div class="item-id">{{ exportItem.id }}</div> -->

                    <showAndUpdateRule
                      v-if="exportItem.id"
                      :ruleItem="{...exportItem, ruleType: 'export'}"
                      :conditionEnum="conditionEnum"
                      :soureceSignList="soureceSignList"
                      :servicer="servicer"
                      :havePermissionsToUse="havePermissionsToUse"
                      :isCopiedServicer="isCopiedServicer"
                      :canUse="canUse"
                      @selectServicer="(id) => $emit('selectServicer', id)"
                      :servicerListFilterSelect="servicerListFilterSelect"
                      :selectedScene="selectedScene"
                      :selectedServicer="selectedServicer"
                      @updataExportList="$emit('updataExportList'); getFlowChart()"
                      @updataEntryList="$emit('updataEntryList')"
                    >
                    </showAndUpdateRule>

                    <!-- <div class="turn-servicer" v-if="exportItem.stopType === 1">
                      转
                      <el-button type="text" @click="redirctByNextId(exportItem.nextId)">{{ getServicerBynextId(exportItem.nextId).receptionist }} </el-button>
                    </div>
                    <div v-else class="turn-servicer">{{ getStopTypeName(exportItem.stopType)}}</div>
                    <div v-if="(!isCopiedServicer || exportItem.stopType === 1) && canUse"  class="drop-class">
                      <el-dropdown @command="handleCommandExport" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom">
                        <span class="el-dropdown-link">
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" :command="['editExport', exportItem]">
                            编辑
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['deleteExport', exportItem]" v-if="havePermissionsToUse">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                    <div v-if="exportItem.stopType === 1 && !exportItem.nextId" style="color: red;">
                      <i class="el-icon-warning"></i>
                      <span style="font-size: 12px; margin-left: 5px">下一步不可为空</span>
                    </div> -->

                  </div>
                  <div class="box-fotter addRule" v-if="havePermissionsToUse" >
                    <!-- <el-button>添加</el-button> -->
                    <el-button type="primary" icon="el-icon-plus" @click="createExport">新建出口条件</el-button>
                  </div>
                </div>
              </div>

          </div>
        </el-scrollbar>

        <div style="position: absolute; bottom: 0; top: 0; right: 0;">
          <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;">
            <div style="display: flex; flex-direction: column; gap: 16px; width:255px; padding: 0 20px 0 16px" >

              <div class="detail-box" v-if="isShowDetailName" style="padding: 0 12px;">
                <!-- <i @click="openShowDetailName" class="el-icon-arrow-up fold position-right"></i> -->
                <div>
                  <!-- <div class="detail-name" >
                    <span>
                      {{ selectedServicer.receptionist }}
                    </span>
                    <div class="detail-name-border"></div>

                  </div> -->
                  <div class="d-info" >
                    <!-- 复用的接待员 -->
                    <template v-if="isCopiedServicer">
                      <div class="d-info-box">
                        <div class="box-title">复用自</div>
                        <el-button class="box-line" type="text" @click="redirctToScene(selectedServicer.refSceneId, selectedServicer.referenceId)" style="text-align: left; color: #66b1ff">{{ selectedServicer.refSceneName }} - {{ selectedServicer.receptionist }}</el-button>
                      </div>
                      <div class="d-info-box">
                        <div class="box-title ">复用时间</div>
                        <div class="box-line"><span class="border-style">{{ selectedServicer.createTime || '-'}}</span></div>
                      </div>
                      <div class="d-info-box">
                        <div class="box-title">
                          擅长(可选)

                          <tooltip
                            v-if="!havePermissionsToUse"
                            :disabled="false"
                            :content="!canUse ? '仅创建人、上级才可编辑擅长' : '复用接待员不支持修改擅长'"
                            type="icon">
                          </tooltip>

                        </div>
                        <div class="box-line" >{{ selectedServicer.skillName || '-'}}</div>
                      </div>

                    </template>

                    <template v-else>
                      <div class="d-info-box">
                        <div class="box-title">创建人</div>
                        <div class="box-line" ><span class="border-style">{{ selectedServicer.userName || '-'}}</span></div>
                      </div>
                      <div class="d-info-box">
                        <div class="box-title ">创建时间</div>
                        <div class="box-line " ><span class="border-style">{{ selectedServicer.createTime || '-'}}</span></div>
                      </div>
                      <div class="d-info-box">
                        <div class="box-title">
                          擅长(可选)

                          <tooltip
                            v-if="!canUse"
                            :disabled="false"
                            content="仅创建人、上级才可编辑擅长"
                            type="icon">
                          </tooltip>
                        </div>
                        <div v-if="selectedServicer.id" class="box-line" >
                          <el-select
                            ref="selectObj"
                            v-model="skillValue"
                            placeholder="选择技能"
                            @change="selectSkill"
                            :popper-append-to-body="false"
                            :disabled="!canUse"
                            @visible-change="skillValueSelectVisibleChange"
                          >
                            <!-- @blur="addOption"
                            @keyup.enter.native="addOption" -->
                            <div class="options-wrap">

                              <el-option
                                v-for="item in skillOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </div>

                            <div class="operate-wrap">
                              <el-form ref="formInlineRef" :model="formInline" :rules="formInlineRule">
                                <el-form-item prop="skillName">
                                  <el-input
                                    v-model="formInline.skillName"
                                    placeholder="技能分类"
                                    @keyup.enter.native="addOption"
                                    clearable
                                    >
                                    <el-button slot="append" type="primary" @click="addOption" icon="el-icon-plus"></el-button>
                                  </el-input>
                                </el-form-item>

                              </el-form>
                            </div>

                            <div slot="empty" class="operate-wrap">
                              <el-form ref="formInlineClearRef" :model="formInline" :rules="formInlineRule">
                                <el-form-item prop="skillName">
                                  <el-input
                                    v-model="formInline.skillName"
                                    placeholder="技能分类"
                                    @keyup.enter.native="addOption"
                                    clearable
                                  >
                                    <el-button slot="append" type="primary" @click="addOption" icon="el-icon-plus"></el-button>
                                  </el-input>
                                </el-form-item>
                              </el-form>
                            </div>
                          </el-select>
                        </div>
                        <div v-else class="box-line" >-</div>

                      </div>
                    </template>

                    <div class="d-info-box">
                      <div class="box-title">
                        接待员类型
                        <span v-if="isDoudi" class="tip-text">仅支持创建一个兜底</span>
                      </div>
                      <div class="box-line">
                        <!-- <el-radio v-model="radio1" label="1" style="margin: 3px 0">普通接待员</el-radio>
                        <el-radio v-model="radio1" label="2">兜底接待员</el-radio> -->
                        <span class="border-style">
                          <!-- isDoudi 代表为兜底接待员  -->
                          {{ isDoudi ? '兜底接待员' : '普通接待员' }}
                        </span>
                        <el-radio-group v-if="isDoudi" v-model="radio2" @input="handleTypeChange" class="doudi-type-radio" >
                          <div>
                            <el-radio :label="0">直接兜底</el-radio>
                            <!-- <el-popover
                              placement="top"
                              trigger="hover"
                              class="popover-button"
                            >
                              <div>如果没有匹配的接待员，则直接流转到该兜底接待员</div>
                              <i class="el-icon-question el-icon-question-tip" slot="reference"></i>
                            </el-popover> -->
                            <el-tooltip class="item" effect="dark" content="如果没有匹配的接待员，则直接流转到该兜底接待员" placement="top-start">
                              <i class="el-icon-question el-icon-question-tip"></i>
                            </el-tooltip>
                          </div>

                          <div>
                            <el-radio :label="1">先随机再兜底</el-radio>
                            <el-tooltip class="item" effect="dark" content="如果没有匹配的接待员，则先在全部接待员中随机流转一圈后再流转到该兜底接待员" placement="top-start">
                              <i class="el-icon-question el-icon-question-tip"></i>
                            </el-tooltip>

                          </div>
                        </el-radio-group>
                      </div>
                    </div>
                    <div class="d-info-box" style="position: relative">
                      <div class="box-title">
                        用途描述
                        <!-- 无权限时进行提示 -->
                        <tooltip
                          v-if="!havePermissionsToUse"
                          :content="!canUse ? '仅创建人、上级才可编辑': '复用接待员不支持修改'"
                          :disabled="false"
                          type="icon">
                        </tooltip>
                      </div>

                      <i v-if="!isEdit && havePermissionsToUse" @click="editTarget"  class="el-icon-edit position-right" style="top: 0" title="编辑我的任务" ></i>
                      <div class="box-line">
                        <!-- <div>请输入接待员的目标<i class="el-icon-edit"></i></div> -->

                        <div class="flex-content">
                          <!-- 复用的接待员 -->
                          <!-- 有权限的情况 -->
                          <template v-if="havePermissionsToUse">
                            <!-- 显示模式 -->
                            <div v-if="!isEdit" @click="editTarget" class="target-text target-info">
                              <div>{{ target }}</div>
                              <!-- <textarea name="description" v-model="target"></textarea> -->
                            </div>
                            <!-- <textarea> </textarea> -->
                            <!-- <span v-if="selectedServicer.id" class="text-over"></span> -->
                            <!-- <el-input v-else type="text" ref="inputPriority" size="small" @blur="editStatuChange" v-model="target"></el-input> -->
                            <!-- 编辑模式 -->
                            <el-input
                              v-else
                              ref="inputPriority"
                              :autosize="{ minRows: 6}"
                              type="textarea"
                              placeholder="请输入内容"
                              @blur="editStatuChange"
                              v-model="target"
                              maxlength="200"
                              show-word-limit
                              style="font-size: 14px; ">
                            </el-input>
                          </template>
                          <!-- 没有权限的情况 -->
                          <template v-else>
                            {{ target }}
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="d-info-box">
                      <div class="box-title">业务范围</div>
                      <div class="box-line" ><span class="border-style">方案： {{ selectedServicer.planId || '-' }} {{ selectedServicer.planName || '-' }}</span></div>
                    </div> -->
                  </div>
                  <!-- <div style="text-align: center;">业务范围</div> -->
                  <!-- <div class="detail-business-type">
                    方案：

                    <div class="panel-footer"></div>

                  </div> -->
                </div>
              </div>
              <div v-else class="detail-name-brief" @click="openShowDetailName">
                {{ selectedServicer.receptionist ? selectedServicer.receptionist.substring(0, 2) : '' }}
              </div>

              <!-- <div class="detail-box">
                <div class="target">我的任务（可选）</div>
                <i v-if="!isEdit && havePermissionsToUse" @click="editTarget"  class="el-icon-edit position-right" title="编辑我的任务" ></i>

                <div class="flex-content">
                  复用的接待员
                  有权限的情况
                  <template v-if="havePermissionsToUse">
                    显示模式
                    <div v-if="!isEdit" @click="editTarget" class="target-text target-info">
                      <div>{{ target }}</div>
                    </div>
                    编辑模式
                    <el-input
                      v-else
                      ref="inputPriority"
                      :autosize="{ minRows: 6}"
                      type="textarea"
                      placeholder="请输入内容"
                      @blur="editStatuChange"
                      v-model="target"
                      maxlength="200"
                      show-word-limit
                      style="font-size: 14px; ">
                    </el-input>
                  </template>
                  没有权限的情况
                  <template v-else>
                    {{ target }}
                  </template>
                </div>
              </div> -->
              <div class="detail-box" id="servicer-map">
                <div class="target">流转关系</div>
                <ServicerMap
                  v-if="isShowServicerChartData && servicerChartData.nodes && servicerChartData.nodes.length > 0"
                  :chartData="servicerChartData"
                  :selectedServicerId="selectedServicer.id"
                  style="margin: 0 -10px; user-select: none"
                  @selectServicer="(id) => $emit('selectServicer', id)"
                  >
                </ServicerMap>
                <span v-else>暂无数据</span>
              </div>
              <!-- 绩效目标 -->
              <performanceGoalData
                v-if="!isDoudi"
                :selectedServicer="selectedServicer"
                :selectedScene="selectedScene"
              >
              </performanceGoalData>
            </div>
          </el-scrollbar>
        </div>
      <!-- </div> -->
    <!-- </el-scrollbar> -->

    <!-- <el-dialog
      :title="(editClientRow ? '编辑' : '新建')+ '入口条件'"
      :visible.sync="clientDialogVisible"
      width="1200px"
      v-if="clientDialogVisible"
    >
      <createClientDialog ref="createClientDialog" :editRow="editClientRow" :options="options"></createClientDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- <el-dialog
      :title="(editExportRow ? '编辑' : '新建')+ '出口条件'"
      :visible.sync="exportDialogVisible"
      width="1200px"
      v-if="exportDialogVisible"
    >
      <createClientDialog
        ref="exportClientDialog"
        :editRow="editExportRow"
        type="export"
        :servicerListFilterSelect="servicerListFilterSelect"
        :options="options"
      ></createClientDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditExportRule">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- <el-dialog
      title="编辑复用出口条件"
      :visible.sync="reuseExportDialogVisible"
      width="700px"
      v-if="reuseExportDialogVisible"
    >
      <el-form
        :model="reuseForm"
        :rules="reuseFormRules"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="处理操作" prop="stopType" class="inline-form-item">
          <el-select v-model="reuseForm.stopType" clearable @change="handleStopTypeChange" disabled>
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value">
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="reuseForm.stopType === 1" prop="nextId" class="inline-form-item" style="margin-left: -100px;">
          <el-select v-model="reuseForm.nextId" clearable placeholder="请选择流转接待员">
            <el-option
              v-for="item in servicerListFilterSelect"
              :label="item.receptionist"
              :value="item.crowdId"
              :key="item.crowdId">
              {{ item.receptionist }}
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reuseExportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reuseExportRule">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 新增入口条件、新增出口条件的弹窗 -->
    <showAndUpdateRule
      ref="showAddDialogRef"
      mode="showAddDialog"
      :conditionEnum="conditionEnum"
      :soureceSignList="soureceSignList"
      :servicer="servicer"
      :servicerListFilterSelect="servicerListFilterSelect"
      :selectedScene="selectedScene"
      :selectedServicer="selectedServicer"
      @updataExportList="$emit('updataExportList'); getFlowChart()"
      @updataEntryList="$emit('updataEntryList')"
      >
    </showAndUpdateRule>

  </div>
  </template>

<script>
// import createClientDialog from './createClientDialog.vue'
// import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/IndexForStoryLine.vue'
// import ShowFlowConditionRule from './com/ShowFlowConditionRule.vue'
// import ShowFlowConditionRuleItem from './com/ShowFlowConditionRuleItem.vue'
// import ShowRule from './com/ShowRule.vue'
import { options } from './utils'

import ServicerMap from './mapShow/servicerMap.vue'
import showAndUpdateRule from '@/views/storyLine/com/showAndUpdateRule.vue'
import performanceGoalData from '@/views/storyLine/com/performanceGoalData.vue'
import tooltip from '@/views/storyLine/com/tooltip.vue'

export default {
  components: {
    // createClientDialog,
    // MultipleActionTagSelect,
    // ShowFlowConditionRule,
    // ShowFlowConditionRuleItem,
    // ShowRule,
    ServicerMap,
    showAndUpdateRule,
    performanceGoalData,
    tooltip
  },

  props: {
    servicer: {
      type: Array,
      default: () => []
    },
    selectedScene: {
      type: Object,
      default: () => {}
    },
    selectedServicer: {
      type: Object,
      default: () => {}
    },
    // skillOptions: {
    //   type: Array,
    //   default: () => []
    // },
    entryList: {
      type: Array,
      default: () => []
    },
    exportList: {
      type: Array,
      default: () => []
    },
    activeIndex2Id: {
      type: [Number, String],
      default: ''
    },
    styleType: {
      type: Boolean,
      default: true
    },
    canUse: { // 当前场景是否有权限
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowDetailName () {
      this.$nextTick(() => {
        for (const key of Object.keys(this.allCharts)) {
          const chart = this.allCharts[key]
          chart.resize()
        }
      })
    },
    entryList (val) {
      if (val.length > 0) {
        const returnArr = []

        val.forEach(item => {
          const ruleArr = JSON.parse(item.rulesJson).rules

          ruleArr.forEach(z1Item => {
            z1Item.rules.forEach(z2Item => {
              if (z2Item.tagKey === 'filmModelTag' && returnArr.findIndex(reItem => reItem.tagCode === z2Item.tagCode) === -1) {
                returnArr.push(z2Item)
              }
            })
          })
        })

        this.tagCodeList = returnArr
        this.getUptmRecommendResourceList()
      }
    },
    styleType () {
      // 刷新图表
      this.refreshChart()
    },
    selectedServicer: {
      handler (val) {
        // 选择接待员时，更新接待员详情数据
        this.skillValue = val.skillId // 技能
        this.target = val.myTask || '我的任务是...'// 任务
        this.targetValue = val.indicators || ''// 绩效指标
        this.radio2 = this.selectedServicer.planc // 兜底方法
        // 入口多选 置空
        this.clearEntry()
        // 出口多选 置空
        this.clearExport()

        // 清空绩效图表
        // this.allChartData = {}
        // for (const key of Object.keys(this.allCharts)) {
        //   const chart = this.allCharts[key]
        //   chart.clear()
        // }

        // 流转关系图
        this.getFlowChart()

        // // 判断是否有权限  现在不需要了，直接用场景的权限就可以了
        // this.getCanReuse()
        // const obj = this.targetKeyList.find(item => {
        //   return this.selectedServicer.indicatorsType === item.id
        // })

        // this.targetKey = obj ? obj.lable : '' // 目标指标
        // this.targetKeyId = obj ? obj.key : ''

        // if (obj) {
        //   // 曲线图
        //   this.getPerformanceGoalData()
        // }
      }
    },
    'selectedScene.id': {
      handler () {
        this.getSkillListBySceneId()
      }
    }
    // 'selectedServicer.id': {
    //   handler () {
    //     // this.isShowServicerChartData = false
    //     // this.$nextTick(() => {
    //     //   this.isShowServicerChartData = true
    //     // })
    //   }
    // }
  },
  computed: {
    isDoudi () {
      return this.selectedServicer.type === 1
    },
    isCopiedServicer () {
      return !!this.selectedServicer.referenceId
    },
    // 过滤掉除了自己的其他接待员 （同一场景）
    servicerListFilterSelect () {
      const data = this.servicer.filter(item => item.id !== this.activeIndex2Id)
      return data
    },

    // 编辑绩效目标，下拉框数据
    soureceSignListOptions () {
      return this.soureceSignList.map(item => {
        return {
          resourceId: item.sourceSign,
          resourceName: item.sourceName
        }
      })
    },
    havePermissionsToUse () {
      // canUse - 该场景是否有权限
      // isCopiedServicer - 是否为复用的接待员 true-是  false-否
      return this.selectedServicer.id && !this.isCopiedServicer && this.canUse
    }

  },
  data () {
    return {
      isShowServicerChartData: true,
      servicerChartData: {},
      options,
      // radio1: '1',
      radio2: 0,
      isShowDetailName: true,
      reuseExportDialogVisible: false,
      reuseForm: {
        stopType: '',
        nextId: ''
      },
      reuseFormRules: {
        stopType: [{ required: true, message: '请选择', trigger: 'change' }],
        nextId: [{ required: true, message: '请选择流转接待员', trigger: 'change' }]
      },
      // isCopiedServicer: false,
      checkList: [],
      exportCheckList: [],
      checkAll: false,
      isIndeterminate: false,
      checkAll2: false,
      isIndeterminate2: false,
      popoverVisible: '',
      recommendLoading: false,
      getGoalDataLoading: false,
      targetKeyFormParent: {
        id: '', // 接待员ID
        indicatorsType: '', // 1 会员付费率，2 会员成交单数 3 会员成交金额 4 会员客单价 5会员付费设备量 6 内容影片吸金订单量 7 订单转换率 8 订单均价 9 影片播放均价
        resource: [],
        videoSource: ''
      },

      indicatorsTypelabel: '',

      formInline: {
        skillName: ''
      },
      formInlineRule: {
        skillName: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      skillOptions: [],

      overview: {},
      clientDialogVisible: false,
      target: '我的任务是...',
      targetValue: '',
      skillValue: '',
      isEdit: false,
      isEditValue: false,

      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      editExportRow: {},
      exportDialogVisible: false,
      soureceSignList: [],
      sourceList: [], // 内容源
      selectSourceCode: 'tencent', // 所选内容源
      recommendResourceList: [], // 推荐影片
      tagCodeList: []
      // canUse: false // 当前接待员是否有权限操作
    }
  },
  created () {
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })

    this.$service.getSourceList().then(res => {
      this.sourceList = res
    })
  },
  mounted () {
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },

  methods: {
    handleCommand (command) {
      const rowObj = this.rowObj
      // rowObj.forEach(item => {
      //   // key 是代表 ref 值
      //   for (const key in item) {
      //     if (key === command) {
      //       item[key].isShow = !item[key].isShow
      //     }
      //   }
      // })
      for (const key in rowObj) {
        if (key === command) {
          const item = rowObj[key]
          item.isShow = !item.isShow
        }
      }
      this.$message('click on item ' + command)
    },

    getFlowChart () {
      this.isShowServicerChartData = false
      const params = {
        id: this.selectedServicer.id // 接待员ID
      }
      this.$service.receptionistFlowChart(params).then(res => {
        this.servicerChartData = res
        this.$nextTick(() => {
          this.isShowServicerChartData = true
        })
      })
    },
    skillValueSelectVisibleChange () {
      const ref = this.$refs.formInlineClearRef || this.$refs.formInlineRef
      console.log('ref--->', ref)
      ref && this.$refs.formInlineRef.resetFields()
    },
    handleTypeChange () {
      const params = {
        id: this.selectedServicer.id, // 接待员ID
        type: 1, // 0 普通接待员 1 兜底接待员
        planc: this.radio2 // 0 直接兜底 1,随机兜底
      }
      // 切换接待员类型
      this.$service.setReceptionistType(params)
      this.selectedServicer.planc = this.radio2
    },
    // getCanReuse () {
    //   this.canUse = false
    //   if (this.selectedServicer.id) {
    //     const params = {
    //       id: this.selectedServicer.id
    //     }
    //     this.$service.getCanReuse(params).then(res => {
    //       this.canUse = res || false
    //     })
    //   }
    // },
    openShowDetailName () {
      this.isShowDetailName = !this.isShowDetailName
    },
    // 编辑复用出口条件
    // reuseExportRule () {
    //   // this.editExportRow = row
    //   // if (this.isCopiedServicer) {
    //   //   this.reuseForm.stopType = row.stopType
    //   //   this.reuseForm.nextId = row.nextId || ''
    //   console.log('reuseForm--->', this.reuseForm)
    //   console.log('selectedServicer--->', this.selectedServicer)
    //   console.log('editExportRow--->', this.editExportRow)
    //   const parmas = {
    //     nId: this.selectedServicer.id,
    //     oId: this.selectedServicer.referenceId,
    //     exportId: this.editExportRow.id,
    //     ...this.reuseForm
    //   }
    //   this.$service.updateExport(parmas).then(res => {
    //     // 刷新列表
    //     this.$emit('updataExportList')
    //     // 流转关系图
    //     this.getFlowChart()
    //     this.reuseExportDialogVisible = false
    //   })
    // },
    handleStopTypeChange () {
      // 切换处理操作时，清空选择的流转接待员 ID
      this.form.nextId = ''
    },
    redirctToScene (sceneId, servicerId) {
      this.$emit('selectScene', sceneId, servicerId)
    },
    // 入口全选
    handleCheckAllChange (val) {
      // 出口多选 置空
      this.clearExport()

      const allIds = this.entryList.map(item => item.id)
      this.checkList = val ? allIds : []
      this.isIndeterminate = false
    },
    // 出口全选
    handleCheckAllChange2 (val) {
      // 入口多选 置空
      this.clearEntry()

      const allIds = this.exportList.map(item => item.id)
      this.exportCheckList = val ? allIds : []
      this.isIndeterminate2 = false
    },
    clearEntry () {
      this.checkList = [] // 入口多选 置空
      this.isIndeterminate = false // 入口多选 置空
      this.checkAll = false // 出口多选 置空
    },
    clearExport () {
      this.exportCheckList = [] // 出口多选 置空
      this.isIndeterminate2 = false // 出口多选 置空
      this.checkAll2 = false // 出口多选 置空
    },
    // 选项框选择： 入口 和 出口多选是互斥的,
    checkListChange (type) {
      if (type === 'entry') {
        // 出口多选 置空
        this.clearExport()

        const checkedCount = this.checkList.length

        this.checkAll = checkedCount === this.entryList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.entryList.length
      } else if (type === 'export') {
        // 入口多选 置空
        this.clearEntry()

        const checkedCount = this.exportCheckList.length

        this.checkAll2 = checkedCount === this.exportList.length
        this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.exportList.length
      }
    },
    // 复制条件
    copyRules (allRules, type = '') {
      if (this.checkList.length > 0 || this.exportCheckList.length > 0) {
        const parmas = {
          selectedIds: type === 'entry' ? this.checkList : this.exportCheckList,
          allRules,
          type
        }
        this.$store.commit('SET_COPY_ENTRY_ID', parmas)
        this.$message.success('复制成功')
      } else {
        this.$message.info('请勾选需要复制条件')
      }
    },
    // 粘贴条件
    pasteRules (pasteType) {
      const { type, selectedIds, allRules } = this.$store.state.configScheme.copyServiceRules

      if ((pasteType === 'export' && this.exportList.length === 10) || (pasteType === 'entry' && this.entryList.length === 10)) {
        return this.$message.error('最多只能创建 10 条，请删除条件后再粘贴')
      }

      if (selectedIds.length === 0) {
        return this.$message.error('请先复制条件')
      }
      if (type === pasteType) {
        const arr = []
        selectedIds.forEach(id => {
          const objData = allRules.find(ruleData => ruleData.id === id)
          // objData && this.savePasteRule(objData, type)
          if (objData) {
            arr.push(objData)
          }
        })
        Promise.all(arr.map((item) => this.savePasteRule(item, type))).then(res => {
          this.$message.success('粘贴成功')
        })
      } else {
        this.$message.error('入口条件、出口条件不允许混用')
      }
    },
    // 保存到后端
    savePasteRule (data, type) {
      const params = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionistId: this.selectedServicer.id,
        tagIds: data.tagIds,
        rulesJson: data.rulesJson,
        behaviorRulesJson: data.behaviorRulesJson,
        flowCondition: data.flowCondition, // 流转指标
        delFlag: 1,
        link: data.link,
        stopType: data.stopType
        // nextId
      }
      if (type === 'entry') {
        this.$service.addEntry(params).then(res => {
          // 刷新列表
          this.$emit('updataEntryList')
        })
      } else if (type === 'export') {
        this.$service.addExport(params).then(res => {
          // 刷新列表
          this.$emit('updataExportList')
        })
      }
    },

    // handleCopy () {
    //   const range = document.createRange() // 创建range对象
    //   range.selectNode(document.getElementById('copycode')) // 获取复制内容的 id 选择器
    //   const selection = window.getSelection() // 创建 selection对象
    //   if (selection.rangeCount > 0) selection.removeAllRanges() // 如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
    //   selection.addRange(range) // 将range对象添加到selection选区当中，会高亮文本块
    //   document.execCommand('copy') // 复制选中的文字到剪贴板
    //   this.$toast('复制成功')
    //   selection.removeRange(range) // 移除选中的元素
    // },
    copyText (str) {
      const input = document.createElement('input')
      const body = document.querySelector('body')
      body.append(input)
      input.value = str
      this.popoverVisible = str
      input.select()
      document.execCommand('copy')
      input.remove()

      // 2 秒后消失
      setTimeout(() => {
        this.popoverVisible = ''
      }, 2000)

      // this.$message({
      //   message: '复制成功',
      //   type: 'success'
      // })
    },
    getKeyName (key) {
      const obj = this.tagCodeList.find(item => Number(item.tagCode) === Number(key))
      return obj ? obj.tagCnName : ''
    },
    getUptmRecommendResourceList () {
      this.recommendLoading = true
      this.recommendResourceList = []
      const tagCodeList = this.tagCodeList
      if (tagCodeList.length > 0) {
        const tagCodes = tagCodeList.map(item => item.tagCode).join(',')
        const params = {
          source: this.selectSourceCode,
          tagCodes
        }
        this.$service.getTopRecommendResourceList(params).then(res => {
          this.recommendResourceList = res || []
          this.recommendLoading = false
        }).catch(() => {
          this.recommendResourceList = []
          this.recommendLoading = false
        })
      }
    },

    toPercent (point) {
      if (!point) return ''
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },

    // 新建入口条件
    createClient () {
      this.$refs.showAddDialogRef.editClientRow = undefined
      this.$refs.showAddDialogRef.clientDialogVisible = true
    },
    createExport  () {
      this.$refs.showAddDialogRef.editExportRow = undefined
      this.$refs.showAddDialogRef.exportDialogVisible = true
    },

    // 服务员选择技能
    async selectSkill (e) {
      // 先判断是否是选择了已有的ID
      // const existIdArr = this.skillOptions.filter(item => item.id === e)
      // if (existIdArr.length > 0) {
      this.$emit('editReceptionist', {
        id: this.selectedServicer.id,
        skillId: e
      })
    },

    addOption () {
      // if (this.formInline.skillName === '') {
      //   return this.$message.error('请输入技能分类')
      // }
      // console.log(this)
      // console.log(this.$refs)
      // console.log(this.$refs.formInlineRef)
      const ref = this.$refs.formInlineClearRef || this.$refs.formInlineRef

      // console.log('ref--------->', ref)

      // ref.validate(valid => {
      ref.validate(valid => {
        if (valid) {
          // // 创建新技能，并选中
          const parmas = {
            sceneId: this.selectedScene.id,
            name: this.formInline.skillName
          }

          this.$service.addSceneSkill(parmas, '添加成功').then(async res => {
            this.formInline.skillName = ''
            this.getSkillListBySceneId()
          })
        }
      })
    },
    // 根据场景ID获取技能列表
    getSkillListBySceneId () {
      const parmas = {
        sceneId: this.selectedScene.id
      }
      return this.$service.getSceneSkillList(parmas).then(res => {
        this.skillOptions = res || []
        return res
      })
    },

    editTargetValue () {
      // 有权限才能操作
      if (this.havePermissionsToUse) {
        this.isEditValue = true
        this.$nextTick(() => {
          this.$refs.inputValue.focus()
        })
      }
    },
    editTarget () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputPriority.focus()
      })
    },
    editStatuChange () {
      this.$emit('editReceptionist', {
        id: this.selectedServicer.id,
        myTask: this.target
      }, 'no-refresh-list')

      // this.editReceptionist({
      //   id: this.selectedServicer.id,
      //   myTask: this.target
      // }, 'no-refresh-list')

      this.selectedServicer.myTask = this.target
      this.isEdit = false
    }

  }
}
</script>

<style lang="stylus" scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'
.doudi-type-radio {
  margin-top: 10px
  ::v-deep .el-radio__label {
    font-size: 12px !important;
  }
  ::v-deep .el-radio {
    margin 3px
  }
}
</style>
