<template>
  <div>
    <BreadCrumb :data=" [{ a: '全部订单' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right order-list">
        <!-- <OrderEvaluate 
		 @successEvent="opClick('evaluateSuccess')"
		  @closeEvent="opClick('evaluateExit')">
		  </OrderEvaluate>  -->
        <el-dialog title="完工码">
          <p class="color-red margin-bottom">提示：“完工码”是订单安装完工后，师傅需要填写至APP端的核销码，如未完工请勿提供</p>
          <p>本单完工码为：</p>
          <div class="donecode text-center color-blue"></div>
        </el-dialog>
        <el-tabs  @tab-click="customEvent({opcode:'tabClick'})">
          <el-tab-pane>
            <span slot="label"><label class="color-red"></label></span>
          </el-tab-pane>
        </el-tabs>
        <div class="search">
          <label>客户信息</label>
          <el-input placeholder="客户姓名/手机号"></el-input>
          <label>订单号</label>
          <el-input placeholder="订单号" v-model="tagData.oS" @keyup.enter.native="queryInit('search')"></el-input>
          <el-button @click="queryInit('search')">搜索</el-button>
          <el-button @click="opClick('reset')">重置</el-button>
          <el-button @click="queryInit('download')">下载</el-button>
          <!-- <div class="title border-bottom-solid margin-v">交易明细<em class="download right absolute pointer" @click="opClick('download')"><i class="icon icon-download"></i>下载</em></div> -->

        </div>
        <ul class="order-title">
          <li>
            <!-- <el-date-picker v-model="tagData.calendar" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="tagData.calendarPicker" @change="queryInit('search')">
            </el-date-picker> -->
          </li>
          <li>客户信息</li>
          <li>金额</li>
          <li>
            <el-select v-if="tagData.tA==='zero'&&tagData.tabsVisible" v-model="tagData.tAta" @change="queryInit('search')">
              <el-option v-for="item in tagData.tD" :key="item.a" :label="item.a" :value="item.b"></el-option>
            </el-select>
            <span v-if="tagData.tA!=='zero'||!tagData.tabsVisible">状态</span>
          </li>
          <li>{{$store.state.userCtx.isPlatform?'服务商信息':'师傅信息'}}</li>
          <li>操作</li>
        </ul>
        <table width="100%" class="order-item" :key="item.fbillhead_id" v-for="item in uiData.listData">
          <colgroup>
            <col width="125">
            <col width="285">
            <col width="105">
            <col width="170">
            <col width="165">
            <col width="142">
          </colgroup>
          <tr>
            <th align="left" colspan="6">
              <span class="bold">{{item.fcreatedate}}</span>
              <span class="color-gray">订单编号:{{item.fbillno}}</span>
              <label v-if="$store.state.userCtx.isPlatform">
                <em>{{item.foffertype_fenumitem}}</em>
                <em class="green" v-if="item.fisappointedorder==1">指派订单</em>
              </label>
              <button v-if="item.fserstatus=='sht_serstatus03'&&item.foffertype == 'offer_type_01'" @click="opClick('offerchange',item.fbillhead_id)">转师傅报价</button>
              <button v-if="item.fserstatus=='sht_serstatus06'&&!comm.IsNullOrEmpty(item.fcompletioncode)" @click="opClick('alookDoneCode',item.fcompletioncode)">查看完工码</button>
              <a href="javascript:" title="批注" :class="['icon',comm.IsNullOrEmpty(item.fannotation)?'':'cur']" @click="opClick('editAnnotation',item)"></a>
            </th>
          </tr>
          <tr>
            <td class="bold font14">{{item.fservicetype_fenumitem}}</td>
            <td>
              <p>{{item.fname}}　　{{item.fphone}}</p>
              <p>{{item.fcusaddress}}</p>
            </td>
            <td class="fontyh">￥{{item.fexpectamount}}</td>
            <td>
              <div v-html="statusInit(item)"></div>
              <Timer class="color-orange" v-if="!comm.IsNullOrEmpty(item.fcompletiondate)&&item.fserstatus=='sht_serstatus07'" :endTime="item.fcompletiondate" day="-7" :format="'距离自动验收还剩：<br/>{dd}天{HH}时{mm}分{ss}秒'"></Timer>
            </td>
            <td v-if="!comm.IsNullOrEmpty(item.fmaster_name)&&item.fserstatus!=='sht_serstatus08'" class="color-gray">
              <p>{{$store.state.userCtx.isPlatform?'服务商':'师傅'}}:<label class="color-orange">{{item.fmaster_name}}</label><i class="icon-complain" @click="opClick('complain',item)" v-if="['sht_serstatus06','sht_serstatus07','sht_serstatus12','sht_serstatus13','sht_serstatus16'].indexOf(item.fserstatus)>-1">诉</i></p>
              <p v-if="item.fserstatus!=='sht_serstatus11'">联系电话:{{item.fmaster_fphone}}</p>
              <!-- <p v-if="['sht_serstatus13','sht_serstatus16'].indexOf(item.fserstatus)>-1">地图：</p> -->
            </td>
            <td v-if="comm.IsNullOrEmpty(item.fmaster_name)||item.fserstatus=='sht_serstatus08'">
              <p v-if="item.fserstatus=='sht_serstatus10'" class="color-gray">服务商：<span class="color-orange">{{item.fcount}}人{{item.foffertype == 'offer_type_01'?'接单':'报价'}}</span></p>
              <p v-if="item.fserstatus=='sht_serstatus10'"><a href="javascript:void(0)" @click="opClick('lookPrice',item)">查看{{item.foffertype == 'offer_type_01'?'接单':'报价'}}>></a></p>
              <div v-if="item.fserstatus!=='sht_serstatus10'">-</div>
            </td>
            <td>
              <a href="javascript:void(0)" :key="button.b" v-for="button in btnOpInit(item)" @click="opClick(button.b,item)">{{button.a}}</a>
            </td>
          </tr>
        </table>
        <template>
          <div class="text-center">
            <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records"></el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '../../services/axios';
// import {listView as base} from '../../lib';
// import OrderListPlugIn from './indexPlugIn';
import OrderEvaluate from '../../components/orderevaluate';
// const listView = {
// 	extends: base
// };
// listView.formId = 'ydj_merchantorder';
// listView.plugs = [new OrderListPlugIn({})];
// listView.mixins = [
 	export default {
		 data(){
			 return{
				 uiData:{
					 listDesc:{pageIndex:0,pageSize:0}
				 },
				 tagData:[],
				//  state:this.$store.state
			 }
		 },
		 created(){
			 axios({
				 methods:'get',
				 url:'/api/Order/GetMerchantOrderList',
				 methods:{
					 merchantID:'this.$store.state.userCtx.MerchantID',
					 orderStatus:'',
					 pageIndex:'1',
					 pageSize:'10'
				 }
			 }).then(res =>{
			 })
		 },
		methods: {
			/**
      *
      加载数据
      *
      @method queryInit
      @param {string} type 类型
      @param {string} [name] tabs name
      @param {Object} [data] Vm.data/this
      **/
			queryInit(type, name, data) {
				let t = data || this;
				let filterArray = [t.tagData.mS];
				switch (type) {
					case 'tabs':
						t.tagData.tA = name;
					case 'menus':
						t.tagData.tabsVisible = type === 'tabs';
						t.tagData.cS = '';
						t.tagData.oS = '';
						t.tagData.calendar = '';
						if (t.tagData.tA === 'zero') {
							t.tagData.tAta = 'zero';
						}
						let source = type === 'tabs' ? t.tagData.tD : t.tagData.otherOrderFilter;
						t.tagData.tS = source.find(o => {
							return o.b === name;
						}).s;
						filterArray.push(t.tagData.tS);
						break;
					case 'search':
						if (this.comm.IsNullOrEmpty(t.tagData.tS)) {
							filterArray.push(
								this.comm.Odefault(
									t.tagData.tD.find(o => {
										return o.b === t.tagData.tAta;
									})
								)
							);
						} else {
							filterArray.push(t.tagData.tS);
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.cS)) {
							filterArray.push(this.comm.StringFormat("(fname like '%{0}%' or fphone like '%{0}%')", t.tagData.cS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.oS)) {
							filterArray.push(this.comm.StringFormat("(fbillno like '%{0}%')", t.tagData.oS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.calendar)) {
							filterArray.push(this.comm.StringFormat("(fcreatedate > '{0}' and fcreatedate<='{1}')", this.comm.DateToString(t.tagData.calendar[0], 'yyyy-MM-dd HH:mm:ss'), this.comm.DateToString(t.tagData.calendar[1], 'yyyy-MM-dd HH:mm:ss')));
						}
						break;
					//--------------新添下载分割线------------------
					case 'download':
						// console.log(this.comm.IsNullOrEmpty(t.tagData.tS))
						if (this.comm.IsNullOrEmpty(t.tagData.tS)) {
							filterArray.push(
								this.comm.Odefault(
									t.tagData.tD.find(o => {
										return o.b === t.tagData.tAta;
									})
								)
							);
						} else {
							filterArray.push(t.tagData.tS);
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.cS)) {
							filterArray.push(this.comm.StringFormat("(fname like '%{0}%' or fphone like '%{0}%')", t.tagData.cS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.oS)) {
							filterArray.push(this.comm.StringFormat("(fbillno like '%{0}%')", t.tagData.oS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.calendar)) {
							filterArray.push(this.comm.StringFormat("(fcreatedate > '{0}' and fcreatedate<='{1}')", this.comm.DateToString(t.tagData.calendar[0], 'yyyy-MM-dd HH:mm:ss'), this.comm.DateToString(t.tagData.calendar[1], 'yyyy-MM-dd HH:mm:ss')));
						}
						let filterStr=filterArray.filter(item => {return item!=""})					
						console.log(filterStr.join("and"))
						t.axios
							.post('/list/ydj_merchantorder?operationno=listdatatoexcel', {
								simpleData: {
									colModel:'["fcreatedate","fbillno","foffertype","fservicetype","fname","fcusaddress","fphone","fexpectamount","fserstatus","fcompletioncode"]',
									filterString:filterStr.join("and")
								}
							})
							.then(res => {
								let fromData = new FormData();
								fromData.append('exportUrl', res.data.operationResult.srvData);
								t.axios
									.post('/download/bas_filedetail', fromData, {
										responseType: 'arraybuffer'
									})
									.then(res => {
										let headers = res.headers;
										let title = '';
										let blob = new Blob([res.data], {
											type: headers['content-type']
										});

										if (window.navigator.msSaveOrOpenBlob) {
											// 兼容IE10
											navigator.msSaveBlob(blob, this.filename);
										} else {
											//  chrome/firefox
											let link = document.createElement('a');
											link.href = window.URL.createObjectURL(blob);
											if (!title) {
												const fileName = headers['content-disposition'];
												title = fileName.includes('filename=') ? fileName.split('=')[1] : '下载的表单文件';
											}
											link.download = title;
											link.click();
											URL.revokeObjectURL(link.href);
										}
									});
							});
						break;
					//===============================================
				}
				if (t.tagData.tabsVisible) {
					this.cornerMarker(t);
				}
				this.comm.ArrayRemove(filterArray, o => {
					return this.comm.IsNullOrEmpty(o);
				});
				if (!t.query) {
					t.query = {filterString: filterArray.join(' and ')};
				} else {
					t.query.filterString = filterArray.join(' and ');
				}
			},
			/**
      *
      状态对应条数角标
      *
      @method cornerMarker
      @param {Object} d this
      */
			cornerMarker(d) {
				let t = this;
				t.axios.post('/bill/ydj_merchantorder?operationno=getMorderStatistics', {loadingOption: {target: '.order-panel'}, simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
					console.log(res)
					let srvData = res.data.operationResult.srvData;
					if (srvData instanceof Array) {
						t.tagData.tD = t.tagData.tD.map(o => {
							o.c = _.sum(
								_.map(
									_.filter(srvData, a => {
										return o.s.indexOf(a.fname) > -1;
									}),
									'fcount'
								)
							);
							return o;
						});
					}
				});
			},
			/*状态颜色*/
			statusInit(obj) {
				let id = obj.fserstatus,
					txt = obj.fserstatus_fenumitem;
				let userCtx = this.$store.state.userCtx;
				if (userCtx.isPlatform) {
					switch (id) {
						case 'sht_serstatus03': //已提交
							if (obj.foffertype == 'offer_type_01') {
								return '<label class="color-red">待接单</label>';
							}
							txt = '待报价';
							break;
						case 'sht_serstatus10': //报价中
							txt = '已报价';
							break;
					}
				} else {
					switch (id) {
						case 'sht_serstatus02': //已拒单
							txt = '平台驳回';
							break;
					}
				}
				switch (id) {
					case 'sht_serstatus00': //草稿
					case 'sht_serstatus03': //已提交
					case 'sht_serstatus12': //待预约'
					case 'sht_serstatus16': //待提货
						return '<label class="color-green">' + txt + '</label>';
					case 'sht_serstatus02': //已拒单
					case 'sht_serstatus07': //已完工
					case 'sht_serstatus10': //报价中
					case 'sht_serstatus11': //待支付
						return (id === 'sht_serstatus07' ? '<label class="color-red">待验收</label><br/>' : '') + '<label class="color-red">' + txt + '</label>';
					default:
						//sht_serstatus01|已取消,sht_serstatus04|平台审核,sht_serstatus05|商户确认,sht_serstatus06|服务中,sht_serstatus08|验收完成,sht_serstatus09|已指派服务商
						if (id === 'sht_serstatus06' && obj.fishang == 1) {
							return '<label class="color-red">订单挂起</label><br/><label class="color-gray">' + txt + '</label>';
						}

						return '<label class="color-gray">' + txt + '</label>';
				}
			},

			/**
      *
      列表操作按钮初始化
      *
      @method btnOpInit
      @param {Object} obj 状态字符串
      @return {Array} Array[Object]
      */
			btnOpInit(obj) {
				let a = obj.fserstatus,
					isrepublish = obj.fisrepublish,
					isrefund = obj.fisrefund,
					servicetype = obj.fservicetype;
				let i = a.length > 13 ? a.substring(13) : a;
				let arr = [];
				if (this.$route.query.type == 'HuOrder') {
					return [{a: '查看原因', b: 'lookfishang'}, {a: '查看订单', b: 'lookOrder'}];
				}
				switch (i) {
					case '00':
						arr = ['submitOrder', 'updateOrder'];
						break;
					case '01':
						arr = isrepublish == 1 ? ['lookOrder'] : ['republish', 'lookOrder'];
						break;
					case '02':
						arr = ['updateOrder', 'lookOrder'];
						break;
					case '03':
					case '16':
						arr = ['lookOrder', 'exitOrder'];
						break;
					case '06':
						arr = this.comm.IsNullOrEmpty(isrefund) && servicetype !== 'fres_type_03' ? ['lookOrder', 'applyRefund'] : ['lookOrder'];
						break;
					case '07':
						arr = this.comm.IsNullOrEmpty(isrefund) && servicetype !== 'fres_type_03' ? ['acceptOrder', 'lookOrder', 'applyRefund', 'feedback'] : ['acceptOrder', 'lookOrder', 'feedback'];
						break;
					case '08':
						arr = ['lookOrder'];
						break;
					case '10':
						arr = ['lookOrder', 'exitOrder'];
						break;
					case '11':
						arr = ['payOrder', 'exitPay', 'lookOrder', 'exitOrder'];
						break;
					case '12':
					case '13':
						arr = this.comm.IsNullOrEmpty(isrefund) ? ['lookOrder', 'applyRefund'] : ['lookOrder'];
						break;
				}
				return _.filter(this.tagData.opBtn, o => {
					return arr.indexOf(o.b) > -1;
				});
			},
			/**
      *
      按钮事件
      *
      @method opClick
      @param {String} a 操作Code
      @param {Object} [b] 数据
      */
			opClick(a, b) {
				let t = this;
				switch (a) {
					case 'reset': //重置搜索条件
						// t.tagData.cS = '';
						// t.tagData.oS = '';
						// t.tagData.calendar = '';
						// t.tagData.tAta = 'zero';
						break;
					case 'submitOrder': //提交订单
						t.$confirm('确定提交订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.invokeFormOperation({
									formId: t.formCtx.formId,
									opcode: 'sht_submitbill',
									param: {
										selectedRows: [
											{
												pkValue: b.fbillhead_id
											}
										]
									}
								}).then(res => {
									t.queryInit('tabs', 'two');
								});
							})
							.catch(() => {});
						break;
					case 'updateOrder': //修改订单
						t.$router.push({
							path: '/order/pre-order',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'lookOrder': //查看订单
						t.$router.push({
							path: '/order/pre-orders',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'editAnnotation': //修改或设置批注
						t.$prompt('', '订单备注', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputValue: b.fannotation,
							inputType: 'textarea'
						})
							.then(({value}) => {
								t.axios.post('/list/ydj_merchantorder?operationno=editannotation', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: b.fbillhead_id}], simpleData: {fannotation: value}}).then(res => {
									b.fannotation = value;
								});
							})
							.catch(() => {});
						break;
					case 'exitOrder': //取消订单
						t.$confirm('确定取消订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.invokeFormOperation({
									formId: t.formCtx.formId,
									opcode: 'sht_cancelbill',
									param: {selectedRows: [{pkValue: b.fbillhead_id}]}
								}).then(res => {
									t.$router.push({path: '/order', query: {type: 'ExOrder'}});
								});
							})
							.catch(() => {});
						break;
					case 'lookPrice': //查看报价
						t.$router.push({
							path: '/order/pre-orders',
							query: {id: b.fbillhead_id, tab: 'two'}
						});
						break;
					case 'payOrder': //支付订单
						t.comm.OrderPay({
							id: b.fbillhead_id,
							price: b.fexpectamount,
							formId: 'ydj_merchantorder',
							type: 'merchantorder',
							islogistics: t.$store.state.userCtx.isPlatform && ['fres_type_01', 'fres_type_03'].indexOf(b.fservicetype) > -1,
							other: {
								service: {No: b.fbillno},
								consumer: {name: b.fname, phone: b.fphone, address: b.fcusaddress}
							}
						});
						break;
					case 'exitPay': //取消支付
						t.$confirm('确定取消支付订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/list/ydj_merchantorder?operationno=cancelPay', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: b.fbillhead_id}]}).then(res => {
									t.queryInit('tabs', 'three');
								});
							})
							.catch(() => {});
						break;
						break;
					case 'complain': //投诉
						t.$router.push({
							path: '/droit/cre-complain',
							query: {orderId: b.fbillhead_id}
						});
						break;
					case 'acceptOrder': //验收窗口显示
						t.$confirm('确定验收吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.opClick('acceptBill', b.fbillhead_id);
							})
							.catch(() => {});
						break;
					case 'acceptBill': //验收数据提交
						let c = arguments[2];
						t.invokeFormOperation({
							formId: t.formCtx.formId,
							opcode: 'sht_acceptbill',
							param: {
								selectedRows: [
									{
										pkValue: b
									}
								],
								simpleData: {examinCode: c}
							}
						}).then(res => {
							if (t.comm.IsNullOrEmpty((res.response.operationResult.srvData || {examinCode: ''}).examinCode)) {
								t.tagData.evaluate.visible = !0;
								t.tagData.evaluate.id = b;
							} else {
								t.$confirm(res.response.operationResult.srvData.titleStr, '操作提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									dangerouslyUseHTMLString: true,
									type: 'warning'
								})
									.then(() => {
										t.opClick('acceptBill', b, res.response.operationResult.srvData.examinCode);
									})
									.catch(() => {});
							}
						});
						break;
					case 'evaluateSuccess':
						t.queryInit('tabs', 'ten');
						break;
					case 'evaluateExit':
						t.queryInit('tabs', 'ten');
						break;
					case 'alookDoneCode': //查看完工码
						t.tagData.done = {code: b || '000000', visible: !0};
						break;
					case 'feedback': //反馈
						t.$router.push({
							path: '/order/cre-problem',
							query: {
								orderId: b.fbillhead_id
							}
						});
						break;
					case 'applyRefund': //申请退款
						t.$router.push({
							path: '/droit/cre-refund',
							query: {
								orderId: b.fbillhead_id
							}
						});
						break;
					case 'republish':
						t.$confirm('确定将未完成的项目重新下单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/bill/ydj_merchantorder?operationno=releaseorder', {selectedRows: [{pkValue: b.fbillhead_id}]}).then(res => {
									t.$router.push({path: '/order/pre-order', query: {id: res.data.operationResult.srvData}});
								});
							})
							.catch(() => {});
						break;
					case 'lookfishang':
						this.$alert(b.fhang, '挂起原因', {
							confirmButtonText: '确定',
							callback: () => {}
						});
						break;
					case 'offerchange':
						t.$confirm('确定将一口价转师傅报价吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/bill/ydj_merchantorder?operationno=offertypechange', {selectedRows: [{pkValue: b}]}).then(res => {
									t.invokePlugIn('refresh');
								});
							})
							.catch(() => {});
						break;
				}
			}
		},
		computed: {
			TabsWatch() {
				return this.tagData.tA;
			}
		},
		watch: {
			$route(to, from) {
				let t = this;
				if (this.comm.IsNullOrEmpty(to.query.type)) {
					this.queryInit('tabs', from.params.tab || 'zero', this);
				} else {
					this.queryInit('menus', to.query.type, this);
					switch (to.query.type) {
						case 'HuOrder':
							document.title = '商户通管理系统 - 挂起单';
							break;
						case 'ExOrder':
							document.title = '商户通管理系统 - 取消单';
							break;
					}
				}
			},
			// TabsWatch(val) {
			// 	this.$store.commit('pageStatus', {orderTab: val});
			// },
			// assess() {
			// 	this.tagData.evaluate.fqualch = [];
			// }
		},
		// components: {OrderEvaluate}
	}
// export default listView;
</script>

<style lang="scss">
.order-list {
	.el-dialog__body {
		.donecode {
			width: 268px;
			height: 118px;
			border: 1px solid #ccc;
			margin: 40px auto;
			font-size: 48px;
			line-height: 118px;
			border-radius: 8px;
		}
	}
	.order-item {
		th {
			button {
				background-color: #0086e4;
				width: 88px;
				height: 26px;
				line-height: 26px;
				border-radius: 4px;
				border: 0;
				color: #fff;
				display: block;
				position: absolute;
				right: 62px;
				top: 2px;
			}
			a.icon {
				background-position: -3px -156px;
				width: 18px;
				height: 16px;
				display: block;
				position: absolute;
				right: 16px;
				top: 6px;
			}
			a.icon.cur {
				background-position: -3px -128px;
			}
			em {
				background-color: #3696ed;
				padding: 3px 5px;
				border-radius: 2px;
				color: #fff;
				&.green {
					background-color: #3dc68a;
				}
			}
		}
	}
	.order-title {
		.el-date-editor {
			margin-left: 10px;
			width: 210px;
		}
		li {
			&:nth-child(1) {
				width: 125px;
			}
			&:nth-child(2) {
				width: 285px;
			}
			&:nth-child(3) {
				width: 105px;
			}
			&:nth-child(4) {
				width: 170px;
			}
			&:nth-child(5) {
				width: 165px;
			}
			&:nth-child(6) {
				width: 146px;
			}
		}
	}
}
</style>