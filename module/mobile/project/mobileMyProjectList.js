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
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	searchData('0');
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	});
});
function queryData(){
	searchData('0');
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
	para.keyword = $("#keyword").val();
	//para.part = $("#part").val()=="ALL"?"":$("#part").val();
	$.post(base+'/weixinapi/mobile/myProject/listPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var photo="";
				if(obj.firstPicpath){
					photo=base+"/images/"+obj.firstPicpath.replace('size','75X75');}
				var promoteOne ="暂无推广语！";
				if(obj.promoteOne){
					promoteOne=obj.promoteOne.length>10?(obj.promoteOne.substr(0,10)+'...'):obj.promoteOne;
				}
				var registerName="";
				if(obj.registerName){
					registerName=obj.registerName.length>7?(obj.registerName.substr(0,7)+'...'):obj.registerName;
				}
				var areaStr = "未设置区域<br />";
				if(obj.areaName){
					if(obj.parentAreaName){
					areaStr =obj.parentAreaName+"-"+obj.areaName+"<br />"}else{
					areaStr =obj.areaName+"<br />"	
			     }}
				div+="<div class='yilan-list' onclick=viewNews('"+obj.id+"') id='bg_"+obj.id+"'>"
				div+="<div class='yilan-text'>"
				div+="<div class='yilan-textin'>"
				div+="<p>"
				div+="<span class='fl bold font16'>"+registerName+"</span>"
				div+="<span class='fr'><b class='colorred'>"+obj.avgPrice+"</b>元/㎡</span>"
				div+="</p>"
				div+="<p>"
				div+=areaStr;
				div+=obj.addr
				div+="</p>"
				div+="<p class='colororange'>"+promoteOne+"</p>"
				div+="</div>"
				div+="</div>"
				div+="<div class='yilan-pic'><img src='"+photo+"'/></div>"
				div+="</div>"
			}
			if(str == '0'){//初始化
				$("#projectList").html("");
			}
			$("#projectList").append(div);
			$.mobile.loading( "hide" );
		}else{
			
			$("#projectList").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#projectList").append(html);
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
	showLoader();
	/*$("#iframeId").attr("src", base+"/weixinapi/mobile/myProject/projectView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid);
	setTimeout(function(){
		$.mobile.loading( "hide" );
		 window.location.href = "#showDetail";
		},500);*/
	setTimeout(function(){
		$.mobile.loading( "hide" ); 
	 window.location.href = base+"/weixinapi/mobile/myProject/projectView?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid; 
	},500);
	}