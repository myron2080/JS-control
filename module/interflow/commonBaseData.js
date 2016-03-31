/**
 * 常用语js,得到基础资料
 * 传入基础资料编码 可得到数组, 引用该JS的页面需要实现js方法genehtml();
**/
function getBaseData(typeNumber){
	var clary = new Array();
	$.post(getPath()+"/basedata/basic/basicSupply/listAllData",{enableflag:'1',typenumber:typeNumber},function(data){
		for(var i=0;i<data.length;i++){
			clary.push(data[i]);
		}
		genehtml(clary);
	},'json');
}


