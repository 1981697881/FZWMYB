import Request from '@/plugins/request/js/index';

export default {
    saleStockOut(params) {
        return Request().post('/api/stockBill/saleStockOut', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },insertBarcode(params) {
        return Request().post('/custInStockTemBox/insertBarcode', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },checkBarcodeUse(params) {
        return Request().post('/custInStockTemBox/checkBarcodeUse', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
};
