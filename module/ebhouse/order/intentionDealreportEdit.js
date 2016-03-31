var commissModel = "FIXEDRATE";
$(document).ready(function(){
	commissModel = $("#houseProjectId").find("option:selected").attr("title");
	$("span[key='normalCommiss']").show();
	if("FIXEDRATE" == commissModel){
		calcCommiss();
		$("span[key='houseProjectAmount']").html("佣金比率");
		$("#houseProjectAmount").text($("input[name='houseProjectAmount']").val() + "%");
		$("span[key='normalCommissRate']").html("标准佣金：比例" + $("input[name='houseProjectAmount']").val() + "%	").show();
		$("span[key='normalCommissText']").html("佣金值" + FormatNumber($("#normalCommiss").val())).show();
		$("span[key='normalCommiss']").hide();
	}else if("FIXEDMONEY" == commissModel ){
		$("span[key='houseProjectAmount']").html("佣金值");
		$("#houseProjectAmount").text($("input[name='houseProjectAmount']").val());
		$("span[key='normalCommissRate']").html("").hide();
		$("span[key='normalCommissText']").html("标准佣金：固定值" + FormatNumber($("input[name='normalCommiss']").val())).show();
		$("span[key='normalCommiss']").hide();
	}else if("HOUSETYPEFIXED" == commissModel ){
		$("span[key='viewHouseType']").show();
		$("span[key='normalCommiss']").show();
		$("span[key='normalCommissRate']").html("").hide();
		$("span[key='normalCommissText']").html("").hide();
		$("#normalCommiss").val($("input[name='houseProjectAmount']").val());
	}else if("CHANGE" == commissModel ){
		$("span[key='normalCommiss']").show();
		$("span[key='normalCommissRate']").html("").hide();
		$("span[key='normalCommissText']").html("").hide();
		$("#normalCommiss").val($("input[name='houseProjectAmount']").val());
	}
	calcDisCount();
	
	if(!isNotNull($("input[name='saleType']").val())){
		$("input[name='saleType']").val('FASTSALE');
	}
	if(isNotNull(saleTypeFlag)){
		$("input[name='saleType']").val(saleTypeFlag);
	}
	init();
	
	
	 //设置成交日期为当前日期
	 if(!isNotNull($("#intentionDate").val())){
			$("#intentionDate").val(formate_yyyyMMdd(new Date));
	 }
	 changeProperType();
	 
	if(!fastBuss || fastBuss=="false"){
		$("#dealOrg").removeAttr("disabled");
	}
	
	
	
	$.ajax({
		url:getPath()+"/agency/myProject/getHouseProjectData?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {id:$('#houseProjectId').val()},
		success: function(data) {
			$("input[name='normalCommiss']").val(0);
			var houseProject = data.houseProject;
			var org = data.org;
			var length = data.length;
			
			commissModel = houseProject.commissModel;
			$("#propertyName").val($('#houseProjectId option:selected').text());
			$("span[key='viewHouseType']").hide();
			$("span[key='normalCommiss']").hide();
			
			$("input[name='houseProjectAmount']").val(houseProject.amount);
			$("#commissRate").val(houseProject.amount);
			$("div[key='agencyContent']").html("");
			$("span[key='normalCommissRate']").html("");
			$("span[key='normalCommissText']").html("");
			if("FIXEDRATE" == houseProject.commissModel){
				calcCommiss();
				$("span[key='houseProjectAmount']").html("佣金比率");
				$("#houseProjectAmount").text(houseProject.amount + "%");
				$("span[key='normalCommissRate']").html("标准佣金：比例" + houseProject.amount + "%	").show();
				$("span[key='normalCommissText']").html("佣金值" + FormatNumber($("#normalCommiss").val())).show();
//				$("#hp_rate").show();
			}else if("FIXEDMONEY" == houseProject.commissModel ){
				$("span[key='houseProjectAmount']").html("佣金值");
				$("#houseProjectAmount").text(houseProject.amount);
				$("span[key='normalCommissRate']").html("");
				$("span[key='normalCommissText']").html("标准佣金：固定值" + FormatNumber(houseProject.amount)).show();
			}else if("HOUSETYPEFIXED" == houseProject.commissModel ){
				$("span[key='viewHouseType']").show();
				$("span[key='normalCommiss']").show();
				$("span[key='normalCommissText']").html("").hide();
				$("#normalCommiss").val(houseProject.amount);
			}else if("CHANGE" == houseProject.commissModel ){
				$("span[key='normalCommiss']").show();
				$("span[key='normalCommissText']").html("").hide();
				$("#normalCommiss").val(houseProject.amount);
			}
		}
	});
	
	
});

//初始化
var cusMoreOperate;
function init(){
	//客户联系人
	cusMoreOperate = new CusMoreOperate({
		id : "cusOperate",
		count : 100,
		initCount : 1,
		index : 1 
	});
	
	$("#saleType").find("a").each(function(i, ele){
		$(ele).click(function(){
			var chk = $(this).prev()
			if(!chk.attr("checked")){
				$("input[name='saleType']").val(chk.val());
				chk.attr("checked","checked");
				//选择其他销售类型，清空客户联系人
				$("div[key='cusContent']").html("");
				$("img[key='cusAddOperate']").click();
				
				$("#dealOrg").val('');
				$("#orgId").val('');
				$("#dealPersonName").html("");
				$("#dealPersonId").val('');
				$("span[name='customerDisplayName']").html('客户选择');
				$("#customerName").val('');
				$("#customerId").val('');
				//清空客户联系人数据
				$("div[key='cusContent']").html("");
				$("img[key='cusAddOperate']").click();
			}
			if("AGENT" == chk.val()){
				$("span[key='spanSaleType']").text("联动");
			}else if("FASTSALE" == chk.val()){
				$("span[key='spanSaleType']").text("快销");
			}else if("INNERDATA" == chk.val()){
				$("span[key='spanSaleType']").text("内场");
			}
			calcCommiss();
			//成交分行自动补全
			Autocomplete.init({
				$em:$( "#dealOrg" ),
				$obj:$('#orgId'),
				type:'POST',
				url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
				maxRows:12,
				param:{saleType: $("input[name='saleType']").val()},
				afterSelect:afterSelect
			});
		});
		
		$(ele).mouseover(function(){
			$(ele).css("cursor", "pointer");
		});
		
		$(ele).mouseout(function(){
			$(ele).css("cursor", "");
		});
	});
	
	//选择租售类型显示数据不一样
	$("input[name='saleTypeRadio']").click(function(){
		var saleType = $("input[name='saleType']").val();
		if($(this).val() != saleType){
			$("input[name='saleType']").val($(this).val());
			//选择其他销售类型，清空客户联系人
			$("div[key='cusContent']").html("");
			$("img[key='cusAddOperate']").click();
			
			$("#dealOrg").val('');
			$("#orgId").val('');
			$("#dealPersonName").html("");
			$("#dealPersonId").val('');
			$("span[name='customerDisplayName']").html('客户选择');
			$("#customerName").val('');
			$("#customerId").val('');
			//清空客户联系人数据
			$("div[key='cusContent']").html("");
			$("img[key='cusAddOperate']").click();
			
		}
		if("AGENT" == $(this).val()){
			$("span[key='spanSaleType']").text("联动");
			
		}else if("FASTSALE" == $(this).val()){
			$("span[key='spanSaleType']").text("快销");
		}else if("INNERDATA" == chk.val()){
			$("span[key='spanSaleType']").text("内场");
		}
		//成交分行自动补全
		Autocomplete.init({
			$em:$( "#dealOrg" ),
			$obj:$('#orgId'),
			type:'POST',
			url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
			maxRows:12,
			param:{saleType: $("input[name='saleType']").val()},
			afterSelect:afterSelect
		});
		
		//选择租售类型显示数据不一样
		$("input[name='saleTypeRadio']").each(function(i, ele){
			if(this.checked){
				if("AGENT" == $(this).val()){
					$("span[key='spanSaleType']").text("联动");
					
				}else if("FASTSALE" == $(this).val()){
					$("span[key='spanSaleType']").text("快销");
				}else if("INNERDATA" == $(this).val()){
					$("span[key='spanSaleType']").text("内场");
				}
			}
		});
	});
	
	//成交分行自动补全
	Autocomplete.init({
		$em:$( "#dealOrg" ),
		$obj:$('#orgId'),
		type:'POST',
		url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
		maxRows:12,
		param:{saleType: $("input[name='saleType']").val()},
		afterSelect:afterSelect
	});
	var orgId = $('#orgId').val();
	if(isNotNull(orgId)){
		afterSelect(orgId);
	}
	
	$("#cusType").val(isNotNull($("#hidCusType").val()) ? $("#hidCusType").val() : "");
	if("FASTSALE" == saleTypeFlag){
		$("#cusType").val("NEWHOUSECUS").hide();
	}
	
}
var projectId = $('#houseProjectId').val();
//项目改变事件
function houseProjectChange(obj){
	if($(obj).val() != ""){
		$.ajax({
			url:getPath()+"/agency/myProject/getHouseProjectData?random=" +  Math.round(Math.random()*100),
			dataType: "json",
			data: {id:$('#houseProjectId').val()},
			success: function(data) {
				$("input[name='normalCommiss']").val(0);
				var houseProject = data.houseProject;
				var org = data.org;
				var length = data.length;
				
				commissModel = houseProject.commissModel;
				$("#propertyName").val($('#houseProjectId option:selected').text());
				$("span[key='viewHouseType']").hide();
				$("span[key='normalCommiss']").hide();
				
				$("input[name='houseProjectAmount']").val(houseProject.amount);
				$("#commissRate").val(houseProject.amount);
				$("div[key='agencyContent']").html("");
				$("span[key='normalCommissRate']").html("");
				$("span[key='normalCommissText']").html("");
				if("FIXEDRATE" == houseProject.commissModel){
					calcCommiss();
					$("span[key='houseProjectAmount']").html("佣金比率");
					$("#houseProjectAmount").text(houseProject.amount + "%");
					$("span[key='normalCommissRate']").html("标准佣金：比例" + houseProject.amount + "%	").show();
					$("span[key='normalCommissText']").html("佣金值" + FormatNumber($("#normalCommiss").val())).show();
//					$("#hp_rate").show();
				}else if("FIXEDMONEY" == houseProject.commissModel ){
					$("span[key='houseProjectAmount']").html("佣金值");
					$("#houseProjectAmount").text(houseProject.amount);
					$("span[key='normalCommissRate']").html("");
					$("span[key='normalCommissText']").html("标准佣金：固定值" + FormatNumber(houseProject.amount)).show();
				}else if("HOUSETYPEFIXED" == houseProject.commissModel ){
					$("span[key='viewHouseType']").show();
					$("span[key='normalCommiss']").show();
					$("span[key='normalCommissText']").html("").hide();
					$("#normalCommiss").val(houseProject.amount);
				}else if("CHANGE" == houseProject.commissModel ){
					$("span[key='normalCommiss']").show();
					$("span[key='normalCommissText']").html("").hide();
					$("#normalCommiss").val(houseProject.amount);
				}
			}
		});
	}
	
}

function calcDisCount(){
	var normalCommiss = $("#normalCommiss").val();
	var agencyCommiss = $("#agencyCommiss").val();
	var discount;
	if(normalCommiss>0 && agencyCommiss >0){
		$("input[name='normalCommiss']").val(Math.round(normalCommiss*Math.pow(10,2))/Math.pow(10,2));
		discount = (agencyCommiss/normalCommiss * 10) ;
		discount = Math.round(discount*Math.pow(10,2))/Math.pow(10,2);
		if(discount > 0){
			if(discount.length >=5){
				discount = discount.substr(0,5);
			}
			if(discount >= 10){
				$("#discount").text("无折扣");
			}else{
				$("#discount").text(discount + "折");
			}
		}
	}else{
		$("#discount").html("");
	}
}

//成交组织回调方法
function afterSelect(orgId){
	$('#dealPersonName').empty();
	var dealPersonId = $("#dealPersonId").val();
	$.post(base+"/agency/dealreport/autoComplatePerson?random=" +  Math.round(Math.random()*100),{orgId:orgId,maxRows: 100,dealDate:$("#dealDate").val()},function(data){
		if(data.count>0){
			$.each(data.items,function(i,ele){
				if(dealPersonId == ele.id){
					$('#dealPersonName').append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "</option>");
				}else{
					$('#dealPersonName').append("<option value='"+ele.id+"'>"+ele.name+"</option>");
				}
			});
		}else{
			$("#dealPersonName").append("<option value=''>业务员</option>");
		}
	},'json');
	
}


 

function CusMoreOperate(config){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='cusTemplate']");
	var content = operateObj.find("div[key='cusContent']");
	// 添加内容
	_addCusContent = function() {
		var idx = content.find("div[key='cusDetail']").length;
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		config.index ++;
		idx++;
		content.append(templateObj);
		$("div[key='cusContent']").find("input[id='cusContactId']").attr("id" ,"cusContactId" + idx);
		$("div[key='cusContent']").find("input[id='cusContactName']").attr("id" ,"cusContactName" + idx);
		$("div[key='cusContent']").find("select[id='cusContactRelation']").attr("id" ,"cusContactRelation" + idx);
		$("div[key='cusContent']").find("select[id='cusContactCountry']").attr("id" ,"cusContactCountry" + idx);
		$("div[key='cusContent']").find("input[id='cusContactMobile']").attr("id" ,"cusContactMobile" + idx);
		$("div[key='cusContent']").find("input[id='cusContactTel']").attr("id" ,"cusContactTel" + idx);
		//产权比例
		$("div[key='agencyContent']").find("input[id='cusDealmenberId']").attr("id" ,"cusDealmenberId" + idx);
		$("div[key='cusContent']").find("input[id='cusContactProperty']").attr("id" ,"cusContactProperty" + idx).attr("idx", idx);
		
		$("div[key='cusContent']").find("input[id='cusContactIdCard']").attr("id" ,"cusContactIdCard" + idx);
		$("div[key='cusContent']").find("input[id='cusContactEmail']").attr("id" ,"cusContactEmail" + idx);
		$("div[key='cusContent']").find("input[id='cusContactAddress']").attr("id" ,"cusContactAddress" + idx);
		$("div[key='cusContent']").find("select[id='cusContactSex']").attr("id" ,"cusContactSex" + idx);
		$("div[key='cusContent']").find("span[key^='idx']").each(function(i, eleSpan){
			$(eleSpan).html(i+1);
		});
		
		// 绑定删除事件
		templateObj.find("img[key='delOperate']").bind("click", function() {
			_removeCusContent($(this));
		});
	}
	
	// 删除内容
	_removeCusContent = function(obj) {
		var size = content.find("div[key='cusDetail']").length;
		if (size <= 1) {
			art.dialog.tips("客户联系人不可少于1条纪录!");
		}else{
			obj.parent().remove();
			$("div[key='cusContent']").find("span[key^='idx']").each(function(i, eleSpan){
				$(eleSpan).html(i+1);
			});
			var dealmenberId = obj.attr("dealmenberId")
			if(isNotNull(dealmenberId)){
				$.post(base+"/agency/dealreport/deleteByDealMenber",{dealmenberId: dealmenberId},function(data){
				},'json');
			}
		}
	}
	$("img[key='cusAddOperate']").bind("click", function() {
		_addCusContent();
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='cusDetail']").size();
		for ( var i = size; i < config.initCount; i++) {
			_addCusContent();
		}
	}
	operateObj.find("img[key='delOperate']").unbind().bind("click", function() {
		_removeCusContent($(this));
	});
}




function selectBusor(id){
	var idx = $("#" + id).attr("idx");
	var busor = $("#busor" + idx);
	var performOrgId = $("#" + id).val();
	var busorPersonId = $("#busorPersonId" + idx).val();
	if(isNotNull(performOrgId)){
		$("#busor" + idx).empty();
		$.post(base+"/agency/dealreport/autoComplatePerson?random=" +  Math.round(Math.random()*100),{orgId:performOrgId,maxRows: 100,dealDate:$("#dealDate").val()},function(data){
			if(data.count>0){
				var tempHtml = '';
				$.each(data.items,function(i,ele){
					if(ele.id == busorPersonId){
						tempHtml+="<option value='"+ele.id+"' selected>"+ele.name+"</option>";
					}else{
						tempHtml+="<option value='"+ele.id+"'>"+ele.name+"</option>";
					}
				});
				$("#busor" + idx).html(tempHtml);
			}else{
				$("#busor" + idx).html("<option value=''>业务员</option>");
			}
			var cloneTemp = $("#busor" + idx).clone();
			$("#busor" + idx).parent().append(cloneTemp);
			$("#busor" + idx).remove();
		},'json');
	}

}

function getCusJson(){
	 var content = $("#cusOperate").find("div[key='cusContent']");
	 var jsonsStr="[";
	 content.find("div[key='cusDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var jsonStr="";
			var cusContactId = $(ele).find("input[name^='cusContactId']");
			var cusContactName = $(ele).find("input[name^='cusContactName']");
			var cusContactRelation = $(ele).find("select[name^='cusContactRelation']")
			var cusContactCountry = $(ele).find("select[id^='cusContactCountry']");
			var cusContactMobile = $(ele).find("input[name^='cusContactMobile']");
			var cusContactTel = $(ele).find("input[name^='cusContactTel']");
			var cusContactProperty = $(ele).find("input[name^='cusContactProperty']");
			var dealmenberId = $(ele).find("input[name^='dealmenberId']");
			var cusContactIdCard = $(ele).find("input[name^='cusContactIdCard']");
			var cusContactEmail = $(ele).find("input[name^='cusContactEmail']");
			var cusContactAddress = $(ele).find("input[name^='cusContactAddress']");
			var cusContactSex = $(ele).find("select[name^='cusContactSex']"); 
			jsonStr+="\"contactId\":\""+cusContactId.val()+"\",";
			jsonStr+="\"name\":\""+cusContactName.val()+"\",";
			jsonStr+="\"relation\":\""+cusContactRelation.val()+"\",";
			jsonStr+="\"country\":\""+cusContactCountry.val()+"\",";
			jsonStr+="\"mobile\":\""+cusContactMobile.val()+"\",";
			jsonStr+="\"tel\":\""+cusContactTel.val()+"\",";
			jsonStr+="\"idcard\":\""+cusContactIdCard.val()+"\",";
			jsonStr+="\"email\":\""+cusContactEmail.val()+"\",";
			jsonStr+="\"address\":\""+cusContactAddress.val()+"\",";
			jsonStr+="\"sex\":\""+cusContactSex.val()+"\",";
			jsonStr+="\"radio\":\""+cusContactProperty.val()+"\",";
			jsonStr+="\"dealmenberId\":\""+dealmenberId.val()+"\",";
			if(jsonStr.indexOf(",")!=-1){
				jsonStr=jsonStr.substring(0,jsonStr.length-1);
			}
			jsonsStr+=jsonStr;
			jsonsStr+="},";
	 });
	 if(jsonsStr.indexOf(",")!=-1){
		jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
		}
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}


function saveDealReport(currentDialog){
	//客户联系人名称字符串
	var cusContactNames = [];
	$("div[key='cusContent']").find("input[name^='cusContactName']").each(function(i, ele){
		cusContactNames[cusContactNames.length] = ele.value;
	});
	if(cusContactNames.length >= 1){
		$("#customerName").val(cusContactNames.toString());
	}
	
	$("#dealPersonId").val($('#dealPersonName option:selected').val());
	//选择租售类型显示数据不一样
	$("input[name='saleTypeRadio']").each(function(i, ele){
		if(this.checked){
			$("input[name='saleType']").val($(this).val());
		}
	});
	if(!checkValidate()){
		return;
	}else{
		$("input[name='bedRoom']").val() == '' ? $("input[name='bedRoom']").val(0) : 1;
		$("input[name='livingRoom']").val() == '' ? $("input[name='livingRoom']").val(0) : 1;
		$("input[name='bathRoom']").val() == '' ? $("input[name='bathRoom']").val(0) : 1;
		$("input[name='balcony']").val() == '' ? $("input[name='balcony']").val(0) : 1;
		$("input[name='roomArea']").val() == '' ? $("input[name='roomArea']").val(0) : 1;
		var cusJsonStr = getCusJson();
		$("#cusJsonStr").val(cusJsonStr);
		$.post(getPath()+"/agency/editdealreport/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
					
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"保存",disabled:true});
	}
}

function checkValidate(){
	var saleTypeCk = false;
	$("input[name='saleTypeRadio']").each(function(i, ele){
		if(this.checked){
			saleTypeCk =  true;
		}
	});
	if(!saleTypeCk){
		art.dialog.tips("请选择租售类型!");
		return false;
	}
	if(!isNotNull($("#houseProjectId").val())){
		art.dialog.tips("请先选择项目!");
		$("#houseProject").select();
		return false;
	}
	
	//标准佣金
	var normalCommiss = $("input[name='normalCommiss']").val();
	if(!isNotNull(normalCommiss) || normalCommiss <= 0){
		art.dialog.tips("佣金值不能为0!");
		$("#normalCommiss").select();
		return false;
	}
	
	if(!isNotNull($("#propertyName").val())){
		art.dialog.tips("物业信息不能为空!");
		$("#propertyName").select();
		return false;
	}
	
	if(!isNotNull($("#buildArea").val())){
		art.dialog.tips("建筑面积不能为空!");
		$("#buildArea").select();
		return false;
	}
	
	if(parseFloat($("#buildArea").val() > 99999999.99)){
		art.dialog.tips("建筑面积不能超过99999999.99!");
		$("#buildArea").select();
		return false;
	}
	
	if(parseFloat($("#roomArea").val()) > 99999999.99){
		art.dialog.tips("套内面积不能超过99999999.99!");
		$("#roomArea").select();
		return false;
	}
	
	if(!isNotNull($("#orgId").val())){
		art.dialog.tips("成交部门不能为空!");
		$("#orgId").select();
		return false;
	}
	
	if(!isNotNull($("#dealPersonId").val())){
		art.dialog.tips("成交业务员不能为空!");
		$("#dealPersonName").select();
		return false;
	}
	if(hasAgencyCus == '1'){
		if(!isNotNull($.trim($("#customerId").val()))){
			art.dialog.tips("成交客户不能为空!");
			$("#customerId").select();
			return false;
		}
	}else{
		if(!isNotNull($.trim($("#customerName").val()))){
			art.dialog.tips("成交客户不能为空!");
			$("#customerName").select();
			return false;
		}
	}
	
	if(!isNotNull($.trim($("#customerSourceId").val()))){
		art.dialog.tips("客户来源不能为空！");
		$("#customerSourceId").select();
		return false;
	}
	
	var tempCusContactName = null;
	var tempCusContactCountry = null;
	var tempCusPhoneNumber = null;
	var tempCusPhoneNumberValide = null;
	var tempCusContactTel = null;
	var tempCusContactTelValide = null;
	var tempCusContactProperty= null;
	var tempCusIdNumber = null;
	var tempCusContactAddress = null;
	var tempCusContactEmail = null;
	var tempCusContactEmailValidate = null;
	var tenoCusContactIdCard = null;
	var tempCusContactSex = null;
	$("div[key='cusContent']").find("div[key='cusDetail']").each(function(i, ele){
		var cusContactName = $(ele).find("input[name^='cusContactName']");
		var cusContactCountry = $(ele).find("select[name^='cusContactCountry']");
		var cusContactMobile = $(ele).find("input[name^='cusContactMobile']");
		var cusContactTel = $(ele).find("input[name^='cusContactTel']");
		var cusContactProperty = $(ele).find("input[name^='cusContactProperty']");
		var cusContactIdCard = $(ele).find("input[name^='cusContactIdCard']");
		var cusContactEmail = $(ele).find("input[name^='cusContactEmail']");
		var cusContactAddress = $(ele).find("input[name^='cusContactAddress']");
		var cusContactSex = $(ele).find("select[name^='cusContactSex']");
		
		//判断手机号码是否合法
		if(isNotNull(cusContactMobile.val()) && !isMobile(cusContactMobile.val())){
			tempCusPhoneNumberValide = cusContactMobile;
		}
		//判断电话号码是否合法
		if(isNotNull(cusContactTel.val()) && !isTel(cusContactTel.val())){
			tempCusContactTelValide = cusContactTel;
		}
		//判断email
		if(isNotNull(cusContactEmail.val()) &&  !isEmail(cusContactEmail.val())){
			tempCusContactEmailValidate = cusContactEmail;
		}
		
		if(!isNotNull($.trim(cusContactName.val()))){
			tempCusContactName = cusContactName
		}
		
		if(!isNotNull(cusContactCountry.val())){
			tempCusContactCountry = cusContactCountry;
		}
		
		if(!isNotNull(cusContactSex.val())){
			tempCusContactSex = cusContactSex;
		}
		
		if(!isNotNull($.trim(cusContactMobile.val()))){
			tempCusContactSex = cusContactMobile
		}
		
		if(!isNotNull($.trim(cusContactProperty.val()))){
			tempCusContactProperty = cusContactProperty;
		}
		
		if(!isNotNull($.trim(cusContactIdCard.val()))){
			tempCusIdNumber = cusContactIdCard;
		}
		
		if(!isNotNull($.trim(cusContactAddress.val()))){
			tempCusContactAddress = cusContactAddress;
		}
	});
	if(isNotNull(tempCusContactName)){
		art.dialog.tips("客户联系人名称不能为空.");
		tempCusContactName.select();
		return false;
	}
	
	if(isNotNull(tempCusContactCountry)){
		art.dialog.tips("客户联系人地域不能为空.");
		tempCusContactCountry.select();
		return false;
	}
	
	if(isNotNull(tempCusPhoneNumber)){
		art.dialog.tips("客户联系人手机不能为空.");
		tempCusPhoneNumber.select();
		return false;
	}
	
	if(isNotNull(tempCusIdNumber)){
		art.dialog.tips("客户联系人身份证不能为空.");
		tempCusIdNumber.select();
		return false;
	}
	
	if(isNotNull(tempCusContactSex)){
		art.dialog.tips("客户联系人性别不能为空.");
		tempCusContactSex.select();
		return false;
	}
	
	if(isNotNull(tempCusContactEmailValidate)){
		art.dialog.tips("客户联系人E-mail不合法.");
		tempCusContactEmailValidate.select();
		return false;
	}
	
	if($("#intentionDate").val()==''){
		art.dialog.tips("预定日期不能为空!");
		$("#intentionDate").select();
		return false;
	}
	
	if($("#sincerityMargin").val()==''){
		art.dialog.tips("诚意金不能为空!");
		$("#sincerityMargin").select();
		return false;
	}
	
	if($("#dealTotalPrice").val()==''){
		art.dialog.tips("成交总价不能为空!");
		$("#dealTotalPrice").select();
		return false;
	}
	
	if(parseFloat($("#dealTotalPrice").val()) > 999999999999.99){
		art.dialog.tips("成交总价不能超过999999999999.99");
		$("#dealTotalPrice").select();
		return false;
	}
	
	if($("#agencyCommiss").val()==''){
		art.dialog.tips("代理佣金不能为空!");
		$("#agencyCommiss").select();
		return false;
	}
	
	if(parseFloat($("#agencyCommiss").val()) > 999999999.99){
		art.dialog.tips("代理佣金不能超过999999999.99!");
		$("#agencyCommiss").select();
		return false;
	}
	
	return true;
}

function viewCustomers(){
	var saleType = $("input[name='saleType']").val();
	var cusType = $("#cusType").val();
	var dealPersonId = $("#dealPersonName").val(); 
	if(dealPersonId){
		if(cusType == 'OLDHOUSECUS'){
			var dlg =art.dialog.open(getPath() + "/broker/customer/viewCustomers?noPrivate=Y&personId="+dealPersonId + "&random="+  Math.round(Math.random()*100),{
				id : "viewCustomers",
				title : '选择客户',
				background : '#333',
				width : 830,
				height : 380,
				lock : true,
				button : [ {
					className : 'aui_state_highlight',
					name : '确定',
					callback : function() {
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.pickCustomer){
							dlg.iframe.contentWindow.pickCustomer();
						}
						return false;
					}
				} , {
					name : '取消',
					callback : function() {
					}
				}]	
			});
			
		}else if(cusType == 'NEWHOUSECUS'){
			var dlg =art.dialog.open(getPath() +"/fastsale/intention/viewIntentionCustomers?privateType=private&personId="+dealPersonId + "&random="+  Math.round(Math.random()*100),{
				id : "viewIntentionCustomers",
				title : '选择意向客户',
				background : '#333',
				width : 830,
				height : 380,
				lock : true,
				button : [ {
					className : 'aui_state_highlight',
					name : '确定',
					callback : function() {
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.pickCustomer){
							dlg.iframe.contentWindow.pickCustomer();
						}
						return false;
					}
				} , {
					name : '取消',
					callback : function() {
					}
				}]	
			});
		}else if(!isNotNull(cusType)){
			art.artDialog.alert("请先选择客户类型."); 
		}
	}else{
		art.artDialog.alert("请选择一个成交业务员"); 
	}
}
//选择客户后，赋值
function setCustomer(customer){
	$("div[key='cusContent']").html("");
	var cusType = $("#cusType").val();
	if(cusType == 'OLDHOUSECUS'){
		//添加客户联系人数据
		$.ajax({
			url:getPath()+"/broker/customer/contactperson/getContactPersonListByCusId?random=" +  Math.round(Math.random()*100),
			dataType: "json",
			data: {customerId:customer.id},
			success: function(data) {
				var contactList = data.contactList;
				$.each(contactList,function(i, contact){
					$("img[key='cusAddOperate']").click();
					i = (i + 1);
					$("#cusContactId" + i).val(contact.id);
					$("#cusContactName" + i).val(contact.name);
					$("#cusContactRelation" + i).val(contact.relation);
					$("#cusContactCountry" + i).val(contact.country);
					$("#cusContactMobile" + i).val(contact.mobile);
					$("#cusContactTel" + i).val(contact.tel);
					$("#cusContactIdCard" + i).val(contact.idcard);
					$("#cusContactEmail" + i).val(contact.email);
					$("#cusContactAddress" + i).val(contact.address);
					$("#cusContactSex" + i).val(contact.sex);
					$("#idx").html(i+1);
				});
			}
		});
	}else if(cusType == 'NEWHOUSECUS'){
		$("img[key='cusAddOperate']").click();
		var i = 1;
		$("#cusContactName" + i).val(customer.customerPersonName);
		$("#cusContactMobile" + i).val(customer.customerPhone);
		$("#idx").html(i);
	}
	
	$("#customerId").val(customer.id);
	$("#customerName").val(customer.customerPersonName);
	$("span[name='customerDisplayName']").html(customer.customerPersonName);
}

//标准佣金和折扣比率计算
function calcCommiss(){
	var dealTotalPrice = parseFloat($.trim($("#dealTotalPrice").val() == '' ? 0 : $.trim($("#dealTotalPrice").val())));
	var commissionRate = $("input[name='houseProjectAmount']").val();//$("#commissRate").val();
		var commissModel = $("#houseProjectId").find("option:selected").attr("title");
		if("FIXEDRATE" == commissModel){
			var normalCommiss = FloatDiv(FloatMul(dealTotalPrice,commissionRate),100);
			$("#normalCommiss").val(normalCommiss);
			$("span[key='normalCommissText']").text("佣金值" + FormatNumber(normalCommiss)).show();
		}else if("FIXEDMONEY" == commissModel){
			$("#normalCommiss").val($("input[name='houseProjectAmount']").val());
			$("span[key='normalCommissText']").text("佣金值" +  FormatNumber($("input[name='houseProjectAmount']").val())).show();
			$("span[key='normalCommissRate']").hide();
		}else if("HOUSETYPEFIXED" == commissModel ){
			$("span[key='normalCommissRate']").hide();
		}else if("CHANGE" == commissModel ){
			$("span[key='normalCommissText']").hide();
			$("span[key='normalCommissRate']").hide();
		}
	calcDisCount();
}

function dealPersonChange(){
	$("span[name='customerDisplayName']").html("客户选择");
}

function cusTypeChange(){
	$("span[name='customerDisplayName']").html('客户选择');
	$("#customerName").val('');
	$("#customerId").val('');
	//选择其他销售类型，清空客户联系人
	$("div[key='cusContent']").html("");
	$("img[key='cusAddOperate']").click();
}

function changeProperType(){
	var properType = $("#newPropertyType").val();
	if(properType=="NORMAL" || properType=="HIGHGRADE" || properType=="COSTLY" || properType=="APARTMENT" ){
		$('span[properType="houseType"]').show();
	}else{
		$('span[properType="houseType"]').hide();
	}
	
	if(properType=="VILLA"){
		$('span[properType="villaType"]').show();
	}else{
		$('span[properType="villaType"]').hide();
	}
	
	if(properType=="MARKET"){
		$('span[properType="marketType"]').show();
	}else{
		$('span[properType="marketType"]').hide();
	}
	
	if(properType=="OFFICEBUILDING"){
		$('span[properType="officebuildingType"]').show();
	}else{
		$('span[properType="officebuildingType"]').hide();
	}
}


function viewHouseType(){
	var houseProjectId = $("#houseProjectId").val();
	var dlg =art.dialog.open(getPath() +"/agency/dealreport/viewHouseType?houseProjectId=" + houseProjectId + "&random=" +  Math.round(Math.random()*100),
			{
				id : "viewHouseType",
				title : '选择户型',
				background : '#333',
				width : 830,
				height : 380,
				lock : true,
				button : [ {
					className : 'aui_state_highlight',
					name : '确定',
					callback : function() {
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.pickHouseType){
							dlg.iframe.contentWindow.pickHouseType();
						}
						return false;
					}
				} , {
					name : '取消',
					callback : function() {
						
					}
				}]	
			});			
	
}

function setHouseType(data){
	$("span[properType='houseType']").show();
	var properType = data.properType;
	var buildArea = data.buildArea;
	var amount = data.amount;
	var room = data.room;
	var halls = data.halls;
	var kitchens = data.kitchens;
	var toilets = data.toilets;
	var balconys = data.balconys;
	$("#newPropertyType").val(properType);
	$("#normalCommiss").val(amount);
	$("input[name='bedRoom']").val(room);
	$("input[name='livingRoom']").val(halls);
	$("input[name='bathRoom']").val(toilets);
	$("input[name='balcony']").val(balconys);
	$("input[name='buildArea']").val(buildArea);
	$("span[key='normalCommissText']").text("标准佣金：户型固定值" + FormatNumber(amount));
}

//客户来源数据
function cusTypeChang(){
	$('#customerSourceId').empty();
	var customerSourceIdData = $("#customerSourceIdData").val();
	$.post(base+"/trade/dealreport/getCusResource?random=" +  Math.round(Math.random()*100),{type:$("#customerSourceTypeId").val(),maxRows: 100},function(data){
		if(data.curesourceList != null && data.curesourceList.length > 0 ){
			$.each(data.curesourceList,function(i,ele){
				if(customerSourceIdData == ele.id){
					$('#customerSourceId').append("<option value='"+ele.id+"' selected='selected'>"+ele.name+"</option>");
				}else{
					$('#customerSourceId').append("<option value='"+ele.id+"'>"+ele.name+"</option>");
				}
			});
		}else{
			$("#customerSourceId").append("<option value=''>请选择</option>");
		}
	},'json');
	
}
//校验手机号码：必须以数字开头，除数字外
function isMobile(s){
 var patrn=/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/; 
 if (!patrn.test(s)){
   return false;
   }
  return true;
}
//email检查
function isEmail(email){
 var patrn= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
  if (!patrn.test(email)) {
   return false;
   }
  return true;
}

//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
function isTel(tel){
	var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
	if(pattern.exec(tel)){
		return true;
	}
	if(tel.length<7 || tel.length>18){
        return false;
	}
	return false;
}
