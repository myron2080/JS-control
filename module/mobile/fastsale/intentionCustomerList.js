$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	$("#addCustomer").bind("click",function(){
		window.location.href = base+"/mobilefastsale/intention/add";
	});
	  
	 $("#intentionCusStatus tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 searchData('0');
	 });
	 
	 $("#orderType tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 searchData('0');
	 });
	 
	searchData('0');
});
function addCustomer(){
	window.location.href = base+"/mobilefastsale/intention/add";
}
function typeTdClick(obj,str){
	$("#showType").text($(obj).text());
	$("#orderType").val(str);
	$("#orderDiv").toggle();
	changeEvent();
}

function changePage(url){
	  
}

function changePageTest(url){
	$.mobile.changePage(url, {transition: "slideup", changeHash: false }); 
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
/** 
 * 选择排序类型
 */
function chooseType(){
	$("#orderDiv").toggle();
}

function changeEvent(){
	$("#mylist").html('');
	$("#currentPage").val("1");
	searchData('0');
}
function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight+1 == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　searchData('1');
		　　}
	});
}
function searchData(str){
	$("#moreDiv").hide();
	showLoader();
	var param = {};
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
		$("#mylist").html('');
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	
	var orderType=$('#orderType .selected').attr('key');
	var key=$("#key").val();
	var status = $(".selected").attr("key");
	param.currentPage = thePage; 
	param.pageSize = 10;
	param.key = key;
	if(status){
	 param.status = status;
	}
	if("followUp"==orderType){
		param.sortname = " ic.flastfollowdate ";
		param.sortorder = "DESC";
	}else if("followDown"==orderType){
		param.sortname = " ic.flastfollowdate ";
		param.sortorder = "ASC";
	}else if("levelUp"==orderType){
		param.sortname = " ic.fcustomerlevel ";
		param.sortorder = " DESC";
	}else if("levelDown"==orderType){
		param.sortname = " ic.fcustomerlevel ";
		param.sortorder = " ASC";
	}
	
	$.post(base+'/mobilefastsale/intention/listData',param,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScrollView();
		    }
		if(null != res.items){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
			  var customerLeav="";
			  if(obj.customerLevelValue=='A'){
				  customerLeav="刚需客";
			  }else if(obj.customerLevelValue=='B'){
				  customerLeav="投资客";
			  }else{
				  customerLeav="潜在客";
			  }
			  
			  var colorClass='a-ico fl';
			  if(obj.customerLevelValue == 'B'){
			   colorClass='b-ico fl';
	          }else if(obj.customerLevelValue == 'C'){
	           colorClass='c-ico fl'; }
				div +=('<div class="yilan-list" onclick=showDetail("'+obj.id+'") objid="'+obj.id+'"  id="bg_'+obj.id+'">'+
		          '<p class="fl" style="width:100%;line-height:21px;">'+
		             '<span class="fl">'+
		                 '<b class="'+colorClass+'">'+obj.customerLevelValue+'</b>'+
		                 '<em class="font16 bold fl" style="line-height:21px;">'+obj.customerName+'</em>'+
//		                 '<em class="font14 fl ml5" style="line-height:21px;">'+obj.statusName+'</em>'+
		             '</span>'+
		             '<span class="fr color666">'+obj.statusName+'</span>'+
		             '<span style="margin-right:26px;" class="fr color666">'+customerLeav+'</span>'+
//		             '<span class="fr color999">'+obj.personName+obj.unFollowDay+'天未跟进  '+obj.lastFollowDate+'</span>'+
		          '</p>'+
		          '<p class="fl font14" style="width:100%;padding:2px 0 14px 0;">'+
//		          +(obj.intentionDesc||'') 到底加不加入描述
		            '<b class="bold color666">描述：</b> <em class="color666">'+(obj.intentionDesc||'')+' '+(obj.remark ? '其他意向:'+obj.remark : '')+'</em>'+
		          '</p>'+
		          '<p class="fl" style="width:100%;">'+
		            '<em class="color999">'+obj.belongToTime+'登记</em>'+
		            '<em class="fr color999">'+obj.personName+obj.unFollowDay+'天未跟进  '+'</em>'+
		          '</p>'+
		     '</div>');
				 
			}
			if(!div){
				//div = '<div class="yilan-list" align="center"><b>没有找到相关记录</b></div>';
				$("#mylist").html("");
				div ='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
				div +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
				div +='</div>'
			}
			$("#mylist").append(div);
			$.mobile.loading( "hide" );
		}
	},'json');
}

function showDetail(id){
	//$("[id^='bg_']").removeClass(" news-list-bg");
	//$("#bg_"+id).addClass(" news-list-bg");
    /*$("#iframeId").attr("src",base+"/mobilefastsale/intention/view?id="+id);
    setTimeout(function(){
    window.location.href = "#showDetail"; 
    },500);*/
    
//    $("#loading").show();
//	 $("#iframeId").remove();
//	 $.mobile.changePage( "#showDetail", { role: "page" } );
//	 $('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
//	 setTimeout(function(){
//	  $("#iframeId").attr("src",base+"/mobilefastsale/intention/view?id="+id);
//	 },500);
//	$("#iframeId").bind('load', function() {
//		$("#loading").hide();
//	});
	
	window.location.href=base+"/mobilefastsale/intention/view?id="+id;
	
}


function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}