 <template>
  <div>
    <BreadCrumb :data=" [{ a: '订单管理', b: { path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '立即下单' }]"></BreadCrumb>
    <div class="sologo w block-center">温馨提示：本平台下单不取收任何费用，并且为您提供线上担保服务。90%安装产生的纠纷及损失均是因为线下交易问题。</div>
    <div class="main-content w block-center placeorder">
      <el-form :model="uiDatas" :rules="rules" ref="uiDatas" label-width="100px">
        <div class="title border-bottom-solid margin-bottom">基本信息</div>
        <div class="el-from-lable-vertical" label="报价方式：">
          <Radio type="round" v-model="uiDatas.type" :readonly="['fres_type_01','fres_type_03'].indexOf(uiDatas.service)>-1" readonly_msg="含有物流的订单只允许报价方式为师傅报价">
            <div value="offer_type_01">
              <div class="offer-one">一口价</div>
            </div>
            <div value="offer_type_02">
              <div class="offer-two">师傅报价</div>
            </div>
          </Radio>
        </div>
        <el-form-item label="服务类目：" prop="profield">
          <Radio type="border" class="serviceicon" v-model="uiDatas.profield" :readonly="uiDatas.fserviceentry.length>0" readonly_msg="如需更改类型，请将服务信息的项目全部移除">
            <div v-for="(item,index) in uiData[1]" :key="item.itemCode" :value="item.itemCode">
              <div class="service-icon"><i :class="['icon','icon-profield-'+index]"></i>{{item.itemName}}</div>
            </div>
          </Radio>
        </el-form-item>
        <div class="el-from-lable-vertical" label="服务类型：">
          <Radio type="border" v-model="uiDatas.service" :readonly="uiDatas.fserviceentry.length>0" readonly_msg="如需更改类型，请将服务信息的项目全部移除">
            <div v-for="item in uiData[2]" :key="item.itemCode" :value="item.itemCode">{{item.itemName}}</div>
          </Radio>
        </div>
        <div class="title border-bottom-solid margin-bottom">客户信息<span class="color-red font14">{{tagData.serviceTypeMessage}}</span></div>
        <el-form-item>
          <button class="intelligence" type="button" @click="opClick('intelligence')"><i class="icon icon-int"></i>智能填写</button>
        </el-form-item>
        <el-form-item label="客户：" is-required>
          <el-col :span="5">
            <el-form-item prop="name" :rules="comm.rules.Zhname">
              <el-input type="text" v-model.trim="uiDatas.name" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="phone" :rules="comm.rules.phone">
              <el-input type="text" v-model.trim="uiDatas.phone" placeholder="请输入客户手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="5">
            <el-form-item>
              <City v-model="tagData.city"></City>
            </el-form-item>
          </el-col>
          <el-col :span="9" prop="cusaddress">
            <el-form-item>
              <el-input type="text" v-model.trim="uiDatas.cusaddress" placeholder="请输入详细的地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiDatas.service)>-1">
            <el-select v-model="uiDatas.fiselevator" class="i8">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'有电梯'},{'id':false,'name':'无电梯'}]"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiDatas.service)>-1&&!uiDatas.fiselevator">
            <el-checkbox v-model="uiDatas.isupstairs"></el-checkbox>是否抬楼
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiDatas.service)>-1&&!uiDatas.fiselevator&&uiDatas.isupstairs">
            <el-form-item prop="elevator">
              <el-input type="number" class="i8" v-model.trim="uiDatas.elevator" placeholder="输入楼层"></el-input> 楼
            </el-form-item>
          </el-col>
        </el-form-item>
        <div v-if="['fres_type_01','fres_type_03'].indexOf(uiDatas.service)>-1">
          <div class="title border-bottom-solid margin-bottom">物流信息<label class="color-gray">平台默认物流点验货时服务商仅验收商品外包装</label></div>
          <el-form-item label="物流公司：" is-required>
            <el-input type="text" v-model.trim="uiDatas.logistics" placeholder="请输入物流公司名称" class="margin-right"></el-input>
            物流单号：<el-input type="text" v-model.trim="uiDatas.logisticsno" placeholder="请输入物流单号"></el-input>
          </el-form-item>

          <el-form-item label="提货地址：" prop="collectadd" is-required>
            <el-input type="text" v-model.trim="uiDatas.collectadd" placeholder="请输入提货详细地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" is-required>
            <el-col :span="10">
              <el-form-item prop="collectpho">
                <el-input type="text" v-model.trim="uiDatas.collectpho" placeholder="请输入提货电话" class="margin-right"></el-input>
                包装件数：<el-input-number class="i8 margin-right" :min="1" :controls="false" :max="100" v-model="uiDatas.pieces"></el-input-number>件
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="代付运费：">
            <el-checkbox v-model="uiDatas.ispay" class="margin-right">需师傅代付运费，师傅报价包含此费用</el-checkbox>
            <em class="color-red">*</em>代付金额：　<el-input-number class="i8 margin-right" :min="0" :controls="false" :max="10000" v-model="uiDatas.shippingamount"></el-input-number>元
          </el-form-item>
        </div>
        <div v-if="uiDatas.service!='fres_type_03'">
          <div class="title border-bottom-solid margin-bottom">服务信息<span class="color-red font14">（重要提醒：平台主要针对定制家居安装为主，请您上传完整的安装图纸，以免图纸不全无法报价或安装时拒绝服务等情况出现。）</span></div>
          <el-form-item label-width="0px" class="form-service-item" v-for=" item in uiDatas.fserviceentry" :key="item.id">
            <div class="service-item">
              <div>
                <div class="img-panel" :data-count="item.fentityimage.id.split(',').length">
                  <img :src="item.fentityimage.url.split(',')[0]" />
                </div>
                <input type="button" value="添加图片" @click="opClick('showImageDialog',item.id)" />
              </div>
              <div>
                <el-form-item label="服务项目" label-width="94px" is-required>
                  <el-select placeholder="请选择服务类型" filterable v-model="item.fseritemid.id">
                    <el-option v-for="items in tagData.serviceTypeData" :key="items.id" :label="items.service_ItemName" :value="items.service_ItemID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="材质" label-width="94px" is-required>
                  <el-select placeholder="请选择材质" v-model="item.fmaterial.id">
                    <el-option v-for="items in tagData.serviceTypeData" :key="items.id" :label="items.material_Txt" :value="items.material"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房型" label-width="94px" :rules="rules['froomno.id']">
                  <el-select placeholder="可选房型" v-model="item.froomno.id">
                    <el-option v-for="roomno in uiData[3]" :key="roomno.id" :label="roomno.itemName" :value="roomno.itemCode"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <div>
                  <el-col :span="9">
                    <el-form-item :label="(uiDatas.type!='offer_type_01'?'期望':'')+'单价'" :rules="rules['fprice']" label-width="94px" is-required>
                      <el-input-number placeholder="0元" class="input-price" :min="0" :controls="false" :max="1000000" v-model="item.fprice"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item :rules="rules['funitid']">
                      <el-select v-model="item.funitid" placeholder="单位" class="input-price">
                        <el-option v-for="items in tagData.serviceTypeData" :key="items.id" :label="items.unitName" :value="items.unitID"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="数量" label-width="80px" :rules="rules['fqty']" is-required>
                      <el-input-number :min="0.001" :max="10000" v-model="item.fqty"></el-input-number>
                    </el-form-item>
                  </el-col>
                </div>
                <el-form-item label="特殊要求" label-width="94px" :rules="rules['frequire']">
                  <el-input type="textarea" :rows="3" :maxlength="100" placeholder="请填写图纸以外没有注明的安装产品（例如：需要安装智能产品，罗马柱需要切角，顶线需要切割）安装请带齐工具（100字以内）" v-model="item.frequire"></el-input>
                </el-form-item>
              </div>
              <div class="item-tools">
                <div class="color-blue">金额：{{parseFloat((item.famount = (item.fprice||0) * (item.fqty||0) ).toFixed(2))}}元</div>
                <i class="el-icon-delete" @click="opClick('deleteServiceItem',item.id)"></i>
              </div>
            </div>
          </el-form-item>
          <el-dialog title="添加图片" :visible.sync="tagData.serviceItem.visible" center :close-on-click-modal="false">
            <ImgManage v-model="tagData.serviceItem.projectImage" :limit="8" :clear="tagData.serviceItem.visible">
              请上传设计/安装图纸，便于师傅更准确的报价
            </ImgManage>
            <span slot="footer">
              <el-button @click="tagData.serviceItem.visible=!1">取 消</el-button>
              <el-button type="primary" @click="opClick('formatServiceItem')">确 定</el-button>
            </span>
          </el-dialog>
          <div class="service-item">
            <input type="button" value="添加图片" @click="opClick('showImageDialog')" />
          </div>
        </div>
        <div class="title border-bottom-solid margin-bottom">其他要求</div>
        <el-form-item label="是否到货：" is-required>
          <el-col :span="5">
            <el-select placeholder="货物是否到达物流点" v-model="uiDatas.fisarrival" class="margin-right">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'已到'},{'id':false,'name':'未到'}]"></el-option>
            </el-select>
          </el-col>
          <el-col :span="10" v-if="!uiDatas.fisarrival">
            <el-form-item label="预计到货时间：" prop="fexpectedarrivaldate" label-position="left" label-width="110px">
              <el-date-picker v-model="uiDatas.fexpectedarrivaldate" type="date" placeholder="选择服务日期" class="margin-right" :picker-options="tagData.datePickerOptions">></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="服务日期：">
          <el-date-picker v-model="uiDatas.orderdate" type="date" placeholder="选择服务日期" class="margin-right" :picker-options="tagData.datePickerOptions">></el-date-picker>
          <span class="color-grey">(希望服务商在此日期上门服务)</span>
        </el-form-item>
        <el-form-item label="备注：" prop="careful" is-required>
          <el-input :maxlength="200" class="textarea-big" :rows="4" type="textarea" v-model="uiDatas.careful" placeholder="请详细说明安装注意的细节，比如需要带齐的工具，安装工艺要求等情况，以免师傅准备不足耽误安装进度。（100字以内）"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" is-required>
          <el-col :span="5">
            <el-form-item prop="urgentname" :rules="comm.rules.Zhname">
              <el-input v-model="uiDatas.urgentname" placeholder="请输入姓名" class="margin-right"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" prop="urgentphone" :rules="comm.rules.phone">
            <el-form-item>
              电话：　<el-input type="text" v-model.trim="uiDatas.urgentphone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <p class="tips margin-bottom">
          温馨提示：①定制类产品需要上传安装图纸或设计图纸，如订单信息与实际服务要求不符，由此造成的损失由用户自行承担。②订单服务过程中因非师傅原因导致师傅空跑，需按师傅报价时服务承诺支付师傅空跑费用。③定制类产品安装过程中造成的改柜、补板或二次上门等情况，用户需按实际情况适当增加费用。④如需师傅代买物料等行为，需支付相等金额的费用。⑤订单信息中必填内容和选填内容相冲突时（如商品信息和备注说明不一致等），一旦出现交易纠纷，平台客服将以订单必填信息为判断标准⑥为保障您的权益，所有行为均需在平台系统内操作，如线下行为造成的损失，平台将不予受理。
        </p>
        <div>派单模式： <Radio v-model="tagData.master.tabactive" class="tab">
            <div value="0">全部师傅</div>
            <div value="1">收藏师傅</div>
            <div value="2">指定师傅</div>
          </Radio>
        </div>
        <div class="tab-panel">
          <p v-if="tagData.master.tabactive==0" class="margin-v-half color-orange">
            订单将指派给符合要求的师傅。
          </p>
          <div v-if="tagData.master.tabactive!=0">
            <em v-for="item in tagData.master.change" :key="item.id">{{item.name}}<i class="el-icon-close" @click="opClick('master-del',item.id)"></i></em><a href="javascript:void(0)" v-if="tagData.master.tabactive==1||(tagData.master.change.length==0&&tagData.master.tabactive==2)" @click="tagData.master.visible=!0;getData('master')">添加师傅</a>
          </div>
        </div>
        <div class="text-right" v-show="uiDatas.type=='offer_type_01'">
          <h1 class="color-blue">合计：{{(uiDatas.fexpectamount= comm.priceSum(uiDatas.shippingamount+_.sum(_.map(uiDatas.fserviceentry,"famount")),2))}}元</h1>
        </div>
      </el-form>
      <div class="text-right btn-panel">
        <button @click="opClick('save',!1)">保存</button>
        <button @click="opClick('save',!0)">提交订单</button>
      </div>
      <!-- <el-dialog title="选择师傅" width="1020px" top="5vh" :visible.sync="tagData.master.visible">
        <div class="search">
          <el-input placeholder="请输入师傅姓名" v-model="tagData.master.search" @keyup.enter.native="getData('master')"></el-input>
          <el-button @click="getData('master',1,false)">搜索</el-button>
          <el-button @click="getData('master',1,true)">重置</el-button>
        </div>
        <ul class="master">
          <li v-for="item in tagData.master.listData" :key="item.fbillhead_id">
            <el-checkbox v-model="item.check" v-if="tagData.master.tabactive==1"></el-checkbox>
            <div class="head" @click="$router.push({path: '/master/detail',query: {id: item.fbillhead_id}});">
              <ImgRender type="headPort" :source="item.fimage"></ImgRender>
            </div>
            <div class="base">
              <h5 @click="$router.push({path: '/master/detail',query: {id: item.fbillhead_id}});">{{item.fname}}</h5>
              <p class="color-grey">{{item.fphone}}</p>
              <i class="icon icon-bond" v-if="item.fispaymargin==='1'">已缴保证金{{item.fmarginamount}}元</i>
            </div>
            <div class="service">
              <p>服务区域：{{item.area_txt}}</p>
              <p>服务类目：{{item.fprofield_txt}}</p>
            </div>
            <div class="evl">
              <p>综合评分:<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(item.overallScore)" disabled></el-rate>
              </p>
              <p>
                服务单数：
                <label class="color-blue">{{item.orderCount}}</label> 好评率：
                <label class="color-blue">{{item.applauseRate}}%</label>
              </p>
            </div>
            <el-button type="orange" size="small" v-if="tagData.master.tabactive==2" @click="tagData.master.change=[{id: item.fbillhead_id, name: item.fname}];tagData.master.visible = !1;">雇佣TA</el-button>
          </li>
        </ul>
        <el-checkbox v-model="tagData.master.checkall" @change="opClick('master-checkall')" v-if="tagData.master.tabactive==1">全选</el-checkbox>
        <template>
          <div class="text-center">
            <el-pagination @current-change="getData('master',$event)" :page-size="tagData.master.listDesc.pageSize" layout="total,  prev, pager, next, jumper" :total="tagData.master.listDesc.rows"></el-pagination>
          </div>
        </template>
        <div slot="footer">
          <el-button @click="tagData.master.visible=!1">取消</el-button>
          <el-button type="primary" @click="opClick('master')">确定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
import ImgManage from '../../../components/imagemanage';
// import {billView as base} from '../../../lib';
// import placeOrderPlugIn from './placeOrderPlugIn';
import {vueCityDatas} from '../../../services/city-picker.data';
// const billView = {
// 	extends: base
// };
// billView.formId = 'ydj_merchantorder';
// billView.plugs = [new placeOrderPlugIn({})];
// billView.mixins = [
export default {
	data() {
		return {
			uiData: [],
			tagData: {
				city: '',
				isSubmit: [],
				service_ItemName: [],
				comboStore: {froomno: []},
				serviceItem: {
					visible: !1,
					projectImage: [], //当前项图片
					editItem: '', //当前项id
					imageslist: [], //所有项目图片信息 临时存放
					tData: [],
					serviceTypeData: [] //存放服务定价数据
				},
				serviceTypeInit: [], //已加载的服务定价数据
				master: {
					tabactive: 0,
					visible: !1,
					listData: [],
					change: [],
					checkall: !1,
					search: '',
					listDesc: {pageCount: 5, pageIndex: 1, rows: 0}
				}
			},
			uiDatas: {
				type: 'offer_type_01',
				profield: '',
				service: '',
				fserviceentry: [],
				expectedarrivaldate: '',
				orderdate: '',
				fexpectamount: 0,
				shippingamount: 0,
				urgentphone: '',
				forderdate: ''
			},
			datePickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				}
			},
			isLoad: !1,
			unitData: [],
			// serviceTypeMessage: ''
			rules: {
				profield: [{required: true, message: '请选择服务项目'}],
				//fname: [{ required: true, message: '请填写客户姓名', trigger: 'blur' }],
				// city: [{required: true, message: '请选择完整的省市区', trigger: 'change'}],
				cusaddress: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
				'fseritemid.id': [
					{
						validator: (a, b, c) => {
							if (t.comm.IsNullOrEmpty(b)) {
								return c(new Error('请选择服务类型'));
							}
							c();
						},
						trigger: 'change'
					}
				],
				'fmaterial.id': [
					{
						validator: (a, b, c) => {
							if (t.comm.IsNullOrEmpty(b)) {
								return c(new Error('请选择材质'));
							}
							c();
						},
						trigger: 'change'
					}
				],
				'froomno.id': [
					{
						validator: (a, b, c) => {
							let item = t.uiDatas.fserviceentry.filter(o => {
								return o.fseritemid.id == b.fseritemid.id && o.fmaterial.id == b.fmaterial.id && o.froomno.id == b.froomno.id;
							});
							if (item.length > 1) {
								return c(new Error('相同的服务项目、材质不允许同样房型'));
							}
							c();
						},
						trigger: 'change'
					}
				],
				fprice: [
					{
						validator: (a, b, c) => {
							if (parseFloat(b) < 0.01 && this.uiDatas.type == 'offer_type_01') {
								return c(new Error('金额不能小于1分钱'));
							}
							c();
						},
						trigger: 'blur'
					}
				],
				funitid: [{required: true, message: '请选择单位', trigger: 'change'}],
				fqty: [
					{
						validator: (a, b, c) => {
							if (parseFloat(b) < 0.0001) {
								return c(new Error('数量不能小于0.0001'));
							}
							c();
						},
						trigger: 'blur'
					}
				],
				frequire: [{required: true, message: '请勿在此填写任何形式的联系方式等信息', trigger: 'blur'}],
				careful: [{required: true, message: '请填写注意事项', trigger: 'blur'}, {required: true, message: '注意事项含有非法信息', trigger: 'blur'}],
				elevator: [
					{
						validator: (a, b, c) => {
							if (b < 2) {
								return c(new Error('楼层至少为2楼及以上'));
							}
							c();
						},
						trigger: 'blur'
					}
				],
				logistics: [{required: true, message: '请填写物流信息', trigger: 'blur'}],
				collectadd: [{required: true, message: '请填写提货地址', trigger: 'blur'}],
				collectpho: [
					{
						validator: (a, b, c) => {
							if (!this.comm._RegExp.isTel.test(b) && !this.comm._RegExp.isPhone.test(b)) {
								return c(new Error('提货电话格式错误'));
							}
							c();
						},
						trigger: 'blur'
					}
				],
				fexpectedarrivaldate: [
					{
						validator: (a, b, c) => {
							if (!this.uiDatas.fisarrival && (!(b instanceof Date) && this.comm.IsNullOrEmpty(b))) {
								return c(new Error('请选择预计到货时间'));
							}
							c();
						},
						trigger: 'blur'
					}
				]
			}
		};
	},
	created() {
		let data = this.$store.state.userCtx.InitBill;
		let newArr = [];
		for (let i in data) {
			newArr.push(data[i].liData);
		}
		this.uiData = newArr;
	},
	methods: {
		getTotalData: (event, data) => {
			console.log(data);
			let t = event;
			let newArr = [];
			for (let i = 0; t.uiDatas.fserviceentry.length > i; i++) {
				let data = {
					orderDetailID: 'string',
					orderID: t.uiDatas.fserviceentry[i].id,
					itemID: 'string',
					itemName: 'string',
					unitID: t.uiDatas.fserviceentry[i].funitid.id,
					unitName: t.uiDatas.fserviceentry[i].funitid.fname,
					materialID: t.uiDatas.fserviceentry[i].fmaterial.id,
					materialName: t.uiDatas.fserviceentry[i].fmaterial.fname,
					roomTypeID: t.uiDatas.fserviceentry[i].froomno.id,
					roomTypeName: t.uiDatas.fserviceentry[i].froomno.fname,
					price: t.uiDatas.fserviceentry[i].fprice,
					qty: t.uiDatas.fserviceentry[i].fqty,
					amount: t.uiDatas.fserviceentry[i].famount,
					imageUrls: t.uiDatas.fserviceentry[i].fentityimage.url,
					remark: 'string'
				};
				newArr.push(data);
			}
			t.axios({
				method: 'post',
				url: '/api/Order/Save',
				data: {
					baseInfo: {
						orderID: t.$store.state.userCtx.userId,
						customerID: 'string',
						organizationID: t.$store.state.userCtx.organizationID,
						orderDate: '2019-11-05T01:23:08.289Z',
						serviceDate: '2019-11-05T01:23:08.289Z',
						orderSendDate: '2019-11-05T01:23:08.289Z',
						orderStatus: 'string',
						quotePriceType: t.uiDatas.type,
						serviceType: t.uiDatas.profield,
						serviceType_txt: 'string',
						profileID: t.uiDatas.profield,
						profileID_txt: 'string',
						merchantID: t.$store.state.userCtx.merchantID,
						orderSendMode: 'string',
						employeeID: 'string',
						policyNo: 'string',
						policyFee: 0,
						policyTime: '2019-11-05T01:23:08.289Z',
						customerServices: 'string',
						orderAmount: t.uiDatas.fexpectamount,
						payStatus: 'string',
						payAmount: 0,
						imageUrls: t.tagData.serviceItem.imageslist,
						remark: t.uiDatas.careful,
						orderComplaint: 'string',
						orderComplaintTime: '2019-11-05T01:23:08.289Z',
						merchantEvaluation: 'string',
						customerEvaluation: 'string'
					},
					customerInfo: {
						customerID: 'string',
						customerType: 'string',
						customerName: t.uiDatas.name,
						phone: t.uiDatas.phone,
						provinceID: 'string',
						cityID: 'string',
						regionID: 'string',
						provinceName: 'string',
						cityName: 'string',
						regionName: t.tagData.city,
						address: t.uiDatas.cusaddress,
						emergencyContact: t.uiDatas.urgentname,
						emergencyPhone: t.uiDatas.urgentphone
					},
					orderDetailList: newArr,
					logisticsInfo: {
						orderLogisticsID: 'string',
						orderID: 'string',
						companyName: t.uiDatas.logistics,
						billNo: t.uiData.logisticsno,
						phone: t.uiData.fcollectpho,
						cargoQty: t.uiData.fprices,
						isElevator: 0,
						isUpstairs: 0,
						cargoFloors: t.uiData.felevator,
						cargoIsReach: 0,
						reachDate: t.uiData.fexpectedarrivaldate,
						reachAddress: t.uiData.fcollectadd,
						freightAmount: 0,
						isPayFreight: 0,
						shippingAmount: t.uiDatas.shippingamount,
						handlingAmount: 0,
						liftbuildAmount: 0
					}
				}
			});
			if (data === true) {
				t.$router.replace({name: 'pre-orders'});
			} else {

				t.$router.replace({name: 'order'});
			}
		},
		getData(type, data, call) {
			let t = this;
			switch (type) {
				case 'seritemprice':
					let MerchantID = t.$store.state.userCtx.MerchantID;
					t.axios({
						url: '/api/Order/GetServiceItemprice',
						methods: 'get',
						params: {
							strMerchantID: MerchantID,
							strProfieID: t.uiDatas.profield,
							strServiceType: t.uiDatas.service
						}
					}).then(res => {
						let srvData = res.data.data;
						t.tagData.serviceTypeData = srvData;
					});
					break;
				case 'master':
					let filterStr = "fapprovestatus ='auth2'";
					if (t.tagData.master.tabactive == 1) {
						filterStr += " and fid in(select fmasterid from t_ydj_masterfavorites where fisfavorites=0 and fmerchantid='" + t.$store.state.userCtx.linkIdentity.id + "')";
					} else {
						filterStr += " and fmainorgid='" + t.$store.state.userCtx.company.companyId + "'";
					}
					if (call === true) {
						t.tagData.master.search = '';
					}
					if (call === false && t.comm.IsNullOrEmpty(t.tagData.master.search)) {
						t.$message({
							message: '您不输入点什么嘛，让我怎找！',
							type: 'warning'
						});
						return;
					}
					if (!t.comm.IsNullOrEmpty(t.tagData.master.search)) {
						filterStr += this.$util.format(" and fname like '%{0}%'", t.tagData.master.search);
					}
					t.axios
						.post('/list/ydj_master?operationno=querydata', {
							selectFields: ['fphone'],
							filterString: filterStr,
							simpleData: {
								fmerchantid: t.$store.state.userCtx.linkIdentity.id
							},
							orderByString: 'fgrade desc,fstar desc',
							pageCount: t.tagData.master.listDesc.pageCount,
							pageIndex: data || 1
						})
						.then(res => {
							let srvData = res.data.operationResult.srvData;
							t.tagData.master.listData = srvData.data;
							t.tagData.master.listDesc.rows = srvData.dataDesc.rows;
						});
					break;
			}
		},
		// opChange(type, data) {
		//   let t = this;
		//   switch (type) {
		//   case "itemcategory": //服务信息 服务类目下拉框
		//     let material = t.tagData.serviceTypeData
		//     console.log(material)
		//       .find(o => {
		//         return o.id == data.fseritemid.id;
		//       })
		//       .material.find(o => {
		//         return o.id == data.fmaterial.id;
		//       });
		//     data.fprice = material.price;
		//     data.funitid = material.unit.id;
		//     data.funitid_fname = material.unit.name;
		//     data.famount = material.price;
		//     data.fprofieldentry = material.fprofield;
		//     break;
		// }
		// },
		opClick(type, data) {
			let t = this;
			switch (type) {
				case 'intelligence':
					t.$prompt('', '地址信息', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputValue: '',
						inputPlaceholder: '请在此处粘贴地址相关信息',
						inputType: 'textarea'
					})
						.then(({value}) => {
							let phone = /((\+?86)|(\(\+86\)))?1[3-9][0-9]{9}/.exec(value);
							if (phone != null) {
								t.uiDatas.phone = phone[0];
							}
							let name = new RegExp('(?<name>[\u4e00-\u9fa5]{2,4})').exec(value).groups['name'];
							if (name != null) {
								t.uiDatas.name = name;
							}
							let area = value.replace(t.uiDatas.phone, '').replace(t.uiDatas.name, '');
							area = new RegExp('(?<province>[^省]+省|.+自治区|上海|北京|天津|重庆)(?<city>[^市]+市|.+自治州|市辖区)(?<region>[^县]+县|.+区|.+镇|.+局)(?<address>.*)').exec(area);
							if (area.groups['province'] != null) {
								let p = vueCityDatas.find(o => {
									return o.label.indexOf(area.groups['province'].trim()) > -1;
								});
								if (area.groups['city'] != null && p != null) {
									let c = p.children.find(o => {
										return o.label.indexOf(area.groups['city'].trim()) > -1;
									});
									if (area.groups['region'] != null && c != null) {
										let a = c.children.find(o => {
											return o.label.indexOf(area.groups['region'].trim()) > -1;
										});
										if (a != null) {
											t.tagDatas.city = [p.value, c.value, a.value];
											t.uiDatas.cusaddress = area.groups['address'].trim();
										}
									}
								}
							}
						})
						.catch(() => {});
					break;
				case 'deleteServiceItem': //删除服务信息单项
					t.$confirm('您确定移除该项？', '操作提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						t.comm.ArrayRemove(t.uiDatas.fserviceentry, o => {
							return o.id == data;
						});
						t.comm.ArrayRemove(t.tagData.serviceItem.imageslist, o => {
							return o.id == data;
						});
					});
					break;
				case 'showImageDialog': //展示服务信息 图片上传框
					if (t.comm.IsNullOrEmpty(t.uiDatas.profield)) {
						t.$message({
							message: '请先选择服务类目',
							type: 'warning'
						});
						return;
					}
					if (t.comm.IsNullOrEmpty(t.uiDatas.service)) {
						t.$message({
							message: '请先选择服务类型',
							type: 'warning'
						});
						return;
					}
					t.tagData.serviceItem.editItem = data || '';
					t.tagData.serviceItem.projectImage = t.comm.Odefault(
						t.tagData.serviceItem.imageslist.find(o => {
							return o.id === data;
						}),
						'data',
						[]
					);
					t.tagData.serviceItem.visible = !0;
					break;
				case 'formatServiceItem': //服务明细图片确定按钮
					if (t.tagData.serviceItem.projectImage.length == 0) {
						t.$message({
							message: '请耐心等待图片上传完毕',
							type: 'warning'
						});
						return false;
					}
					let entity = {
						id: _.map(t.tagData.serviceItem.projectImage, 'id').join(),
						name: _.map(t.tagData.serviceItem.projectImage, 'name').join(),
						url: _.map(t.tagData.serviceItem.projectImage, 'url').join()
					};
					if (t.comm.IsNullOrEmpty(entity.id)) {
						t.$message({
							message: '请至少上传一张图片',
							type: 'warning'
						});
						return false;
					}
					t.tagData.serviceItem.visible = !1;
					if (t.comm.IsNullOrEmpty(t.tagData.serviceItem.editItem)) {
						let gid = t.comm.Guid(t.tagData.serviceItem.imageslist);
						console.log(t.tagData.serviceItem.imageslist);
						t.tagData.serviceItem.imageslist.push({
							id: gid,
							data: t.tagData.serviceItem.projectImage
						});
						t.uiDatas.fserviceentry.push({
							id: gid,
							fentityimage: entity,
							fseritemid: {id: '', name: ''},
							fmaterial: {id: '', name: ''},
							fqty: 1,
							fprice: 0,
							frequire: '',
							froomno: {id: '', name: ''},
							funitid: ''
						});
					} else {
						t.uiDatas.fserviceentry.find(o => {
							return o.id === t.tagData.serviceItem.editItem;
						}).fentityimage = entity;
						t.tagData.serviceItem.imageslist.find(o => {
							return o.id === t.tagData.serviceItem.editItem;
						}).data = t.tagData.serviceItem.projectImage;
					}
					// t.uiDatas.fserviceentry=t.uiDatas.fserviceentry
					// for(let item=0;t.uiDatas.fserviceentry.length>item;item++){
					// 	console.log(t.uiDatas.fserviceentry[item])
					// }
					break;
				case 'save': //保存或提交按钮
					t.uiDatas.forderdate = new Date((t.uiDatas.forderdate instanceof Date ? t.uiDatas.forderdate : new Date()).setHours(8));
					if (t.uiDatas.fexpectedarrivaldate instanceof Date) {
						t.uiDatas.fexpectedarrivaldate = new Date(t.uiDatas.fexpectedarrivaldate.setHours(8));
					}
					t.$refs['uiDatas'].validate(valid => {
						if (!valid) {
							t.$message({
								message: '请完善当前订单信息',
								type: 'warning'
							});
							return false;
						}
						if (t.uiDatas.type == 'fres_type_03') {
							t.uiDatas.fserviceentry = [
								{
									fentityimage: '',
									fseritemid: {id: '200000000000001026', name: '其它'},
									fmaterial: {id: 'material_33', name: '其它'},
									fqty: 1,
									fprice: 0,
									famount: 0,
									frequire: ''
								}
							];
						}
						if (t.comm.IsNullOrEmpty(t.uiDatas.fserviceentry) || t.uiDatas.fserviceentry.length == 0) {
							t.$message({
								message: '请至少填写一项服务信息',
								type: 'warning'
							});
							return false;
						}
						// let pid = t.uiDatas.profield.split(",");
						// t.uiDatas.profield_txt = t.uiDatas.profield.name = t._.map(
						//   t.tagData.comboStore.profield.filter(o => {
						//     return pid.indexOf(o.id) > -1;
						//   }),
						//   "name"
						// ).join();
						// t.tagData.isSubmit = data;

						if (['fres_type_01', 'fres_type_03'].indexOf(t.uiDatas.type) > -1) {
							t.uiDatas.type = 'offer_type_02';
						} else {
							t.uiDatas.logistics = '';
							t.uiDatas.logisticsno = '';
							t.uiDatas.collectadd = '';
							t.uiDatas.collectrel = '';
							t.uiDatas.collectpho = '';
							t.uiDatas.pieces = 0;
							t.uiDatas.shippingamount = 0;
							t.uiDatas.ispay = false;
							t.uiDatas.elevator = 0;
						}
						// if (!t.comm.IsNullOrEmpty(t.tagData.master.change)) {
						// 	t.uiDatas.fmasterid = {
						// 		// id: t._.map(t.tagData.master.change, "id").join(),
						// 		name: t._.map(t.tagData.master.change, 'name').join()
						// 	};
						// 	t.uiDatas.fisappointedorder = 1;
						// }
						t.$options.methods.getTotalData(t, data);
						// t.menuItemClick({ opcode: "save", event: "uiDatas" });
					});
					break;
				case 'master':
					t.tagData.master.listData.forEach(o => {
						if (o.check == true) {
							let ch = t.tagData.master.change.find(a => {
								return a.id == o.fbillhead_id;
							});
							if (ch == null) {
								t.tagData.master.change.push({
									id: o.fbillhead_id,
									name: o.fname
								});
							}
						}
					});
					t.tagData.master.visible = !1;
					break;
				case 'master-del':
					t.$confirm('您确定移除该项？', '操作提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						t.comm.ArrayRemove(t.tagData.master.change, o => {
							return o.id == data;
						});
					});
					break;
				case 'master-checkall':
					t.tagData.master.listData = t.tagData.master.listData.map(o => {
						o.check = t.tagData.master.checkall;
						return o;
					});
					break;
				default:
					break;
			}
		}
	},
	components: {ImgManage},
	computed: {
		Profield() {
			if (!this.comm.IsNullOrEmpty(this.uiDatas.profield)) {
				return this.uiDatas.profield;
			}
		},
		serviceType() {
			if (!this.comm.IsNullOrEmpty(this.uiDatas.service)) {
				return this.uiDatas.service;
			}
		},
		city() {
			return this.tagData.city;
		},
		appointed() {
			if (!this.comm.IsNullOrEmpty(this.tagData.master)) {
				return this.tagData.master.tabactive;
			}
		},
		masterCh() {
			return this.uiDatas.fmasterid;
		}
	},
	watch: {
		city(v) {
			this.uiDatas.fprovince = {id: v[0] || ''};
			this.uiDatas.fcity = {id: v[1] || ''};
			this.uiDatas.fregion = {id: v[2] || ''};
		},
		serviceType(v) {
			if (['fres_type_01', 'fres_type_03'].indexOf(v) > -1) {
				this.uiDatas.type = 'offer_type_02';
				this.tagData.serviceTypeMessage = '目前配送类服务只支持“师傅报价”模式，暂不支持“一口价”';
			} else {
				this.tagData.serviceTypeMessage = '';
			}
			this.getData('seritemprice');
		},
		Profield(v) {
			if (!this.comm.IsNullOrEmpty(v)) {
				this.uiDatas.type = '';
			}
		},
		appointed(v) {
			this.tagData.master.change = [];
		},
		masterCh(v) {
			if (!this.comm.IsNullOrEmpty(v.id) && this.tagData.isLoad) {
				let _id = v.id.split(',');
				let _name = v.name.split(',');
				let _arr = [];
				for (var i = 0; i < _id.length; i++) {
					_arr.push({id: _id[i], name: _name[i]});
				}
				this.tagData.master.change = _arr;
			}
		}
	}
};
</script>
<style lang="scss">
.sologo {
	background-color: #fdf6ec;
	padding: 10px;
	color: #e6a23c;
}
.placeorder {
	.radio-round {
		& > div {
			margin-right: 50px;
			& > * {
				position: relative;
				height: 60px;
			}
			.offer-one {
				padding-left: 50px;
				line-height: 60px;
				&::before {
					content: '';
					background-image: url(../../../assets/images/icon.png);
					background-position: -332px -115px;
					width: 42px;
					height: 40px;
					display: block;
					position: absolute;
					left: 0;
				}
			}
			.offer-two {
				padding-left: 40px;
				line-height: 60px;
				&::before {
					content: '';
					background-image: url(../../../assets/images/icon.png);
					background-position: -294px -111px;
					width: 27px;
					height: 55px;
					display: block;
					position: absolute;
					left: 0;
				}
			}
		}
	}
	.radio-border {
		& > * {
			margin-right: 10px;
		}
	}
	.serviceicon {
		& > * {
			width: 100px;

			padding-bottom: 5px;
			line-height: 20px;
			font-size: 12px;
		}

		.icon-profield-0 {
			background-position: -146px -234px;
		}
		.icon-profield-1 {
			background-position: -226px -234px;
		}
		.icon-profield-2 {
			background-position: -306px -234px;
		}
		.icon-profield-3 {
			background-position: -386px -234px;
		}
		.icon-profield-4 {
			background-position: -466px -234px;
		}
		.icon-profield-5 {
			background-position: -546px -234px;
		}
		.icon-profield-6 {
			background-position: -626px -234px;
		}
		.icon {
			width: 70px;
			height: 70px;
			display: block;
			margin: 10px auto 0 auto;
		}
	}
	.intelligence {
		background-color: #fff;
		border: 1px solid #ff6d22;
		color: #ff6d22;
		line-height: 22px;
		padding: 5px 12px;
		border-radius: 18px;
		& > i {
			vertical-align: middle;
			margin-right: 5px;
		}
	}
	.el-from-lable-vertical {
		position: relative;
		padding-left: 100px;
		margin-bottom: 22px;
		&::before {
			content: attr(label);
			display: block;
			width: 88px;
			height: 40px;
			line-height: 40px;
			text-align: right;
			position: absolute;
			padding-right: 12px;
			left: 0;
			top: 50%;
			margin-top: -20px;
			color: #606266;
		}
	}
	.city_box {
		display: inline-block;
	}
	.city_box,
	.el-select,
	.el-input {
		width: 200px;
	}
	.input-address {
		width: 372px;
	}
	.i8 {
		width: 100px;
		.el-input {
			width: 100px;
		}
	}
	.service-item {
		border: 1px solid #e7e7e7;
		padding: 20px 20px 20px 34px;
		margin-bottom: 20px;
		font-size: 0;
		& > div {
			display: inline-block;
			vertical-align: top;
			font-size: 14px;
			margin-right: 10px;
			& > * {
				margin-bottom: 20px;
				min-height: 40px;
				&:last-child {
					margin-bottom: 0;
				}
			}
			label {
				width: 80px;
				display: inline-block;
				padding-right: 14px;
				text-align: right;
				&.vt {
					vertical-align: top;
					line-height: 32px;
				}
				&.unit {
					width: 48px;
					padding: 0;
				}
			}
		}
		.item-tools {
			padding: 10px 0;
			font-size: 18px;
			text-align: right;
			width: 150px;
		}
		.item-tools .el-icon-delete {
			font-size: 24px;
			color: #bbbbbb;
			margin: 20px 15px 0 0;
		}
		.el-select,
		.el-input,
		.el-input-number {
			width: 149px;
		}
		.input-price {
			width: 100px;
			.el-input {
				width: 100px;
			}
		}
		.el-textarea {
			width: 455px;
		}

		.img-panel {
			width: 80px;
			height: 80px;
			box-sizing: content-box;
			border: 1px solid #e7e7e7;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				width: 0;
				height: 0;
				border-top: 26px solid #409eff;
				border-right: 26px solid transparent;
			}
			&::after {
				content: attr(data-count);
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				display: block;
				color: #fff;
				font-size: 12px;
				line-height: 20px;
				width: 26px;
				height: 26px;
				text-indent: 4px;
				text-align: left;
			}
			& > img {
				width: 80px;
				height: 80px;
			}
		}

		input[type='button'] {
			width: 80px;
			height: 34px;
			box-sizing: border-box;
			cursor: pointer;
			background-color: #fff;
			border: 1px solid #ff6d22;
			color: #ff6d22;
			border-radius: 4px;
			&:hover {
				background-color: rgba(255, 109, 34, 0.6);
			}
		}
	}
	.btn-panel {
		button {
			width: 128px;
			height: 45px;
			color: #fff;
			border-radius: 4px;
			background-color: #ff6d22;
			margin: 15px 0;
			font-size: 16px;
			&:hover {
				opacity: 0.8;
			}
		}
	}
	.tips {
		color: #3696ed;
		background-color: #e2f3ff;
		padding: 10px 20px;
		line-height: 1.8;
	}
	.tab {
		& > * {
			background-color: #fff;
			border: 1px solid #ccc;
			border-radius: 4px 4px 0 0;
			border-bottom: 1px solid #ff6d22;
			&.is-active {
				border-color: #ff6d22;
				color: #ff6d22;
				border-bottom: 1px solid #fff;
			}
		}
	}
	.tab-panel {
		border: 1px solid #ff6d22;
		padding: 10px;
		a {
			height: 33px;
			line-height: 33px;
			border: 1px dashed #ff6d22;
			display: inline-block;
			padding: 0 12px;
			color: #ff6d22;
		}
		em {
			height: 35px;
			line-height: 35px;
			display: inline-block;
			background-color: #ff6d22;
			color: #fff;
			padding: 0 12px;
			margin-right: 10px;
			border-radius: 4px;
			position: relative;
			i {
				position: absolute;
				right: -5px;
				top: -5px;
				border-radius: 50%;
				background-color: #ccc;
				color: #fff;
				cursor: pointer;
			}
		}
	}
	.el-pagination__editor.el-input {
		width: 50px;
	}
	.master {
		li {
			font-size: 0;
			padding: 10px;
			border: 1px solid #e8e8e8;
			position: relative;
			margin-bottom: 15px;
			& > * {
				display: inline-block;
				font-size: 14px;
				vertical-align: top;
			}
			.head {
				width: 112px;
				height: 112px;
				overflow: hidden;
				border-radius: 50%;
				border: 1px solid #e8e8e8;
				margin: 0 25px 0 15px;
				cursor: pointer;
				img {
					width: 100%;
				}
			}
			.base {
				width: 200px;
				h5 {
					font-size: 16px;
					line-height: 28px;
					font-weight: bold;
					margin-bottom: 18px;
					cursor: pointer;
				}
				p {
					margin-bottom: 18px;
				}
			}
			.service {
				width: 260px;
				padding-right: 40px;
				p {
					margin: 8px 0;
				}
			}
			.evl {
				width: 280px;
				p {
					margin: 8px 0;
				}
			}
			.el-button {
				position: absolute;
				right: 10px;
				top: 40px;
			}
		}
	}
}
</style>