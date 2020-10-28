<template>
  <div class="home">
   <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
             <vxe-button @click="printEvent">打印</vxe-button>
             <vxe-button @click="exportDataEvent">默认导出</vxe-button>
          </template>
        </vxe-toolbar>

        <vxe-table
          border
          resizable
          row-key
          highlight-hover-row
          ref="xTable"
          height="500"
          :data="tableData"
          @cell-dblclick="cellDBLClickEvent">
               <vxe-table-column width="60">
         <template v-slot>
          <span class="drag-btn">
            <i class="vxe-icon--menu"></i>
          </span>
        </template>
        <template v-slot:header>
          <vxe-tooltip v-model="showHelpTip1" content="按住后可以上下拖动排序！" enterable>
            <i class="vxe-icon--question" @click="showHelpTip1 = !showHelpTip1"></i>
          </vxe-tooltip>
        </template>
      </vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="newsname" title="文稿标题"></vxe-table-column>
          <vxe-table-column field="sex" title="播出形式" :formatter="formatterSex"></vxe-table-column>
          <vxe-table-column field="time" title="时长"></vxe-table-column>
          <vxe-table-column field="nickname" title="记者"></vxe-table-column>
          <vxe-table-column field="address" title="Address" show-overflow></vxe-table-column>
          <vxe-table-column title="操作" width="100" show-overflow>
            <template v-slot="{ row }">
              <vxe-button type="text" icon="fa fa-edit" @click="editEvent(row)"></vxe-button>
              <vxe-button type="text" icon="fa fa-trash-o" @click="removeEvent(row)"></vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>

        <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600" min-height="300" :loading="submitLoading" resize destroy-on-close>
          <template v-slot>
            <vxe-form :data="formData" :items="formItems" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent"></vxe-form>
          </template>
        </vxe-modal>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'Home',
  components: {
    
  },
  data () {
            return {
              // 拖拽
              showHelpTip1: false,

              submitLoading: false,
              tableData: [],
              selectRow: null,
              showEdit: false,
              sexList: [
                { label: '女播', value: '0' },
                { label: '男播', value: '1' },
                { label: '双播', value: '2' },
                { label: '备播', value: '3' },
              ],
              formData: {
                newsname: null,
                nickname: null,
                role: null,
                sex: null,
                time: null,
                num: null,
                checkedList: [],
                flag1: null,
                date3: null,
                address: null
              },
              formRules: {
                newsname: [
                  { required: true, message: '请输入名称' },
                  { min: 1, max: 20, message: '长度在 1 到 20 个字符' }
                ],
                nickname: [
                  { required: true, message: '请输入昵称' }
                ],
                time: [
                  { required: true, message: '请输入时长' }
                ]
              },
              formItems: [
                { title: 'Basic information', span: 24, titleAlign: 'left', titleWidth: 200, titlePrefix: { icon: 'fa fa-address-card-o' } },
                { field: 'newsname', title: '文稿标题', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
                { field: 'nickname', title: '记者', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } },
                { field: 'role', title: 'Role', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入角色' } } },
                { field: 'sex', title: 'Sex', span: 12, itemRender: { name: '$select', options: [] } },
                { field: 'time', title: '时长', span: 12, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入年龄' } } },
                { field: 'flag1', title: '是否单身', span: 12, itemRender: { name: '$radio', options: [{ label: '是', value: 'Y' }, { label: '否', value: 'N' }] } },
                { field: 'checkedList', title: '可选信息', span: 24, visibleMethod: this.visibleMethod, itemRender: { name: '$checkbox', options: [{ label: '运动、跑步', value: '1' }, { label: '听音乐', value: '2' }, { label: '泡妞', value: '3' }, { label: '吃美食', value: '4' }] } },
                { title: 'Other information', span: 24, titleAlign: 'left', titleWidth: 200, titlePrefix: { message: '请填写必填项', icon: 'fa fa-info-circle' } },
                { field: 'num', title: 'Number', span: 12, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入数值' } } },
                { field: 'date3', title: 'Date', span: 12, itemRender: { name: '$input', props: { type: 'date', placeholder: '请选择日期' } } },
                { field: 'address', title: 'Address', span: 24, titleSuffix: { message: '提示信息！！', icon: 'fa fa-question-circle' }, itemRender: { name: '$textarea', props: { autosize: { minRows: 2, maxRows: 4 }, placeholder: '请输入地址' } } },
                { align: 'center', span: 24, titleAlign: 'left', itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '提交', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
              ]
            }
          },
          created () {
            this.formItems[4].itemRender.options = this.sexList
            // this.tableData = window.MOCK_DATA_LIST.slice(0, 20)
            this.rowDrop()
          },
          methods: {
            exportDataEvent () {
                this.$refs.xTable.exportData({ type: 'csv' })
              },
            printEvent () {
                      this.$refs.xTable.print()
                    },
            rowDrop () {
              this.$nextTick(() => {
                const xTable = this.$refs.xTable
                this.sortable1 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                  handle: '.drag-btn',
                  onEnd: ({ newIndex, oldIndex }) => {
                    const currRow = this.tableData.splice(oldIndex, 1)[0]
                    this.tableData.splice(newIndex, 0, currRow)
                  }
                })
              })
            },
            formatterSex ({ cellValue }) {
              let item = this.sexList.find(item => item.value === cellValue)
              return item ? item.label : ''
            },
            visibleMethod ({ data }) {
              return data.flag1 === 'Y'
            },
            cellDBLClickEvent ({ row }) {
              this.editEvent(row)
            },
            insertEvent () {
              this.formData = {
                newsname: '',
                nickname: '',
                role: '',
                sex: '',
                time: '',
                num: '',
                checkedList: [],
                flag1: '',
                date3: '',
                address: ''
              }
              this.selectRow = null
              this.showEdit = true
            },
            editEvent (row) {
              this.formData = {
                newsname: row.newsname,
                nickname: row.nickname,
                role: row.role,
                sex: row.sex,
                time: row.time,
                num: row.num,
                checkedList: row.checkedList,
                flag1: row.flag1,
                date3: row.date3,
                address: row.address
              }
              this.selectRow = row
              this.showEdit = true
            },
            removeEvent (row) {
              this.$XModal.confirm('您确定要删除该数据?').then(type => {
                if (type === 'confirm') {
                  this.$refs.xTable.remove(row)
                }
              })
            },
            submitEvent () {
              this.submitLoading = true
              setTimeout(() => {
                this.submitLoading = false
                this.showEdit = false
                if (this.selectRow) {
                  this.$XModal.message({ message: '保存成功', status: 'success' })
                  Object.assign(this.selectRow, this.formData)
                } else {
                  this.$XModal.message({ message: '新增成功', status: 'success' })
                  this.$refs.xTable.insert(this.formData)
                  this.tableData.push(this.formData)
                }
              }, 500)
            }
          }
        
}
</script>
