function initProjectData(pag){//加载数据
	if(pag == null){
		initProjectItem();
	}
	$("#projectMessage").html("");
	var projectId=$("#projectId").val();
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["projectDate"]){
		startDate = MenuManager.menus["projectDate"].getValue().timeStartValue;
		endDate = MenuManager.menus["createTime2"].getValue().timeEndValue;
	}
	var classhtm = '<div class="success_news03k">';
	if(screen.width == 1024 && screen.height == 768) classhtm = '<div class="success_news03">';
	if(screen.width == 1152 && screen.height == 864) classhtm = '<div class="screen1152864">';
	if(screen.width == 1280 && screen.height == 600) classhtm = '<div class="screen1280600">';
	if(screen.width == 1280 && screen.height == 720) classhtm = '<div class="screen1280720">';
	if(screen.width == 1280 && screen.height == 800) classhtm = '<div class="screen1280800">';
	if(screen.width == 1280 && screen.height == 960) classhtm = '<div class="screen1280960">';
	if(screen.width == 1280 && screen.height == 1024) classhtm = '<div class="screen12801024">';
	if(screen.width == 1360 && screen.height == 768) classhtm = '<div class="screen1360768">';
	if(screen.width == 1366 && screen.height == 768) classhtm = '<div class="screen1366768">';
	if(screen.width >= 1440 && screen.height >= 900) classhtm = '<div class="screen1440900">';
	$.post(getPath()+'/interflow/projectTrends/getTrendsData',{page:pag,projectId:projectId,startDate:startDate,endDate:endDate},function(data){
		$("#projectLoading").hide();
		if(data){
			var items=data.items;
			for(var i = 0;i < items.length; i++){
				var photosStr = "";
				if(items[i].photoList){
					for(var k = 0;k < items[i].photoList.length; k++){
						var photo = items[i].photoList[k].PATH;
						photosStr += '<a href="javascript:void(0)"><img enlarger="'+getPath()+'/images/' + photo.replace("size","origin")+'"  src="'+getPath()+'/images/'+photo.replace("size","150X100")+'" /></a>';
	                }
				}
				
				$('<div class="success_news01">'+
                '<div class="success_news02" person-pop='+items[i].personNumber+' pop-name='+items[i].personName+'"><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+imgBase+"/"+items[i].photo.replace("size","150X100")+'" /></div>'+
                classhtm+
                '<div class="sn">'+
                         '<div class="sn_line">'+
				              '<div class="sn_left">'+
				                   '<h1>'+
				                   '【'+items[i].projectName+'】'+'&nbsp;&nbsp;('+items[i].title+')'+
				                   '</h1>'+
                              '</div>'+
				              '<div class="sn_right">'+
				             items[i].timeStr+'&nbsp;'+ items[i].createName+'&nbsp;发布'+
				              '</div>'+
				         '</div>'+
                         '<div class="sn_list">'+
                              items[i].content+
                              photosStr+
                         '</div>'+
                    '</div>'+
                    '</div>').appendTo("#projectMessage");
			}
			var totalPage = data.recordCount%data.pageSize==0?(data.recordCount/data.pageSize):Math.floor(data.recordCount/data.pageSize)+1;
			var pagediv = "<div><font>当前第"+data.currentPage+"页,共"+totalPage
			+"页</font><a href='#' id='prev' onclick=pagGetProjectData("+data.currentPage+",'prev',"+totalPage+")>上一页</a>"		
			+"<a href='#' id='next' onclick=pagGetProjectData("+data.currentPage+",'next',"+totalPage+")>下一页</a></div>";
			$("#Pagination6").html(pagediv);
			EnlargerImg.init();	//放大图片
		}
		personPop.init();
		$("#Pagination6").mCustomScrollbar();
	},'json');
}

function pagGetProjectData(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips('已经是第一页');
			return
		}else{
			initProjectData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initProjectData(page+1);
		}
	}
}

/**
 * 加载所有项目 
 */
function initProjectItem(){
	$.post(getPath()+'/agency/trends/getAllProject',{},function(data){
		if(null != data.allPro){
			var project=data.allPro;
			var option="<option value=''>所有项目</option>";
			for(var i=0;i<project.length;i++){
				var pro=project[i];
				option+="<option value='"+pro.id+"'>"+pro.registerName+"</option>";
			}
			$("#projectId").append(option);
		}
	},'json');
}