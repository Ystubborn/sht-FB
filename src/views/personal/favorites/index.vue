<template>
  <div>
    <BreadCrumb :data="[{ a: '收藏师傅' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right master-favorites">
        <h4 class="title border-bottom-solid margin-bottom">收藏师傅</h4>
        <ul>
          <li v-for="item in uiData.listData" :key="item.fbillhead_id">
            <div class="head" @click="$router.push({path: '/master/detail',query: {id: item.fbillhead_id}});">
              <ImgRender type="headPort" :source="item.fimage"></ImgRender>
            </div>
            <div class="base">
              <h5 @click="opClick('lookMaster',item.fbillhead_id)">{{item.fname}}</h5>
              <p class="color-grey">{{item.fphone}}</p>
              <i class="icon icon-bond" v-if="item.fispaymargin">已缴保证金{{item.fmarginamount}}元</i>
            </div>
            <div class="service">
              <p>服务区域：{{item.area_txt}}</p>
              <p>服务类目：{{item.fprofield_txt}}</p>
            </div>
            <div class="evl">
              <p>综合评分:<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(item.overallScore)" disabled></el-rate>
              </p>
              <p>
                服务单数：
                <label class="color-blue">{{item.orderCount}}</label> 好评率：
                <label class="color-blue">{{item.applauseRate}}%</label>
              </p>
            </div>
            <div class="fav">
              <el-button type="orange" v-if="item.isFavorites" @click="opClick('favMaster',item)">取消收藏</el-button>
            </div>
          </li>
        </ul>
        <template>
          <div class="text-center">
            <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records"></el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template> 

<script>
import {listView as base} from '../../../lib';
import FavoritesListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ydj_master';
listView.plugs = [new FavoritesListPlugIn({})];
listView.mixins = [
	{
		methods: {
			/**
      *
      按钮事件
      *
      @method opClick
      @param {String} type 操作Code
      @param {Object} [data] 数据
      */
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'favMaster':
						t.axios.post('/bill/ydj_masterfavorites?operationno=Favorites', {loadingOption: {target: '.element-loading'}, simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, fmasterid: data.fbillhead_id}}).then(res => {
							if (res.data.operationResult.srvData.code != 1) {
								t.comm.ArrayRemove(t.uiData.listData, o => {
									return o.fbillhead_id == data.fbillhead_id;
								});
							}
						});
						break;
					case 'lookMaster':
						t.$router.push({
							path: '/master/detail',
							query: {id: data}
						});
						break;
				}
			}
		}
	}
];
export default listView;
</script>
<style lang="scss">
.master-favorites {
	& > ul {
		li {
			font-size: 0;
			padding: 30px;
			border: 1px solid #e8e8e8;
			position: relative;
			margin-bottom: 15px;
			& > * {
				display: inline-block;
				font-size: 14px;
				vertical-align: top;
			}
			.head {
				width: 112px;
				height: 112px;
				overflow: hidden;
				border-radius: 50%;
				border: 1px solid #e8e8e8;
				margin: 0 25px 0 15px;
				cursor: pointer;
				img {
					width: 100%;
				}
			}
			.base {
				width: 150px;
				h5 {
					font-size: 16px;
					line-height: 28px;
					font-weight: bold;
					margin-bottom: 18px;
					cursor: pointer;
				}
				p {
					margin-bottom: 18px;
				}
			}
			.service {
				width: 230px;
				padding-right: 30px;
				p {
					margin: 8px 0;
				}
			}
			.evl {
				width: 270px;
				p {
					margin: 8px 0;
				}
			}
		}
	}
}
</style>
