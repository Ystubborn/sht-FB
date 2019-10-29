import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class placeOrderPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let userCtx = this.$store.state.userCtx;
	 
		let t = this;
		//临时数据包
		args.tagData = {
			city: [],
			isSubmit: false,
			logistics: {//物流模块
				visible: !1,
				default: 'this.src="' + require('../../../assets/images/default/car.png') + '"'
			},
			address: {
				type: !0,//true 提货地址 false 安装地址
				data: [],
				mapCenter: userCtx.linkIdentity.city || '深圳市',
				driving: { start: '', end: '' }
			},
			milePrice: 0,//运输费用
			serviceItem: {
				visible: !1
			}
		};
		args.rules = {
			"fprofield.id": [{ required: true, message: '请选择服务项目' }],
			fname: [{ required: true, message: '请填写客户姓名', trigger: 'blur' }],
			"fregion.id": [{ required: true, message: '请选择完整的省市区', trigger: 'change' }],
			fcusaddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
			"fcareful": [{ required: true, message: '请填写注意事项', trigger: 'blur' }],
			"fimage.id": [{ required: true, message: '请上传图纸' }],
		};
		return super.onInitUiModel(args);
	}

	onAfterLoadModelData(args) {
		if (!args) {
			return;
		}
		let t = this;
		if (args.status == 'view') {
			if (['sht_serstatus00', 'sht_serstatus02'].indexOf(t.uiData.fserstatus.id) == -1) {
				t.$router.push({ path: '/order/pre-orders', query: { id: t.uiData.id } })
				return;
			}
			t.tagData.city = [t.uiData.fprovince.id, t.uiData.fcity.id, t.uiData.fregion.id];
			return super.onAfterLoadModelData(args);
		}
		return super.onAfterLoadModelData(args);
	}

	onBeforeDoOperation(args) {
		let t = this;
		args.param.loadingOption = {
			target: '.placeorder',
			text: ''
		}
		switch (args.opcode) {
			case 'save':
				if (!t.tagData.isSubmit) {
					if (!args.param.simpleData) {
						args.param.simpleData = {};
					}
					args.param.simpleData.appId = "Other";
				}
				break;
		}
		return Promise.resolve(args);
	}

	onAfterDoOperation(args) {
		let t = this;
		let srvData = args.response.operationResult.srvData;
		if (args.opcode === 'save') {
			if (t.tagData.isSubmit) {
				t.$router.push({ path: '/order/pre-orders', query: { id: srvData[0].id } })
			}
			else {
				t.$router.push({ path: '/order', name: "order", params: { tab: 'one' } })
			}
		}
		return Promise.resolve(args);
	}
	onRefresh(args) {
		let t = this;
		let linkIdentity = t.$store.state.userCtx.linkIdentity
		if (linkIdentity) {
			if (t.uiData.fmerchantid) {
				t.uiData.fmerchantid.id = linkIdentity.id || '';
				t.uiData.fmerchantid.fname = linkIdentity.name || '';
			}
		}
		return Promise.resolve(args);
	}
}