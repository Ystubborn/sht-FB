<template>
  <div>
    <BreadCrumb :data="[{a: '报表管理'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right font14">
        <h4 class="title border-bottom-solid">数据报表</h4>
        <div class="report-screen">
          日期　<el-date-picker v-model="calendar" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          　统计年份　<el-select v-model="year">
            <el-option v-for="item in yearData" :key="item.a" :label="item.a" :value="item.b"></el-option>
          </el-select>
          　统计月份　<el-select v-model="month">
            <el-option v-for="item in monthData" :key="item.a" :label="item.a" :value="item.b"></el-option>
          </el-select>
        </div>
        <div class="report">
          <div>
            <div class="title">总支出<div>
                <el-select v-model="servicetype_ch" size="small" placeholder="选择服务类型">
                  <el-option v-for="item in servicetype" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="profield_ch" size="small" placeholder="选择服务项目">
                  <el-option v-for="item in profield" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div :style="{height:'300px',width:'487px'}" ref="BarEchart">
            </div>
          </div>
          <div>
            <div class="title">总单量</div>
            <div :style="{height:'300px',width:'487px'}" ref="PieEchart">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
	data() {
		let year = new Date().getFullYear();
		let yeardata = [];
		for (let i = year - 2; i < year + 1; i++) {
			yeardata.push({a: i + '年', b: i});
		}
		let month = new Date().getMonth();
		let date = new Date().getDate();
		return {
			barchart: null,
			piechart: null,
			id: 'id666',
			calendar: [new Date(year, 0, 1, 0, 0, 0), new Date(year, month, date, 23, 59, 59)],
			year: new Date().getFullYear(),
			yearData: yeardata,
			month: -1,
			monthData: [{a: '不限', b: -1}, {a: '一月', b: 0}, {a: '二月', b: 1}, {a: '三月', b: 2}, {a: '四月', b: 3}, {a: '五月', b: 4}, {a: '六月', b: 5}, {a: '七月', b: 6}, {a: '八月', b: 7}, {a: '九月', b: 8}, {a: '十月', b: 9}, {a: '十一月', b: 10}, {a: '十二月', b: 11}],
			start: '',
			end: '',
			servicetype: [],
			servicetype_ch: '',
			profield: [],
			profield_ch: ''
		};
	},
	created() {
		let t = this;
		t.axios.post('/bill/ydj_merchantorder?operationno=QueryComboBatch', {loadingOption: {target: '.element-loading'}, simpleData: {fieldKey: 'fservicetype,fprofield'}}).then(res => {
			let data = res.data.operationResult.srvData;
			t.servicetype = data.fservicetype;
			t.profield = data.fprofield;
		});
	},
	mounted() {
		this.Init();
	},
	watch: {
		year(v) {
			if (this.month == -1) {
				let year = new Date().getFullYear();
				let month = new Date().getMonth();
				let date = new Date().getDate();
				if (v == year) {
					this.calendar = [new Date(v, 0, 1, 0, 0, 0), new Date(v, month, date, 23, 59, 59)];
				} else {
					this.calendar = [new Date(v, 0, 1, 0, 0, 0), new Date(v, 11, 31, 23, 59, 59)];
				}
				return;
			}
			let day = 31;
			if ([4, 6, 9, 11].indexOf(this.month - 1) > -1) {
				day = 30;
			} else if (this.month === 1) {
				day = this.year % 4 == 0 && this.year % 100 !== 0 ? 29 : 28;
			}
			this.calendar = [new Date(v, this.month, 1, 0, 0, 0), new Date(v, this.month, day, 23, 59, 59)];
		},
		month(v) {
			let year = new Date().getFullYear();
			let month = new Date().getMonth();
			let date = new Date().getDate();
			if (this.year == year && v > month) {
				this.$message({
					message: '您要查询的月份还没到哦！',
					type: 'warning'
				});
				return;
			}
			if (v !== -1) {
				if (v == month) {
					this.calendar = [new Date(this.year, v, 1, 0, 0, 0), new Date(this.year, v, date, 23, 59, 59)];
					return;
				}
				let day = 31;
				if ([4, 6, 9, 11].indexOf(v - 1) > -1) {
					day = 30;
				} else if (v === 1) {
					day = this.year % 4 == 0 && this.year % 100 !== 0 ? 29 : 28;
				}
				this.calendar = [new Date(this.year, v, 1, 0, 0, 0), new Date(this.year, v, day, 23, 59, 59)];
				return;
			}
		},
		calendar(v) {
			if (this.comm.IsNullOrEmpty(v) || v.length != 2) {
				return;
			}
			this.PieLoadData(this.comm.DateToString(v[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(v[1], 'yyyy-MM-dd 23:59:59'));
			this.BarLoadData(this.comm.DateToString(v[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(v[1], 'yyyy-MM-dd 23:59:59'));
		},
		servicetype_ch() {
			if (this.comm.IsNullOrEmpty(this.calendar) || this.calendar.length != 2) {
				return;
			}
			this.BarLoadData(this.comm.DateToString(this.calendar[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(this.calendar[1], 'yyyy-MM-dd 23:59:59'));
		},
		profield_ch() {
			if (this.comm.IsNullOrEmpty(this.calendar) || this.calendar.length != 2) {
				return;
			}
			this.BarLoadData(this.comm.DateToString(this.calendar[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(this.calendar[1], 'yyyy-MM-dd 23:59:59'));
		}
	},
	methods: {
		Init() {
			this.barchart = echarts.init(this.$refs.BarEchart);
			this.piechart = echarts.init(this.$refs.PieEchart);
			this.PieLoadData(this.comm.DateToString(this.calendar[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(this.calendar[1], 'yyyy-MM-dd 23:59:59'));
			this.BarLoadData(this.comm.DateToString(this.calendar[0], 'yyyy-MM-dd 00:00:00'), this.comm.DateToString(this.calendar[1], 'yyyy-MM-dd 23:59:59'));
		},
		PieLoadData(start, end) {
			this.axios.post('/bill/ydj_merchantorder?operationno=mechantOrderServiceReport', {loadingOption: {target: '.element-loading'}, simpleData: {fmerchantid: this.$store.state.userCtx.linkIdentity.id, StartDate: start, EndDate: end}}).then(res => {
				let data = res.data.operationResult.srvData;
				let sumtotal = _.sum(_.map(data, 'value'));
				this.piechart.setOption({
					color: ['#52a8fb', '#52a8fb', '#d29cfe', '#fe7877', '#ff8f47', '#60e6df'],
					title: {
						text: '总单量',
						subtext: String(sumtotal),
						textAlign: 'center',
						textStyle: {
							color: '#666666',
							fontWeight: 'normal',
							fontSize: 14
						},
						subtextStyle: {
							fontSize: 30,
							color: '#333'
						},
						top: '40%',
						left: '145px'
					},
					legend: {
						icon: 'circle',
						itemGap: 20,
						itemWidth: 8,
						orient: 'vertical',
						top: 'middle',
						right: '60px',
						data: data,
						formatter: function(name) {
							var total = 0;
							var target;
							for (var i = 0, l = data.length; i < l; i++) {
								total += data[i].value;
								if (data[i].name == name) {
									target = data[i].value;
								}
							}
							var arr = ['{a|' + name + '}', '{b|' + (target == 0 ? '0.00%' : ((target / total) * 100).toFixed(2) + '%') + '}'];
							return arr.join('');
						},
						textStyle: {
							rich: {
								a: {color: '#666', padding: [0, 5, 0, 0], fontSize: 14},
								b: {color: '#333', fontWeight: 'bold', fontSize: 14}
							}
						}
					},
					series: [
						// 主要展示层的
						{
							radius: ['30%', '60%'],
							center: ['150px', '50%'],
							hoverAnimation: false,
							type: 'pie',
							label: {
								normal: {
									show: false
								}
							},
							data: data
						}
					]
				});
			});
		},
		BarLoadData(start, end) {
			this.axios.post('/bill/ydj_merchantorder?operationno=mechantOrderMoneyReport', {loadingOption: {target: '.element-loading'}, simpleData: {fmerchantid: this.$store.state.userCtx.linkIdentity.id, StartDate: start, EndDate: end, servicetype: this.servicetype_ch, profield: this.profield_ch}}).then(res => {
				let data = res.data.operationResult.srvData;
				this.barchart.setOption({
					color: ['#52a8fb'],
					tooltip: {},
					grid: {
						left: '14px',
						right: '14px',
						bottom: '14px',
						containLabel: true
					},
					title: {
						subtext: '金额（元）',
						subtextStyle: {
							color: '#666'
						}
					},
					xAxis: {
						data: data.x,
						axisLine: {
							lineStyle: {
								color: '#e8e8e8'
							}
						},
						axisLabel: {
							color: '#666',
							fontSize: 12
						}
					},
					yAxis: {
						axisTick: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#e8e8e8'
							}
						},
						axisLabel: {
							color: '#666',
							fontSize: 12
						},
						splitLine: {
							show: false
						}
					},
					series: [
						{
							type: 'bar',
							barWidth: '12px',
							itemStyle: {
								normal: {
									barBorderRadius: [6, 6, 0, 0]
								}
							},
							data: data.y
						}
					]
				});
			});
		}
	}
};
</script>
<style lang="scss">
.report-screen {
	margin: 20px 0;
	.el-select {
		width: 140px;
	}
}
.report {
	font-size: 0;
	& > div {
		border: 1px solid #e8e8e8;
		margin-right: 20px;
		background-color: #fff;
		display: inline-block;
		vertical-align: top;
		box-sizing: border-box;
		width: 489px;
		&:last-child {
			margin-right: 0;
		}
		.title {
			position: relative;
			& > div {
				position: absolute;
				top: -2px;
				right: 14px;
			}
			background-color: #f5f5f5;
			height: 42px;
			line-height: 42px;
			padding-left: 1em;
			.el-select {
				width: 110px;
				line-height: 32px;
			}
		}
	}
}
</style>