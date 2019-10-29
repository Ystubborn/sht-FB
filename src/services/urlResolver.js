// @author: linus
// @desc: 为领域模型提供api请求路径解析器
import _ from 'lodash';
/*
处理领域表单url解析
参数(args)结构：
				|--domainType 为当前发出请求的领域类型
				|--formId 为当前发出领域请求的表单标识
				|--opcode 为业务操作码标识，比如：save
				|--result (string)为函数返回值
				|--option
						|--参数(option)结构：
*/
const resolveUrl = function (options) {
	// 生成当前操作对应的请求url（按规则生成）        
	options.result = "/" + options.domainType + "/" + options.formId + ".json?operationno=" + options.opcode;
	return options.result;
};
export default resolveUrl;