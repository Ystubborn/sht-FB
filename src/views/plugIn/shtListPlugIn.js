import listPlugIn from '../../lib/domain/list/listPlugIn';

export default class shtListPlugIn extends listPlugIn{
		constructor(options){
				super(options);
		}
		onInitUiModel(args){
				var self=this;
				return super.onInitUiModel(args);
		}

		onRefresh(args){
				var self=this;
				var param=Object.assign({},{
						formId:self.formCtx.formId,
						opcode:"querydata",
						param:self.query,
				});
				self.invokeFormOperation({
						formId:self.formCtx.formId,
						opcode:"querydata",
						param:Object.assign({
							pageId:'sys_mainfw',
							selectedRows:[
							],                  
						},self.query),
						args:args
				})
				.then(resp=>{
						var dataDesc=resp.response.operationResult.srvData.dataDesc||{};
						self.$set(self.uiData,'listData',resp.response.operationResult.srvData.data);

						self.$set(self.uiData,'listDesc',{
										pageIndex:resp.param.pageIndex,
										// 累计页数
										pages:dataDesc.pages||0,
										// 每页记录数
										pageSize:dataDesc.pageCount||50,
										// 所有分录数
										records:dataDesc.rows||0,
										// 表单张数
										bills:dataDesc.bills
								});
				})
				.catch  (error=>{
						Promise.reject(error);
				});
				return super.onRefresh(args);
		}
}