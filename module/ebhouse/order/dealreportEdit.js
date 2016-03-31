var commissModel = "FIXEDRATE";
$(document).ready(function(){
	/*if(!isNotNull(projectRate)){
		alert("请先配置项目提成比例.");
		art.dialog.close();
	}else{
		if(isNotNull(hasProject) && hasProject != "Y"){
			 $("#projectPart").val(0);
		 }
		$("#agencyPart").val(100 - parseInt($("#projectPart").val()));
	}*/
	commissModel = $("#houseProjectId").find("option:selected").attr("title");
//	performanceCalcModel = $("#houseProjectId").find("option:selected").attr("key");
	if("FIXEDRATE" == commissModel){
//		$("span[key='houseProjectAmount']").html("佣金比率");
//		$("#houseProjectAmount").text($("#houseProjectAmount").text() + "%");
//		$("#hp_rate").show();
	}else{
//		$("span[key='houseProjectAmount']").html("佣金值");
//		$("#hp_rate").hide();
	}
	$("span[key='normalCommiss']").show();
	
	setTimeout(function(){
		if("FIXEDRATE" == commissModel){
			calcCommiss();
			$("span[key='houseProjectAmount']").html("佣金比率");
			$("#houseProjectAmount").text($("input[name='houseProjectAmount']").val() + "%");
			$("span[key='normalCommissRate']").html("标准佣金：比例" + $("input[name='houseProjectAmount']").val() + "%	").show();
			$("span[key='normalCommissText']").html("佣金值" + FormatNumber($("#normalCommiss").val())).show();
			$("span[key='normalCommiss']").hide();
//		$("#hp_rate").show();
		}else if("FIXEDMONEY" == commissModel ){
			$("span[key='houseProjectAmount']").html("佣金值");
			$("#houseProjectAmount").text($("input[name='houseProjectAmount']").val());
			$("span[key='normalCommissRate']").html("").hide();
			$("span[key='normalCommissText']").html("标准佣金：固定值" + FormatNumber($("input[name='normalCommiss']").val())).show();
			$("span[key='normalCommiss']").hide();
//		$("#hp_rate").hide();
		}else if("HOUSETYPEFIXED" == commissModel ){
			$("span[key='viewHouseType']").show();
//			$("span[key='houseProjectAmount']").html("佣金值");
//			$("#houseProjectAmount").text($("input[name='houseProjectAmount']").val());
//			$("span[key='normalCommissText']").show().html("标准佣金：户型固定值" + $("input[name='normalCommiss']").val());
//			$("span[key='normalCommiss']").hide();
			$("span[key='normalCommiss']").show();
			$("span[key='normalCommissRate']").html("").hide();
			$("span[key='normalCommissText']").html("").hide();
			$("#normalCommiss").val($("input[name='houseProjectAmount']").val());
//		$("#hp_rate").hide();
		}else if("CHANGE" == commissModel ){
			$("span[key='normalCommiss']").show();
			$("span[key='normalCommissRate']").html("").hide();
			$("span[key='normalCommissText']").html("").hide();
			$("#normalCommiss").val($("input[name='houseProjectAmount']").val());
		}
	},500);
	
	calcDisCount();
	
//	caleModel = $("#houseProjectId").find("option:selected").attr("alt");
	if(caleModel == 'FIXED' || !isNotNull(caleModel)){
		$("#projectPart").attr("disabled", "disabled").css("background-color","rgb(240, 240, 240)");
		$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
	}else if(caleModel == 'CHANGE'){
		$("#projectPart").removeAttr("disabled").css("background-color","");
		$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
	}else{
		$("#projectPart").removeAttr("disabled").css("background-color","");
		$("#agencyPart").removeAttr("readonly").css("background-color","");
	}
	
	if(!isNotNull($("input[name='saleType']").val())){
		$("input[name='saleType']").val('FASTSALE');
	}
	if(isNotNull(saleTypeFlag)){
		$("input[name='saleType']").val(saleTypeFlag);
	}
	init();
	var agencyContent = $("#agencyOperate").find("div[key='agencyContent']");
	agencyContent.find("div[key='agencyDetail']").each(function(i,ele){
		    var agencyPerformOrg = $("#agencyPerformOrg" + (i+1));
			var agencyPerformOrgId = "agencyPerformOrgId" + (i+1);
			Autocomplete.init({
				$em:agencyPerformOrg,
				$obj:$('#' + agencyPerformOrgId),
				url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
				maxRows:10,
				position: {
					my: "left top",
					at: "left top",
					collision: "none"
				},
				param:{filter: "filter"},
				type:'POST',
				afterSelect: function(){
					var dealDate = $("#dealDate").val();
					if(isNotNull(dealDate)){
						agencyPerformOrgChange(agencyPerformOrgId);
						selectAgencyBusor(agencyPerformOrgId);
					}else{
						agencyPerformOrg.val("");
						$('#' + agencyPerformOrgId).val("");
						alert("请先选择成交日期.");
					}
				}
			});
	 });
	
	var content = $("#Operate").find("div[key='content']");
	content.find("div[key='detail']").each(function(i,ele){
		    var performOrg = $("#performOrg" + (i+1));
			var performOrgId = "performOrgId" + (i+1);
			Autocomplete.init({
				$em:performOrg,
				$obj:$('#' + performOrgId),
				url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
				maxRows:10,
				position: {
					my: "left top",
					at: "left top",
					collision: "none"
				},
				param:{saleType: $("input[name='saleType']").val()},
				type:'POST',
				afterSelect: function(){
					var dealDate = $("#dealDate").val();
					if(isNotNull(dealDate)){
						performOrgChange(performOrgId);
						selectBusor(performOrgId);
					}else{
						performOrg.val("");
						$('#' + performOrgId).val("");
						alert("请先选择成交日期.");
					}
				}
			});
	 });
	 //上报业绩计算
//	 calcPerformance();
	 var dealreportId = $("#id").val();
	 setTimeout(function(){
		 $("input[name='performOrgId']").each(function(i, ele){
			 selectBusor(ele.id);
		 });
		 
		 $("input[name='agencyPerformOrgId']").each(function(i, ele){
			 selectAgencyBusor(ele.id);
		 });
	 },100);
	 //设置成交日期为当前日期
	 if(!isNotNull($("#dealDate").val())){
			$("#dealDate").val(formate_yyyyMMdd(new Date));
	 }
	 changeProperType();
	 
	 if(comfire == 'comfire'){
		 $(":input").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
		 $("img[key='cusAddOperate']").hide();
		 $("div[key='cusContent']").find("img[key='delOperate']").hide();
		 
		 $("img[key='addOperate']").hide();
		 $("div[key='content']").find("img[key='delOperate']").hide();
		 $("input[name='saleTypeRadio']").attr("disabled",true);
		 $("#saleType").find("a").attr("disabled",true);
		 $("#projectCommissDeduct").removeAttr("readonly").css("background-color","");
		 
		 $("#propertyType").attr("disabled", true);
		 $("#newPropertyType").attr("disabled", true);
		 $("#dealPersonName").attr("disabled", true);
		 $("#customerSourceId").attr("disabled", true);
		 
		 
		 $("span[name='customerDisplayName']").css("color","").unbind();
		 $("#projectPartDesc").removeAttr("readonly").css("background-color","");
		 $("div[key='agencyContent']").find(":input").removeAttr("readonly").css("background-color","");
		 $("div[key='agencyContent']").find("input[name='agencyShareAmount']").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
		 
		 $("div[key='agencyTemplate']").find(":input").removeAttr("readonly").css("background-color","");
		 $("div[key='agencyTemplate']").find("input[name='agencyShareAmount']").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
	 }
	 $("span[name^='lead']").css("color","#04A5FC");
	 $("span[name^='agencyLead']").css("color","#04A5FC");
	if(!fastBuss || fastBuss=="false"){
		$("#dealOrg").removeAttr("disabled");
	}
	//设置业绩复算模式
	if(caleModel == "REPEAT"){
		$("#repeat").val(1);
	}
	
	if(isNotNull($("#customerSourceIdData").val())){
		 cusTypeChang();
	 }
	$.ajax({
		url:getPath()+"/agency/myProject/getHouseProjectData?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {id:$('#houseProjectId').val()},
		success: function(data) {
//			var propertyName = $("#propertyName").val();
			var houseProject = data.houseProject;
			var org = data.org;
			var projectManList = data.projectManList;
			var length = data.length;
//			$("#houseProjectAmount").text(houseProject.amount + "%");
			$("input[name='houseProjectAmount']").val(houseProject.amount);
			$("#commissRate").val(houseProject.amount);
			//清空代理成交数据
			$("div[key='agencyContent']").html("");
			
			
			
			if(houseProject.caleModel == 'FIXED' || !isNotNull(houseProject.caleModel)){
				$("#projectPart").val(houseProject.rate);
				$("#agencyPart").val(100 - parseInt($("#projectPart").val()));
				$("#projectPart").attr("disabled", "disabled").css("background-color","rgb(240, 240, 240)");
				$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
			}else if(houseProject.caleModel == 'CHANGE'){
				$("#projectPart").val(houseProject.rate);
				$("#agencyPart").val(100 - parseInt($("#projectPart").val()));
				$("#projectPart").removeAttr("disabled").css("background-color","");
				$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
			}else{
				$("#projectPart").val(100);
				$("#agencyPart").val(100);
				$("#projectPart").removeAttr("disabled").css("background-color","");
				$("#agencyPart").removeAttr("readonly").css("background-color","");
			}
			if(caleModel== "REPEAT"){
				$("#projectPart").val(100);
				$("#agencyPart").val(100);
			}
			
			if("INNERDATA" == saleTypeFlag){
				$("#projectPart").val(0);
				$("#agencyPart").val(100);
				$("#projectPart").attr("disabled", "disabled").css("background-color","rgb(240, 240, 240)");
				$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
			}
			
			
			//项目相关项目专员分成，自动带出
			if(dealContectMan == "Y"){
				$.each(projectManList,function(i, ele){
					$("img[key='agencyAddOperate']").click();
					var agencyPerformOrg = $("#agencyPerformOrg" + (i+1));
					var agencyPerformOrgId = "agencyPerformOrgId" + (i+1);
					var dealDate = $("#dealDate").val();
					
					$("#agencyPerformOrg" + (i+1)).val(ele.org.name);
					$("#agencyPerformOrgId" + (i+1)).val(ele.org.id);
					$("#agencyBusorPersonId" + (i+1)).val(ele.person.id);
					if(isNotNull(dealDate)){
						agencyPerformOrgChange(agencyPerformOrgId);
						selectAgencyBusor(agencyPerformOrgId);
						var ratio = Math.round(100/length * Math.pow(10,0))/Math.pow(10,0);
						$("#agencyRatio" + (i+1)).val(ratio);
						selectedCalcAgencyShareAmount($("#agencyPerformOrg" + (i+1)).get(0));
					}else{
						agencyPerformOrg.val("");
						$('#' + agencyPerformOrgId).val("");
					}
				});
			}
			if(houseProjectId != $('#houseProjectId').val()){
				calcCommiss();
			}
		}
	});
});

//初始化
var cusMoreOperate;
var agencyMoreOperate;
var moreOperate;
function init(){
	if(!isNotNull(hasProject) || hasProject == "Y"){
		//项目业绩
		agencyMoreOperate = new AgencyMoreOperate({
			id : "agencyOperate",
			count : 100,
			initCount : 1,
			index : 1 
		});
	}else{
		$("#projectPart").val(0);
	}
	
	
	//客户联系人
	cusMoreOperate = new CusMoreOperate({
		id : "cusOperate",
		count : 100,
		initCount : 1,
		index : 1 
	});
	//业绩分配
	var initIndex = $("div[key='content']").find("div[key='detail']").length;
	moreOperate = new MoreOperate({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
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
				
				//清空代理成交数据
				$("div[key='agencyContent']").html("");
				$("img[key='agencyAddOperate']").click();
				
				//清空客户联系人数据
				$("div[key='content']").html("");
				$("img[key='addOperate']").click();
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
			
			
			var agencyContent = $("#agencyOperate").find("div[key='agencyContent']");
			agencyContent.find("div[key='agencyDetail']").each(function(i,ele){
				    var agencyPerformOrg = $("#agencyPerformOrg" + (i+1));
					var agencyPerformOrgId = "agencyPerformOrgId" + (i+1);
					Autocomplete.init({
						$em:agencyPerformOrg,
						$obj:$('#' + agencyPerformOrgId),
						url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
						maxRows:10,
						position: {
							my: "left top",
							at: "left top",
							collision: "none"
						},
						param:{filter: "filter"},
						type:'POST',
						afterSelect: function(){
							var dealDate = $("#dealDate").val();
							if(isNotNull(dealDate)){
								agencyPerformOrgChange(agencyPerformOrgId);
								selectAgencyBusor(agencyPerformOrgId);
							}else{
								agencyPerformOrg.val("");
								$('#' + agencyPerformOrgId).val("");
								alert("请先选择成交日期.");
							}
						}
					});
			 });
			
			var content = $("#Operate").find("div[key='content']");
			content.find("div[key='detail']").each(function(i,ele){
				    var performOrg = $("#performOrg" + (i+1));
					var performOrgId = "performOrgId" + (i+1);
					Autocomplete.init({
						$em:performOrg,
						$obj:$('#' + performOrgId),
						url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
						maxRows:10,
						position: {
							my: "left top",
							at: "left top",
							collision: "none"
						},
						param:{saleType: $("input[name='saleType']").val()},
						type:'POST',
						afterSelect: function(){
							var dealDate = $("#dealDate").val();
							if(isNotNull(dealDate)){
								performOrgChange(performOrgId);
								selectBusor(performOrgId);
							}else{
								performOrg.val("");
								$('#' + performOrgId).val("");
								alert("请先选择成交日期.");
							}
						}
					});
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
			
			//清空代理成交数据
			$("div[key='agencyContent']").html("");
			$("img[key='agencyAddOperate']").click();
			
			//清空客户联系人数据
			$("div[key='content']").html("");
			$("img[key='addOperate']").click();
			
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
		
		var content = $("#Operate").find("div[key='content']");
		content.find("div[key='detail']").each(function(i,ele){
			    var performOrg = $("#performOrg" + (i+1));
				var performOrgId = "performOrgId" + (i+1);
				Autocomplete.init({
					$em:performOrg,
					$obj:$('#' + performOrgId),
					url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
					maxRows:10,
					position: {
						my: "left top",
						at: "left top",
						collision: "none"
					},
					param:{saleType: $("input[name='saleType']").val()},
					type:'POST',
					afterSelect: function(){
						var dealDate = $("#dealDate").val();
						if(isNotNull(dealDate)){
							performOrgChange(performOrgId);
							selectBusor(performOrgId);
						}else{
							performOrg.val("");
							$('#' + performOrgId).val("");
							alert("请先选择成交日期.");
						}
					}
				});
		 });
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
	
	var houseProjectId = $('#houseProjectId').val();
	//项目自动补全
	Autocomplete.init({
		$em:$( "#houseProject" ),
		$obj:$('#houseProjectId'),
		url:base+"/agency/myProject/autoComplateHouseProject?random=" +  Math.round(Math.random()*100),
		maxRows:12,
		type:'POST',
		afterSelect: function(){
			$.ajax({
				url:getPath()+"/agency/myProject/getHouseProjectData?random=" +  Math.round(Math.random()*100),
				dataType: "json",
				data: {id:$('#houseProjectId').val()},
				success: function(data) {
//					var propertyName = $("#propertyName").val();
					var houseProject = data.houseProject;
					var org = data.org;
					var projectManList = data.projectManList;
					var length = data.length;
//					$("#houseProjectAmount").text(houseProject.amount + "%");
					$("input[name='houseProjectAmount']").val(houseProject.amount);
					$("#commissRate").val(houseProject.amount);
					//清空代理成交数据
					$("div[key='agencyContent']").html("");
					$.each(projectManList,function(i, ele){
						$("img[key='agencyAddOperate']").click();
						var agencyPerformOrg = $("#agencyPerformOrg" + (i+1));
						var agencyPerformOrgId = "agencyPerformOrgId" + (i+1);
						var dealDate = $("#dealDate").val();
						
						$("#agencyPerformOrg" + (i+1)).val(ele.org.name);
						$("#agencyPerformOrgId" + (i+1)).val(ele.org.id);
						$("#agencyBusorPersonId" + (i+1)).val(ele.person.id);
						if(isNotNull(dealDate)){
							agencyPerformOrgChange(agencyPerformOrgId);
							selectAgencyBusor(agencyPerformOrgId);
							var ratio = Math.round(100/length * Math.pow(10,0))/Math.pow(10,0);
							$("#agencyRatio" + (i+1)).val(ratio);
							selectedCalcAgencyShareAmount($("#agencyPerformOrg" + (i+1)).get(0));
						}else{
							agencyPerformOrg.val("");
							$('#' + agencyPerformOrgId).val("");
						}
					});
					if(houseProjectId != $('#houseProjectId').val()){
						calcCommiss();
					}
				}
			});
		}
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
	
	if(isNotNull($("#specailEdit").val())){
		 $("input[name='saleTypeRadio']").attr("disabled",true);
		 $("#saleType").find("a").attr("disabled",true);
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
//			var propertyName = $("#propertyName").val();
				$("input[name='normalCommiss']").val(0);
				var houseProject = data.houseProject;
				var org = data.org;
				var projectManList = data.projectManList;
				var length = data.length;
				if(houseProject.caleModel == 'FIXED' || !isNotNull(houseProject.caleModel)){
					$("#projectPart").val(houseProject.rate);
					$("#agencyPart").val(100 - parseInt($("#projectPart").val()));
					$("#projectPart").attr("disabled", "disabled").css("background-color","rgb(240, 240, 240)");
					$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
				}else if(houseProject.caleModel == 'CHANGE'){
					$("#projectPart").val(houseProject.rate);
					$("#agencyPart").val(100 - parseInt($("#projectPart").val()));
					$("#projectPart").removeAttr("disabled").css("background-color","");
					$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
				}else{
					$("#projectPart").val(100);
					$("#agencyPart").val(100);
					$("#projectPart").removeAttr("disabled").css("background-color","");
					$("#agencyPart").removeAttr("readonly").css("background-color","");
				}
				if(caleModel== "REPEAT"){
					$("#projectPart").val(100);
					$("#agencyPart").val(100);
				}
//				caleModel = houseProject.caleModel;
				commissModel = houseProject.commissModel;
//				performanceCalcModel = houseProject.performanceCalcModel;
				$("#propertyName").val($('#houseProjectId option:selected').text());
				$("span[key='viewHouseType']").hide();
				$("span[key='normalCommiss']").hide();
				
				$("input[name='houseProjectAmount']").val(houseProject.amount);
				$("#commissRate").val(houseProject.amount);
				//清空代理成交数据
				$("div[key='agencyContent']").html("");
				$.each(projectManList,function(i, ele){
					if(ele.org && ele.org.id){
						$("img[key='agencyAddOperate']").click();
						var agencyPerformOrg = $("#agencyPerformOrg" + (i+1));
						var agencyPerformOrgId = "agencyPerformOrgId" + (i+1);
						var dealDate = $("#dealDate").val();
						
						$("#agencyPerformOrg" + (i+1)).val(ele.org.name);
						$("#agencyPerformOrgId" + (i+1)).val(ele.org.id);
						$("#agencyBusorPersonId" + (i+1)).val(ele.person.id);
						if(isNotNull(dealDate)){
							agencyPerformOrgChange(agencyPerformOrgId);
							selectAgencyBusor(agencyPerformOrgId);
							var ratio = Math.round(100/length * Math.pow(10,0))/Math.pow(10,0);
							$("#agencyRatio" + (i+1)).val(ratio);
							selectedCalcAgencyShareAmount($("#agencyPerformOrg" + (i+1)).get(0));
						}else{
							agencyPerformOrg.val("");
							$('#' + agencyPerformOrgId).val("");
						}
					}
				});
				if(projectId != $('#houseProjectId').val()){
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
//					$("#hp_rate").hide();
					}else if("HOUSETYPEFIXED" == houseProject.commissModel ){
						$("span[key='viewHouseType']").show();
//						$("span[key='houseProjectAmount']").html("佣金值");
//						$("#houseProjectAmount").text(houseProject.amount);
//						$("span[key='normalCommissText']").show().html("标准佣金：户型固定值0");
						$("span[key='normalCommiss']").show();
						$("span[key='normalCommissText']").html("").hide();
						$("#normalCommiss").val(houseProject.amount);
//					$("#hp_rate").hide();
					}else if("CHANGE" == houseProject.commissModel ){
						$("span[key='normalCommiss']").show();
						$("span[key='normalCommissText']").html("").hide();
						$("#normalCommiss").val(houseProject.amount);
					}
					
					
					calcAgencyPerformance();
					calcFastSalePerformance();
					
				}
				if("INNERDATA" == saleTypeFlag){
					$("#projectPart").val(0);
					$("#agencyPart").val(100);
					$("#projectPart").attr("disabled", "disabled").css("background-color","rgb(240, 240, 240)");
					$("#agencyPart").attr("readonly", "readonly").css("background-color","rgb(240, 240, 240)");
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

function AgencyMoreOperate(config){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='agencyTemplate']");
	var content = operateObj.find("div[key='agencyContent']");
	// 添加内容
	_addAgencyContent = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		config.index ++;
		idx = content.find("div[key='agencyDetail']").length;
		idx++;
		content.append(templateObj);
		$("div[key='agencyContent']").find("input[id='agencyPerformOrg']").attr("id" ,"agencyPerformOrg" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyPerformOrgId']").attr("id" ,"agencyPerformOrgId" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("select[id='agencyBusor']").attr("id" ,"agencyBusor" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyBusorPersonId']").attr("id" ,"agencyBusorPersonId" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyRatio']").attr("id" ,"agencyRatio" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyShareAmount']").attr("id" ,"agencyShareAmount" + idx).attr("idx", idx);
		
		
		$("div[key='agencyContent']").find("span[name='agencyLeadaName']").attr("name" ,"agencyLeadaName" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("span[name='agencyLeadbName']").attr("name" ,"agencyLeadbName" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("span[name='agencyLeadcName']").attr("name" ,"agencyLeadcName" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("span[name='agencyLeaddName']").attr("name" ,"agencyLeaddName" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("span[name='agencyLeadeName']").attr("name" ,"agencyLeadeName" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("span[name='agencyLeadfName']").attr("name" ,"agencyLeadfName" + idx).attr("idx", idx);
		
		$("div[key='agencyContent']").find("input[id='agencyLeada']").attr("id" ,"agencyLeada" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyLeadb']").attr("id" ,"agencyLeadb" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyLeadc']").attr("id" ,"agencyLeadc" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyLeadd']").attr("id" ,"agencyLeadd" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyLeade']").attr("id" ,"agencyLeade" + idx).attr("idx", idx);
		$("div[key='agencyContent']").find("input[id='agencyLeadf']").attr("id" ,"agencyLeadf" + idx).attr("idx", idx);
		
		$("div[key='agencyContent']").find("span[key^='idx']").each(function(i, eleSpan){
			$(eleSpan).html(i+1);
		});
		
		
		var agencyPerformOrg = $("#agencyPerformOrg" + idx);
		var agencyPerformOrgId = "agencyPerformOrgId" + idx;
		Autocomplete.init({
			type:'POST',
			$em:agencyPerformOrg,
			$obj:$('#' + agencyPerformOrgId),
			url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
			maxRows:10,
			position: {
				my: "left top",
				at: "left top",
				collision: "none"
			},
			param:{filter: "filter"},
			afterSelect: function(){
				var dealDate = $("#dealDate").val();
				if(isNotNull(dealDate)){
					agencyPerformOrgChange(agencyPerformOrgId);
					selectAgencyBusor(agencyPerformOrgId);
				}else{
					agencyPerformOrg.val("");
					$('#' + agencyPerformOrgId).val("");
					alert("请先选择成交日期.");
				}
			}
		});
		// 绑定删除事件
		templateObj.find("img[key='delOperate']").bind("click", function() {
			_removeAgencyContent($(this));
		});
	}
	// 删除内容
	_removeAgencyContent = function(obj) {
		var size = content.find("div[key='agencyDetail']").size();
		if (size <= 1) {
			art.dialog.tips("项目业绩分配不可少于1条纪录!");
		}else{
			obj.parent().parent().parent().parent().parent().parent().remove();
			$("div[key='agencyContent']").find("span[key^='idx']").each(function(i, eleSpan){
				$(eleSpan).html(i+1);
			});
		}
	}
	$("img[key='agencyAddOperate']").bind("click", function() {
		_addAgencyContent();
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='agencyDetail']").size();
		for ( var i = size; i < config.initCount; i++) {
			_addAgencyContent();
		}
	}
	operateObj.find("img[key='delOperate']").unbind().bind("click", function() {
		_removeAgencyContent($(this));
	});
}

function MoreOperate(config){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='content']");
	var idx = content.find("div[key='detail']").length;
	// 添加内容
	_addContent = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("img[key='delOperate']").bind("click", function() {
			_removeContent($(this));
		});
		config.index ++;
		idx++;
		content.append(templateObj);
		$("div[key='content']").find("select[id='sharetype']").attr("id" ,"sharetype" + idx);
		$("div[key='content']").find("input[id='performOrg']").attr("id" ,"performOrg" + idx);
		$("div[key='content']").find("input[id='performOrgId']").attr("id" ,"performOrgId" + idx).attr("idx", idx);
		$("div[key='content']").find("select[id='busor']").attr("id" ,"busor" + idx);
		$("div[key='content']").find("input[id='ratio']").attr("id" ,"ratio" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='shareAmount']").attr("id" ,"shareAmount" + idx);
		
		$("div[key='content']").find("span[name='leadaName']").attr("name" ,"leadaName" + idx).attr("idx", idx);
		$("div[key='content']").find("span[name='leadbName']").attr("name" ,"leadbName" + idx).attr("idx", idx);
		$("div[key='content']").find("span[name='leadcName']").attr("name" ,"leadcName" + idx).attr("idx", idx);
		$("div[key='content']").find("span[name='leaddName']").attr("name" ,"leaddName" + idx).attr("idx", idx);
		$("div[key='content']").find("span[name='leadeName']").attr("name" ,"leadeName" + idx).attr("idx", idx);
		$("div[key='content']").find("span[name='leadfName']").attr("name" ,"leadfName" + idx).attr("idx", idx);
		
		$("div[key='content']").find("input[id='leada']").attr("id" ,"leada" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='leadb']").attr("id" ,"leadb" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='leadc']").attr("id" ,"leadc" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='leadd']").attr("id" ,"leadd" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='leade']").attr("id" ,"leade" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='leadf']").attr("id" ,"leadf" + idx).attr("idx", idx);
		
		$("div[key='content']").find("input[id='orga']").attr("id" ,"orga" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='orgb']").attr("id" ,"orgb" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='orgc']").attr("id" ,"orgc" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='orgd']").attr("id" ,"orgd" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='orge']").attr("id" ,"orge" + idx).attr("idx", idx);
		$("div[key='content']").find("input[id='orgf']").attr("id" ,"orgf" + idx).attr("idx", idx);
		
		var performOrg = $("#performOrg" + idx);
		var performOrgId = "performOrgId" + idx;
		Autocomplete.init({
			type:'POST',
			$em:performOrg,
			$obj:$('#' + performOrgId),
			url:base+"/agency/dealreport/autoComplateOrg?random=" +  Math.round(Math.random()*100),
			maxRows:10,
			position: {
				my: "left top",
				at: "left top",
				collision: "none"
			},
			param:{saleType: $("input[name='saleType']").val()},
			afterSelect: function(){
				var dealDate = $("#dealDate").val();
				if(isNotNull(dealDate)){
					performOrgChange(performOrgId);
					selectBusor(performOrgId);
				}else{
					performOrg.val("");
					$('#' + performOrgId).val("");
					alert("请先选择成交日期.");
				}
			}
		});
	}
	// 删除内容
	_removeContent = function(obj) {
		var size = content.find("div[key='detail']").size();
		if (size <= 1) {
			art.dialog.tips("快销/联动业绩分配不可少于1条纪录!");
		} else{
			obj.parent().parent().parent().parent().parent().parent().remove();
		}
	}
	$("img[key='addOperate']").bind("click", function() {
		var size = content.find("div[key='detail']").length;
		if (config.count > size) {
			_addContent();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='detail']").size();
		for ( var i = size; i < config.initCount; i++) {
			_addContent();
		}
	}
	operateObj.find("img[key='delOperate']").unbind().bind("click", function() {
		_removeContent($(this));
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

function selectAgencyBusor(id){
	var idx = $("#" + id).attr("idx");
	var agencyBusor = $("#agencyBusor" + idx);
	var agencyPerformOrgId = $("#" + id).val();
	var agencyBusorPersonId = $("#agencyBusorPersonId" + idx).val();
	if(isNotNull(agencyPerformOrgId)){
		$("#agencyBusor" + idx).empty();
		$.post(base+"/agency/dealreport/autoComplateXMZY?random=" +  Math.round(Math.random()*100),{orgId:agencyPerformOrgId,maxRows: 100,dealDate:$("#dealDate").val()},function(data){
			if(data.count>0){
				var tempHtml = '';
				$.each(data.items,function(i,ele){
					if(ele.id == agencyBusorPersonId){
						tempHtml+="<option value='"+ele.id+"' selected>"+ele.name+"</option>";
					}else{
						tempHtml+="<option value='"+ele.id+"'>"+ele.name+"</option>";
					}
				});
				$("#agencyBusor" + idx).html(tempHtml);
			}else{
				$("#agencyBusor" + idx).html("<option value=''>业务员</option>");
			}
			var cloneTemp = $("#agencyBusor" + idx).clone();
			$("#agencyBusor" + idx).parent().append(cloneTemp);
			$("#agencyBusor" + idx).remove();
		},'json');
	}

}

function agencyPerformOrgChange(id){
	var idx = $("#" + id).attr("idx");
	var agencyBusor = $("#agencyBusor" + idx);
	var agencyPerformOrgId = $("#" + id).val();
	//获取上级领导赋值
	$.ajax({
		url:getPath()+"/agency/dealreport/getOrgLead?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {orgId:agencyPerformOrgId,dealDate:$("#dealDate").val()},
		success: function(data) {
			var message = data.message;
			$("#" + id).parent().parent().find("span[id='agencyLeadaName']").text("");
			$("#" + id).parent().parent().find("span[id='agencyLeadbName']").text("");
			$("#" + id).parent().parent().find("span[id='agencyLeadcName']").text("");
			$("#" + id).parent().parent().find("span[id='agencyLeaddName']").text("");
			$("#" + id).parent().parent().find("span[id='agencyLeadeName']").text("");
			$("#" + id).parent().parent().find("span[id='agencyLeadfName']").text("");
				var leada = data.leada;
				var leadb = data.leadb;
				var leadc = data.leadc;
				var leadd = data.leadd;
				var leade = data.leade;
				var leadf = data.leadf;
				if(leada && leada != null && leada.name != null){
					if(isNotNull(leada.org.businessTypes) && leada.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeadaName']").text(leada.name).attr("title",leada.org.name + ":" + leada.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeada]").val(leada.id);
				}
				if(leada && leada.org != null){
					$("#" + id).parent().parent().find("input[id^=agencyOrga]").val(leada.org.id);
				}
				if(leadb && leadb != null && leadb.name != null && leadLevel > 1){
					if(isNotNull(leadb.org.businessTypes) && leadb.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeadbName']").text(leadb.name).attr("title",leadb.org.name + ":" + leadb.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeadb]").val(leadb.id);
				}
				if(leadb && leadb.org != null && leadLevel > 1){
					$("#" + id).parent().parent().find("input[id^=agencyOrgb]").val(leadb.org.id);
				}
				if(leadc && leadc != null && leadc.name != null && leadLevel > 2){
					if(isNotNull(leadc.org.businessTypes) && leadc.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeadcName']").text(leadc.name).attr("title",leadc.org.name + ":" + leadc.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeadc]").val(leadc.id);
				}
				if(leadc && leadc.org != null && leadLevel > 2){
					$("#" + id).parent().parent().find("input[id^=agencyOrgc]").val(leadc.org.id);
				}
				if(leadd && leadd != null && leadd.name != null && leadLevel > 3){
					if(isNotNull(leadd.org.businessTypes) && leadd.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeaddName']").text(leadd.name).attr("title",leadd.org.name + ":" + leadd.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeadd]").val(leadd.id);
				}
				if(leadd && leadd.org != null && leadLevel > 3){
					$("#" + id).parent().parent().find("input[id^=agencyOrgd]").val(leadd.org.id);
				}
				if(leade && leade != null && leade.name != null && leadLevel > 4){
					if(isNotNull(leade.org.businessTypes) && leade.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeadeName']").text(leade.name).attr("title",leade.org.name + ":" + leade.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeade]").val(leade.id);
				}
				if(leade && leade.org != null && leadLevel > 4){
					$("#" + id).parent().parent().find("input[id^=agencyOrge]").val(leade.org.id);
				}
				if(leadf && leadf != null && leadf.name != null && leadLevel > 5){
					if(isNotNull(leadf.org.businessTypes) && leadf.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
						$("#" + id).parent().parent().find("span[id='agencyLeadfName']").text(leadf.name).attr("title",leadf.org.name + ":" + leadf.positionName);
					}
					$("#" + id).parent().parent().find("input[id^=agencyLeadf]").val(leadf.id);
				}
				if(leadf && leadf.org != null && leadLevel > 5){
					$("#" + id).parent().parent().find("input[id^=agencyOrgf]").val(leadf.org.id);
				}
			}
	});
}

function performOrgChange(id){
	var idx = $("#" + id).attr("idx");
	var busor = $("#busor" + idx);
	var performOrgId = $("#" + id).val();
	var dealreportId = $("#id").val();
	//获取上级领导赋值
	$.ajax({
		url:getPath()+"/agency/dealreport/getOrgLead?random=" +  Math.round(Math.random()*100),
		dataType: "json",
		data: {orgId:performOrgId,dealDate:$("#dealDate").val()},
		success: function(data) {
			var message = data.message;
			$("#" + id).parent().parent().find("span[id='leadaName']").text("");
			$("#" + id).parent().parent().find("span[id='leadbName']").text("");
			$("#" + id).parent().parent().find("span[id='leadcName']").text("");
			$("#" + id).parent().parent().find("span[id='leaddName']").text("");
			$("#" + id).parent().parent().find("span[id='leadeName']").text("");
			$("#" + id).parent().parent().find("span[id='leadfName']").text("");
				var leada = data.leada;
				var leadb = data.leadb;
				var leadc = data.leadc;
				var leadd = data.leadd;
				var leade = data.leade;
				var leadf = data.leadf;
				
				//选择租售类型显示数据不一样
				$("input[name='saleTypeRadio']").each(function(i, ele){
					if(this.checked){
						if("INNERDATA" == $(this).val()){
							if(leada && leada != null && leada.name != null){
								if(isNotNull(leada.org.businessTypes) && leada.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadaName']").text(leada.name).attr("title",leada.org.name + ":" + leada.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leada]").val(leada.id);
							}
							if(leada && leada.org != null){
								$("#" + id).parent().parent().find("input[id^=orga]").val(leada.org.id);
							}
							if(leadb && leadb != null && leadb.name != null && leadLevel > 1){
								if(isNotNull(leadb.org.businessTypes) && leadb.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadbName']").text(leadb.name).attr("title",leadb.org.name + ":" + leadb.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadb]").val(leadb.id);
							}
							if(leadb && leadb.org != null && leadLevel > 1){
								$("#" + id).parent().parent().find("input[id^=orgb]").val(leadb.org.id);
							}
							if(leadc && leadc != null && leadc.name != null && leadLevel > 2){
								if(isNotNull(leadc.org.businessTypes) && leadc.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadcName']").text(leadc.name).attr("title",leadc.org.name + ":" + leadc.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadc]").val(leadc.id);
							}
							if(leadc && leadc.org != null && leadLevel > 2){
								$("#" + id).parent().parent().find("input[id^=orgc]").val(leadc.org.id);
							}
							if(leadd && leadd != null && leadd.name != null && leadLevel > 3){
								if(isNotNull(leadd.org.businessTypes) && leadd.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leaddName']").text(leadd.name).attr("title",leadd.org.name + ":" + leadd.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadd]").val(leadd.id);
							}
							if(leadd && leadd.org != null && leadLevel > 3){
								$("#" + id).parent().parent().find("input[id^=orgd]").val(leadd.org.id);
							}
							if(leade && leade != null && leade.name != null && leadLevel > 4){
								if(isNotNull(leade.org.businessTypes) && leade.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadeName']").text(leade.name).attr("title",leade.org.name + ":" + leade.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leade]").val(leade.id);
							}
							if(leade && leade.org != null && leadLevel > 4){
								$("#" + id).parent().parent().find("input[id^=orge]").val(leade.org.id);
							}
							if(leadf && leadf != null && leadf.name != null && leadLevel > 5){
								if(isNotNull(leadf.org.businessTypes) && leadf.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadfName']").text(leadf.name).attr("title",leadf.org.name + ":" + leadf.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadf]").val(leadf.id);
							}
							if(leadf && leadf.org != null && leadLevel > 5){
								$("#" + id).parent().parent().find("input[id^=agencyOrgf]").val(leadf.org.id);
							}
						}else{
							if(leada && leada != null && leada.name != null){
								if(isNotNull(leada.org.businessTypes) && leada.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadaName']").text(leada.name).attr("title",leada.org.name + ":" + leada.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leada]").val(leada.id);
							}
							if(leada && leada.org != null){
								$("#" + id).parent().parent().find("input[id^=orga]").val(leada.org.id);
							}
							if(leadb && leadb != null && leadb.name != null){
								if(isNotNull(leadb.org.businessTypes) && leadb.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadbName']").text(leadb.name).attr("title",leadb.org.name + ":" + leadb.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadb]").val(leadb.id);
							}
							if(leadb && leadb.org != null){
								$("#" + id).parent().parent().find("input[id^=orgb]").val(leadb.org.id);
							}
							if(leadc && leadc != null && leadc.name != null){
								if(isNotNull(leadc.org.businessTypes) && leadc.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadcName']").text(leadc.name).attr("title",leadc.org.name + ":" + leadc.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadc]").val(leadc.id);
							}
							if(leadc && leadc.org != null){
								$("#" + id).parent().parent().find("input[id^=orgc]").val(leadc.org.id);
							}
							if(leadd && leadd != null && leadd.name != null){
								if(isNotNull(leadd.org.businessTypes) && leadd.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leaddName']").text(leadd.name).attr("title",leadd.org.name + ":" + leadd.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadd]").val(leadd.id);
							}
							if(leadd && leadd.org != null){
								$("#" + id).parent().parent().find("input[id^=orgd]").val(leadd.org.id);
							}
							if(leade && leade != null && leade.name != null){
								if(isNotNull(leade.org.businessTypes) && leade.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadeName']").text(leade.name).attr("title",leade.org.name + ":" + leade.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leade]").val(leade.id);
							}
							if(leade && leade.org != null){
								$("#" + id).parent().parent().find("input[id^=orge]").val(leade.org.id);
							}
							if(leadf && leadf != null && leadf.name != null){
								if(isNotNull(leadf.org.businessTypes) && leadf.org.businessTypes.indexOf('a3059a8c-2197-49e3-9d33-3994f9c55347') != -1){
									$("#" + id).parent().parent().find("span[id='leadfName']").text(leadf.name).attr("title",leadf.org.name + ":" + leadf.positionName);
								}
								$("#" + id).parent().parent().find("input[id^=leadf]").val(leadf.id);
							}
							if(leadf && leadf.org != null){
								$("#" + id).parent().parent().find("input[id^=agencyOrgf]").val(leadf.org.id);
							}
						}
					}
				});
				
				
			}
	});
}


MoreOperate.prototype.getJsonData = function() {
	var operateObj = $("#" + this.config.id);
	var content = operateObj.find("div[key='content']");
	var jsonsStr = "[";
	content.find("div[key='detail']").each(
			function(i, obj) {
				jsonsStr += "{";
				var jsonStr = "";
				$(obj).find("input[type='text']").each(
						function(i, inputObj) {
							jsonStr += "\"" + $(inputObj).attr("key") + "\":\""
									+ $(inputObj).val() + "\",";
						});
				$(obj).find("select").each(
						function(i, inputObj) {
							jsonStr += "\"" + $(inputObj).attr("key") + "\":\""
									+ $(inputObj).val() + "\",";
						});
				$(obj).find("input[type='checkbox']").each(
						function(i, inputObj) {
							jsonStr += "\"" + $(inputObj).attr("key") + "\":\""
									+ ($(inputObj).attr("checked")=='checked'?"1":"0") + "\",";
						});
				if (jsonStr.indexOf(",") != -1) {
					jsonStr = jsonStr.substring(0, jsonStr.length - 1);
				}
				jsonsStr += jsonStr;
				jsonsStr += "},";
			});
	if (jsonsStr.indexOf(",") != -1) {
		jsonsStr = jsonsStr.substring(0, jsonsStr.length - 1);
	}
	jsonsStr += "]";
	return jsonsStr;
}

function getAgencyJson(){
	 var content = $("#agencyOperate").find("div[key='agencyContent']");
	 var jsonsStr="[";
	 content.find("div[key='agencyDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var jsonStr="";
			var agencyPerformOrgId = $(ele).find("input[name^='agencyPerformOrgId']");
			var agencyBusor = $(ele).find("select[name^='agencyBusor']");
			var agencyRatio = $(ele).find("input[name^='agencyRatio']");
			var agencyShareAmount = $(ele).find("input[name^='agencyShareAmount']");
			
			var agencyOrga = $(ele).find("input[id^='agencyOrga']");
			var agencyOrgb = $(ele).find("input[id^='agencyOrgb']");
			var agencyOrgc = $(ele).find("input[id^='agencyOrgc']");
			var agencyOrgd = $(ele).find("input[id^='agencyOrgd']");
			var agencyOrge = $(ele).find("input[id^='agencyOrge']");
			var agencyOrgf = $(ele).find("input[id^='agencyOrgf']");
			
			var agencyLeada = $(ele).find("input[id^='agencyLeada']");
			var agencyLeadb = $(ele).find("input[id^='agencyLeadb']");
			var agencyLeadc = $(ele).find("input[id^='agencyLeadc']");
			var agencyLeadd = $(ele).find("input[id^='agencyLeadd']");
			var agencyLeade = $(ele).find("input[id^='agencyLeade']");
			var agencyLeadf = $(ele).find("input[id^='agencyLeadf']");
			
			var agencyEdges = Math.round(agencyRatio.val()/100 * Math.pow(10,4))/Math.pow(10,4);
			var repeat = $("#repeat").val();
			jsonStr+="\"org\":{\"id\":\""+agencyPerformOrgId.val()+"\"},";
			jsonStr+="\"busor\":{\"id\":\""+agencyBusor.val()+"\"},";
			jsonStr+="\"ratio\":\""+agencyRatio.val()+"\",";
			jsonStr+="\"shareAmount\":\"" + agencyShareAmount.val()+"\",";
			jsonStr+="\"edges\":\""+ agencyEdges +"\",";
			
			jsonStr+="\"orga\":{\"id\":\""+agencyOrga.val()+"\"},";
			jsonStr+="\"orgb\":{\"id\":\""+agencyOrgb.val()+"\"},";
			jsonStr+="\"orgc\":{\"id\":\""+agencyOrgc.val()+"\"},";
			jsonStr+="\"orgd\":{\"id\":\""+agencyOrgd.val()+"\"},";
			jsonStr+="\"orge\":{\"id\":\""+agencyOrge.val()+"\"},";
			jsonStr+="\"orgf\":{\"id\":\""+agencyOrgf.val()+"\"},";
			
			jsonStr+="\"leada\":{\"id\":\""+agencyLeada.val()+"\"},";
			jsonStr+="\"leadb\":{\"id\":\""+agencyLeadb.val()+"\"},";
			jsonStr+="\"leadc\":{\"id\":\""+agencyLeadc.val()+"\"},";
			jsonStr+="\"leadd\":{\"id\":\""+agencyLeadd.val()+"\"},";
			jsonStr+="\"leade\":{\"id\":\""+agencyLeade.val()+"\"},";
			jsonStr+="\"leadf\":{\"id\":\""+agencyLeadf.val()+"\"},";
			
			jsonStr+="\"repeat\":\""+ repeat +"\",";
			
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

function getPerformJson(){
	 var content = $("#Operate").find("div[key='content']");
	 var jsonsStr="[";
	 content.find("div[key='detail']").each(function(i,ele){
		 jsonsStr+="{";
			var jsonStr="";
			var sharetype = $(ele).find("select[name^='sharetype']")
			var performOrg = $(ele).find("input[id^='performOrgId']");
			var busor = $(ele).find("select[name^='busor']");
			var ratio = $(ele).find("input[name^='ratio']");
			var shareAmount = $(ele).find("input[name^='shareAmount']");
			
			var orga = $(ele).find("input[id^='orga']");
			var orgb = $(ele).find("input[id^='orgb']");
			var orgc = $(ele).find("input[id^='orgc']");
			var orgd = $(ele).find("input[id^='orgd']");
			var orge = $(ele).find("input[id^='orge']");
			var orgf = $(ele).find("input[id^='orgf']");
			
			var leada = $(ele).find("input[id^='leada']");
			var leadb = $(ele).find("input[id^='leadb']");
			var leadc = $(ele).find("input[id^='leadc']");
			var leadd = $(ele).find("input[id^='leadd']");
			var leade = $(ele).find("input[id^='leade']");
			var leadf = $(ele).find("input[id^='leadf']");
			
			var edges = Math.round(ratio.val()/100 * Math.pow(10,4))/Math.pow(10,4);
			//快销部设置非复算模式
			var repeat = 0;
			jsonStr+="\"shareType\":\""+sharetype.val()+"\",";
			jsonStr+="\"org\":{\"id\":\""+performOrg.val()+"\"},";
			jsonStr+="\"busor\":{\"id\":\""+busor.val()+"\"},";
			jsonStr+="\"ratio\":\""+ratio.val()+"\",";
			jsonStr+="\"shareAmount\":\""+shareAmount.val()+"\",";
			jsonStr+="\"edges\":\""+ edges +"\",";
			
			jsonStr+="\"orga\":{\"id\":\""+orga.val()+"\"},";
			jsonStr+="\"orgb\":{\"id\":\""+orgb.val()+"\"},";
			jsonStr+="\"orgc\":{\"id\":\""+orgc.val()+"\"},";
			jsonStr+="\"orgd\":{\"id\":\""+orgd.val()+"\"},";
			jsonStr+="\"orge\":{\"id\":\""+orge.val()+"\"},";
			jsonStr+="\"orgf\":{\"id\":\""+orgf.val()+"\"},";
			
			jsonStr+="\"leada\":{\"id\":\""+leada.val()+"\"},";
			jsonStr+="\"leadb\":{\"id\":\""+leadb.val()+"\"},";
			jsonStr+="\"leadc\":{\"id\":\""+leadc.val()+"\"},";
			jsonStr+="\"leadd\":{\"id\":\""+leadd.val()+"\"},";
			jsonStr+="\"leade\":{\"id\":\""+leade.val()+"\"},";
			jsonStr+="\"leadf\":{\"id\":\""+leadf.val()+"\"},";
			jsonStr+="\"repeat\":\""+ repeat +"\",";
			
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
	//业绩分配id字符串
	var cooperatIds = [];
	$("div[key='content']").find("input[name^='performOrgId']").each(function(i, ele){
		cooperatIds[cooperatIds.length] = ele.value;
	});
	$("#cooperatIds").val(cooperatIds.toString());
	
	//业绩分配人员字符串
	var cooperatNames = [];
	$("div[key='content']").find("input[name^='busor']").each(function(i, ele){
		cooperatNames[cooperatNames.length] = ele.value;
	});
	$("#cooperatNames").val(cooperatNames.toString());
	$("#dealPersonId").val($('#dealPersonName option:selected').val());
	//选择租售类型显示数据不一样
	$("input[name='saleTypeRadio']").each(function(i, ele){
		if(this.checked){
			$("input[name='saleType']").val($(this).val());
		}
	});
	if(!isNotNull(hasProject) || hasProject == "Y"){
		confireAgencyShareAmount();
	}
	confireShareAmount();
	if(!checkValidate()){
		return;
	}else{
		$("input[name='bedRoom']").val() == '' ? $("input[name='bedRoom']").val(0) : 1;
		$("input[name='livingRoom']").val() == '' ? $("input[name='livingRoom']").val(0) : 1;
		$("input[name='bathRoom']").val() == '' ? $("input[name='bathRoom']").val(0) : 1;
		$("input[name='balcony']").val() == '' ? $("input[name='balcony']").val(0) : 1;
		$("input[name='roomArea']").val() == '' ? $("input[name='roomArea']").val(0) : 1;
		var agencyJsonStr = getAgencyJson();
		$("#agencyJsonStr").val(agencyJsonStr);
		var cusJsonStr = getCusJson();
		$("#cusJsonStr").val(cusJsonStr);
		var performJsonStr = getPerformJson();
		$("#performJsonStr").val(performJsonStr);
		//disabled属性表达无法提交
		$("#projectPart").removeAttr("disabled");
		$.post(getPath()+"/agency/editdealreport/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					$.post(base+"/ebhouse/order/updateOrderStatus",{orderId:$("#orderId").val(),dealreportId: res.dealreportId});
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
	
//	if(isNotNull(tempCusPhoneNumberValide)){
//		art.dialog.tips("客户联系人手机不合法.");
//		tempCusPhoneNumberValide.select();
//		return false;
//	}
	
//	if(isNotNull(tempCusContactTelValide)){
//		art.dialog.tips("客户联系人电话不合法.");
//		tempCusContactTelValide.select();
//		return false;
//	}
	
//	if(isNotNull(tempCusContactProperty)){
//		art.dialog.tips("客户联系人产权比例不能为空.");
//		tempCusContactProperty.select();
//		return false;
//	}
	
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
	
//	if(isNotNull(tenoCusContactIdCard)){
//		art.dialog.tips("客户联系人身份证号码不合法.");
//		tenoCusContactIdCard.select();
//		return false;
//	}
	
//	if(isNotNull(tempCusContactAddress)){
//		art.dialog.tips("客户联系人地址不能为空.");
//		tempCusContactAddress.select();
//		return false;
//	}
	
//	if($("#contractNumber").val()==''){
//		art.dialog.tips("合同编号不能为空!");
//		$("#contractNumber").select();
//		return false;
//	}
	
	if($("#dealDate").val()==''){
		art.dialog.tips("成交日期不能为空!");
		$("#dealDate").select();
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
		art.dialog.tips("应收佣金不能为空!");
		$("#agencyCommiss").select();
		return false;
	}
	
	if(parseFloat($("#agencyCommiss").val()) > 999999999.99){
		art.dialog.tips("应收佣金不能超过999999999.99!");
		$("#agencyCommiss").select();
		return false;
	}
	
	if(parseFloat($("#projectPart").val()) > 100){
		art.dialog.tips("项目分成不能超过100!");
		$("#projectPart").select();
		return false;
	}
	
	if(parseFloat($("#projectCommissDeduct").val()) > 999999999.99){
		art.dialog.tips("项目佣金扣除不能超过999999999.99!");
		$("#projectCommissDeduct").select();
		return false;
	}
	
	if(parseFloat($("#agencyPart").val()) > 100){
		art.dialog.tips("联动成分不能超过100!");
		$("#agencyPart").select();
		return false;
	}
	if(parseFloat($("#agencyCommissDeduct").val()) > 999999999.99){
		art.dialog.tips("联动佣金扣除不能超过999999999.99!");
		$("#agencyCommissDeduct").select();
		return false;
	}

	
	var agencyPerformance = $("input[name='agencyPerformance']").val();
	if(parseFloat(agencyPerformance) < 0){
		art.dialog.tips("代理可上报业绩必须大于0!");
		return false;
	}
	
	var tempAgencyPerformOrg = null;
	var tempAgencyBusor = null;
	var tempAgencyRatio = null;
	var tempAgencyShareAmount= null;
	var percentAgencySum = 0.0;
	var tempAgencyCount = 0;
	$("div[key='agencyContent']").find("div[key='agencyDetail']").each(function(i, ele){
		var agencyPerformOrg = $(ele).find("input[name^='agencyPerformOrgId']");
		var agencyBusor = $(ele).find("select[name^='agencyBusor']");
		var agencyRatio = $(ele).find("input[name^='agencyRatio']");
		var agencyShareAmount = $(ele).find("input[name^='agencyShareAmount']");
		
		if(agencyRatio.val()){
			tempAgencyCount  ++;
			//util.js精确计算加法运算
			percentAgencySum = accAdd(percentAgencySum , agencyRatio.val());
		}
		
		
		if(!isNotNull($.trim(agencyPerformOrg.val()))){
			tempAgencyPerformOrg = agencyPerformOrg;
		}
		
		if(!isNotNull(agencyBusor.val())){
			tempAgencyBusor = agencyBusor;
		}
		
		if(!isNotNull($.trim(agencyRatio.val()))){
			tempAgencyRatio = agencyRatio
		}
		
		if(!isNotNull($.trim(agencyShareAmount.val()))){
			tempAgencyShareAmount = agencyShareAmount;
		}
	});
	
	if("INNERDATA" != saleTypeFlag){
		if(isNotNull(tempAgencyPerformOrg)){
			art.dialog.tips("项目业绩分配组织不能为空.");
			tempAgencyPerformOrg.select();
			return false;
		}
		if(isNotNull(tempAgencyBusor)){
			art.dialog.tips("项目业绩分配项目专员不能为空.");
			tempAgencyBusor.select();
			return false;
		}
		if(isNotNull(tempAgencyRatio)){
			art.dialog.tips("项目业绩分配比例不能为空.");
			tempAgencyRatio.select();
			return false;
		}
		if(isNotNull(tempAgencyShareAmount)){
			art.dialog.tips("项目业绩分配金额不能为空.");
			tempAgencyShareAmount.select();
			return false;
		}
		if(tempAgencyCount > 0 && percentAgencySum != 100){
			alert("项目业绩分配比例必须是100%.");
			return false;
		}
	}
	
	var fastPerformance = $("input[name='fastPerformance']").val();
	if(parseFloat(fastPerformance) < 0){
		art.dialog.tips("快销/联动可上报业绩必须大于0!");
		return false;
	}
	var tempPerformOrg = null;
	var tempBusor = null;
	var tempRatio = null;
	var tempShareAmount= null;
	var percentSum = 0.0;
	var tempCount = 0;
	var tempSharetypeCount = 0;
	$("div[key='content']").find("div[key='detail']").each(function(i, ele){
		var performOrg = $(ele).find("input[name^='performOrgId']");
		var busor = $(ele).find("select[name^='busor']");
		var ratio = $(ele).find("input[name^='ratio']");
		var shareAmount = $(ele).find("input[name^='shareAmount']");
		var sharetype = $(ele).find("select[name^='sharetype']");
		
		if(ratio.val()){
			tempCount ++;
			//util.js精确计算加法运算
			percentSum = accAdd(percentSum , ratio.val());
		}
		
		
		if(!isNotNull($.trim(performOrg.val()))){
			tempPerformOrg = performOrg
		}
		
		if(!isNotNull(busor.val())){
			tempBusor = busor;
		}
		
		if(!isNotNull($.trim(ratio.val()))){
			tempRatio = ratio
		}
		
		if(!isNotNull($.trim(shareAmount.val()))){
			tempShareAmount = shareAmount;
		}
		if(sharetype.val() == 'ALLCUSTOMER'){
			tempSharetypeCount ++;
		}
	});
	if(isNotNull($("#agencyPart").val()) && $("#agencyPart").val() >0){
		if(isNotNull(tempPerformOrg)){
			art.dialog.tips("快销/联动业绩分配组织不能为空.");
			tempPerformOrg.select();
			return false;
		}
		if(isNotNull(tempBusor)){
			art.dialog.tips("快销/联动业绩分配人不能为空.");
			tempBusor.select();
			return false;
		}
		if(isNotNull(tempRatio)){
			art.dialog.tips("快销/联动业绩分配比例不能为空.");
			tempRatio.select();
			return false;
		}
		if(isNotNull(tempShareAmount)){
			art.dialog.tips("快销/联动业绩分配金额不能为空.");
			tempShareAmount.select();
			return false;
		}
		if(tempCount > 0 && percentSum != 100){
			alert("快销/联动业绩分配比例必须是100%.");
			return false;
		}
		
		if(tempSharetypeCount > 1){
			alert("快销/联动分配类型只能选择一个客户所有人.");
			return false;
		}
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
//	var saleType = $("input[name='saleType']").val();
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
//			$("span[key='normalCommissText']").text("佣金值" + $("input[name='houseProjectAmount']").val()).show();
			$("span[key='normalCommissRate']").hide();
		}else if("CHANGE" == commissModel ){
			$("span[key='normalCommissText']").hide();
			$("span[key='normalCommissRate']").hide();
		}
	calcDisCount();
}

//代理可上报业绩计算
function calcAgencyPerformance(){
	var agencyCommiss = parseFloat($.trim($("#agencyCommiss").val()) == '' ? 0 : parseFloat($.trim($("#agencyCommiss").val())));
	if(performanceCalcModel == "BYDEALPRICE"){
		agencyCommiss = parseFloat($.trim($("#dealTotalPrice").val()) == '' ? 0 : parseFloat($.trim($("#dealTotalPrice").val())));
	}
	var projectPart = parseFloat($.trim($("#projectPart").val()) == '' ? 0 : parseFloat($.trim($("#projectPart").val())));
	if(caleModel!= "REPEAT"){
		$("#agencyPart").val(100 - projectPart);
	}
	var projectCommissDeduct = parseFloat($.trim($("#projectCommissDeduct").val()) == '' ? 0 : $.trim($("#projectCommissDeduct").val()));
	var agencyPerformance = FloatMul(agencyCommiss, projectPart/100) - projectCommissDeduct;
	agencyPerformance = Math.round(agencyPerformance * Math.pow(10,0))/Math.pow(10,0);
	$("strong[id='agencyPerformance']").html(FormatNumber(agencyPerformance)+ "元");
	$("input[name='agencyPerformance']").val(agencyPerformance);
}


//快销联动可上报业绩计算
function calcFastSalePerformance(){
	var agencyCommiss = parseFloat($.trim($("#agencyCommiss").val()) == '' ? 0 : parseFloat($.trim($("#agencyCommiss").val())));
	if(performanceCalcModel == "BYDEALPRICE"){
		agencyCommiss = parseFloat($.trim($("#dealTotalPrice").val()) == '' ? 0 : parseFloat($.trim($("#dealTotalPrice").val())));
	}
	var agencyPart = parseFloat($.trim($("#agencyPart").val()) == '' ? 0 : parseFloat($.trim($("#agencyPart").val())));
	var agencyCommissDeduct = parseFloat($.trim($("#agencyCommissDeduct").val()) == '' ? 0 : $.trim($("#agencyCommissDeduct").val()));
	var fastPerformance =FloatMul(agencyCommiss,agencyPart/100) - agencyCommissDeduct;
	fastPerformance = Math.round(fastPerformance * Math.pow(10,0))/Math.pow(10,0);
	$("strong[id='fastPerformance']").html(FormatNumber(fastPerformance)+ "元");
	$("input[name='fastPerformance']").val(fastPerformance);
}


function dealPersonChange(){
	$("span[name='customerDisplayName']").html("客户选择");
}
//计算项目业绩分配金额
function calcAgencyShareAmount(ele){
	var index = $(ele).attr("idx");
	var agencyRatio = parseFloat($.trim($("#agencyRatio" + index).val()) == '' ? 0 : $.trim($("#agencyRatio" + index).val()));
	var agencyPerformance = parseFloat($.trim($("input[name='agencyPerformance']").val()) == '' ? 0 : $.trim($("input[name='agencyPerformance']").val()) );
	if(agencyRatio != '' &&(agencyPerformance <= 0 || agencyRatio <= 0)){
//		art.artDialog.alert("代理上报业绩和业绩分配比率必须大于0"); 
		$("#ratio" + index).val("");
	}else{
		var agencyShareAmount = FloatMul(agencyRatio, agencyPerformance);
		agencyShareAmount = Math.round(FloatDiv(agencyShareAmount,100) * Math.pow(10,0))/Math.pow(10,0);
		$("#agencyShareAmount" + index).val(agencyShareAmount);
	}
}

//计算项目业绩分配金额
function selectedCalcAgencyShareAmount(ele){
	if(saleTypeFlag != "INNERDATA"){
		var index = $(ele).attr("idx");
		var agencyRatio = parseFloat($.trim($("#agencyRatio" + index).val()) == '' ? 0 : $.trim($("#agencyRatio" + index).val()));
		var agencyPerformance = parseFloat($.trim($("input[name='agencyPerformance']").val()) == '' ? 0 : $.trim($("input[name='agencyPerformance']").val()) );
		if(agencyRatio != '' &&(agencyPerformance <= 0 || agencyRatio <= 0)){
			//art.artDialog.alert("代理上报业绩和业绩分配比率必须大于0"); 
			$("#ratio" + index).val("");
		}else{
			var agencyShareAmount = FloatMul(agencyRatio, agencyPerformance);
			agencyShareAmount = Math.round(FloatDiv(agencyShareAmount,100) * Math.pow(10,0))/Math.pow(10,0);
			$("#agencyShareAmount" + index).val(agencyShareAmount);
		}
	}
}


//计算快销联动业绩分配金额
function calcShareAmount(ele){
	var index = $(ele).attr("idx");
	var ratio = parseFloat($.trim($("#ratio" + index).val()) == '' ? 0 : $.trim($("#ratio" + index).val()));
	var fastPerformance = parseFloat($.trim($("input[name='fastPerformance']").val()) == '' ? 0 : $.trim($("input[name='fastPerformance']").val()));
	if(ratio != '' &&(fastPerformance <= 0 || ratio <= 0)){
		art.artDialog.alert("快销联动上报业绩和业绩分配比率必须大于0"); 
		$("#ratio" + index).val("");
	}else{
		var shareAmount = FloatMul(ratio, fastPerformance);
		shareAmount = Math.round(FloatDiv(shareAmount,100) * Math.pow(10,0))/Math.pow(10,0);
		$("#shareAmount" + index).val(shareAmount);
	}
}


//修改（应收佣金、项目成分、分配比例）值后“分配业绩”值需重新计算。
function commissChangeByAgency(){
	$("div[key='agencyContent']").find("div[key='agencyDetail']").each(function(i, ele){
		var ratioEle = $(ele).find("input[name^='agencyRatio']");
		var shareAmountEle = $(ele).find("input[name^='agencyShareAmount']");
		//获取比例
		var ratio = parseFloat($.trim(ratioEle.val()) == '' ? 0 : $.trim(ratioEle.val()));
		//获取上报业绩
		var performance = parseFloat($.trim($("input[name='agencyPerformance']").val()) == '' ? 0 : $.trim($("input[name='agencyPerformance']").val()) );
		var shareAmount = FloatMul(ratio, performance);
		shareAmount = Math.round(FloatDiv(shareAmount,100) * Math.pow(10,0))/Math.pow(10,0);
		shareAmountEle.val(shareAmount);
	});
}

//修改（业主佣金、客户佣金、分配比例）值后“分配业绩”值需重新计算。
function commissChange(){
	$("div[key='content']").find("div[key='detail']").each(function(i, ele){
		var ratioEle = $(ele).find("input[name^='ratio']");
		var shareAmountEle = $(ele).find("input[name^='shareAmount']");
		//获取比例
		var ratio = parseFloat($.trim(ratioEle.val()) == '' ? 0 : $.trim(ratioEle.val()));
		//获取上报业绩
		var performance = parseFloat($.trim($("input[name='fastPerformance']").val()) == '' ? 0 : $.trim($("input[name='fastPerformance']").val()) );
		var shareAmount = FloatMul(ratio, performance);
		shareAmount = Math.round(FloatDiv(shareAmount,100) * Math.pow(10,0))/Math.pow(10,0);
		shareAmountEle.val(shareAmount);
	});
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

//校验手机号码：必须以数字开头，除数字外
function isMobile(s){
 var patrn=/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/; 
 if (!patrn.test(s)){
   return false;
   }
  return true;
}


function viewagencyLead(ele,leadId){
	$("#" + leadId + idx).val()
	var idx = $(ele).attr("idx");
	$("#leadChangeSpan").val($(ele).attr("name")); 
	$("#leadChangeId").val(leadId); 
	$("#leadChangeIdx").val(idx); 
	var dlg =art.dialog.open(getPath() +"/agency/dealreport/viewLead?leadId=" + $("#" + leadId + idx).val() + "&dealDate=" + $("#dealDate").val()+ "&random=" +  Math.round(Math.random()*100),
			{
				id : "viewLead",
				title : '修改领导',
				background : '#333',
				width : 830,
				height : 380,
				lock : true,
				button : [ {
					className : 'aui_state_highlight',
					name : '确定',
					callback : function() {
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.pickLead){
							dlg.iframe.contentWindow.pickLead();
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

function setLead(data){
	var leadChangeIdx = $("#leadChangeIdx").val();
	var leadChangeId = $("#leadChangeId").val();
	var leadChangeSpan = $("#leadChangeSpan").val();
	var spanId = leadChangeId + "Name";
	$("#" + leadChangeId + leadChangeIdx ).val(data.id);
	$("span[name='" + leadChangeSpan + "']").html(data.name).attr("title", data.leadOrgName + ":" + data.leadPositionName);
}

function cusTypeChange(){
	$("span[name='customerDisplayName']").html('客户选择');
	$("#customerName").val('');
	$("#customerId").val('');
	//选择其他销售类型，清空客户联系人
	$("div[key='cusContent']").html("");
	$("img[key='cusAddOperate']").click();
}


function confireAgencyShareAmount(){
	if("INNERDATA" != saleTypeFlag){
		//获取上报业绩
		var performance = parseFloat($.trim($("input[name='agencyPerformance']").val()) == '' ? 0 : $.trim($("input[name='agencyPerformance']").val()) );
		var shareAmount = 0;
		var dataEle = null;
		$("div[key='agencyContent']").find("div[key='agencyDetail']").each(function(i, ele){
			var shareAmountEleVal = $(ele).find("input[name^='agencyShareAmount']").val();
			if(i == 0){
				dataEle = $(ele).find("input[name^='agencyShareAmount']");
			}else{
				if(isNaN(shareAmountEleVal)){
					shareAmountEleVal = 0;
				}
				var shareAmountTemp = Math.round(shareAmountEleVal*Math.pow(10,0))/Math.pow(10,0);
				shareAmount = accAdd(shareAmount,shareAmountTemp);
			}
			
		});
		dataEle.val(performance - shareAmount);
	}
}


function confireShareAmount(){
	//获取上报业绩
	var performance = parseFloat($.trim($("input[name='fastPerformance']").val()) == '' ? 0 : $.trim($("input[name='fastPerformance']").val()) );
	var shareAmount = 0;
	var dataEle = null;
	$("div[key='content']").find("div[key='detail']").each(function(i, ele){
		var shareAmountEleVal = $(ele).find("input[name^='shareAmount']").val();
		if(i == 0){
			dataEle = $(ele).find("input[name^='shareAmount']");
		}else{
			if(isNaN(shareAmountEleVal)){
				shareAmountEleVal = 0;
			}
			var shareAmountTemp = Math.round(shareAmountEleVal*Math.pow(10,0))/Math.pow(10,0);
			shareAmount = accAdd(shareAmount,shareAmountTemp);
		}
		
	});
	dataEle.val(performance - shareAmount);
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