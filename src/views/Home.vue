<template>
  <div class="home container">
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
          <vxe-table-column field="sex"   width="120" title="播出形式" :formatter="formatterSex"></vxe-table-column>
          <vxe-table-column field="newsname" title="文稿标题"></vxe-table-column>
          <vxe-table-column field="time" title="时长" width="120"></vxe-table-column>
          <vxe-table-column field="gtime" title="累计时长" width="120" :formatter="sec_to_time"></vxe-table-column>
          <vxe-table-column field="nickname" title="记者" width="120"> </vxe-table-column>
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
import Vue from 'vue'

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
             
                checkedList: [],
               
           
                address: null
              },
              formRules: {
                newsname: [
                  { required: true, message: '请输入名称' },
                  { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
                ],
                // nickname: [
                //   { required: true, message: '请输入昵称' }
                // ],
                time: [
                  { required: true, message: '请输入时长' }
                ]
              },
              formItems: [
                { title: 'Basic information', span: 24, titleAlign: 'left', titleWidth: 200, titlePrefix: { icon: 'fa fa-address-card-o' } },
                { field: 'newsname', title: '文稿标题', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
                { field: 'nickname', title: '记者', span: 12, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } },
                
                { field: 'sex', title: '播出形式', span: 12, itemRender: { name: '$select', options: [] } },
                { field: 'time', title: '时长', span: 12, itemRender: { name: '$input', props: { type: 'time', placeholder: '请输入时长' } } },
               
        
                { title: 'Other information', span: 24, titleAlign: 'left', titleWidth: 200, titlePrefix: { message: '请填写必填项', icon: 'fa fa-info-circle' } },
                //{ field: 'num', title: 'Number', span: 12, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入数值' } } },
               // { field: 'date3', title: 'Date', span: 12, itemRender: { name: '$input', props: { type: 'time', placeholder: '请选择时间' } } },
                { field: 'address', title: '文稿', span: 24, titleSuffix: { message: '提示信息！！', icon: 'fa fa-question-circle' }, itemRender: { name: '$textarea', props: { autosize: { minRows: 8, maxRows: 10 }, placeholder: '请输入文稿' } } },
                { align: 'center', span: 24, titleAlign: 'left', itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: '提交', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] } }
              ]
            }
          },
          created () {
            this.formItems[3].itemRender.options = this.sexList
            console.log("this.customers.length");
            // this.tableData = window.MOCK_DATA_LIST.slice(0, 20)
            this.rowDrop()
                let times=0;
                // console.log(this.customers.length);
               
	                 
          },
          mounted(){
              console.log("mounted");
          },
          watch:{
                  tableData:{//深度监听，可监听到对象、数组的变化
                      handler(val, oldVal){
                
                              // console.log(this.customers.length);
                              let times=0;
                              for(var item=0;item<val.length;item++){  //遍历对象数组，item表示某个具体的对象
                                  let s=0;
                                  let hour = val[item].time.split(':')[0];
                                  let min =val[item].time.split(':')[1];
                                  let sec = val[item].time.split(':')[2];
                                   s = Number(hour*3600) + Number(min*60) + Number(sec);
                                   console.log("--"+s)
                                  Vue.set(val[item],'gtime',s+times)
                                  times=val[item].gtime
                                  // this.customers[item].gtime=times+this.customers[item].gtime
                                  
                                  console.log(s,"---",val[item].gtime,"---",times)
                                  // this.customers[item].time=this.customers[item].time+2

                              }
                          // console.log("监控到变化");
                      },
                      deep:true //true 深度监听
                  }
              },
          methods: {
            sec_to_time({cellValue}) {
              // console.log({cellValue})
                  var t;
                  if(cellValue > -1){
                      var hour = Math.floor(cellValue/3600);
                      var min = Math.floor(cellValue/60) % 60;
                      var sec = cellValue % 60;
                      if(hour < 10) {
                          t = '0'+ hour + ":";
                      } else {
                          t = hour + ":";
                      }

                      if(min < 10){t += "0";}
                      t += min + ":";
                      if(sec < 10){t += "0";}
                      t += sec.toFixed(0);
                  }
      // console.log(t);
                    // console.log(t);
                    return t;
                },
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
                    console.log(this.tableData)
                    
                       
                  }
                })
              })
            },
            formatterSex ({ cellValue }) {
              let item = this.sexList.find(item => item.value === cellValue)
              return item ? item.label : ''
            },
            // visibleMethod ({ data }) {
            //   return data.flag1 === 'Y'
            // },
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
               
                checkedList: [],
               
            
                address: ''
              }
              this.selectRow = null
              this.showEdit = true
            },
            editEvent (row) {
             
                let hour = row.time.split(':')[0];
                let min = row.time.split(':')[1];
                let sec = row.time.split(':')[2];
                let s = Number(hour*3600) + Number(min*60) + Number(sec);
              console.log(s)

              this.formData = {
                newsname: row.newsname,
                nickname: row.nickname,
                role: row.role,
                sex: row.sex,
                time: row.time,
            
                checkedList: row.checkedList,
               
               
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

                console.log(this.tableData)

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



<style scoped>
.container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}
</style>