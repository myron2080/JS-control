function initProcessInfoData(page){
	var key = $("#key").val()==$("#key").attr("defaultValue")?'':$("#key").val();
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["checkedDate"]){
		queryStartDate = MenuManager.menus["checkedDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["checkedDate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
	} 
	$.post(getPath()+"/hr/processInfo/getListData",{page:page,billType:$("#processType").val(),key:key,queryStartDate:queryStartDate,queryEndDate:queryEndDate},function(pag){
		$("#gsdtData").html('');
		var processType = $("#processType").val();
		if(processType){
			$("label[name='"+processType+"']").html(pag.recordCount);
		}else{
			$("#all").html(pag.recordCount);
		}
		var list = pag.items;
		for(var i = 0;i<list.length;i++){
			var title = "";
			var pic = getPath()+"/default/style/images/hr/";
			if(list[i].billType.value=="LEAVE"){
				pic +="hr07.png";
				title='很遗憾，'+(list[i].oldOrg!=null?list[i].oldOrg.name:'')+(list[i].apply!=null?list[i].apply.name:'')+'离开了我公司，工作交接请联系'+(list[i].givePerson!=null?list[i].givePerson.name+'('+list[i].givePerson.phone+')':'')+'';
			}else if(list[i].billType.value=="ENROLL"){
				pic +="hr01.png";
				title = '热烈欢迎'+(list[i].apply!=null?list[i].apply.name:'')+'成为'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+'的一员'+(list[i].changePosition!=null?list[i].changePosition.name:'')+'('+(list[i].changeJobLevel!=null?list[i].changeJobLevel.name:'')+')';
			}else if(list[i].billType.value=="TRANSFER"){
				pic +="hr05.png";
				title = '原'+(list[i].oldOrg!=null?list[i].oldOrg.name:'')+(list[i].oldJobLevel!=null?list[i].oldJobLevel.name:'')+list[i].apply.name+'调到'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+(list[i].changePosition!=null?list[i].changePosition.name:'')+'';
			}else if(list[i].billType.value=="PROMOTION"){
				pic +="hr04.png";
				title = '恭喜'+(list[i].apply!=null?list[i].apply.name:'')+'童鞋成功晋级为'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+(list[i].changePosition!=null?list[i].changePosition.name:'')+'('+(list[i].changeJobLevel!=null?list[i].changeJobLevel.name:'')+')';
			}else if(list[i].billType.value=="DEMOTION"){
				pic +="hr08.png";
				title = '对不起，由于种种原因，'+(list[i].apply!=null?list[i].apply.name:'')+'降级为'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+(list[i].changePosition!=null?list[i].changePosition.name:'')+'('+list[i].changeJobLevel.name+')';
			}else if(list[i].billType.value=="INCREASE_PARTTIMEJOB"){
				pic +="hr06.png";
				title =''+(list[i].oldOrg!=null?list[i].oldOrg.name:'')+(list[i].oldPosition!=null?list[i].oldPosition.name:'')+list[i].apply.name+'现兼职'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+(list[i].changePosition!=null?list[i].changePosition.name:'')+'';
			}else if(list[i].billType.value=="DISMISS_PARTTIMEJOB"){
				pic +="hr09.png";
				title ='现撤职'+(list[i].apply!=null?list[i].apply.name:'')+(list[i].oldOrg!=null?list[i].oldOrg.name:'')+(list[i].oldPosition!=null?list[i].oldPosition.name:'')+'职务';
			}else if(list[i].billType.value=="POSITIVE"){
				pic +="hr03.png";
				title = '恭喜'+(list[i].apply!=null?list[i].apply.name:'')+'童鞋成功转正';
			}else if(list[i].billType.value=="REINSTATEMENT"){
				pic +="hr02.png";
				title = '热烈祝贺'+(list[i].apply!=null?list[i].apply.name:'')+'童鞋，经过他的不懈努力，再次成为'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+(list[i].changePosition!=null?list[i].changePosition.name:'')+'('+(list[i].changeJobLevel?list[i].changeJobLevel.name:'')+')';
			}else if(list[i].billType.value=="RUNDISK"){
				pic +="hr01.png";
				title = '热烈欢迎'+(list[i].apply!=null?list[i].apply.name:'')+'成为'+(list[i].changeOrg!=null?list[i].changeOrg.name:'')+'的一员'+(list[i].changePosition!=null?list[i].changePosition.name:'')+'('+(list[i].changeJobLevel!=null?list[i].changeJobLevel.name:'')+')';
			}else if(list[i].billType.value=="DELRUNDISK"){
				pic +="hr07.png";
				title='很遗憾，'+(list[i].oldOrg!=null?list[i].oldOrg.name:'')+list[i].apply.name+'离开了我公司，工作交接请联系'+(list[i].givePerson!=null?list[i].givePerson.name+'('+list[i].givePerson.phone+')':'')+'';
			}
			
			$('<dl><dt person-pop='+(list[i].apply!=null?list[i].apply.number:'')+' pop-name='+(list[i].apply!=null?list[i].apply.name:'')+' ><img src="'+getPath()+'/'+(list[i].apply!=null?(list[i].apply.photo==null ||list[i].apply.photo==''?"default/style/images/home/man_head.gif":"images/"+list[i].apply.photo):"default/style/images/home/man_head.gif")+'"/></dt>'+
                    '<dd>'+
                    '<div class="hr_arrow"></div>'+
                    '<img src="'+pic+'" width="29" height="15" />'+
                    '<font>'+title+'</font>'+
                    '<div class="time">'+list[i].auditDate+'</div>'+
               '</dd></dl>').appendTo("#gsdtData");
		}
		
		if(list.length<1){
			$("#gsdtData").html('<img src="'+getPath()+'/default/style/images/houseProject/404.gif">').css("textAlign","center").css("marginTop","200px");
		}else{
			$("#gsdtData").css("marginTop","0").css("textAlign","left");
		}
		personPop.init();
		var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
		$("#gsdtDataPage").html(initpagelist(page,totalPage));
	},'json');
}

function pagesearch(num){
	initProcessInfoData(num);
}

function getCount(){
	var key = $("#key").val()==$("#key").attr("defaultValue")?'':$("#key").val();
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["checkedDate"]){
		queryStartDate = MenuManager.menus["checkedDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["checkedDate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
	}
	$.post(getPath()+"/hr/processInfo/getCount",{key:key,queryStartDate:queryStartDate,queryEndDate:queryEndDate},function(res){
     	$("#enrollCount").html(res.enrollCount==null?0:res.enrollCount);
     	$("#positiveCount").html(res.positiveCount==null?0:res.positiveCount);
     	$("#reinstatementCount").html(res.reinstatementCount==null?0:res.reinstatementCount);
     	$("#leaveCount").html(res.leaveCount==null?0:res.leaveCount);
     	$("#transferCount").html(res.transferCount==null?0:res.transferCount);
     	$("#promotionCount").html(res.promotionCount==null?0:res.promotionCount);
     	$("#demotionCount").html(res.demotionCount==null?0:res.demotionCount);
     	$("#missjobCount").html(res.missjobCount==null?0:res.missjobCount);
     	$("#increasejobCount").html(res.increasejobCount==null?0:res.increasejobCount);
     	$("#rundiskCount").html(res.rundiskCount==null?0:res.rundiskCount);
     	$("#delrundiskCount").html(res.delrundiskCount==null?0:res.delrundiskCount);
     	$("#all").html(res.all);
	},'json');
}

function resetProcessData(str,obj){
	$("#processType").val(str);
	$(".toplist").find("a").css("color","");
	$(obj).css("color","#ff0000");
	initProcessInfoData(1);
}