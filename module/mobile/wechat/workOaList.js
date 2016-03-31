var flag=0;
$(document).on("click", "#moreBtn", function() {
	showLoader();
}).on("mobileinit", function() {
	  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	$("#addOa").bind("click",function(){
		window.location.href = base+"/weixinapi/mobile/workOa/add";
	});
	 
	searchData('0');
});

//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });}
function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1; 
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	$("#moreDiv").hide();
	var para = {};
	para.currentPage = thePage;
	para.personId = currentId;
	para.pageSize = 10;
	para.orgId = orgId;
	
//	if(condition){
		//如果有条件 添加条件
		var param = getCondition();
		para.byTimeType = param.byTimeType;
		para.keyWord = param.keyWord;
//	}
	
	
	$.post(base+'/weixinapi/mobile/workOa/listPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		
		
		if(null != res.items){
			var showList=res.items;
			var div="";
			if(showList.length>0){
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				 var photo=base+"/default/style/images/mobile/man.jpg";
				 var defaultPhoto = photo;
				if(obj.creatorPhoto){
					photo=base+"/images/"+obj.creatorPhoto;}
				
				    var preview=obj.preview;
					
				    div+='<dl id="bg_'+obj.id+'" onclick=view(this) class="Joblist">';
					div+='<dd><div class="jobbody">';
					if(currentId == obj.creatorId){
						div+='<a href="#" class="delete" onclick=toDelete(event,"'+obj.id+'")>删除</a>';
					}
					div+='<h3>'+obj.creatorName+'   '+obj.orgName+'</h3>'+obj.title;
					div+='<span>'+obj.createDate+' '+obj.summaryTypeName+' 批复'+obj.replyCount+'次</span>';
					div+='</div></dd>';
					div+='<dt><img onerror="this.src=\''+defaultPhoto+'\'" src="'+photo+'"/></dt>';
					div+='</dl>';
			}
			}else{
				div   +=' <div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
				div   +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
				div   +='</div>'
			}
			if(str == '0'){//初始化
				$("#listContent").html("");
			}
			$("#listContent").append(div);
			$.mobile.loading( "hide" );
		}else{
			
			$("#listContent").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#listContent").append(html);
			$.mobile.loading( "hide" );
		}
		
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		
	},'json');
}
function ltrim(str){ //删除空格
    str=str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    //str=str.replace(/(^\s*)|(\s*$)/g,"");//去除两头空格
    str=str.replace(/&nbsp;/g,"");
    str=str.replace(/\s+/g,"");//去除所有空格
   return str;
}
function toFull(id){
$("#"+id+"_full").show();
$("#"+id+"_short").hide();
}
function toShort(id){
	$("#"+id+"_full").hide();
	$("#"+id+"_short").show();
}
function toDelete(event,id){
	flag=1;
	$("#toDoId").val(id);
	//$( "#popupDialog" ).popup( "open" );	
	commonCfmShow("确定删除么?",'deleteNow()');
}

function view(obj){
	 var id=$(obj).attr("id");
	 viewWorkSummary(id.substring(id.indexOf("_")+1));
}
	 
function deleteNow(){
		 $.post(base+'/weixinapi/mobile/workOa/delete',{id:$("#toDoId").val()},function(res){
			 if(res.STATE == 'SUCCESS'){
					searchData('0');
					commonCfmHide();
				}else{
					msgDialog("操作失败");
					commonCfmHide();
				}
		 },'json');
	}
function toEdit(id){
	window.location.href = base+"/weixinapi/mobile/workOa/edit?id="+id;
	}
/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	$.mobile.changePage( "#systemMsg", { role: "dialog" } );
}

function viewWorkSummary(id){
	if(flag==0){
		 window.location.href= base+"/weixinapi/mobile/workOa/showView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid;
	}else{
		flag = 0;
	}
}

$(function(){
	
})


function changeEvent(){
	//去查
	searchData('0');
}

function getCondition(){
	var byTimeType = $("td.selected").attr('value');
	var keyWord = $("#keyWord").val().trim();
	var param = {};
	param.byTimeType = byTimeType ;
	param.keyWord = keyWord ;
	return param;
}

$(function(){
	$("td").click(function(){
		if(!$(this).hasClass('selected')){
			$("td.selected").removeClass('selected');
			$(this).addClass('selected');
		}
		searchData('0');
	})
})