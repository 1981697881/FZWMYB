<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">出库拣货</block>
		</cu-custom>
		<loading :loadModal="loadModal"></loading>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					包数:
					<text>{{ form.bNum }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">客户:{{ form.FCustName }}</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item,index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 220upx;"  :class="modalName=='move-box-'+ index?'move-cur':''" 
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" >
						<view style="clear: both;width: 100%;" class="grid text-center col-2" @tap="showModal2(index, item)" data-target="Modal" data-number="item.number">
							<view class="text-grey">序号:{{item.index=(index + 1)}}</view>
							<view class="text-grey">编码:{{item.number}}</view>
							<view class="text-grey">名称:{{item.name}}</view>
							<view class="text-grey">数量:{{item.quantity}}</view>
							<view class="text-grey">批号:{{item.fbatchNo}}</view>
							<view class="text-grey">单位:{{item.unitName}}</view>
							<view class="text-grey">规格:{{item.model}}</view>
							<view class="text-grey">仓位:{{item.positions}}</view>
							<view class="text-grey">仓库:{{item.stockName}}</view>
							<!-- <view class="text-grey">
								<picker @change="PickerChange($event, item)" :value="pickerVal" :range-key="'FName'" :range="stockList">
									<view class="picker">
										<button class="cu-btn sm round bg-green shadow" >
										<text class="cuIcon-homefill">
										</text>仓库</button>
									</view>
								</picker>
							</view> -->
						</view>
						<view class="move">
							<view class="bg-red" @tap="del(index,item)">删除</view>
						</view>
					</view>
				</view>
		</view>
		</scroll-view>
	</view>
</template>
<script>
import uniFab from '@/components/uni-fab/uni-fab.vue';
import basic from '@/api/basic';
import sales from '@/api/sales';
import loading from '@/components/loading';
import service from '@/service.js';
export default {
	components: { uniFab, loading },
	props: {
	},
	data() {
		return {
			cuIList: [],
			show: false,
			pageHeight: 0,
			headName: '',
			isOrder: false,
			loadModal: false,
			onoff: true,
			isClick: false,
			pickerVal: null,
			gridCol: 3,
			form: {
				finBillNo: null,
				bNum: 0,
				FCustNumber: '',
				fbillerID: null,
				FCustName: '',
			},
			listTouchStart: 0,
			listTouchDirection: null,
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
			startDate: null,
			endDate: null,
			billNo: null
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
			console.log('你想要的code：', data.code);
		});
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.isDis = true;
			me.form.FCustNumber = option.FCustNumber;
			me.form.FCustName = option.FCustName;
			me.startDate = option.startDate;
			me.endDate = option.endDate;
			me.billNo = option.billNo;
			me.source = option.tranType;
			me.form.finBillNo = option.billNo;
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
								number: data[i].FItemNumber,
								name: data[i].FItemName,
								model: data[i].FModel,
								FItemID: data[i].FItemID,
								checked: false,
								show: false,
								isLoading: false,
								FCounty: 0,
								FBatchManager: data[i].FBatchManager,
								fsourceBillNo: data[i].FBillNo,
								Famount: data[i].Famount,
								Fauxprice: data[i].Fauxprice,
								fsourceEntryID: data[i].FEntryID,
								fsourceTranType: data[i].FTranType,
								quantity: data[i].Fauxqty,
								Fauxqty: data[i].Fauxqty,
								unitID: data[i].FUnitNumber,
								unitName: data[i].FUnitName
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
							me.pageHeight = res.windowHeight - infoHeight - headHeight;
						}, 1000);
					}
				});
			}
		}
	},
	methods: {
		initMain() {
			const me = this;
			me.loadModal = false;
			me.isClick = false;
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.form.bNum = this.cuIList.length;
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
		fabClick() {
			var that = this;
			uni.scanCode({
				success: function(res) {
					that.getScanInfo(res.result);
				}
			});
		},
		//获取扫码结果
		getScanInfo(res) {
			var that = this;
			let number = 0;
			if (that.isOrder) {
				let resData = res.split(',');
				for (let i in that.cuIList) {
					if (resData[0] == that.cuIList[i]['number']) {
						if (that.cuIList[i]['onFBarCode'] != res) {
							that.cuIList[i]['quantity'] = resData[2];
							that.cuIList[i]['fbatchNo'] = resData[1];
							that.cuIList[i]['bNum'] = resData[3];
							that.cuIList[i]['onFBarCode'] = res
							that.form.bNum += parseFloat(resData[3]);
						}else{
							uni.showToast({
								icon: 'none',
								title: '该条码已扫描！'
							});
							break;
						}
					} else {
						number++;
					}
				}
				if (number == that.cuIList.length) {
					uni.showToast({
						icon: 'none',
						title: '该物料不在所选单据中！'
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
<style lang="scss" scoped>
/* #ifdef APP-PLUS*/
.selectTrees {
	margin-bottom: 180rpx;
}
/* #endif */

.deleteBtn {
	position: absolute;
	right: 10%;
	background: #f97979;
	padding: 2rpx 16rpx;
	border-radius: 4rpx;
}

.itemT:nth-child(odd) {
	margin-left: 60rpx;
	color: #666666;
	width: 45% !important;
}
.itemT:nth-child(even) {
	color: #666666;
	width: 40% !important;
}
.itemO {
	color: #666666;
	width: 50% !important;
}

.tree-two {
	padding: 20rpx;
	color: #666666;
	border-bottom: 2rpx solid #e2e2e2;
}
.flexIn {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	align-content: center;
	flex-wrap: nowrap;
	width: 100%;
}
</style>
