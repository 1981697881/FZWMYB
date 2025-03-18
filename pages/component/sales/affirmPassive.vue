<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">销售出库</block>
		</cu-custom>
		<loading :loadModal="loadModal"></loading>
		<!-- <uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab> -->
		<yb-list v-model="show" :data="chooseList" :title="title" @confirm="chooseClick" />
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					日期:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate"
						@change="bindChange"></ruiDatePicker>
				</view>
				<!-- <view class="action">
					包数:
					<text>{{ form.bNum }}</text>
				</view> -->
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view style="width: 90px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable
						v-model="form.fdeptID" :value="form.fdeptID" @change="deptChange"></ld-select>
				</view>
				<view class="action">
					<view style="width: 90px;">仓库:</view>
					<ld-select :list="stockList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable
						v-model="form.fdCStockId" :value="form.fdCStockId" @change="stockChange"></ld-select>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">客户:{{ form.FCustName }}</view>
					<!-- <ld-select :list="customerList"
				list-key="FName" value-key="FNumber"
				placeholder="请选择"
				clearable
				:value="form.FCustNumber"
				@change="customerChange"></ld-select> -->
				</view>
				<button class="cu-btn round lines-blue line-blue shadow" @tap="showModal" :disabled="isDis"
					data-target="Modal">选择</button>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">备注:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 70%;margin-top: 20%;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">客户信息</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view style="width:100%;height: 100%;overflow: auto;text-align: left;">
					<city-select @cityClick="cityClick" :formatName="formatName" :obtainCitys="customerList"
						:isSearch="true" style="width: auto !important;" ref="citys"></city-select>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: auto;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">{{ popupForm.headName }}</view>
					<view class="action" @tap="hideModal2"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">数量:</view>
									<input name="input" type="digit" style="border-bottom: 1px solid;"
										v-model="popupForm.FAuxStockQty" />
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
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: auto;"
						:data-target="'move-box-' + index">
						<view style="clear: both;width: 100%;" @tap="showModal2(index, item)"
							class="grid text-center col-2" data-target="Modal" data-number="item.number">
							<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
							<view class="text-grey">编码:{{ item.number }}</view>
							<view class="text-grey">名称:{{ item.name }}</view>
							<view class="text-grey">数量:{{ item.quantity }}</view>
							<view class="text-grey">实发数量:{{ item.FAuxStockQty }}</view>
							<view class="text-grey">批号:{{ item.fbatchNo }}</view>
							<view class="text-grey">单位:{{ item.unitName }}</view>
							<view class="text-grey">仓库:{{ item.stockName }}</view>
							<view class="text-grey" style="width: 100%;">规格:{{ item.model }}</view>
							<view class="text-grey"><button v-if="item.onFBarCode.length>0" @tap.stop="showModalList(index, item)" class="mini-btn" type="primary" size="mini">查看</button></view>
							<view class="text-grey"><button v-if="item.onFBarCode.length>0" @tap.stop="DeleteModalList(index, item)" class="mini-btn" type="primary" size="mini">清空</button></view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" :disabled="isClick"
						@tap="$manyCk(saveData)">提交</button>
					<button v-if="!isOrder" class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;"
						@tap="$manyCk(clearList)">清空</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import ybList from '@/components/yb-list/yb-list.vue';
	import ldSelect from '@/components/ld-select/ld-select.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import basic from '@/api/basic';
	import sales from '@/api/sales';
	import production from '@/api/production';
	import citySelect from '@/components/city-select/city-select.vue';
	import loading from '@/components/loading';
	import service from '@/service.js';
	export default {
		components: {
			ldSelect,
			uniFab,
			loading,
			citySelect,
			ybList
		},
		data() {
			return {
				formatName: 'FName',
				pageHeight: 0,
				headName: '',
				isOrder: false,
				isClick: false,
				onoff: true,
				isDis: false,
				loadModal: false,
				pickerVal: null,
				modalName: null,
				modalName2: null,
				gridCol: 3,
				borrowItem: {},
				popupForm: {
					FAuxStockQty: ''
				},
				show: false,
				title: '选择',
				form: {
					finBillNo: null,
					fdate: '2000-01-01',
					bNum: 0,
					fnote: '',
					FCustNumber: '',
					fbillerID: null,
					fdCStockId: '09',
					FCustName: '',
					fdeptID: '33'
				},
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
				deptList: [],
				stockList: [],
				customerList: [],
				chooseList: [],
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
				endDate: null,
				billNo: null
			};
		},
		watch: {
			cuIList: {
				handler(newValue, oldValue) {
					let number = 0
					this.cuIList.forEach((item) => {
						number += Number(item.quantity)
					})
					this.form.bNum = number
				},
				deep: true
			}
		},
		onLoad: function(option) {
			let me = this;
			uni.$on('scancodedate', function(data) {
				// _this 这里面的方法用这个 _this.code(data.code)
				me.getScanInfo(data.code);
			});
			if (JSON.stringify(option) != '{}') {
				this.isOrder = true;
				this.isDis = true;
				//me.form.fdeptID = option.FDeptNumber;
				me.form.FCustNumber = option.FCustNumber;
				me.form.FCustName = option.FCustName;
				me.startDate = option.startDate;
				me.endDate = option.endDate;
				me.billNo = option.billNo;
				me.form.finBillNo = option.billNo;
				basic
					.getOrderList({
						billNo: option.billNo,
						tranType: option.tranType,
						type: option.type
					})
					.then(res => {
						if (res.success) {
							let data = res.data.list;
							console.log(data)
							for (let i in data) {
								me.cuIList.push({
									Fdate: data[i].Fdate,
									number: data[i].FItemNumber,
									name: data[i].FItemName,
									model: data[i].FModel,
									FBatchManager: data[i].FBatchManager,
									fsourceBillNo: data[i].FBillNo,
									Famount: data[i].Famount,
									onFBarCode: [],
									scanBarCode: [],
									FAuxStockQty: 0,
									FOrderEntryID: data[i].FOrderEntryID,
									ForderID: data[i].ForderID,
									FBarCode: data[i].FBarCode,
									Fauxprice: data[i].Fauxprice,
									FSourceInterID: data[i].FSourceInterID,
									fsourceEntryId: data[i].FEntryID,
									fsourceTranType: data[i].FTranType,
									quantity: data[i].Fauxqty,
									unitID: data[i].FUnitNumber,
									unitName: data[i].FUnitName,
									stockName: data[i].FDCStockName,
									stockId: data[i].FDCStockNumber,
								});
							}
							console.log(me.cuIList)
							me.form.bNum = res.data.list.length;
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
		onUnload() {
			// 移除监听事件
			uni.$off('scancodedate');
		},
		onReady: function() {
			var me = this;
			me.loadModal = true;
			me.initMain();
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
								me.pageHeight = res.windowHeight - infoHeight - headHeight - 35;
							}, 1000);
						}
					});
				}
			}
		},
		methods: {
			showModalList(index, item){
				this.chooseList = item.onFBarCode
				this.show = true;
			},DeleteModalList(index, item){
				uni.showModal({
					title: '温馨提示',
					content: '是否清空已扫数据？',
					success: function(res) {
						if (res.confirm) {
							item['onFBarCode'] =[]
							item['scanBarCode'] =[]
							item['FAuxStockQty'] = 0
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			showModal2(index, item) {
				let that = this;
				/* if(item.stockId == null || item.stockId == ''){
						return uni.showToast({
							icon: 'none',
							title: '请先选择仓库！',
						});
					} */
				if (item.onFBarCode.length > 0) {
					uni.showModal({
						title: '温馨提示',
						content: '为了避免统计错乱，手工输入和扫码只能选其一，是否清空扫码数量？',
						success: function(res) {
							if (res.confirm) {
								item.onFBarCode = [];
								item.FAuxStockQty = 0;
								that.modalName2 = 'Modal';
								if (item.FAuxStockQty == null || typeof item.FAuxStockQty == 'undefined') {
									item.FAuxStockQty = '';
								}
								that.popupForm = {
									FAuxStockQty: item.FAuxStockQty,
								};
								that.borrowItem = item;
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else {
					that.modalName2 = 'Modal';
					if (item.FAuxStockQty == null || typeof item.FAuxStockQty == 'undefined') {
						item.FAuxStockQty = '';
					}
					that.popupForm = {
						FAuxStockQty: item.FAuxStockQty,
					};
					that.borrowItem = item;
				}
			},
			hideModal2(e) {
				this.modalName2 = null;
				this.popupForm = {};
			},
			saveCom() {
				var me = this;
				me.borrowItem.FAuxStockQty = me.popupForm.FAuxStockQty;
				me.modalName2 = null;
			},
			cityClick(item) {
				this.form.FCustName = item.FName;
				this.form.FCustNumber = item.FNumber;
				this.modalName = null;
			},
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
					.getDeptList({})
					.then(res => {
						if (res.success) {
							console.log(res.data)
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
				basic
					.customerList({})
					.then(res => {
						if (res.success) {
							me.customerList = res.data;
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
					});
				me.isClick = false;
				me.loadModal = false;
			},
			saveData() {
				this.isClick = true;
				let portData = {};
				let result = [];
				let list = this.cuIList;
				let array = [];
				let codeArray = [];
				let isBatchNo = false;
				let number = 0;
				for (let i in list) {
					let obj = {};
					obj.fauxqty = list[i].FAuxStockQty;
					obj.fentryId = list[i].index;
					obj.finBillNo = list[i].FBillNo;
					/* if (list[i].FBatchManager) {
						if (list[i].fbatchNo != '' && list[i].fbatchNo != null) {
							obj.fbatchNo = list[i].fbatchNo;
							isBatchNo = true;
						} else {
							isBatchNo = false;
							break;
						}
					} else {
						if (list[i].fbatchNo == '' || list[i].fbatchNo == null) {
							obj.fbatchNo = list[i].fbatchNo;
							isBatchNo = true;
						} else {
							isBatchNo = false;
							break;
						}
					} */
					obj.fitemId = list[i].number;
					obj.fauxprice = list[i].Fauxprice != null && typeof list[i].Fauxprice != 'undefined' ? list[i]
						.Fauxprice : 0;
					obj.famount = list[i].Famount != null && typeof list[i].Famount != 'undefined' ? list[i].Famount : 0;
					obj.fdCStockId = list[i].stockId;
					/* if (list[i].stockId == null || typeof list[i].stockId == 'undefined') {
						result.push(list[i].index);
					} */
					if (list[i].FAuxStockQty == null || list[i].FAuxStockQty == 0 || typeof list[i].FAuxStockQty == '') {
						result.push(list[i].index);
					}
					obj.fsourceBillNo = list[i].fsourceBillNo == null || list[i].fsourceBillNo == 'undefined' ? '' : list[
						i].fsourceBillNo;
					obj.fsourceEntryId = list[i].fsourceEntryId == null || list[i].fsourceEntryId == 'undefined' ? '' :
						list[i].fsourceEntryId;
					obj.fsourceTranType = list[i].fsourceTranType == null || list[i].fsourceTranType == 'undefined' ? '' :
						list[i].fsourceTranType;
					obj.fsourceinterid = list[i].FSourceInterID;
					obj.funitId = list[i].unitID;
					array.push(obj);
					list[i].onFBarCode.forEach((item) => {
						codeArray.push({
							"fbillNo": item.fbillNo,
							"ftranType": item.ftranType,
							"fpackCode": item.fpackCode,
							"fbarcode": item.fbarcode,
							"fdate": item.fdate,
							"fitemnumber": list[i].number
						});
					});
					if(list[i].onFBarCode.length>0){
						number++
					}
				}
				portData.items = array;
				if(number == 0){
					portData.fnote = "手工录入";
				}else{
					portData.fnote = "扫描录入";
				}
				portData.ftranType = 2101;
				portData.finBillNo = this.form.finBillNo;
				portData.fdate = this.form.fdate;
				portData.fbillerID = this.form.fbillerID;
				portData.fdeptId = this.form.fdeptID;
				portData.fcustId = this.form.FCustNumber;
				portData.fsupplyID = this.form.FCustNumber;
				if (this.form.FCustNumber == '' || typeof this.form.FCustNumber == 'undefined') {
					uni.showToast({
						icon: 'none',
						title: '客户不能为空'
					});
					this.isClick = false;
					return;
				}
				console.log(codeArray)
				if (result.length == 0) {
					if (portData.fcustId != '' && typeof portData.fcustId != 'undefined') {
						/* if (isBatchNo) { */
						sales
							.saleStockOut(portData)
							.then(res => {
								if (res.success) {
									sales
										.insertBarcode(codeArray)
										.then(reso => {
											if (reso.success) {
												this.cuIList = [];
												uni.showToast({
													icon: 'success',
													title: res.msg
												});
												this.form.bNum = 0;
												this.initMain();
												if (this.isOrder) {
													uni.navigateBack({
														url: '../sales/salesActive?startDate=' + this
															.startDate +
															'&endDate=' + this.endDate
													});
												}
											}
										}).catch(erro => {

										});
								}
							})
							.catch(err => {
								uni.showToast({
									icon: 'none',
									title: err.msg
								});
								this.isClick = false;
							});
						/* } else {
							uni.showToast({
								icon: 'none',
								title: '启用批号，批号不能为空，未启用批号，批号必须为空'
							});
							this.isClick = false;
						} */
					} else {
						uni.showToast({
							icon: 'none',
							title: '客户不能为空'
						});
						this.isClick = false;
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '物料实发数量不允许为空'
					});
					this.isClick = false;
				}
			},
			del(index, item) {
				this.cuIList.splice(index, 1);
				this.form.bNum = this.cuIList.length;
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal(e) {
				this.modalName = null;
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
			customerChange(val) {
				this.form.FCustNumber = val;
			},
			stockChange(val) {
				let sList = this.stockList;
				let list = this.cuIList;
				const me = this;
				for (let i in sList) {
					if (sList[i].FNumber == val) {
						for (let j in list) {
							me.$set(list[j], 'stockName', sList[i].FName);
							me.$set(list[j], 'stockId', val);
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
			},
			fabClick() {
				var that = this;
				uni.scanCode({
					success: function(res) {
						that.getScanInfo(res.result);
					}
				});
			},
			chooseClick(val) {
				let that = this;
				if (val.length > 1) {
					for (let i in that.cuIList) {
						if (val[0]["FNumber"] == that.cuIList[i]['number']) {
							that.cuIList[i]['onFBarCode'] =[]
							that.cuIList[i]['scanBarCode'] =[]
							that.cuIList[i]['FAuxStockQty'] = 0
							if (that.cuIList[i]['onFBarCode'].length == 0) {
								that.cuIList[i]['FAuxStockQty'] = 0;
							}
							that.cuIList[i]['onFBarCode'].push(...val)
							that.cuIList[i]['scanBarCode'].push(val[0]["fpackCode"])
							let res = val[0]["fpackCode"].split(";");
							that.cuIList[i]['FAuxStockQty'] = (parseInt(res[4]) + parseFloat(that.cuIList[i][
								'FAuxStockQty'
							]))
							break;
						}
					}
				} else {
					for (let i in that.cuIList) {
						if (val[0]["FNumber"] == that.cuIList[i]['number']) {
							/* obj1.fbillNo = list[i].FBillNo;
							obj1.ftranType = 21;
							obj1.fpackCode = "";
							obj1.fbarcode = "";
							obj1.fdate = this.form.fdate; */
							that.cuIList[i]['onFBarCode'] =[]
							that.cuIList[i]['scanBarCode'] =[]
							that.cuIList[i]['FAuxStockQty'] = 0
							if (that.cuIList[i]['onFBarCode'].length == 0) {
								that.cuIList[i]['FAuxStockQty'] = 0;
							}
							that.cuIList[i]['scanBarCode'].push(val[0]["fpackCode"])
							that.cuIList[i]['onFBarCode'].push(...val)
							that.cuIList[i]['FAuxStockQty'] = (1 + parseFloat(that.cuIList[i]['FAuxStockQty']))
							break;
						}
					}
				}
			},
			firstList(val) {
				let that = this;
				if (val.length > 1) {
					for (let i in that.cuIList) {
						if (val[0]["FNumber"] == that.cuIList[i]['number']) {
							if (that.cuIList[i]['onFBarCode'].length == 0) {
								that.cuIList[i]['FAuxStockQty'] = 0;
							}
							that.cuIList[i]['onFBarCode'].push(...val)
							that.cuIList[i]['scanBarCode'].push(val[0]["fpackCode"])
							let res = val[0]["fpackCode"].split(";");
							that.cuIList[i]['FAuxStockQty'] = (parseInt(res[4]) + parseFloat(that.cuIList[i][
								'FAuxStockQty'
							]))
							break;
						}
					}
				} else {
					for (let i in that.cuIList) {
						if (val[0]["FNumber"] == that.cuIList[i]['number']) {
							/* obj1.fbillNo = list[i].FBillNo;
							obj1.ftranType = 21;
							obj1.fpackCode = "";
							obj1.fbarcode = "";
							obj1.fdate = this.form.fdate; */
							if (that.cuIList[i]['onFBarCode'].length == 0) {
								that.cuIList[i]['FAuxStockQty'] = 0;
							}
							that.cuIList[i]['scanBarCode'].push(val[0]["fpackCode"])
							that.cuIList[i]['onFBarCode'].push(...val)
							that.cuIList[i]['FAuxStockQty'] = (1 + parseFloat(that.cuIList[i]['FAuxStockQty']))
							break;
						}
					}
				}
			},
			getScanInfo(res) {
				var that = this;
				let number = 0;
				that.chooseList = [];
				for (let i in that.cuIList) {
					if (that.cuIList[i]['scanBarCode'].indexOf(res) != -1) {
						number++;
					}
				}
				if (number > 0) {
					return uni.showToast({
						icon: 'none',
						title: '该条码已扫描！'
					});
				}
				if (that.isOrder) {
					let resData = res.split(';')
					sales.checkBarcodeUse({
							uuid: res,
							ftranType: 21
						})
						.then(useRes => {
							console.log(useRes)
							console.log(resData)
							if (useRes.success && useRes.data == 0) {
								if (resData.length == 1) {
									basic
										.checkBarCodefifo({
											uuid: res
										})
										.then(reso => {
											if (reso.success) {
												console.log(reso)
												if (reso.data.length > 0) {
													var chooseList = []
													reso.data.forEach((item) => {
														if (item.FCurrent == "Y") {
															chooseList.push({
																"FNumber": item["fitemnumber"],
																"FName": item["fitemnumber"],
																"fbarcode": item["FBarCode"],
																"fpackCode": res,
																"fbillNo": that.form.finBillNo,
																"ftranType": 21,
																"fdate": that.form.fdate,
																"Ffifo": item.Ffifo
															});
														}
													})
													that.firstList(chooseList)
													/* that.show = true; */
													/* if (that.cuIList[i]['scanBarCode'].indexOf(res)) {
																that.chooseList.push({
																	"FNumber": reso.data[0]["FNumber"],
																	"FName": reso.data[0]["FName"],
																	"fbarcode": res,
																	"fpackCode": "",
																	"fbillNo": that.form.finBillNo,
																	"ftranType": 21,
																	"fdate": that.form.fdate,
																});
																that.show = true;
															} else {
																uni.showToast({
																	icon: 'none',
																	title: '该条码已扫描！'
																});
																break;
															} 
													}*/
												} else {
													uni.showToast({
														icon: 'none',
														title: "查不到条码信息"
													});
												}

											}
										})
										.catch(err => {
											uni.showToast({
												icon: 'none',
												title: err.message
											});
										});
								} else {
									production
										.checkBarCode({
											uuid: res,
										})
										.then(reso => {
											console.log(reso)
											if (reso.success && reso.data.length > 0) {
												basic
													.checkBarCodefifo({
														uuid: res
													})
													.then(resfifo => {
														if (resfifo.success) {
															console.log(reso)
															if (resfifo.data.length > 0) {
																var chooseList = []
																resfifo.data.forEach((item) => {
																	let resItem = item['fpackcode'].split(";");
																	if (item.FCurrent == "Y") {
																		chooseList.push({
																			"FNumber": item["fitemnumber"],
																			"FName": item["fitemnumber"],
																			"fbarcode": item["FBarCode"],
																			"fpackCode": res,
																			"fbillNo": that.form.finBillNo,
																			"ftranType": 21,
																			"fdate": that.form.fdate,
																			"Ffifo": item.Ffifo
																		});
																	}
																})
																that.firstList(chooseList)
																/* that.show = true; */
															} else {
																uni.showToast({
																	icon: 'none',
																	title: "查不到条码信息"
																});
															}

														}
													})
													.catch(err => {
														uni.showToast({
															icon: 'none',
															title: err.message
														});
													});
												/* reso.data.forEach((item) => {
													let resItem = item['fpackcode'].split(";");
													that.chooseList.push({
														"FNumber": resItem[5],
														"FName": resItem[1],
														"fbarcode": item["FBarCode"],
														"fpackCode": res,
														"fbillNo": that.form.finBillNo,
														"ftranType": 21,
														"fdate": that.form.fdate
													});
												})
												that.show = true; */
											} else {
												uni.showToast({
													icon: 'none',
													title: "查不到装箱信息"
												});
											}
										})
										.catch(err => {
											uni.showToast({
												icon: 'none',
												title: err.message
											});
										});


								}
							} else {
								uni.showToast({
									icon: 'none',
									title: '该条码或条码里某一项已进行出库扫描！'
								});
							}
						})
						.catch(useErr => {
							uni.showToast({
								icon: 'none',
								title: useErr.message
							});
						});


				}
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

	.cu-list.menu-avatar>.cu-item .content {
		left: 5px;
	}

	.cu-list.menu-avatar>.cu-item .action {}

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
