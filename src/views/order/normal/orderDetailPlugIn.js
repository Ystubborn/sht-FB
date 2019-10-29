import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class orderDetailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		//临时数据包
		args.tagData = {
			tabActive: 'one',//切换卡选中项
			offer:
			{
				visible: !1,
				masterOffer: [],//师傅报价信息
				detail: { fmasterinfo: {} }
			},
			tabs: {
				master: !1,
				order: !1,
				done: !1,
				refund: !1,
				feedbackBtn: !1,
				complainBtn: !1,
				refundBtn: !1
			},
			evaluate: { visible: !1 },//评价
			feedData: [], complainData: [], refundData: [],
			dealerStar: 0,
			thirdVisible: !1
		};
		args.tagData.tabActive = t.$route.query.tab || 'one';
		return super.onInitUiModel(args);
	}

	onAfterLoadModelData(args) {
		let t = this;
		//师傅报价选项卡显示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus10', 'sht_serstatus11', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.master = !0;
			t.getData('loadOffer');
		}
		//服务过程选项卡显示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.order = !0;
		}
		//完工信息展示 反馈数据展示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.done = !0;
			t.getData('feedback');
		}
		//服务过程选项卡 反馈按钮展示
		if (t.uiData.fserstatus.id === 'sht_serstatus07') {
			t.tagData.tabs.feedbackBtn = !0;
		}
		//服务过程选项卡 投诉数据及按钮展示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.getData('complain');
			if ('sht_serstatus08' !== t.uiData.fserstatus.id) {
				t.tagData.tabs.complainBtn = !0;
			}
		}
		//服务过程选项卡 退款数据及按钮展示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.refund = !0;
			t.getData('refund');
			if ('sht_serstatus08' !== t.uiData.fserstatus.id) {
				t.tagData.tabs.refundBtn = !0;
			}
		}
		if ('sht_serstatus08' === t.uiData.fserstatus.id) {
			t.getData('evaluate');
		}
		return super.onAfterLoadModelData(args);
	}
}