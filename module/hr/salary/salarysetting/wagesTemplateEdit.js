$(function(){
	//添加事件
	getItemNoSelect();
	getItemSelect();
});

function saveAdd(preWinObj){
	currentDialog = preWinObj;
	save(currentDialog);
}
function save(dlg){
	currentDialog = dlg;
	$("#detailJson").val(putJsonData());
	if(checkValidate()){
	$.post($("form").attr("action"),$('form').serialize(),function(res){
		if(res.MSG){
			art.dialog.data(res.MSG,1.5);
			currentDialog.close();
		} 
	},'json');}
	return false;
}
function setPosition(oldvalue,newvalue,doc){
	if(newvalue){
	$("#orgName").val(newvalue.position.belongOrg.name);
	$("#orgId").val(newvalue.position.belongOrg.id);
	$("#jobName").val(newvalue.position.job.name);
    $("#jobId").val(newvalue.position.job.id);
    }}
function checkValidate(){
	if($("#name").val()==''){
		art.dialog.tips("请填写名称！");
		return false;
	}
	if($("#orgId").val()==''){
		art.dialog.tips("请选择组织！");
		return false;
	}
	return true;
	}
/**
 * 拼接json数据
 */
function putJsonData(){
	        	var jsonData="[";
	        	  var box1 = liger.get("listbox1"), box2 = liger.get("listbox2");
		            var selecteds = box2.data;
		            if (!selecteds || !selecteds.length) {
		            	jsonData="";
	        	}else{
			            for(var i = 0;i<selecteds.length;i++){
			            jsonData+="{'salaryItem':{'id':'"+selecteds[i].id+"'},'sortNumber':'"+i+"'},";
			            }
		        		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	        	}
	        	return jsonData;
	        }
//选择列表start
function getItemNoSelect(){
	var param={};
	
	var url=base+"/hr/wagestemplate/listData4NoSelect";
	if($("#dataId").val()!=null&&$("#dataId").val()!=''){
		param['wagesTemplateId'] = $("#dataId").val();
	}else{
		delete param['wagesTemplateId'] ;
	}
	$.post(url,param,function(data){
	 	var josonData="[";
		itemLength = data.length;
		if(data.length>0){
			for(var i = 0;i< data.length;i++){
				if(itemLength!=i){
					josonData+="{ text: '"+data[i].name+"', id: '"+data[i].id+"' },";
				 }else{
					 josonData+="{ text: '"+data[i].name+"', id: '"+data[i].id+"' }"
				} 
		}}
		josonData+="]";
		var getData = eval(josonData);
	 $("#listbox1,#listbox2").ligerListBox({
        isShowCheckBox: true,
        isMultiSelect: true,
        height: 140
    });
	liger.get("listbox1").setData(getData);
	},'json');}
function getItemSelect(){
	var url;
	if($("#dataId").val()!=null&&$("#dataId").val()!=''){
	url=base+"/hr/wagestemplate/listData4Select?wagesTemplateId="+$("#dataId").val();
	$.post(url,function(data){
	 	var josonData="[";
		itemLength = data.length;
		if(data.length>0){
			for(var i = 0;i< data.length;i++){
				if(itemLength!=i){
					josonData+="{ text: '"+data[i].salaryItem.name+"', id: '"+data[i].salaryItem.id+"' },";
				 }else{
					 josonData+="{ text: '"+data[i].salaryItem.name+"', id: '"+data[i].salaryItem.id+"' }"
				} 
		}}
		josonData+="]";
		var getData = eval(josonData);
		$("#listbox2").ligerListBox({
	        isShowCheckBox: true,
	        isMultiSelect: true,
	        height: 140
	    });
		liger.get("listbox2").setData(getData);
	},'json');}else{
		 $("#listbox2").ligerListBox({
		        isShowCheckBox: true,
		        isMultiSelect: true,
		        height: 140
		    });
	}}
function moveToUp(){
    var box2 = liger.get("listbox2");
    var selectedsAll = box2.data;
   //var selectedsAll1 = box2.data;
    var selecteds = box2.getSelectedItems();
    if (!selecteds || !selecteds.length) {
    	art.dialog.tips("请选择一项！");
    	return;}else if(selecteds.length>1){
    		art.dialog.tips("只能选择一项！");
        	return;
    	}else{
    for(var i=0;selectedsAll.length;i++){
    	if(selectedsAll[i]==selecteds[0]){
    		var changeIndex=i-1;
    		if(changeIndex>=0){
    		var temp =selectedsAll[changeIndex];
    		selectedsAll[changeIndex]=selectedsAll[i];
    		selectedsAll[i] = temp;}else{
    			art.dialog.tips(" 已到第一项！");
    		}
    		break;
    	}
    }
   box2.setData(selectedsAll);}
}
function moveToDown(){
    var box2 = liger.get("listbox2");
    var selectedsAll = box2.data;
   //var selectedsAll1 = box2.data;
    var selecteds = box2.getSelectedItems();
    if (!selecteds || !selecteds.length) {
    	art.dialog.tips("请选择一项！");
    	return;}else if(selecteds.length>1){
    		art.dialog.tips("只能选择一项！");
        	return;
    	}else{
    for(var i=0;selectedsAll.length;i++){
    	if(selectedsAll[i]==selecteds[0]){
    		var changeIndex=i+1;
    		if(changeIndex<selectedsAll.length){
    		var temp =selectedsAll[changeIndex];
    		selectedsAll[changeIndex]=selectedsAll[i];
    		selectedsAll[i] = temp;}else{
    			art.dialog.tips(" 已到最后一项！");
    		}
    		break;
    	}
    }
   box2.setData(selectedsAll);}
}
function moveToLeft()
{
    var box1 = liger.get("listbox1"), box2 = liger.get("listbox2");
    var selecteds = box2.getSelectedItems();
    if (!selecteds || !selecteds.length){
    	art.dialog.tips("请选择一项！");
    	return;}
    box2.removeItems(selecteds);
    box1.addItems(selecteds);
}
function moveToRight()
{
    var box1 = liger.get("listbox1"), box2 = liger.get("listbox2");
    var selecteds = box1.getSelectedItems();
    if (!selecteds || !selecteds.length){
    	art.dialog.tips("请选择一项！");
    	return;}
    box1.removeItems(selecteds);
    box2.addItems(selecteds);
}
function moveAllToLeft()
{ 
    var box1 = liger.get("listbox1"), box2 = liger.get("listbox2");
    var selecteds = box2.data;
    if (!selecteds || !selecteds.length) return;
    box1.addItems(selecteds);
    box2.removeItems(selecteds); 
}
function moveAllToRight()
{ 
    var box1 = liger.get("listbox1"), box2 = liger.get("listbox2");
    var selecteds = box1.data;
    if (!selecteds || !selecteds.length) return;
    box2.addItems(selecteds);
    box1.removeItems(selecteds);
   
}
//选择列表end