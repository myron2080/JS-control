$(document).ready(function(){
	 var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 backListPage();
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 //alert(1);
	 queryData(1);
});
function searchData(){
	queryData(1);
}
function showLoader() { 
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b'       //加载器主题样式a-e  
        //textonly: false,   //是否只显示文字  
        //html: ""           //要显示的html内容，如图片等  
    });}
function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
				queryData();
		　　}
	});
}
function queryData(reload){
	showLoader();
	var curstatus = $("#statusType").val()=="ALL"?"":$("#statusType").val();
	
	var keyword = $("#keyword").val();
	var para = {};
	para.status = curstatus;
	
	if(reload) $(".wx-box").html('');
	var currentpage = $("#currentPage").val();
	currentpage = parseInt(currentpage)?parseInt(currentpage):0;
	if(reload) currentpage = 0;
	currentpage += 1;
	para.currentPage =  currentpage;
	para.personId = currentId;
	para.positionId = positionId;
	para.pageSize = 10;
	para.keyword = keyword;
	//para.processType = 'COUNTERSIGN';
	//para.realstatusnot = 'REJECT';
	
	$("#moreDiv").hide();
	$.post(getPath()+"/workflow/processView/queryMobileData",para,function(res){
		
		var data = res.data;
		var curpage = res.curpage;
		var pagecount = res.totalpage;
		
		if(curpage<pagecount){
			//$("#moreDiv").show();
			initScrollView();
		}else{
			$("#moreDiv").hide();
		}
		$("#currentPage").val(curpage);
		$("#totalPage").val(pagecount);
		
		var html = '';
		if(data.length>0){
		$.each(data,function(i,item){
			html +='<div class="wx-dl" onclick=dealbgProcess(this,"'+item.id+'","'+item.status+'")><a href="javascript:void(0)">';
			html += '<div class="wx-dl-avatar"> <img src="'+getPath()+'/images/'+(item.person?item.person.photo:'')+'" onerror="this.src=\''+getPath()+'/default/style/images/mobile/man.jpg\' "/></div>';
			html += '<div class="wx-dl-box"><div class="wx-dl-boxin">';
			html += '<p class="font16 color666">'+'<b class="colorh">'+item.creator.name +'</b>      '+item.huiQianType+'</p>';
			html += '<p class="font15 color666">'+item.name+'</p>';
			html += '<p class="font12 color999">  <b class="color999">'+ item.createTime+ '</b> 制单  '  +'</p>';
			html += '<textarea style="display:none;">'+item.taskdesc+'</textarea>';
			html += (item.status=='SUBMIT'?'<div class="wx-dl-r"><a href="javascript:void(0)" onclick=dealProcess("'+item.id+'","'+item.status+'","'+item.processType+'")>处理</a></div>':('<div class="wx-dl-r"><span class="pro'+item.status+'" >'+item.statusDesc+'</span></div>'));			
			html +='</div></div></a></div>';
		});
		}else{
			html +=' <div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			/*if(curstatus=='SUBMIT'){
				html +=' <img src="'+getPath()+'/default/style/images/mobile/submitblank.png" />';
			}else{
				html +=' <img src="'+getPath()+'/default/style/images/mobile/approveblank.png" />';
			}*/
			//html += '<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +=' <img src="'+getPath()+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>';
		}
		$(".wx-box").append(html);
		$.mobile.loading( "hide" );
	
		
		
	},'json');

	
}
function backListPage(){
	 $.mobile.changePage( "#listPage", { role: "page" } );
}

function dealbgProcess(obj,id,status){
	
	showLoader();
	
	dealProcess(id,status);
	
}

function dealProcess(id,status,processtype){
	var from = $("#fromsource").val();
	//if(processtype=='COUNTERSIGN'){
		window.location.href = base+"/weixinapi/mobile/workflow/weixinView?pvid="+id;
	//}else{
	//	window.location.href = base+"/weixinapi/mobile/workflow/weixinHrView?pvid="+id;
	//}
	
}

function typeTdClick(obj,str){
	
	var now = $("td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
	$("#statusType").val(str);
	queryData("1");
}