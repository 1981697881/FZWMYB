import Request from '@/plugins/request/js/index';

export default {
    productStockIn(params) {
        return Request().post('/api/stockBill/productStockIn', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
	pickingStockOut(params) {
        return Request().post('/api/stockBill/pickingStockOut', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
	//装箱查询
	checkBarCode(params) {
        return Request().post('/api/basic/checkBarCode', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },
	//装箱
	insert(params) {
        return Request().post('/custInStockTem/insert', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
	//装箱列表
	custInStockTemBoxList(page) {
		return Request().get('/custInStockTemBox/list/'+page.userId+'/'+page.pageNum+'/'+page.pageSize, {
		    
		});
    },//装箱删除
	custInStockTemBoxDelete(params) {
        return Request().post('/custInStockTemBox/delete', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
};
