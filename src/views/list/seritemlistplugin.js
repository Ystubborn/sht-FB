import shtListPlugIn from '../plugIn/shtListPlugIn';

export default class seritemlistplugin extends shtListPlugIn {
		constructor(options) {
				super(options);
		}
		onInitUiModel(args) {
				args.tagData = {
						listDataCheckList: [],
						search:''
				}
				args.query = { filterString: "fservicetype='" + this.servicetype + "' and fprofield in ('" + this.profield.split(',').join("','") + "')  and  fdealerid='" + this.$store.state.userCtx.linkIdentity.id + "'" };
				return super.onInitUiModel(args);
		}

		onBeforeDoOperation(args) {
				args.param.loadingOption = {
						target: '.seritem',
						text: ''
				}
				return Promise.resolve(args);
		}

		// 分页
		onCustomEvent(args) {
				var self = this;
				switch (args.opcode) {
						case 'pageSizeChanged':
								self.query.pageCount = args.value;
								break;
						case 'pageIndexChanged':
								self.query.pageIndex = args.value;
								break;
				}
				return super.onCustomEvent(args);
		}

}