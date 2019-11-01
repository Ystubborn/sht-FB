/**
 * Created by linus at 20171208
 */
import Vue from 'vue';
import _ from 'lodash';
import VuexPersistedState from 'vuex-persistedstate';
import Vuex from 'vuex';

Vue.use(Vuex);

// 生成 mutations 方法
function generate(name) {
  return function (state, value) {
    if (_.isObjectLike(value)) {
      state[name] = _.assign(state[name] || {}, value);
    }
    else {
      state[name] = value || state[name];
    }
  };
}

const options = {
  strict: true,

  // 多页面共享数据
  state: {
    //登录成功后用户上下文信息对象
    userCtx: {
      userId: '',
      userName: '',//用户账号
      displayName: '',//名字
      userHead: '',
      isMonthlyaccount:false,
      isLoggedIn: false,
      isPlatform: false,
      platformCode: '425035663272972289',
      platformdealer: '425236371930746886',
      upApi: {
        fsApiUrl:'http://apifile.zys6d.cn'
      },
      // 关联业务身份信息：对于商户通这里就是商户资料
      linkIdentity: {},
      company: {},
      companys: [],
      /*-new-*/
      userToken:'',
      Token:'',
      organizationID:'',
      MerchantID:'uid_7483a5012f7bf9ac1a000000',
      InitBill:[]

    },
    header: {
      caption: ''
    },
    message: '',
    pageStatus: {
      orderTab: '',
      history: ''
    },
    pay: {
      params: {
        id: '',
        isbalance: true,//是否可用余额支付
        type: '',
        formId: '',
        price: 0,
        other: {},
        islogistics: false,//是否含物流
      }
    }
  },
  // 操作
  actions: {},

  // 数据变更
  mutations: {},


  plugins: [VuexPersistedState({
    storage: window.sessionStorage,
    paths: ['userCtx', 'pageStatus', 'pay']
  })]
};



// 为每个 state 字段生成对应的 mutations 方法
Object.keys(options.state).forEach((key) => {
  options.mutations[key] = generate(key);
});


// 创建一个 store 对象用于管理应用状态
const store = new Vuex.Store(options);

export default store;