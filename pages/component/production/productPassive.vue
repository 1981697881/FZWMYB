<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">产品入库</block>
		</cu-custom>
		<uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					日期:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate" @change="bindChange"></ruiDatePicker>
				</view>
				<view class="action">
					包数:
					<text>{{ form.bNum }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view style="width: 90px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdeptID" @change="deptChange"></ld-select>
				</view>
				<view class="action">
					<view style="width: 90px;">仓库:</view>
					<ld-select :list="stockList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdCStockId" @change="stockChange"></ld-select>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">备注:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
				<button class="cu-btn round lines-blue line-blue shadow" @tap="showModal" data-target="Modal">详情</button>
			</view>
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 350upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">温馨提示</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">用户：{{ form.username }}</text>
						</view>
						<view class="action"><text class="text-grey"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 350upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">{{ popupForm.headName }}</view>
					<view class="action" @tap="hideModal2"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">批号:</view>
									<input name="input" style="border-bottom: 1px solid;" v-model="popupForm.fbatchNo" />
								</view>
							</view>
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">数量:</view>
									<input name="input" type="digit" style="border-bottom: 1px solid;" v-model="popupForm.quantity" />
								</view>
							</view>
						</view>
					</view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">库位:</view>
									<input name="input" style="border-bottom: 1px solid;" v-model="popupForm.positions" />
									<button class="cu-btn round lines-red line-red shadow" @tap="$manyCk(scanPosition)">扫码</button>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal2">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view
						class="cu-item"
						style="width: 100%;margin-top: 2px;height: 320upx;"
						:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
						@touchstart="ListTouchStart"
						@touchmove="ListTouchMove"
						@touchend="ListTouchEnd"
						:data-target="'move-box-' + index"
					>
						<view style="clear: both;width: 100%;"><!-- @tap="showModal2(index, item)" -->
							<view style="clear: both;width: 100%;" class="grid text-center col-2"  data-target="Modal" data-number="item.number">
								<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
								<view class="text-grey">编码:{{ item.number }}</view>
								<view class="text-grey">名称:{{ item.name }}</view>
								<view class="text-grey">数量:{{ item.quantity }}</view>
								<view class="text-grey">应收数量:{{ item.Fauxqty }}</view>
								<view class="text-grey">实收数量:{{ item.FAuxStockQty }}</view>
								<view class="text-grey">批号:{{ item.fbatchNo }}</view>
								<view class="text-grey">单位:{{ item.unitName }}</view>
								<view class="text-grey">规格:{{ item.model }}</view>
								<view class="text-grey">仓位:{{ item.positions }}</view>
								<view class="text-grey">{{ item.stockName }}</view>
							</view>
							<view class="text-grey text-center">
								<picker @change="PickerChange($event, item)" :value="pickerVal" :range-key="'FName'" :range="stockList">
									<view class="picker">
										<button class="cu-btn sm round bg-green shadow">
											<text class="cuIcon-homefill"></text>
											仓库
										</button>
									</view>
								</picker>
							</view>
						</view>
						<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;margin-right: 10%;" @tap="$manyCk(saveData)">提交</button>
					<button class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;" @tap="$manyCk(clearList)">清空</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import basic from '@/api/basic';
import loading from '@/components/loading';
import production from '@/api/production';
import service from '@/service.js';
export default {
	components: { ruiDatePicker, ldSelect, uniFab, loading },
	data() {
		return {
			pageHeight: 0,
			headName: '',
			isOrder: false,
			loadModal: false,
			onoff: true,
			isClick: false,
			pickerVal: null,
			modalName: null,
			modalName2: null,
			gridCol: 3,
			form: {
				finBillNo: null,
				fdate: '',
				bNum: 0,
				fnote: '',
				fbillerID: null,
				fdCStockId: '',
				fdeptID: ''
			},
			borrowItem: {},
			popupForm: {
				fbatchNo: '',
				positions: '',
				quantity: ''
			},
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			deptList: [],
			stockList: [],
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
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
						me.form.bNum = data.length;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.message
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
		clearList() {
			const that = this;
			if (that.cuIList.length > 0) {
				uni.showModal({
					title: '温馨提示',
					content: '是否清空列表，清空之后将无法还原！',
					success: function(res) {
						if (res.confirm) {
							that.cuIList = [];
							that.initMain();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
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
						title: err.message
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
						title: err.message
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
						title: err.message
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
								this.form.bNum = 0;
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
								title: err.message
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
		submitCom() {
			var me = this;
			if (me.popupForm.positions != '' && me.popupForm.positions != null) {
				basic.selectFdCStockIdByFdCSPId({ fdCSPId: me.popupForm.positions }).then(reso => {
					if (reso.data != null && reso.data != '') {
						if (reso.data['FIsStockMgr']) {
							me.borrowItem.stockName = reso.data['stockName'];
							me.borrowItem.stockId = reso.data['stockNumber'];
							me.borrowItem.FIsStockMgr = reso.data['FIsStockMgr'];
							me.borrowItem.positions = me.popupForm.positions;
							me.borrowItem.quantity = me.popupForm.quantity;
							me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
							me.modalName2 = null;
						} else {
							me.borrowItem.stockName = reso.data['stockName'];
							me.borrowItem.stockId = reso.data['stockNumber'];
							me.borrowItem.FIsStockMgr = reso.data['FIsStockMgr'];
							me.borrowItem.positions = '';
							me.borrowItem.quantity = me.popupForm.quantity;
							me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
							me.modalName2 = null;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '该库位不存在仓库中！'
						});
					}
				});
			} else {
				if (me.popupForm.FIsStockMgr) {
					return uni.showToast({
						icon: 'none',
						title: '仓位已启用，请输入仓位！'
					});
				} else {
					me.borrowItem.positions = '';
					me.borrowItem.quantity = me.popupForm.quantity;
					me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
					me.modalName2 = null;
				}
			}
		},
		saveCom() {
			var me = this;
			if (this.popupForm.quantity > me.borrowItem.Fauxqty) {
				uni.showModal({
					title: '温馨提示',
					content: '入库数量大于单据数量！请确认！',
					success: function(res) {
						if (res.confirm) {
							me.submitCom();
						} else if (res.cancel) {
							return;
						}
					}
				});
			} else {
				me.submitCom();
			}
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.form.bNum = this.cuIList.length;
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target;
		},
		showModal2(index, item) {
			/* if(item.stockId == null || item.stockId == ''){
					return uni.showToast({
						icon: 'none',
						title: '请先选择仓库！',
					});
				} */
			this.modalName2 = 'Modal';
			if (item.fbatchNo == null || typeof item.fbatchNo == 'undefined') {
				item.fbatchNo = '';
			}
			if (item.positions == null || typeof item.positions == 'undefined') {
				item.positions = '';
			}
			if (item.quantity == null || typeof item.quantity == 'undefined') {
				item.quantity = '';
			}
			this.popupForm = {
				quantity: item.quantity,
				fbatchNo: item.fbatchNo,
				FIsStockMgr: item.FIsStockMgr,
				positions: item.positions
			};
			this.borrowItem = item;
		},
		hideModal(e) {
			this.modalName = null;
		},
		hideModal2(e) {
			this.modalName2 = null;
			this.popupForm = {};
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
			let sList = this.stockList;
			let list = this.cuIList;
			const me = this;
			for (let i in sList) {
				if (sList[i].FNumber == val) {
					for (let j in list) {
						me.$set(list[j], 'stockName', sList[i].FName);
						me.$set(list[j], 'FIsStockMgr', sList[i].FIsStockMgr);
						me.$set(list[j], 'stockId', val);
						me.$set(list[j], 'positions', '');
					}
				}
			}
		},
		bindChange(e) {
			this.form.fdate = e;
		},
		PickerChange(e, item) {
			this.$set(item, 'stockName', this.stockList[e.detail.value].FName);
			this.$set(item, 'stockId', this.stockList[e.detail.value].FNumber);
			this.$set(item, 'positions', '');
			this.$set(item, 'FIsStockMgr', this.stockList[e.detail.value].FIsStockMgr);
		},
		scanPosition() {
			let me = this;
			uni.scanCode({
				success: function(res) {
					basic.selectFdCStockIdByFdCSPId({ fdCSPId: res.result }).then(reso => {
						if (reso.data != null && reso.data != '') {
							me.popupForm.positions = res.result;
							me.popupForm.stockName = reso.data['stockName'];
							me.popupForm.stockId = reso.data['stockNumber'];
							me.popupForm.FIsStockMgr = reso.data['FIsStockMgr'];
						} else {
							uni.showToast({
								icon: 'none',
								title: '该库位不存在仓库中！'
							});
						}
					});
				}
			});
		},
		fabClick() {
			var that = this;
			uni.scanCode({
				success: function(res) {
					that.getScanInfo(res.result)
					/* basic
						.barcodeScan({ uuid: res.result })
						.then(reso => {
							if (reso.success) {
								if (that.isOrder) {
									console.log(reso.data);
									//if(reso.data['billNo'] == this.billNo){
									let number = 0;
									for (let i in that.cuIList) {
										if (reso.data['number'] == that.cuIList[i]['number']) {
											if (reso.data['stockNumber'] == that.cuIList[i]['stockId'] && reso.data['batchNo'] == that.cuIList[i]['fbatchNo']) {
												if (reso.data['quantity'] == null) {
													reso.data['quantity'] = 1;
												}
												if (reso.data['isEnable'] == 2) {
													reso.data['uuid'] = null;
												}
												that.cuIList[i]['quantity'] = parseFloat(that.cuIList[i]['quantity']) + parseFloat(reso.data['quantity']);
												number++;
												break;
											}
										} else {
											uni.showToast({
												icon: 'none',
												title: '该物料不在所选列表中！'
											});
											number++;
											break;
										}
									}
									if (number == 0) {
										if (reso.data['quantity'] == null) {
											reso.data['quantity'] = 1;
										}
										if (reso.data['isEnable'] == 2) {
											reso.data['uuid'] = null;
										}
										reso.data.stockName = reso.data.stockNumber;
										reso.data.stockId = reso.data.warehouse;
										reso.data.FIsStockMgr = reso.data.FIsStockMgr;
										reso.data.fbatchNo = reso.data.batchNo;
										that.cuIList.push(reso.data);
										that.form.bNum = that.cuIList.length;
									}
									/* }else{
									uni.showToast({
										icon: 'none',
										title: '该物料不在所选单据中！',
									});
								} */
								/*} else {
									let number = 0;
									for (let i in that.cuIList) {
										if (
											reso.data['number'] == that.cuIList[i]['number'] &&
											reso.data['stockNumber'] == that.cuIList[i]['stockId'] &&
											reso.data['batchNo'] == that.cuIList[i]['fbatchNo']
										) {
											if (reso.data['quantity'] == null) {
												reso.data['quantity'] = 1;
											}
											if (reso.data['isEnable'] == 2) {
												reso.data['uuid'] = null;
											}
											that.cuIList[i]['quantity'] = parseFloat(that.cuIList[i]['quantity']) + parseFloat(reso.data['quantity']);
											number++;
											break;
										}
									}
									if (number == 0) {
										if (reso.data['quantity'] == null) {
											reso.data['quantity'] = 1;
										}
										if (reso.data['isEnable'] == 2) {
											reso.data['uuid'] = null;
										}
										reso.data.stockName = reso.data.stockNumber;
										reso.data.stockId = reso.data.warehouse;
										reso.data.FIsStockMgr = reso.data.FIsStockMgr;
										reso.data.fbatchNo = reso.data.batchNo;
										that.cuIList.push(reso.data);
										that.form.bNum = that.cuIList.length;
									}
								}
							}
						})
						.catch(err => {
							uni.showToast({
								icon: 'none',
								title: err.message
							});
						});*/
				} 
			});
		},
		 getScanInfo(res) {
		 	var that = this;
		 		let number = 0;
		 		let resData = res.split(',')
		 	if (that.isOrder) {
		 		for (let i in that.cuIList) {
		 			let codeData = that.cuIList[i]['FBarCode'].split(',')
		 			if ((resData[0]+resData[1]+resData[2]+resData[3]+resData[4]) == (codeData[0]+codeData[1]+codeData[2]+codeData[3]+codeData[4])) {
		 				if (that.cuIList[i]['onFBarCode'] == '') {
		 					that.cuIList[i]['onFBarCode'] = (resData[0]+resData[1]+resData[2]+resData[3]+resData[4])
		 					that.cuIList[i]['FAuxStockQty'] = resData[3]
		 				}else{
		 					uni.showToast({
		 						icon: 'none',
		 						title: '该条码已扫描！'
		 					});
		 					break;
		 				}
		 			}  else {
		 				number ++;
		 			}
		 		}
		 		if(number == that.cuIList.length){
		 			uni.showToast({
		 				icon: 'none',
		 				title: '该物料不在所选单据中！'
		 			});
		 		}
		 	}else{
				for (let i in that.cuIList) {
					let codeData = that.cuIList[i]['FBarCode'].split(',')
					if ((resData[0]+resData[1]+resData[2]+resData[3]+resData[4]) == (codeData[0]+codeData[1]+codeData[2]+codeData[3]+codeData[4])) {
						if (that.cuIList[i]['onFBarCode'] == '') {
							that.cuIList[i]['onFBarCode'] = (resData[0]+resData[1]+resData[2]+resData[3]+resData[4])
							that.cuIList[i]['FAuxStockQty'] = resData[3]
						}else{
							uni.showToast({
								icon: 'none',
								title: '该条码已扫描！'
							});
							break;
						}
					} else {
					  	number ++;
					}
				}
				if(number == that.cuIList.length){
					that.cuIList.push({
						Fdate: resData[0],
						FBillNo: resData[0],
						number: resData[0],
						name: resData[0],
						model: resData[0],
						Fauxprice: resData[0],
						Famount: resData[0],
						FBatchManager: resData[0], 
						fsourceEntryID: resData[0],
						fsourceTranType: resData[0],
						FAuxStockQty: resData[0],
						Fauxqty: resData[0],
						fsourceBillNo: resData[0],
						unitID: resData[0],
						unitName: resData[0],
						quantity: resData[0]
					});
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
.cu-item {
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
