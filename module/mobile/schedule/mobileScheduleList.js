var tempId;
var toFullId;
$(document).on("click", "#moreBtn,#searchBtn", function() {
	showLoader();
	 /* var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "加载中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html 
	  });*/
}).on("click","[id^='bg_']", function() {
	/*$("[id^='bg_']").removeClass(" hover-bg");
	 $(this).addClass(" hover-bg");*/
	 var id=$(this).attr("id");
	 id=id.substring(id.indexOf("_")+1);
	 if(id!=tempId){
	 $("#toDo_"+tempId).hide();}
	 if(id!=toFullId){
	 toShort(toFullId);}
}).on("mobileinit", function() {
	  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	$("#addSchedule").bind("click",function(){
		window.location.href = base+"/weixinapi/mobileinterflow/mobileschedule/addSchedule";
	});
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 
	 $("#queryType tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 $("#type").val($(".selected").attr("key"));
		 searchData('0');
	 });
	searchData('0');
	/*$("[id^='bg_']").live('touchstart', function(){ 
		$("[id^='bg_']").removeClass(" hover-bg");
		 $(this).addClass(" hover-bg");
		 var id=$(this).attr("id");
		 id=id.substring(id.indexOf("_")+1);
		 if(id!=tempId){
		 $("#toDo_"+tempId).hide();}
		 if(id!=toFullId){
		 toShort(toFullId);}
		}); */ 
	/*$("[id^='bg_']").live('touchend', function(){  
		 $(this).removeClass(" hover-bg");
		 var id=$(this).attr("id");
		 id=id.substring(id.indexOf("_")+1);
		 //$("[id^='toDo_']").hide();
		if($("#"+id).css("display")!="none") {
			   $("#"+id).hide();
		    }
		});*/
	//$( "#dialogPage" ).popup();
});

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

function changeEvent(){
	$("#mylist").html('');
	$("#currentPage").val("1");
	var orderType=$("#orderType").val();
	//alert(orderType.substring(0,orderType.indexOf("_")));
	//alert(orderType.substring(orderType.indexOf("_")+1));
	$("#rankey").val(orderType.substring(0,orderType.indexOf("_")));
    $("#sortkey").val(orderType.substring(orderType.indexOf("_")+1));
    searchData('0');
}

/*function searchData(str){
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	var rankey = $("#rankey").val();
	var sortkey = $("#sortkey").val();
	para.rankey = rankey?(rankey+" "+sortkey):"";
	var currtype = $("#type").val();
	para.type = currtype;
	para.personId = currentId;
	para.pageSize = 10;
	$.post(base+'/weixinapi/mobileinterflow/mobileschedule/listPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	$("#moreDiv").show();
		    }
		if(null != res.items){
			var showList=res.items;
			//var div="";
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var impor;
				if(obj.pressLevel==2 && obj.importLevel==2){
				impor="<b class='redbox mr5'>紧急重要</b>"
				}else if(obj.pressLevel==2 && obj.importLevel==1){
				impor="<b class='orangebox mr5'>急而不重</b>"
				}else if(obj.pressLevel==1 && obj.importLevel==2){
						impor="<b class='zsbox mr5'>重而不急</b>"
				}if(obj.pressLevel==1 && obj.importLevel==1){
					impor="<b class='bluebox mr5'>不急不重</b>"
				}else if(obj.pressLevel==0 && obj.importLevel==0){
					impor="<b class='orangebox mr5'>搁浅</b>"
				}
				div+="<div class='ric'><div class='ricin'>";
				div+=" <div class='ricin-list'>"+impor+obj.name+"</div>";
				if(obj.description.length>100){
				div+="<div class='ricin-list' style='font-size:14px;' id='"+obj.id+"_short'>"+obj.preview+"<a style='color:#3674b2;' href='#' onclick=toFull('"+obj.id+"')>(查看全文)</a></div>";}			
				div+="<div class='ricin-list' id='"+obj.id+"_full'" 
				if(obj.description.length>100){
				div+="style='display:none'";}
				div+=">"+obj.description;
				if(obj.description.length>100){
				div+="<a style='color:#3674b2;' href='#' onclick=toShort('"+obj.id+"')>(收起)</a>";}
				div+="</div>";
				
				
				//div+="<div class='zd-list pb5' id='"+obj.id+"_short'>"+preview+"<a style='color:#3674b2;' href='#' onclick=toFull('"+obj.id+"')>(查看全文)</a></div>"
			    //div+="<div class='zd-list pb5' id='"+obj.id+"_full' style='display:none'>"+obj.content+"<a style='color:#3674b2;' href='#' onclick=toShort('"+obj.id+"')>(收起)</a></div>"
				
				
				div+="<div class='ricin-list'>";
				div+="<b class='fl color999' style='font-size:14px;'>"+obj.scheDate+"&nbsp; &nbsp;<a class='color999' href='#'typeKey='toDialog' key='"+obj.id+"'onclick=toDelete('"+obj.id+"')  >删除</a></b>";
				//div+="<b class='fl color999' style='font-size:14px;'><a class='color999' href='#'typeKey='toDialog' onclick=toEdit('"+obj.id+"')  >|修改</a></b>";
				div+="<b class='fr'>";
				//div+="<a class='bl-btn' href='#'>办理</a>"
				div+="<a  href='#'key='box' class='bl-btn'  onclick=showToDo('"+obj.id+"')>办理</a>"
				div+="<div class='bl-box' key='box' id='"+obj.id+"' style='display:none'>";
				div+="<a class='bl-box01' href='#' onclick=toDo('"+obj.id+"','DOING')>现在做</a>";
				div+="<a class='bl-box01' href='#' onclick=toDo('"+obj.id+"','WILLDO')>等等做</a>";
				div+="<a class='bl-box01' href='#' onclick=toDo('"+obj.id+"','DONE')>完成啦</a>";
				div+="<a class='bl-box01' style='margin-right:0px;' href='#'onclick=toDo('"+obj.id+"','LATEDO')>再说吧</a>";
				div+="</div>";
				div+="</b>";
				div+="</div>";
				div+="</div>";
				div+="</div>"
			}
			if(str == '0'){//初始化
				$("#mylist").html("");
			}
			$("#mylist").append(div);
			$('ul').listview('refresh');
			$.mobile.loading( "hide" );
		}else{
			$("#mylist").html(' <img src="'+base+'/default/style/images/mobile/approveblank.png" />');
			$.mobile.loading( "hide" );
		}
	},'json');
	loadCountData();
}*/
//显示加载器  
function showLoader() { 
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b'       //加载器主题样式a-e  
        //textonly: false,   //是否只显示文字  
        //html: ""           //要显示的html内容，如图片等  
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
	var para = {};
	para.currentPage = thePage;
	var rankey = $("#rankey").val();
	var sortkey = $("#sortkey").val();
	para.rankey = rankey?(rankey+" "+sortkey):"";
	var currtype = $("#type").val();
	para.type = currtype;
	para.personId = currentId;
	para.pageSize = 10;
	$.post(base+'/weixinapi/mobileinterflow/mobileschedule/listData_Count',para,function(res){
		$("#totalPage").val(res.totalpage);
		if(null != res.listData){
			var showList=res.listData;
			//var div="";
			var div="";
			if(showList.length>0){
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var impor;
				if(obj.pressLevel==2 && obj.importLevel==2){
				impor="<b class='redbox mr5'>紧急重要</b>"
				}else if(obj.pressLevel==2 && obj.importLevel==1){
				impor="<b class='orangebox mr5'>急而不重</b>"
				}else if(obj.pressLevel==1 && obj.importLevel==2){
						impor="<b class='zsbox mr5'>重而不急</b>"
				}if(obj.pressLevel==1 && obj.importLevel==1){
					impor="<b class='bluebox mr5'>不急不重</b>"
				}else if(obj.pressLevel==0 && obj.importLevel==0){
					impor="<b class='orangebox mr5'>搁浅</b>"
				}
				div+="<div class='ric'  id='bg_"+obj.id+"'><div class='ricin'>";
				div+=" <div class='ricin-list'>"+impor+"<b style='line-height:22px;'>"+obj.name+"</b></div>";
				div+="<div class='ricin-list' style='font-size:14px;' id='"+obj.id+"_short'>"+obj.preview		
				if(obj.description.length>100){
				div+="<a style='color:#3674b2;' href='#' onclick=toFull('"+obj.id+"')>(查看全文)</a>"}
				div+="</div>";	
				div+="<div class='ricin-list' style='font-size:14px;display:none' id='"+obj.id+"_full'" 
				if(obj.description.length>100){
				div+="style='display:none'";}
				div+=">"+obj.description;
				if(obj.description.length>100){
				div+="<a style='color:#3674b2;' href='#' onclick=toShort('"+obj.id+"')>(收起)</a>";}
				div+="</div>";
				//div+="<div class='zd-list pb5' id='"+obj.id+"_short'>"+preview+"<a style='color:#3674b2;' href='#' onclick=toFull('"+obj.id+"')>(查看全文)</a></div>"
			    //div+="<div class='zd-list pb5' id='"+obj.id+"_full' style='display:none'>"+obj.content+"<a style='color:#3674b2;' href='#' onclick=toShort('"+obj.id+"')>(收起)</a></div>"
				div+="<div class='ricin-list'>";
				div+="<b class='fl color999' style='font-size:14px;'>"+obj.scheDate+"&nbsp; &nbsp;<a class='color999' href='#'typeKey='toDialog' key='"+obj.id+"'onclick=toDelete('"+obj.id+"')  >删除</a></b>";
				//div+="<b class='fl color999' style='font-size:14px;'><a class='color999' href='#'typeKey='toDialog' onclick=toEdit('"+obj.id+"')  >|修改</a></b>";
				div+="<b class='fr'>";
				//div+="<a class='bl-btn' href='#'>办理</a>"
				div+="<a  href='javaScript:void(0)'key='box' class='bl-btn'  onclick=showToDo('"+obj.id+"')>办理</a>"
				div+="<div class='bl-box' key='box' id='toDo_"+obj.id+"' style='display:none'>";
				div+="<a class='bl-box01' href='javaScript:void(0)' onclick=toDo('"+obj.id+"','DOING')>现在做</a>";
				div+="<a class='bl-box01' href='javaScript:void(0)' onclick=toDo('"+obj.id+"','WILLDO')>等等做</a>";
				div+="<a class='bl-box01' href='javaScript:void(0)' onclick=toDo('"+obj.id+"','DONE')>完成啦</a>";
				div+="<a class='bl-box01' style='margin-right:0px;' href='javaScript:void(0)'onclick=toDo('"+obj.id+"','LATEDO')>再说吧</a>";
				div+="</div>";
				div+="</b>";
				div+="</div>";
				div+="</div>";
				div+="</div>"
			}
			}else{
				div   +=' <div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
				div   +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
				div   +='</div>'
			}
			if(str == '0'){//初始化
				$("#mylist").html("");
			}
			$("#mylist").append(div);
		}else{
			$("#mylist").html("");
			var html="";
			html +=' <div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html  +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#mylist").append(html);
			$.mobile.loading( "hide" );
		}
		$.mobile.loading( "hide" );
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		$.each(res.listCount,function(i,item){
			$("#"+item.type+"_Count").html(item.count);
		});
	},'json');
	//loadCountData();
}

function ltrim(str){ //删除空格
    str=str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    //str=str.replace(/(^\s*)|(\s*$)/g,"");//去除两头空格
    str=str.replace(/&nbsp;/g,"");
    str=str.replace(/\s+/g,"");//去除所有空格
   return str;
}
function toFull(id){
toFullId=id;
$("#"+id+"_full").show();
$("#"+id+"_short").hide();
}
function toShort(id){
	$("#"+id+"_full").hide();
	$("#"+id+"_short").show();
}


function showToDo(id){
	tempId=id;
	if($("#toDo_"+id).css("display")=="none")
    {
		$('div[key="box"]').hide();
		$("#toDo_"+id).show();
     }else
    {
	   $("#toDo_"+id).hide();
    }
}
function toEdit(id){
	window.location.href = base+"/weixinapi/mobileinterflow/mobileschedule/edit?id="+id;
}


function toDo(id,type){
	$.post(base+"/weixinapi/mobileinterflow/mobileschedule/updateStatus",{id:id,type:type},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				commonTipShow(res.MSG);
				searchData('0');
				/*setTimeout(function(){
					window.location.href = base+"/mobileinterflow/mobileschedule/list";
				},2000);*/
			}else{
				commonTipShow("操作成功！");
			}
		}else{
			commonTipShow(res.MSG);
		}
	},'json');	
}

function toDelete(id){
	 if(id!='go'){//弹出确认信息
		 $("#toDoId").val(id);
		 //$( "#popupDialog" ).popup( "open" );
		 commonCfmShow("确定删除么?",'toDelete("go")');
	 }else{
		 $.post(base+'/weixinapi/mobileinterflow/mobileschedule/delete',{id:$("#toDoId").val()},function(res){
			 if(res.STATE == 'SUCCESS'){
				 commonTipShow(res.MSG);
					searchData('0');
					/*setTimeout(function(){
						window.location.href = base+"/mobileinterflow/mobileschedule/list";
					},2000);*/
				}else{
					commonTipShow(res.MSG);
				}
		 },'json');
	 }
}


function loadCountData(){
	$.post(base+"/weixinapi/mobileinterflow/mobileschedule/getCountData",{personId:currentId},function(data){
		$.each(data,function(i,item){
			$("#"+item.type+"_Count").html(item.count);
		});
	},'json');
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide");
	/*$("#msgStr").text(txt);
	$.mobile.changePage( "#systemMsg", { role: "dialog" } );*/
	commonMsgShow(txt);
}

function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}