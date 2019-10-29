import shtListPlugIn from '../../plugIn/shtListPlugIn';

export default class FavoritesListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		if (!this.query) {
			this.query = { selectFields: ['fphone'], filterString: "fapprovestatus ='auth2' and fid in(select fmasterid from t_ydj_masterfavorites where fisfavorites=0 and fmerchantid='" + this.$store.state.userCtx.linkIdentity.id + "')", simpleData: { fmerchantid: this.$store.state.userCtx.linkIdentity.id }, OrderByString: 'fispaymargin desc' };
		} else {
			this.query.filterString = "fapprovestatus ='auth2' and fid in(select fmasterid from t_ydj_masterfavorites where fisfavorites=0 and fmerchantid='" + this.$store.state.userCtx.linkIdentity.id + "')";
			this.query.selectFields = ['fphone'];
			this.query.OrderByString = 'fgrade desc';
			this.query.simpleData = { fmerchantid: this.$store.state.userCtx.linkIdentity.id };
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
		switch (args.opcode) {
			case 'pageSizeChanged':
				t.query.pageCount = args.value;
				break;
			case 'pageIndexChanged':
				t.query.pageIndex = args.value;
				break;
		}
		return super.onCustomEvent(args);
	}
}