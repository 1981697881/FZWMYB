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
					<text>{{ form.finBillNo }}</text>
				</view>
				<button class="cu-btn round line-orange shadow" @tap="showModal" data-target="1"><text class="cuIcon-scan"></text></button>
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
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
				<button class="cu-btn round line-orange shadow" @tap="showModal" data-target="2"><text class="cuIcon-scan"></text></button>
			</view>
		</view>
		<scroll-view scroll-x class="bg-white nav text-center margin-top" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">
				{{ tabNav[index] }}
			</view>
		</scroll-view>
		<block v-if="TabCur == 0">
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>
					装箱码:
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
								<view style="clear: both;width: 100%;" class="grid text-center col-2"  data-target="Modal" data-number="item.number">
									<view class="text-grey">机身码:{{ (item.index = index + 1) }}</view>
									<view class="text-grey">产品码:{{ item.number }}</view>
								</view>
							</view>
							<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
						</view>
					</view>
				</view>
				<view class="cu-bar tabbar shadow foot">
					<view class="box text-center">
						<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">提交</button>
					</view>
				</view>
			</scroll-view>
		</block>
		<block v-if="TabCur == 1">
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
								<view style="clear: both;width: 100%;" class="grid text-center col-3" data-target="Modal" data-number="item.number">
									<view class="text-grey">机身码:{{ (item.index = index + 1) }}</view>
									<view class="text-grey">产品码:{{ item.number }}</view>
									<view class="text-grey">包装码:{{ item.name }}</view>
								</view>
							</view>
							<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
						</view>
					</view>
				</view>
				<view class="cu-bar tabbar shadow foot">
					<view class="box text-center">
						<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" @tap="$manyCk(saveData)">提交</button>
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
			form: {
				finBillNo: null,
				fdate: '',
				fnote: '',
				fbillerID: null,
				fdeptID: ''
			},
			borrowItem: {},
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			deptList: [],
			cuIList: [],
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
			basic
				.getOrderList({
					billNo: option.billNo,
					/* startDate: option.startDate,
					 	endDate: option.endDate, */
					tranType: option.tranType,
					type: option.type
				})
				.then(res => {
					if (res.success) {
						let data = res.data.list;
						for (let i in data) {
							me.cuIList.push({
								Fdate: data[i].Fdate,
								FBillNo: data[i].FBillNo,
								number: data[i].FItemNumber,
								name: data[i].FItemName,
								model: data[i].FModel,
								Fauxprice: data[i].Fauxprice,
								Famount: data[i].Famount,
								FBatchManager: data[i].FBatchManager,
								fsourceEntryID: data[i].fsourceEntryID,
								fsourceTranType: data[i].FTranType,
								FAuxStockQty: data[i].FAuxStockQty,
								Fauxqty: data[i].Fauxqty,
								fsourceBillNo: data[i].FBillNo,
								unitID: data[i].FUnitNumber,
								unitName: data[i].FUnitName,
								quantity: data[i].Fauxqty
							});
						}
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
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
						var infoHeight = 0;
						var headHeight = 0;
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
						setTimeout(function() {
							me.pageHeight = res.windowHeight - infoHeight - headHeight;
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
			me.loadModal = false;
			me.isClick = false;
		},
		saveData() {
			this.isClick = true;
			let portData = {};
			let result = [];
			let list = this.cuIList;
			let array = [];
			let isBatchNo = false;
			let batchMsg = '';
			let me = this;
			for (let i in list) {
				let obj = {};
				obj.fauxqty = list[i].quantity;
				obj.fentryId = list[i].index;
				obj.finBillNo = this.form.finBillNo;
				obj.fitemId = list[i].number;
				if (list[i].FBatchManager) {
					if (list[i].fbatchNo != '' && list[i].fbatchNo != null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						batchMsg = '批号已启用，不允许为空';
						break;
					}
				} else {
					if (list[i].fbatchNo == '' || list[i].fbatchNo == null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						batchMsg = '批号未启用，不允许输入';
						break;
					}
				}
				obj.fauxprice = list[i].Fauxprice != null && typeof list[i].Fauxprice != 'undefined' ? list[i].Fauxprice : 0;
				obj.famount = list[i].Famount != null && typeof list[i].Famount != 'undefined' ? list[i].Famount : 0;
				obj.fdCSPId = list[i].positions;
				obj.uuid = list[i].uuid;
				obj.fdCStockId = list[i].stockId;
				if (list[i].stockId == null || typeof list[i].stockId == 'undefined') {
					result.push(list[i].index);
				}
				obj.fsourceBillNo = list[i].fsourceBillNo == null || list[i].fsourceBillNo == 'undefined' ? '' : list[i].fsourceBillNo;
				obj.fsourceEntryID = list[i].fsourceEntryID == null || list[i].fsourceEntryID == 'undefined' ? '' : list[i].fsourceEntryID;
				obj.fsourceTranType = list[i].fsourceTranType == null || list[i].fsourceTranType == 'undefined' ? '' : list[i].fsourceTranType;
				obj.funitId = list[i].unitID;
				array.push(obj);
			}
			portData.items = array;
			portData.ftranType = 2;
			portData.finBillNo = this.form.finBillNo;
			portData.fdate = this.form.fdate;
			portData.fbillerID = this.form.fbillerID;
			portData.fdeptId = this.form.fdeptID;
			console.log(JSON.stringify(portData));
			if (result.length == 0) {
				if (isBatchNo) {
					production
						.productStockIn(portData)
						.then(res => {
							if (res.success) {
								this.cuIList = [];
								uni.showToast({
									icon: 'success',
									title: res.msg
								});
								this.initMain();
								if (this.isOrder) {
									setTimeout(function() {
										uni.$emit('handleBack', { startDate: me.startDate, endDate: me.endDate, source: me.source });
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
				} else {
					uni.showToast({
						icon: 'none',
						title: batchMsg
					});
					this.isClick = false;
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '仓库不允许为空'
				});
				this.isClick = false;
			}
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
		},
		showModal(e) {
			/* this.fabClick(); */
			this.scanChoice = null;
			this.scanChoice = e.currentTarget.dataset.target;
			this.modalName = "Modal";
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
			switch(that.scanChoice){
				case '1':
				that.scanResult = res;
				that.hideModal();
				break;
				case '2':
				that.scanResult = res;
				that.hideModal();
				break;
				case '3':
				that.scanResult = res;
				that.hideModal();
				break;
				default:
				uni.showToast({
					icon: 'none',
					title: '请点击扫描按钮，再调用扫描'
				});
			}
			/* basic
				.inventoryByBarcode({ uuid: res })
				.then(reso => {
					console.log(reso);
					if (reso.success) {
						let data = reso.data;
						for (let i in that.cuIList) {
							console.log(data[0]['FItemID'] == that.cuIList[i]['FItemID']);
							console.log(data[0]['FItemID'] + ',' + that.cuIList[i]['FItemID']);
							if (data[0]['FItemID'] == that.cuIList[i]['FItemID']) {
								number++;
								uni.showToast({
									icon: 'none',
									title: '该物料已存在'
								});
								break;
							}
						}
						if (number == 0) {
							data[0].number = data[0].FNumber;
							data[0].name = data[0].FName;
							data[0].unitName = data[0].FUnitName;
							data[0].model = data[0].FModel;
							for (var i = 0; i < data.length; i++) {
								data[i].number = data[i].FNumber;
								data[i].name = data[i].FName;
								data[i].unitName = data[i].FUnitName;
								data[i].model = data[i].FModel;
								data[i].quantity = 0;
								data[i].checked = false;
								data[i].stockName = data[i].FStockName;
								data[i].stockId = data[i].FStockNumber;
								data[i].FIsStockMgr = data[i].FIsStockMgr;
								data[i].fbatchNo = data[i].FBatchNo;
								data[i].unitID = data[i].FUnitID;
							}
							that.cuIList.push({
								number: data[0].FNumber,
								name: data[0].FName,
								FItemID: data[0].FItemID,
								checked: false,
								isLoading: false,
								FCounty: 0,
								unitName: data[0].FUnitName,
								model: data[0].FModel,
								childrenList: data
							});
							console.log(data);
							that.form.bNum = that.cuIList.length;
						}
						console.log(that.cuIList);
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				}); */
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
