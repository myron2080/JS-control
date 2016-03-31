$(document).on("click", "#moreBtn", function() {
	  var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "加载中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html
	  }); 
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
	//getBaseData("gglm");
	searchData('0');
	/*$("[id^='bg_']").live('touchstart', function(){ 
		 $("[id^='bg_']").removeClass(" hover-bg");
		 $(this).addClass(" hover-bg");
		// $(this).addClass(" zd-gray");
		});  
	$("[id^='bg_']").live('touchend', function(){  
		 $(this).removeClass("zd-gray");
		});*/

});

//test
//}).on("click","[id^='bg_']", function() {
function iClick(obj){
	 var id=$(obj).attr("id");
	 viewNews(id.substring(id.indexOf("_")+1));
}
	

//

function getBaseData(typeNumber){
	var clary = new Array();
	$.post(getPath()+"/basedata/basic/basicSupply/listAllData",{enableflag:'1',typenumber:typeNumber},function(data){
		for(var i=0;i<data.length;i++){
			clary.push(data[i]);
		}
		genehtml(clary);
	},'json');
}
function genehtml(a){
	var html ="<option value='ALL'>请选择栏目</option>";
	for(var i=0;i<a.length;i++){
		html +="<option value='"+a[i].id+"'>"+a[i].name+"</option>";
	}
	$("#partsel").html("");
	$("#partsel").html(html);
}
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
	para.personId = currentId;
	para.pageSize = 10;
	para.orgId = orgId;
	para.searchName = $("#keyWord").val();
	para.part = $("#part").val()=="ALL"?"":$("#part").val();
	$.post(base+'/weixinapi/mobile/newscenter/listPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	$("#moreDiv").hide();
		    	initScroll();
		    }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				 var photo="";
				if(obj.firstPhoto){
					photo=base+"/images/"+obj.firstPhoto.replace('size','100X75');}
				var content="暂无详细内容！";
				if(obj.content){
					//content=ltrim(obj.content);
					content=obj.content;
					}
				div+="<div class='news-list' onclick=iClick(this) id='bg_"+obj.id+"'>"
				div+="<h1>"+obj.title+"</h1>"
				div+="<div class='news-listin'><div class='news-listin01'>"
				if(photo!=""){
				div+="<div class='news-list01'><img src='"+photo+"'/></div>"}
				div+="<div class='news-list02'>"
				if(photo!=""){
				div+="<div class='news-list03'>"}else{
					div+="<div class='news-list04'>"
				}
				div+="<div class='news-list03a'>"+content+"</div>"
				//div+="<div class='news-list03a'>"+(content.length>100?(content.substr(0,44)+'...'):content)+"</div>"
				div+="<div class='news-list03b' style='color:#999;'>"+obj.createDate+" <a href='#' >回复("+obj.replyCount+")</div>"
				div+="</div></div>"
				
			    div+="</div>"
				div+="</div>"
				div+="</div>"
			}
			if(str == '0'){//初始化
				$("#newsList").html("");
			}
			$("#newsList").append(div);
			$.mobile.loading( "hide" );
		}else{
			
			$("#newsList").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#newsList").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}

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

function changeEvent(){
	$("#mylist").html('');
	$("#currentPage").val("1");
	$("#part").val($("#partsel").val());
    searchData('0');
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

function viewNews(id){
	window.location.href=base+"/weixinapi/mobile/newscenter/newsView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid;
//	$("#loading").show();
//	 $("#iframeId").remove();
//	 $.mobile.changePage( "#showDetail", { role: "page" } );
//	 $('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
//	 setTimeout(function(){
//	$("#iframeId").attr("src",base+"/weixinapi/mobile/newscenter/newsView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid);
//	 },500);
//	$("#iframeId").bind('load', function() {
//		$("#loading").hide();
//		 //window.location.href = "#showDetail";
//		
//	});
	/*setTimeout(function(){
	 window.location.href = base+"/weixinapi/mobile/newscenter/newsView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid;
	},500);*/
	// $("#popupMap").popup( "open" );showDetail
	// $("#showDetail").popup( "open" );
	}