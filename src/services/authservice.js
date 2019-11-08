import axios from './axios';
import store from '../vuex/global';
module.exports = {
	login(args) {
		var that = this;
		return axios.post('/api/User/Login', args)
			.then(res => {
				const data=res.data.data
				args.response = res;
				store.commit('userCtx', {
					userId: data.userID,
					organizationID:data.organizationID,
					userName: data.userAccount,
					displayName: data.userName,
					userToken: data.token
				});
				// //登录新接口
				// axios.post('/api/User/Login', {
				// 	userAccount: args.userName,
				// 	userPwd: args.password
				// }).then(response => {
				// 	store.commit('userCtx', {
				// 		Token: response.data.data.token,
				// 		organizationID:response.data.data.organizationID
				// 	})
				// })
				that.rememberSessionData(data|| {});
			// 	return axios.post('/dynamic/sys_mainfw?operationno=getsysinfo', {})
			// 		.then(res2 => {
			// 			var srvData = res2.data.operationResult.srvData;

			// 			var fileInfo = srvData.fileServerInfo;
			// 			//自动补全 fsApiUrl 最后的斜杠
			// 			if (fileInfo && fileInfo.fsApiUrl) {
			// 				if (fileInfo.fsApiUrl[fileInfo.fsApiUrl.length - 1] !== '/') {
			// 					fileInfo.fsApiUrl += '/';
			// 				}
			// 			}
			// 			store.commit('userCtx', { upApi: fileInfo });

			// 			args.sysinfo = res2;
			// 			return Promise.resolve(args);
			// 		})
			// 		.catch(error => {
			// 			return Promise.reject(error);
			// 		});

			// })
			// .catch(error => {
			// 	return Promise.reject(error);
			});
	},

	logout() {
		return axios.post('/api/User/Logout',{
			token:store.state.userCtx.userToken
		});
	},

	rememberSessionData(data) {
		 let MerchantID=store.state.userCtx.MerchantID?store.state.userCtx.MerchantID:null
		if (data && MerchantID) {
			axios({
				method:'get',
				url:'/api/Order/InitBill',
				params:{
					MerchantID:MerchantID
				}
			}).then(a => {
				console.log(a)
				store.commit('userCtx',{InitBill:a.data.data,

				})
			})
		}
		var companyInfo = [];
		if (data && data.companys) {
			companyInfo = JSON.parse(data.companys);
		}
		var company = {};
		if (data && data.company) {
			company = JSON.parse(data.company);
		}
		store.commit('userCtx', {
			isLoggedIn: true,
			// linkIdentity: linkIdInfo,
			// companys: companyInfo,
			// company: company,
			isPlatform:false
			//  store.state.userCtx.platformCode == company.companyId
		});
	}
};