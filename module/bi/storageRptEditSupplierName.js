$list_editUrltui = getPath()+"/ebstorage/backgoods/edit";//编辑及查看url
$(document).ready(
	function (){
		console.log("test");
		$list_dataGrid = $("#tableContainer").ligerGrid(
				$.extend($list_defaultGridParam, {
					columns : [ {
						display : '订单号',
						name : 'order.orderNo',
						align : 'center',
						width : 130
					}, {
						display : '确认时间',
						name : 'order.finishTime',
						align : 'center',
						width : 150
					},{
						display : '出货店',
						name : 'order.storage.name',
						align : 'center',
						width : 60
					},{
						display : '供应商',
						name : 'supplierName',
						align : 'center',
						width : 90
					}, {
						display : '客户姓名',
						name : 'order.address.receiptPersonName',
						align : 'center',
						width : 60
					}, {
						display : '客户昵称',
						name : 'order.member.nickName',
						align : 'center',
						width : 100
					}, {
						display : '联系方式',
						name : 'order.address.contactPhone',
						align : 'center',
						width : 100
					}, {
						display : '客户地址',
						name : 'order.address.addressInfo',
						align : 'center',
						width : 100
					}, {
						display : '商品名称',
						name : 'goods.name',
						align : 'center',
						width : 100
					}, {
						display : '商品条形码',
						name : 'goods.barCode',
						align : 'center',
						width : 100
					}, {
						display : '仓位编码',
						name : 'storageNumber',
						align : 'center',
						width : 100
					}, {
						display : '数量',
						name : 'num',
						align : 'center',
						width : 100
					}, {
						display : '规格',
						name : 'goods.specifications',
						align : 'center',
						width : 100
					}, {
						display : '计量单位',
						name : 'goods.specifications',
						align : 'center',
						width : 100
					}, {
						display : '价格（元）',
						name : 'dealWithPrice',
						align : 'center',
						width : 100
					}
					
					],
					url : getPath() + "/ebsite/order/showDetailStorage?goodsId="+goodsId+"&timeBegin="+queryStartDate+"&timeEnd="+queryEndDate+"&storageId="+storageId+"&orderStatus=ALREADRECEIPT"
				}));
	}
);

