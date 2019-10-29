import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../vuex/global';
import { MessageBox } from 'element-ui';
import authService from '../services/authservice';
import commUtil from 'src/services/utils/commUtil';
Vue.use(VueRouter);
const NotFound = r => require(['views/notfound'], r);
const Register = r => require(['views/register'], r);
const MRegister = r => require(['views/mobileregister'], r);
const Login = r => require(['views/login'], r);
const ResetPwd = r => require(['views/resetpwd'], r);
const Home = r => require(['views/home/index'], r);
const Order = r => require(['views/order/index'], r);
const PreOrder = r => require(['views/order/normal/placeOrder'], r);
const OrderDetail = r => require(['views/order/normal/orderDetail'], r);
const VPreOrder = r => require(['views/order/VIP/placeOrder'], r);
const VOrderDetail = r => require(['views/order/VIP/orderDetail'], r);
const Supply = r => require(['views/order/supply/index'], r);
const DetSupply = r => require(['views/order/supply/detail'], r);
const Problem = r => require(['views/order/problem/index'], r);
const DetProblem = r => require(['views/order/problem/detail'], r);
const CreProblem = r => require(['views/order/problem/create'], r);
const Additional = r => require(['views/order/additional/index'], r);
const DetAdditional = r => require(['views/order/additional/detail'], r);
const Pay = r => require(['views/pay/index'], r);
const AilpaySuccess = r => require(['views/pay/alipaySuccess'], r);
const Refund = r => require(['views/droit/refund/index'], r);
const CreRefund = r => require(['views/droit/refund/create'], r);
const DetRefund = r => require(['views/droit/refund/detail'], r);
const Complain = r => require(['views/droit/complain/index'], r);
const CreComplain = r => require(['views/droit/complain/create'], r);
const DetComplain = r => require(['views/droit/complain/detail'], r);
const Insure = r => require(['views/droit/insure/index'], r);
const Assets = r => require(['views/droit/insure/assets'], r);
const Person = r => require(['views/droit/insure/person'], r);
const DetInsure = r => require(['views/droit/insure/detail'], r);
const Wallet = r => require(['views/settle/wallet/index'], r);
const Month = r => require(['views/settle/wallet/month'], r);
const MonthPay = r => require(['views/settle/wallet/monthPay'], r);
const Recharge = r => require(['views/settle/wallet/recharge'], r);
const Withdraw=r => require(['views/settle/wallet/withdraw'], r);
const Withdraws=r => require(['views/settle/wallet/withdraws'], r);
const Claim = r => require(['views/settle/wallet/claim'], r);
const Report = r => require(['views/settle/report/index'], r);
const WalletPwd = r => require(['views/settle/wallet/pwd'], r)
const Account = r => require(['views/settle/wallet/account'], r);;
const Coupon = r => require(['views/settle/coupon/index'], r);
const BaseData = r => require(['views/personal/basedata/index'], r);
const UpdPwd = r => require(['views/personal/basedata/pwd'], r);
const Favorites = r => require(['views/personal/favorites/index'], r);
const Comproblem = r => require(['views/personal/comproblem/index'], r);
const Master = r => require(['views/master/index'], r);
const DetMaster = r => require(['views/master/detail'], r);


// 页面路由
const routes = [

	{
		redirect: {
			name: 'login'
		}
	},
	{
		component: Register,
		name: 'register',
		meta: {
			title: '用户注册'
		}
	},
	{
		component: MRegister,
		name: 'mregister',
		meta: {
			title: '用户注册'
		}
	},
	{
		component: ResetPwd,
		name: 'resetpwd',
		meta: {
			title: '忘记密码'
		}
	},
	{
		component: Login,
		name: 'login',
		meta: {
			title: '登录'
		}
	},
	{
		component: Home,
		name: 'home',
		meta: {
			requireAuth: true,
			title: '首页'
		}
	},
	{
		component: Order,
		name: 'order',
		meta: {
			requireAuth: true,
			title: '全部订单'
		}
	},
	{
		path: '/order/supply',
		component: Supply,
		name: 'supply',
		meta: {
			requireAuth: true,
			title: '补价单'
		}
	},
	{
		path: '/order/det-supply',
		component: DetSupply,
		name: 'det-supply',
		meta: {
			requireAuth: true,
			title: '补价详情'
		}
	},
	{
		path: '/order/problem',
		component: Problem,
		name: 'problem',
		meta: {
			requireAuth: true,
			title: '问题单'
		}
	},
	{
		path: '/order/det-problem',
		component: DetProblem,
		name: 'det-problem',
		meta: {
			requireAuth: true,
			title: '问题详情'
		}
	},
	{
		path: '/order/cre-problem',
		component: CreProblem,
		name: 'cre-problem',
		meta: {
			requireAuth: true,
			title: '问题反馈'
		}
	},
	{
		path: '/order/additional',
		component: Additional,
		name: 'additional',
		meta: {
			requireAuth: true,
			title: '附加费'
		}
	},
	{
		path: '/order/det-additional',
		component: DetAdditional,
		name: 'det-additional',
		meta: {
			requireAuth: true,
			title: '附加费详情'
		}
	},
	{
		path: '/order/pre-order',
		component: PreOrder,
		name: 'pre-order',
		meta: {
			requireAuth: true,
			title: '下单'
		}
	},
	{
		path: '/order/pre-orders',
		component: OrderDetail,
		name: 'pre-orders',
		meta: {
			requireAuth: true,
			title: '订单明细'
		}
	},
	{
		path: '/pay/:id?',
		component: Pay,
		name: 'pay',
		meta: {
			requireAuth: true,
			title: '在线支付'
		}
	},
	{
		component: AilpaySuccess,
		name: 'payback',
		meta: {
			title: '跳转中...'
		}
	},
	{
		path: '/droit',
		component: Refund,
		name: 'refund',
		meta: {
			requireAuth: true,
			title: '退款管理'
		}
	},
	{
		path: '/droit/cre-refund',
		component: CreRefund,
		name: 'cre-refund',
		meta: {
			requireAuth: true,
			title: '退款申请'
		}
	},
	{
		path: '/droit/det-refund',
		component: DetRefund,
		name: 'det-refund',
		meta: {
			requireAuth: true,
			title: '退款明细'
		}
	},
	{
		path: '/droit/complain',
		component: Complain,
		name: 'complain',
		meta: {
			requireAuth: true,
			title: '投诉管理'
		}
	},
	{
		path: '/droit/cre-complain',
		component: CreComplain,
		name: 'crecomplain',
		meta: {
			requireAuth: true,
			title: '订单投诉'
		}
	},
	{
		path: '/droit/det-complain',
		component: DetComplain,
		name: 'detcomplain',
		meta: {
			requireAuth: true,
			title: '投诉明细'
		}
	},
	{
		path: '/droit/insure',
		component: Insure,
		name: 'insure',
		meta: {
			requireAuth: true,
			title: '我要报案'
		}
	},
	{
		path: '/droit/insure/person',
		component: Person,
		name: 'person',
		meta: {
			requireAuth: true,
			title: '客户意外申报'
		}
	},
	{
		path: '/droit/det-insure',
		component: DetInsure,
		name: 'detinsure',
		meta: {
			requireAuth: true,
			title: '申报明细'
		}
	},
	{
		path: '/droit/insure/assets',
		component: Assets,
		name: 'assets',
		meta: {
			requireAuth: true,
			title: '客户财产损失申报'
		}
	},
	{
		path: '/settle',
		component: Wallet,
		name: 'wallet',
		meta: {
			requireAuth: true,
			title: '我的钱包'
		}
	},
	{
		path: '/settle/month',
		component: Month,
		name: 'month',
		meta: {
			requireAuth: true,
			title: '月结'
		}
	},
	{
		path: '/settle/monthpay',
		component: MonthPay,
		name: 'monthpay',
		meta: {
			requireAuth: true,
			title: '月结支付'
		}
	},
	{
		path: '/settle/recharge',
		component: Recharge,
		name: 'recharge',
		meta: {
			requireAuth: true,
			title: '充值'
		}
	},
	{
		path: '/settle/withdraw',
		component: Withdraw,
		name: 'withdraw',
		meta: {
			requireAuth: true,
			title: '提现'
		}
	},
	{
		path: '/settle/withdraws',
		component: Withdraws,
		name: 'withdraws',
		meta: {
			requireAuth: true,
			title: '提现'
		}
	},
	{
		path: '/settle/report',
		component: Report,
		name: 'report',
		meta: {
			requireAuth: true,
			title: '数据报表'
		}
	},
	{
		path: '/settle/walletpwd',
		component: WalletPwd,
		name: 'walletpwd',
		meta: {
			requireAuth: true,
			title: '钱包密码'
		}
	},
	{
		path: '/settle/account',
		component: Account,
		name: 'account',
		meta: {
			requireAuth: true,
			title: '账户绑定'
		}
	},
	{
		path: '/settle/coupon',
		component: Coupon,
		name: 'coupon',
		meta: {
			requireAuth: true,
			title: '现金券'
		}
	},
	{
		path: '/settle/claim',
		component: Claim,
		name: 'claim',
		meta: {
			requireAuth: true,
			title: '赔付金'
		}
	},
	{
		path: '/personal',
		component: BaseData,
		name: 'base',
		meta: {
			requireAuth: true,
			title: '个人资料'
		}
	},
	{
		path: '/personal/favorites',
		component: Favorites,
		name: 'favorites',
		meta: {
			requireAuth: true,
			title: '师傅收藏'
		}
	},
	{
		path: '/personal/updpwd',
		component: UpdPwd,
		name: 'updpwd',
		meta: {
			requireAuth: true,
			title: '修改密码'
		}
	},
	{
		path: '/personal/problem',
		component: Comproblem,
		name: 'comproblem',
		meta: {
			requireAuth: true,
			title: '帮助中心'
		}
	},
	{
		component: Master,
		name: 'master',
		meta: {
			requireAuth: true,
			title: '师傅中心'
		}
	},
	{
		path: '/master/detail',
		component: DetMaster,
		name: 'detmaster',
		meta: {
			requireAuth: true,
			title: '师傅明细'
		}
	}
].map(route => {
	if (commUtil.IsNullOrEmpty(route.path)) {
		route.path = commUtil.IsNullOrEmpty(route.name) ? '' : '/' + route.name;
	}
	return route;
});
// 404 页
routes.push({
	path: '*',
	component: NotFound,
	name: 'notfound',
	meta: {
		title: '404'
	}
});

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: routes
});


// 创建路由守卫，实现登录页面跳转
router.beforeEach((to, from, next) => {
	if (to && to.meta && to.meta.title) {
		document.title = "商户通管理系统 - " + to.meta.title;
	}
	else {
		document.title = "商户通管理系统";
	}
	if (to.name === "pre-order") {//路由修改下单
		to.matched[0].components.default = store.state.userCtx.isPlatform ? PreOrder : VPreOrder;
	}
	if (to.name === "pre-orders") {//路由修改订单明细
		to.matched[0].components.default = store.state.userCtx.isPlatform ? OrderDetail : VOrderDetail;
	}
	if (to.name === 'base' && to.query.id == null) {
		next({ path: '/personal', query: { id: store.state.userCtx.linkIdentity.id } });
		return
	}
	// 根据路由组件配置参数决定是否需要登录验证
	if (to && to.meta && to.meta.requireAuth === true) {
		// 取vuex中的state里的用户登录信息
		if (store.state.userCtx && store.state.userCtx.isLoggedIn) {
			next();
			return;
		}
		if (store.state.userCtx && store.state.userCtx.userName) {
			return logInByPwd(to, from, next);
		}
		next('/login');
	} else {
		next();
	}
});

function logInByPwd(to, from, next) {
	// 服务请求返回401错误时，弹出窗口输入密码重新登录
	MessageBox.prompt('请输入密码', '会话过期', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /[\w@!#$%&'*+/=?^_`{|}~\-\.\[\]:;|"<>()]{6,16}/,
		inputErrorMessage: '密码格式不正确(必须是6-16位字母符号或数字组合）',
		inputType: 'password'
	})
		.then(({ value }) => {
			return authService.login({
				userName: store.state.userCtx.userName,
				password: value,
				//任何post参数中都可以携带这个参数来干预Loading配置
				loadingOption: {
					target: '.el-message-box',
					text: '正在登录……'
				}
			});
		})
		.catch((err) => {
			next('/login');
		});
}

export default router;
