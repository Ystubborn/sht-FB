import billPlugIn from '../../lib/domain/bill/billPlugIn';

export default class shtBillPlugIn extends billPlugIn{
		// onInitUiModel(args){
		// 		var self=this;
		// 		var routeParam=Object.assign({}, this.$route.params||{},this.$route.query||{});
		// 		return self.invokeFormOperation({
		// 				formId:self.formCtx.formId,
		// 				opcode:"initbill",
		// 				param:{
		// 					pageId:'sys_mainfw',
		// 					selectedRows:[
		// 						{
		// 							pkValue:routeParam.id||args.pkId||''
		// 						}
		// 					],
		// 					simpleData:routeParam
		// 				}
		// 			})
		// 			.then(data=>{
		// 					var resp=data.response||{};
		// 						var opResult=resp.operationResult;
		// 						if(opResult && opResult.isSuccess && opResult.srvData){          
		// 								args.formCtx={
		// 										pageId:opResult.srvData.pageId
		// 								};
		// 								args.uiData=opResult.srvData.uiData;
		// 								if(!args.tagData){
		// 										args.tagData={};
		// 								}
		// 								// 将服务端插件里在初始化时返回的数据合并至_srvTag上。
		// 								args.tagData = Object.assign({}, args.tagData, opResult.srvData.tagData || {});
		// 						}
		// 						//console.log(args);
		// 						return Promise.resolve(args);
		// 			})
		// 			.catch(error=>{
		// 					console.log('onInitUiModel error');
		// 					console.log(error);
		// 					return Promise.reject(error);
		// 			});   
		// }
}