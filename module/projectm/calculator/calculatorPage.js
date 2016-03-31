$(document).ready(function(){
	$("#buildSel").change(function(){
		var buildId = $("#buildSel").val();
		queryFloor(buildId);
	});
	$("#floorSel").change(function(){
		var buildId = $("#buildSel").val();
		var floorId = $("#floorSel").val();
		queryStores(buildId,floorId);
	});
	$("#discountSel li").click(function(){
		if($(this).hasClass("now")){
			$(this).removeClass("now");
		}else{
			$(this).addClass("now");
		}
		var discount = '';
		$("#discountSel li.now").each(function(){
			if(discount == ''){
				discount += $(this).attr('key');
			}else{
				discount += ',' + $(this).attr('key');
			}
		});
		$("#discount").val(discount);
	});
});
function queryFloor(buildId){
	if(buildId == null || buildId == ''){
		$("#floorSel option:gt(0)").remove();
		$("#storesSel option:gt(0)").remove();
		return ;
	}
	$.post(ctx+"/projectm/calc/floor",{building:buildId},function(res){
		var floorList = res.floorList ;
		var option = '' ;
		for(var i = 0 ; i < floorList.length ; i ++){
			option += '<option value="'+floorList[i].FFLOOR+'">'+floorList[i].FFLOOR+'</option>' ;
		}
		$("#floorSel option:gt(0)").remove();
		$("#storesSel option:gt(0)").remove();
		$("#floorSel").append(option);
	},'json');
}
function queryStores(buildId,floorId){
	if(floorId == null || floorId == ''){
		$("#storesSel option:gt(0)").remove();
		return ;
	}
	$.post(ctx+"/projectm/calc/stores",{building:buildId,floor:floorId},function(res){
		var storesList = res.storesList ;
		var option = '' ;
		for(var i = 0 ; i < storesList.length ; i ++){
			option += '<option value="'+storesList[i].FSTORES+'">'+storesList[i].FSTORES+'</option>' ;
		}
		$("#storesSel option:gt(0)").remove();
		$("#storesSel").append(option);
	},'json');
}
function search(){
	var stores = $("#storesSel").val();
	if(stores == null || stores == ""){
		art.dialog.tips('请选择铺位号');
		return ;
	}
	var discount = $("#discount").val();
	if(discount == null || discount == ""){
		art.dialog.tips('请选择折扣');
		return ;
	}
	var buildId = $("#buildSel").val();
	var floorId = $("#floorSel").val();
	$.post(ctx+"/projectm/calc/search",{building:buildId,floor:floorId,stores:stores,discount:discount},function(res){
		var calc = res.calc ;
		var discount = res.discount ;
		$("#stores").text(calc.building+"-"+calc.floor+"-"+calc.stores);
		$("#builtArea").text(calc.builtArea);
		$("#setArea").text(calc.setArea);
		$("#publicArea").text(calc.publicArea);
		$("#price").text(FormatNumber(calc.price));
		$("#totalPrice").text(FormatNumber(calc.totalPrice));
		$("#mortgagePrice").text(FormatNumber(calc.mortgagePrice));
		$("#firstPayPrice").text(FormatNumber(calc.firstPayPrice));
		$("#filingPrice").text(FormatNumber(calc.filingPrice));
		$("#totalFilingPrice").text(FormatNumber(calc.totalFilingPrice));
		$("#salePrice").text(FormatNumber(calc.salePrice));
		$("#saleTotalPrice").text(FormatNumber(calc.saleTotalPrice));
		var discountList = discount.split(",");
		for(var i = 0 ;  i < discountList.length ; i ++){
			$("#discountResult li[key='"+discountList[i]+"']").show();
		}
		$("#search").hide();
		$("#searchResult").show();
	},'json');
}
function reSearch(){
	window.location.reload();
}