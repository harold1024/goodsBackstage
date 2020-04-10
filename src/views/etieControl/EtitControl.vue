<template>
  <div class="EtitControl">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>控制项库</span>
        <span style="float: right;">
          <el-button
            :disabled="evaluationStandard==1"
            class="green-btn"
            icon="el-icon-plus"
            size="medium"
            @click="dialogFormVisible = true"
          >添加控制项</el-button>
        </span>
      </div>
      <!-- :right-default-checked="defaultChecked" -->
      <tree-transfer
        v-loading="loading"
        :title="['控制项库', '所选控制项']"
        :from_data="fromData"
        :to_data="toData"
        :defaultTransfer="true"
        :defaultProps="{label:'label',disabled: 'disabled'}"
        @addBtn="add"
        @removeBtn="remove"
        :mode="mode"
        height="480px"
        filter
        :openAll="false"
        :renderContentLeft="renderContentLeft"
        :renderContentRight="renderContentRight"
        node-key="id"
        :default-expanded-keys="defaultExpand"
      ></tree-transfer>
    </el-card>
    <!-- Form -->
    <Modal
      title="添加控制项"
      :visible="dialogFormVisible"
      width="700px"
      @on-cancel="dialogFormVisible = false"
      @on-ok="addControlFormOK"
    >
      <el-form :model="controlItemForm" label-width="100px">
        <el-form-item label="控制域">
          <el-select
            v-model="controlItemForm.stage"
            placeholder="请选择控制域"
            @change="clearOtherStage1"
          >
            <el-option
              v-for="item in stages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="info" @click="creatCtrol">创建控制域</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="controlItemForm.newAddcontrolItem"
            placeholder="添加新控制域"
            v-show="newStage"
            @change="clearOtherStage2"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加控制项">
          <div v-for="index in newCtrolLen" :key="index">
            <div style="margin-bottom:10px;">
              <span class="inlineBlock">
                <el-input v-model="controlItemForm.name[index]"></el-input>
              </span>
              <span class="inlineBlock">
                <el-button type="info" icon="el-icon-connection" circle @click="selectlinkCtrol" />
              </span>
              <span v-show="linkCtrol" class="inlineBlock">
                关联控制项：
                <el-cascader
                  v-model="controlItemForm.relatedNames[index]"
                  :options="linkStages"
                  @change="handleChange"
                  clearable
                  :show-all-levels="false"
                  :collapse-tags="true"
                  :props="props"
                ></el-cascader>
              </span>
            </div>
          </div>
          <div>
            <el-tooltip effect="dark" content="添加控制项" placement="right">
              <el-button
                icon="el-icon-plus"
                circle
                class="green-btn"
                style="margin:5px 0;"
                @click="addCtrol"
              />
            </el-tooltip>
          </div>
        </el-form-item>
      </el-form>
    </Modal>
    <el-button
      type="info"
      style="float:right;margin:20px;"
      @click="nextStep()"
      :loading="btnLoading"
    >下一步</el-button>
    <!-- <el-button type="info" style="float:right;margin:20px;" @click="preStep()">上一步</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Modal from "@/components/Modal";
import treeTransfer from "el-tree-transfer";
import {
  getBaseTemplateMasterDomainByBaseTemplateId,
  getBaseTemplateStages,
  getCtrlItemsByBaseTemplateIdAndStageName,
  saveBaseTemplate,
  getAllBaseTemplateCtrItems,
  editBaseTemplate
} from "@/api/customTemplate";

export default {
  components: { treeTransfer, Modal },
  data() {
    return {
      btnLoading: false,
      loading: true,
      defaultExpand: [],
      showInput: false,
      mode: "transfer", // transfer addressList
      fixedFromData: [],
      fromData: [],
      toData: [],
      dialogFormVisible: false,
      stages: [],
      controlItemForm: {
        name: [],
        relatedNames: [],
        stage: "",
        newAddcontrolItem: ""
      },
      linkCtrol: false,
      newCtrolLen: 1,
      newStage: false,
      props: { multiple: true, value: "id" }, //层级选择可多选
      linkStages: [],
      baseTemplateId: this.$route.query.baseTemplateId,
      // evaluationStandard: parseInt(this.$route.query.evaluationStandard),
      evaluationStandard: this.$route.query.evaluationStandard,
      baseTemplateName: this.$route.query.baseTemplateName,
      type: this.$route.query.type, //type为0是新增，1是编辑
      stageData: [],
      defaultChecked: []
      // rightData: []
    };
  },

  computed: {
    ...mapGetters(["evalStandards"])
  },
  watch: {},
  mounted() {
    this.getBaseTemplateStages();
    this.type ? this.getBaseTemplateMasterDomainByBaseTemplateId() : null;
    this.getAllBaseTemplateCtrItems();
    this.getAllBaseTemplateCtrItems2();
  },
  methods: {
    formateEval(val) {
      let data = this.evalStandards;
      for (var i = 0; i < data.length; i++) {
        if (data[i].value == val) {
          return data[i].label;
        }
      }
    },
    clearOtherStage1() {
      this.controlItemForm.newAddcontrolItem = "";
    },
    clearOtherStage2() {
      this.controlItemForm.stage = "";
    },
    addControlFormOK() {
      this.dialogFormVisible = false;

      let addToData = {
        pid: 0,
        id: this.controlItemForm.newAddcontrolItem
          ? this.controlItemForm.newAddcontrolItem
          : this.controlItemForm.stage,
        label: this.controlItemForm.newAddcontrolItem
          ? this.controlItemForm.newAddcontrolItem
          : this.controlItemForm.stage,
        stage: this.controlItemForm.newAddcontrolItem
          ? this.controlItemForm.newAddcontrolItem
          : this.controlItemForm.stage,
        isEdit: false,
        isChanged: false,
        children: this.controlItemForm.name
          .map((item, index) => {
            return {
              pid: this.controlItemForm.newAddcontrolItem
                ? this.controlItemForm.newAddcontrolItem
                : this.controlItemForm.stage,
              id: item,
              label: item,
              stage: this.controlItemForm.newAddcontrolItem
                ? this.controlItemForm.newAddcontrolItem
                : this.controlItemForm.stage,
              name: item,
              isEdit: false,
              isChanged: false,
              relatedNames:
                this.controlItemForm.relatedNames[index] &&
                this.controlItemForm.relatedNames[index].length !== 0
                  ? this.controlItemForm.relatedNames[index]
                      .map(item2 => {
                        return item2[1];
                      })
                      .join()
                  : null
            };
          })
          .filter(item => {
            return item;
          })
      };

      if (this.toData.length !== 0) {
        let toDataStageLabel = this.toData.map((item, index) => {
          return item.label;
        });
        let printStage = this.controlItemForm.newAddcontrolItem
          ? this.controlItemForm.newAddcontrolItem
          : this.controlItemForm.stage;
        let includeIndex = toDataStageLabel.indexOf(printStage);
        if (includeIndex < 0) {
          this.toData.push(addToData);
        } else {
          for (var i = 0; i < addToData.children.length; i++) {
            this.toData[includeIndex].children.push(addToData.children[i]);
          }
        }
      } else {
        this.toData.push(addToData);
      }
    },
    saveBaseTemplate(params) {
      saveBaseTemplate(params).then(res => {
        this.btnLoading = false;
        this.$router.push({
          name: "ControlDemand",
          query: {
            baseTemplateId: res.data,
            evaluationStandard: this.evaluationStandard,
            type: 0
          }
        });
      });
    },
    editBaseTemplate(params) {
      editBaseTemplate(params).then(res => {
        this.btnLoading = false;
        this.$router.push({
          name: "ControlDemand",
          query: {
            baseTemplateId: this.baseTemplateId,
            evaluationStandard: this.evaluationStandard,
            type: this.type
          }
        });
      });
    },
    nextStep() {
      var masterSecurityDomainList = [];
      for (var i = 0; i < this.toData.length; i++) {
        for (var j = 0; j < this.toData[i].children.length; j++) {
          /////
          let stageAliasesChange = this.toData[i].children[j].stageAliases
            ? this.toData[i].children[j].stageAliases
            : this.toData[i].children[j].stage;
          let nameAliasesChange = this.toData[i].children[j].nameAliases
            ? this.toData[i].children[j].nameAliases
            : this.toData[i].children[j].name;
          /////
          masterSecurityDomainList.push({
            ...this.toData[i].children[j],
            id: null,
            stageAliases: this.toData[i].isChanged
              ? this.toData[i].label
              : stageAliasesChange,
            stage: this.toData[i].stage,
            name: this.toData[i].children[j].name,
            nameAliases: this.toData[i].children[j].isChanged
              ? this.toData[i].children[j].label
              : nameAliasesChange
          });
        }
      }

      let params = {
        masterBaseTemplateLibrary: {
          evaluationStandard: this.evaluationStandard,
          baseTemplateName: this.$route.query.baseTemplateName,
          id: this.baseTemplateId
        },
        masterSecurityDomainList: masterSecurityDomainList
      };
      if (masterSecurityDomainList.length == 0) {
        this.$message({
          type: "warning",
          message: "所选控制项不能为空"
        });
      } else {
        this.btnLoading = true;
        this.type == 1
          ? this.editBaseTemplate(params)
          : this.saveBaseTemplate(params);
      }
    },
    // preStep() {
    //   this.$emit("preStep");
    // },
    handleData(data) {
      let newData = Array.from(
        new Set(
          data.map(item => {
            return item.stage;
          })
        )
      );

      this.stageData = newData.map(item => {
        //item是一级菜单label
        return {
          pid: 0,
          id: item,
          label: item, //再循环的时候判断是stageAliases/stage
          isEdit: false,
          isChanged: false,
          stage: item,
          children: data
            .filter(subItem => {
              if (subItem.stage == item) {
                return subItem;
              }
            }) //先筛选出符合条件的
            .map(subItem => {
              return {
                ...subItem,
                pid: item,
                id: subItem.name,
                label: subItem.nameAliases ? subItem.nameAliases : subItem.name,
                isEdit: false,
                isChanged: false
                // name: subItem.name
              };
            })
        };
      });
      for (var i = 0; i < this.stageData.length; i++) {
        let temp = this.stageData[i].children[0].stageAliases;
        this.stageData[i].label = temp ? temp : this.stageData[i].label;
      }
      this.toData = this.stageData;

      // 对左侧控制项库进行去重
    },
    // 获取所选控制项
    getBaseTemplateMasterDomainByBaseTemplateId() {
      let params = {
        baseTemplateId: this.baseTemplateId
      };
      getBaseTemplateMasterDomainByBaseTemplateId(params).then(res => {
        //获取this.toData 的值
        this.handleData(res.data);
      });
    },
    //获取控制项库
    getAllBaseTemplateCtrItems() {
      let params = {
        evalStandard: this.evaluationStandard
      };
      getAllBaseTemplateCtrItems(params)
        .then(res => {
          this.loading = false;
          let data = res.data;
          let newData = Array.from(
            new Set(
              data.map(item => {
                return item.stage;
              })
            )
          );

          this.fixedFromData = newData.map(item => {
            //item是一级菜单label
            return {
              pid: 0,
              id: item,
              label: item,
              isEdit: false,
              isChanged: false,
              stage: item,
              disabled: false,
              children: data
                .filter(subItem => {
                  if (subItem.stage == item) {
                    return subItem;
                  }
                }) //先筛选出符合条件的
                .map(subItem => {
                  return {
                    pid: item,
                    id: subItem.name,
                    label: subItem.name,
                    isEdit: false,
                    isChanged: false,
                    disabled: false,
                    name: subItem.name,
                    code: subItem.code,
                    evaluationStandardName: subItem.evaluationStandardName
                  };
                })
            };
          });
          this.fromData = this.fixedFromData;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取关联控制项
    getAllBaseTemplateCtrItems2() {
      let params = {
        evalStandard: 1
      };
      getAllBaseTemplateCtrItems(params).then(res => {
        let data = res.data;
        let newData = Array.from(
          new Set(
            data.map(item => {
              return item.stage;
            })
          )
        );

        this.linkStages = newData.map(item => {
          //item是一级菜单label
          return {
            pid: 0,
            id: item,
            label: item,
            isEdit: false,
            isChanged: false,
            stage: item,
            children: data
              .filter(subItem => {
                if (subItem.stage == item) {
                  return subItem;
                }
              }) //先筛选出符合条件的
              .map(subItem => {
                return {
                  pid: item,
                  id: subItem.name,
                  label: subItem.name,
                  isEdit: false,
                  isChanged: false,
                  name: subItem.name,
                  code: subItem.code,
                  evaluationStandardName: subItem.evaluationStandardName
                };
              })
          };
        });
      });
    },

    getBaseTemplateStages() {
      let myData = [];
      // debugger;
      let params = {
        evalStandard: this.evaluationStandard
      };
      getBaseTemplateStages(params)
        .then(res => {
          this.stages = res.data.map((item, index) => {
            return {
              label: item.stage,
              value: item.stage
            };
          });
        })
        .catch(() => {});
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // console.log("add=========fromData:", fromData);
      // console.log("add=========toData:", toData);
      // console.log("add=========obj:", obj);
      this.toData = toData;
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      //   // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      //   // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log("remove===========fromData:", fromData);
      // console.log("remove===========toData:", toData);
      // console.log("remove===========obj:", obj);
    },
    nodeDelete(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      //后加的
      if (node.level == 1) {
        this.toData = children;
      }
    },
    showLeft(data) {
      return data.label;
    },
    showOrEdit(data) {
      if (data.isEdit) {
        return (
          <input
            value={data.label}
            on-blur={ev => this.edit_sure(ev, data)}
            class="editInput"
          />
        );
      } else {
        return data.label;
      }
    },
    // 所选控制项名称更新
    nodeEdit(ev, store, data) {
      data.isEdit = true;
      this.$nextTick(() => {
        const $input =
          ev.target.parentNode.parentNode.querySelector("input") ||
          ev.target.parentElement.parentElement.querySelector("input");

        !$input ? "" : $input.focus();
      });
    },
    // 编辑结果确定
    edit_sure(ev, data) {
      // const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input');
      const $input = document.querySelector(".editInput");
      if (!$input) {
        return false;
      } else {
        if (data.label !== $input.value) {
          data.isChanged = true;
        }
        data.label = $input.value;
        data.isEdit = false;
      }
    },
    // 节点上移
    nodeUp(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const cIndex = children.findIndex(d => d.id === data.id);

      if (parent.level === 0 && cIndex === 0) {
        return;
      } else if (parent.level !== 0 && cIndex === 0) {
        // 不同父节点中移动

        const parent2 = parent.parent;
        const children2 = parent2.data.children || parent2.data;
        const pIndex2 =
          parseInt(
            children2.findIndex(p => p.id === parent.data.id),
            10
          ) - 1;

        if (pIndex2 < 0) {
          return;
        }

        children2[pIndex2].children.push(data);
        children.splice(cIndex, 1);
        this.defaultExpand[0] = children2[pIndex2].id;
      } else if (parent.level === 0 && cIndex !== 0) {
        const tempChildrenNodex1 = children[cIndex - 1];
        const tempChildrenNodex2 = children[cIndex];

        this.$set(children, cIndex - 1, tempChildrenNodex2);
        this.$set(children, cIndex, tempChildrenNodex1);
        this.defaultExpand[0] = data.id;
        this.toData = children;
      } else if (parent.level !== 0 && cIndex !== 0) {
        const tempChildrenNodex1 = children[cIndex - 1];
        const tempChildrenNodex2 = children[cIndex];

        this.$set(children, cIndex - 1, tempChildrenNodex2);
        this.$set(children, cIndex, tempChildrenNodex1);
        this.defaultExpand[0] = data.id;
        this.toData = JSON.parse(JSON.stringify(this.toData));
      }
    },
    // 节点下移
    nodeDown(store, node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const cIndex = children.findIndex(d => d.id === data.id);
      const cLength = children.length - 1; // 最边上的节点
      const allLevel = store.data.length - 1; // 树的深度

      if (parent.level === allLevel && cIndex === cLength) {
        // 最最末的节点
        return;
      } else if (parent.level !== allLevel && cIndex === cLength) {
        // 父节点不同

        const parent2 = parent.parent;
        const children2 = parent2.data.children || parent2.data;
        const pIndex2 = parseInt(
          children2.findIndex(p => p.id === parent.data.id),
          10
        );

        if (pIndex2 === allLevel) {
          return;
        }

        children2[pIndex2 + 1].children.push(data);
        children.splice(cIndex, 1);
        this.defaultExpand[0] = children2[pIndex2 + 1].id;
      } else if (
        parent.level == 0 &&
        parent.level !== allLevel &&
        cIndex !== cLength
      ) {
        // 一级菜单
        const tempChildrenNodex1 = children[cIndex + 1];
        const tempChildrenNodex2 = children[cIndex];

        this.$set(children, cIndex + 1, tempChildrenNodex2);
        this.$set(children, cIndex, tempChildrenNodex1);
        this.defaultExpand[0] = data.id;
        this.toData = children;
      } else if (
        (parent.level === allLevel && cIndex !== cLength) ||
        (parent.level !== allLevel && cIndex !== cLength)
      ) {
        // 父节点相同
        const tempChildrenNodex1 = children[cIndex + 1];
        const tempChildrenNodex2 = children[cIndex];

        this.$set(children, cIndex + 1, tempChildrenNodex2);
        this.$set(children, cIndex, tempChildrenNodex1);
        this.defaultExpand[0] = data.id;
        this.toData = JSON.parse(JSON.stringify(this.toData));
      }
    },
    renderContentLeft(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          {data.pid == 0 ? (
            <span>{this.showLeft(data)}</span>
          ) : (
            <el-tooltip
              class="item"
              effect="dark"
              content={data.evaluationStandardName}
              placement="top"
            >
              <span>{this.showLeft(data)}</span>
            </el-tooltip>
          )}
        </span>
      );
    },
    renderContentRight(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          {this.showOrEdit(data)}
          <span>
            <el-button
              size="mini"
              icon="el-icon-edit"
              on-click={ev => this.nodeEdit(ev, store, data)}
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              on-click={() => this.nodeDelete(node, data)}
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-top"
              on-click={() => this.nodeUp(node, data)}
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-bottom"
              on-click={() => this.nodeDown(store, node, data)}
            ></el-button>
          </span>
        </span>
      );
    },
    // 创建控制域
    creatCtrol() {
      this.newStage = true;
    },
    // 关联控制项
    selectlinkCtrol() {
      this.linkCtrol = true;
    },
    // 添加控制项
    addCtrol() {
      this.newCtrolLen++;
    },
    // 选中关联控制项值时的
    handleChange(value) {
      console.log(value);
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.EtitControl .el-button--mini {
  padding: 4px 10px;
}
.EtitControl .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.dialog .el-input__inner,
.dialog .el-textarea__inner {
  width: 200px;
  min-width: 200px;
}
.inlineBlock {
  display: inline-block;
}
.EtitControl .el-select-dropdown__list, .el-scrollbar__view {
  /* display: flex !important; */
}
</style>

