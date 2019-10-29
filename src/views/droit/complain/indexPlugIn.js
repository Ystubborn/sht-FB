import shtListPlugIn from '../../plugIn/shtListPlugIn';

export default class ComplainListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			reject: { desc: "", id: "", visible: !1 },//驳回项目
			tA: 'zero',//Tab选项卡选中
			tD: [//a lable | b name | s filter
				{ a: "全部", b: "zero", s: '' },
				{ a: "处理中", b: "one", s: "fcomplainstatus='complain_status01'" },
				{ a: "投诉成功", b: "two", s: "fcomplainstatus='complain_status02'" },
				{ a: "投诉失败", b: "three", s: "fcomplainstatus='complain_status03'" }
			],
			cS: '',//客户信息
			oS: '',//订单号
			tS: '',//状态条件
			mS: '',//商户隔离条件
			back: { id: '', image: {}, visible: !1, content: '' },
			cMload: !0
		}
		args.rules = {
			content: [{ required: true, message: '请输入回复说明', trigger: 'blur' }]
		}
		/*处理普通商户和VIP商户Tabs数据源*/
		let userCtx = this.$store.state.userCtx;
		args.tagData.tD.map(o => {
			o.c = 0;
			return o;
		});

		/*商户过滤条件*/
		if (userCtx.linkIdentity) {
			args.tagData.mS = this.$util.format("fmerchantid='{0}'", userCtx.linkIdentity.id || '');
		}
		//全部订单、其他类型订单
		this.queryInit('', this.$route.params.tab || 'zero', args);
		return super.onInitUiModel(args);
	}
	onCustomEvent(args) {
		let t = this;
		switch (args.opcode) {
			case 'pageSizeChanged':
				t.query.pageCount = args.value;
				break;
			case 'pageIndexChanged':
				t.query.pageIndex = args.value;
				break;
			case 'tabClick':
				t.queryInit('', t.tagData.tA, t);
				break;
		}
		return super.onCustomEvent(args);
	}
}