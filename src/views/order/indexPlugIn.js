import shtListPlugIn from '../plugIn/shtListPlugIn';

export default class OrderListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			evaluate: { id: '', visible: !1 },//评价
			cMload: !0,
			done: { visible: !1, code: '000000' },
			tabsVisible: true,
			tA: 'zero',//Tab选项卡选中 
			tAta: 'zero',
			calendar: '',
			calendarPicker: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
			tD: [//a lable | b name | s filter
				{ a: "全部订单", b: "zero", s: '' },
				{ a: "未提交/退单", b: "one", s: "(fserstatus='sht_serstatus00' or fserstatus='sht_serstatus02')", p: false },
				{ a: "待派单", b: "two", s: "(fserstatus='sht_serstatus03' or fserstatus='sht_serstatus04' or fserstatus='sht_serstatus05')", p: false },
				{ a: "待提交", b: "one", s: "(fserstatus='sht_serstatus00')", p: true },
				{ a: "待报价", b: "two", s: "(fserstatus='sht_serstatus03')", p: true },
				{ a: "待雇佣", b: "three", s: "(fserstatus='sht_serstatus10' or fserstatus='sht_serstatus11')", p: true },
				//{ a: "待支付", b: "four", s: "(fserstatus='sht_serstatus11')", p: true },
				{ a: "待预约", b: "five", s: "(fserstatus='sht_serstatus12')" },
				{ a: "待提货", b: "six",s:"(fserstatus='sht_serstatus16')"},
				{ a: "待上门", b: "seven", s: "(fserstatus='sht_serstatus13' or fserstatus='sht_serstatus16')" },
				{ a: "服务中", b: "eight", s: "(fserstatus='sht_serstatus06')" },
				{ a: "待验收", b: "nine", s: "(fserstatus='sht_serstatus07')" },
				{ a: "交易完成", b: "ten", s: "(fserstatus='sht_serstatus08')" }
			],
			cS: '',//客户信息
			oS: '',//订单号
			mS: '',//商户隔离条件
			tS: '',//状态条件
			aS: '',//所有筛选条件
			otherOrderFilter: [
				{
					a: "挂起单",
					b: "HuOrder",
					s: "fserstatus='sht_serstatus06' and fishang=1"
				},
				{
					a: "取消单",
					b: "ExOrder",
					s: "(fserstatus='sht_serstatus01')"
				}
			],
			opBtn: [
				{ a: '提交订单', b: 'submitOrder' },
				{ a: '查看报价', b: 'lookPrice' },
				{ a: '支付', b: 'payOrder' },
				{ a: '取消支付', b: 'exitPay' },
				{ a: '验收', b: 'acceptOrder' },
				{ a: '反馈', b: 'feedback' },
				{ a: '重新发布', b: 'republish' },
				{ a: '查看订单', b: 'lookOrder' },
				{ a: '取消订单', b: 'exitOrder' },
				{ a: '申请退款', b: 'applyRefund' },
				{ a: '修改订单', b: 'updateOrder' }
			]
		}
		/*处理普通商户和VIP商户Tabs数据源*/
		let userCtx = this.$store.state.userCtx;
		if (userCtx.isPlatform) {
			this.comm.ArrayRemove(args.tagData.tD, o => { return o.p === false });
		}
		else {
			this.comm.ArrayRemove(args.tagData.tD, o => { return o.p === true });
		}
		args.tagData.tD.map(o => {
			o.c = 0;
			return o;
		});

		/*商户过滤条件*/
		if (userCtx.linkIdentity) {
			args.tagData.mS = this.$util.format("fmerchantid='{0}'", userCtx.linkIdentity.id);
		}
		if (!this.comm.IsNullOrEmpty(this.$route.params.search)) {
			let kV = this.$route.params.search;
			kV.key === 'customer' ? args.tagData.cS = kV.value : args.tagData.oS = kV.value;
			this.queryInit('search', args.tagData.tA, args);
		}
		//全部订单、其他类型订单
		else if (this.comm.IsNullOrEmpty(this.$route.query.type)) {
			this.queryInit('tabs', this.$route.params.tab || 'zero', args);
		} else {
			this.queryInit('menus', this.$route.query.type, args);
		}
		return super.onInitUiModel(args);
	}

	onBeforeDoOperation(args) {
		args.param.loadingOption = {
			target: '.order-panel'
		}
		return Promise.resolve(args);
	}
	onCustomEvent(args) {
		let t = this;
		t.tagData.s = '';
		switch (args.opcode) {
			case 'pageSizeChanged':
				t.query.pageCount = args.value;
				break;
			case 'pageIndexChanged':
				t.query.pageIndex = args.value;
				break;
			case 'tabClick':
				this.queryInit('tabs', t.tagData.tA, t);
				break;
		}
		return super.onCustomEvent(args);
	}
}