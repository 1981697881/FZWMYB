<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">扫描入库</block>
		</cu-custom>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					入库单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					生产单号:
					<text>{{ form.fworkno }}</text>
				</view>
				<button :disabled="!isOrder" class="cu-btn round line-orange shadow" @tap="showModal" data-target="1"><text class="cuIcon-scan"></text></button>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view style="width: 40px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdeptID" @change="deptChange"></ld-select>
				</view>
				<view class="action">
					<view style="width: 90px;">日期:</view>
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate" @change="bindChange"></ruiDatePicker>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">产品:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fitemnumber" />
				</view>
				<button class="cu-btn round line-orange shadow" @tap="showModal" data-target="2"><text class="cuIcon-scan"></text></button>
			</view>
		</view>
		<scroll-view scroll-x class="item-tab bg-white nav text-center margin-top" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">
				{{ tabNav[index] }}
			</view>
		</scroll-view>
		<block v-if="TabCur == 0">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>
					装箱码:{{ form.fpackcode }}
				</view>
				<button class="cu-btn round line-orange shadow" @tap="showModal" data-target="3"><text class="cuIcon-scan"></text></button>
			</view>
			<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
				<view v-for="(item, index) in cuIList" :key="index">
					<view class="cu-list menu-avatar">
						<view
							class="cu-item"
							style="width: 100%;margin-top: 2px;height: 120upx;"
							:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
							@touchstart="ListTouchStart"
							@touchmove="ListTouchMove"
							@touchend="ListTouchEnd"
							:data-target="'move-box-' + index"
						>
							<view style="clear: both;width: 100%;">
								<view style="clear: both;width: 100%;" class="grid text-center col-2" data-target="Modal" data-number="item.number">
									<view class="text-grey">机身码:{{ item.fitemcode }}</view>
									<view class="text-grey">产品码:{{ item.fboxcode }}</view>
								</view>
							</view>
							<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
						</view>
					</view>
				</view>
				<view class="cu-bar tabbar shadow foot">
					<view class="box text-center">
						<button :disabled="isClick" class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;" @tap="$manyCk(packingData)">装箱</button>
					</view>
				</view>
			</scroll-view>
		</block>
		<block v-if="TabCur == 1">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>
					仓库:
					<ld-select :list="stockList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdCStockId" @change="stockChange"></ld-select>
				</view>
			</view>
			<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
				<view v-for="(item, index) in boxList" :key="index">
					<view class="cu-list menu-avatar">
						<view
							class="cu-item"
							style="width: 100%;margin-top: 2px;height: 120upx;"
							:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
							@touchstart="ListTouchStart"
							@touchmove="ListTouchMove"
							@touchend="ListTouchEnd"
							:data-target="'move-box-' + index"
						>
							<view style="clear: both;width: 100%;">
								<view style="clear: both;width: 100%;" class="grid text-center col-2" data-target="Modal" data-number="item.number">
									<view class="text-grey">机身码:{{ item.fitemcode }}</view>
									<view class="text-grey">产品码:{{ item.fboxcode }}</view>
									<view class="text-grey">包装码:{{ item.fpackcode }}</view>
								</view>
							</view>
							<view class="move"><view class="bg-red" @tap="delBox(index, item)">删除</view></view>
						</view>
					</view>
				</view>
				<view class="cu-bar tabbar shadow foot">
					<view class="box text-center">
						<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">提交入库</button>
					</view>
				</view>
			</scroll-view>
		</block>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 350upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">扫描信息</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">条码信息：{{ scanResult }}</text>
						</view>
						<view class="action"><text class="text-grey"></text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import basic from '@/api/basic';
import loading from '@/components/loading';
import production from '@/api/production';
import service from '@/service.js';
export default {
	components: { ruiDatePicker, ldSelect, loading },
	data() {
		return {
			tabNav: ['产品数据', '装箱数据'],
			TabCur: 0,
			pageHeight: 0,
			headName: '',
			scanResult: '',
			isOrder: false,
			loadModal: false,
			onoff: true,
			isClick: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			scanChoice: null,
			gridCol: 3,
			counter: 0,
			counterIndex: 0,
			form: {
				finBillNo: null,
				fdate: '',
				fworkno: null,
				fitemnumber: '',
				fbillerID: null,
				fdeptID: '',
				fdCStockId: ''
			},
			borrowItem: {},
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			deptList: [],
			stockList: [],
			cuIList: [],
			boxList: [],
			startDate: null,
			endDate: null
		};
	},
	onUnload() {
		// 移除监听事件
		uni.$off('scancodedate');
	},
	onLoad: function(option) {
		let me = this;
		uni.$on('scancodedate', function(data) {
			// _this 这里面的方法用这个 _this.code(data.code)
			me.getScanInfo(data.code);
		});
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			me.form.fdeptID = option.FDeptNumber;
			this.startDate = option.startDate;
			this.endDate = option.endDate;
			this.source = option.tranType;
			this.billNo = option.billNo;
		}
	},
	onReady: function() {
		var me = this;
		me.loadModal = true;
		if (service.getUsers().length > 0) {
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				me.form.fbillerID = service.getUsers()[0].userId;
				me.form.username = service.getUsers()[0].username;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.getheight');
						let customHead = uni.createSelectorQuery().select('.customHead');
						let itemTab = uni.createSelectorQuery().select('.item-tab');
						var infoHeight = 0;
						var headHeight = 0;
						var itemTabHeight = 0;
						info.boundingClientRect(function(data) {
							//data - 各种参数
							infoHeight = data.height;
						}).exec();
						customHead
							.boundingClientRect(function(data) {
								//data - 各种参数
								headHeight = data.height;
							})
							.exec();
						itemTab
							.boundingClientRect(function(data) {
								//data - 各种参数
								itemTabHeight = data.height;
							})
							.exec();
						setTimeout(function() {
							me.pageHeight = res.windowHeight - infoHeight - headHeight - itemTabHeight - 60;
						}, 1000);
					}
				});
				me.initMain();
			}
		}
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			this.isClick = false;
		},
		initMain() {
			const me = this;
			this.form.fdate = this.getDay('', 0).date;
			basic
				.getBillNo({ TranType: 2 })
				.then(res => {
					if (res.success) {
						me.form.finBillNo = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});

			basic
				.getDeptList({})
				.then(res => {
					if (res.success) {
						me.deptList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.getStockList({})
				.then(res => {
					if (res.success) {
						me.stockList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			me.getPickingList();
			me.loadModal = false;
			me.isClick = false;
		},
		getPickingList() {
			let that = this;
			production
				.custInStockTemBoxList({ pageNum: 1, pageSize: 250 })
				.then(res => {
					if (res.success) {
						that.boxList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		packingData() {
			let that = this;
			if (that.isOrder && that.form.fworkno == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描单号'
				});
			}
			if (that.form.fitemnumber == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描产品'
				});
			}
			if (that.form.fdeptID == '') {
				return uni.showToast({
					icon: 'none',
					title: '请选择部门'
				});
			}
			if (that.form.fpackcode == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描装箱码'
				});
			}
			if (that.cuIList.length == 0 || that.counterIndex == 1) {
				return uni.showToast({
					icon: 'none',
					title: '装箱列表为空或数据不全'
				});
			}
			that.isClick = true;
			let portData = {};
			let list = this.cuIList;
			let array = [];
			list.forEach((item, index) => {
				let obj = {};
				obj.fseq = index + 1;
				obj.fitemcode = item.fitemcode;
				obj.fboxcode = item.fboxcode;
				obj.fpackcode = that.form.fpackcode;
				array.push(obj);
			});
			portData.custInStockTemBoxes = array;
			portData.fdate = that.form.fdate;
			portData.fbillno = this.form.fbillno;
			portData.fdeptnumber = this.form.fdeptID;
			portData.fitemnumber = this.form.fitemnumber;
			portData.fworkno = this.form.fworkno;
			production
				.insert(portData)
				.then(res => {
					if (res.success) {
						that.cuIList = [];
						uni.showToast({
							icon: 'success',
							title: res.msg
						});
					} else {
						that.isClick = false;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
					that.isClick = false;
				});
		},
		saveData() {
			this.isClick = true;
			let portData = {};
			let result = [];
			let list = this.boxList;
			let array = [];
			let that = this;
			if (that.isOrder && that.form.fworkno == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描单号'
				});
			}
			if (that.form.fitemnumber == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描产品'
				});
			}
			if (that.form.fdCStockId == '') {
				return uni.showToast({
					icon: 'none',
					title: '请选择仓库'
				});
			}
			if (that.form.fdeptID == '') {
				return uni.showToast({
					icon: 'none',
					title: '请选择部门'
				});
			}
			if (that.form.fpackcode == null) {
				return uni.showToast({
					icon: 'none',
					title: '请扫描装箱码'
				});
			}
			if (that.cuIList.length == 0) {
				return uni.showToast({
					icon: 'none',
					title: '装箱列表为空'
				});
			}
			for (let i in list) {
				let obj = {};
				obj.fauxqty = 1;
				obj.fentryId = list[i].index;
				obj.finBillNo = that.form.finBillNo;
				obj.fitemId = list[i].fitemcode;
				obj.fpackcode = list[i].fpackcode;
				obj.fdCStockId = that.form.fdCStockId;
				if (list[i].stockId == null || typeof list[i].stockId == 'undefined') {
					result.push(list[i].index);
				}
				obj.fsourceBillNo = that.form.fworkno == null || that.form.fworkno == 'undefined' ? '' : that.form.fworkno;
				/* obj.fsourceEntryID = list[i].fsourceEntryID == null || list[i].fsourceEntryID == 'undefined' ? '' : list[i].fsourceEntryID;
				obj.fsourceTranType = list[i].fsourceTranType == null || list[i].fsourceTranType == 'undefined' ? '' : list[i].fsourceTranType; */
				array.push(obj);
			}
			portData.items = array;
			portData.ftranType = 2;
			portData.finBillNo = this.form.finBillNo;
			portData.fdate = this.form.fdate;
			portData.fbillerID = this.form.fbillerID;
			portData.fdeptId = this.form.fdeptID;
			console.log(JSON.stringify(portData));
			production
				.productStockIn(portData)
				.then(res => {
					if (res.success) {
						this.boxList = [];
						uni.showToast({
							icon: 'success',
							title: res.msg
						});
						this.initMain();
						if (this.isOrder) {
							setTimeout(function() {
								uni.$emit('handleBack', { startDate: that.startDate, endDate: that.endDate, source: that.source });
								uni.navigateBack({
									url: '../production/productActive'
								});
							}, 1000);
						}
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
					this.isClick = false;
				});
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.counter--;
			that.counterIndex = 0;
		},
		delBox(index, item) {
			let that = this;
			production
				.custInStockTemBoxDelete({ fid: item.fid })
				.then(res => {
					if (res.success) {
						uni.showToast({
							icon: 'success',
							title: res.msg
						});
						that.getPickingList();
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		showModal(e) {
			/* this.fabClick(); */
			this.scanChoice = null;
			this.scanChoice = e.currentTarget.dataset.target;
			this.modalName = 'Modal';
		},
		hideModal(e) {
			this.modalName = null;
			this.scanChoice = null;
		},
		// 查询前后三天日期
		getDay(date, day) {
			var today = new Date();
			var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
			today.setTime(targetday_milliseconds); //注意，这行是关键代码
			var tYear = today.getFullYear();
			var tMonth = today.getMonth();
			var tDate = today.getDate();
			var getDay = today.getDay();
			tMonth = this.doHandleMonth(tMonth + 1);
			tDate = this.doHandleMonth(tDate);
			var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var week = weeks[getDay];
			return {
				day: tDate,
				week: week,
				date: tYear + '-' + tMonth + '-' + tDate
			};
		},
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		deptChange(val) {
			this.form.fdeptID = val;
		},
		stockChange(val) {
			this.form.fdCStockId = val;
		},
		bindChange(e) {
			this.form.fdate = e;
		},
		fabClick() {
			var that = this;
			let number = 0;
			uni.scanCode({
				success: function(res) {
					that.getScanInfo(res.result);
				}
			});
		},
		getScanInfo(res) {
			var that = this;
			let number = 0;
			switch (that.scanChoice) {
				case '1':
					that.scanResult = res;
					that.form.fworkno = res;
					that.hideModal();
					break;
				case '2':
					that.scanResult = res;
					that.form.fitemnumber = res;
					that.hideModal();
					break;
				case '3':
					that.scanResult = res;
					that.form.fpackcode = res;
					that.hideModal();
					break;
				default:
					let counter = that.counterIndex == 0 ? 'fitemcode' : 'fboxcode';
					if (typeof that.cuIList[this.counter] == 'undefined') {
						that.cuIList.push({
							fitemcode: res,
							fboxcode: ''
						});
						that.counterIndex++;
					} else {
						if (that.cuIList[this.counter]['fitemcode'] == res) {
							that.cuIList[this.counter][counter] = res;
							if (that.counterIndex == 0) {
								that.counterIndex++;
							} else {
								this.counter++;
								that.counterIndex = 0;
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: '机身码和产品码不一致，请确认'
							});
						}
					}
			}
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	}
};
</script>

<style>
.cu-modal.cu-item {
	float: left;
	width: 50%;
}
.cu-item .content {
	float: left;
}
.cu-list.menu-avatar > .cu-item .content {
	left: 5px;
}
.cu-list.menu-avatar > .cu-item .action {
}
.input {
	height: 30px;
}
.box {
	width: 100%;
}
.uni-input-placeholder,
.uni-input-input {
	font-size: 13px;
}
.action,
.content {
	font-size: 13px !important;
}
.ruidata {
	width: 100%;
	font-size: 13px;
	height: 7vw !important;
}
.cu-bar {
	min-height: 30px;
}
/* .page {
		height: calc(100vh - 320upx);
	} */
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
