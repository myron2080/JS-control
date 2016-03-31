$(document).ready(function(){
	searchData('0');
});
function nextDay(type){
	var nowDate=$("#nowDate").text();
	$.post(base+'/mobilefastsale/performance/getDate',{nowDate:nowDate,type:type},function(json){
		if(null != json.result){
			$("#nowDate").text(json.result);
			$("#dataDiv").html('');
			searchData('0');
		}
	},'json');
	
}
function changeEvent(){
	$("#dataDiv").html('');
	$("#currentPage").val("1");
	searchData('0');
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
	$("#typeTable").toggle();
}
function typeTdClick(obj,str){
	$("#showType").text($(obj).text());
	$("#orderType").val(str);
	$("#typeTable").toggle();
	changeEvent();
}

/**
 * 选择显示数据类型
 */
function chooseLevel(){
	$("#levelTable").toggle();
}
function tdClick(obj,str){
	$("#showLevel").text($(obj).text());
	$("#dataLevel").val(str);
	$("#levelTable").toggle();
	changeEvent();
}

function searchData(str){
	//loading('show');
	showLoader()
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var nowDate=$("#nowDate").text();
	var orderType=$("#orderType").val();
	
	var dataLevel=$("#dataLevel").val();
	
	var key=$("#key").val();
	$.post(base+'/mobilefastsale/performance/listData',{nowDate:nowDate,orderType:orderType,dataLevel:dataLevel,key:key,currentPage:thePage},function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreBtn").hide();
		    }else{
		    	//$("#moreBtn").show();
		    	initScroll();
		    }
		if(null != res.items){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				div+="<div class='databoxin'><a href='javascript:void(0)' onclick='popup(\""+base+"/mobilefastsale/performance/detail?dataLevel="+dataLevel+"&personId="+obj.PERSON_ID+"&orgId="+obj.ORG_ID+"&nowDate="+nowDate+"&orderType="+orderType+"\")'><dl>";
				if(i == 0 && thePage == 1){
					if(thePage != 1){
						div+="<dt><b class='font03'>"+(i+1+(thePage-1)*30)+"</b></dt>";
					}else{
						div+="<dt><b class='font03'>"+(i+1)+"</b></dt>";
					}
				}else if(i == 1 && thePage == 1){
					if(thePage != 1){
						div+="<dt><b class='font04'>"+(i+1+(thePage-1)*30)+"</b></dt>";
					}else{
						div+="<dt><b class='font04'>"+(i+1)+"</b></dt>";
					}
				}else if(i == 2 && thePage == 1){
					if(thePage != 1){
						div+="<dt><b class='font05'>"+(i+1+(thePage-1)*30)+"</b></dt>";
					}else{
						div+="<dt><b class='font05'>"+(i+1)+"</b></dt>";
					}
				}else{
					if(thePage != 1){
						div+="<dt><b>"+(i+1+(thePage-1)*30)+"</b></dt>";
					}else{
						div+="<dt><b>"+(i+1)+"</b></dt>";
					}
				}
				div+="<dd>";
				if(dataLevel == 'org'){//组织
					div+="<p class='font01'>"+obj.ORG_NAME+"</p>";
				}else{//人员
					div+="<p class='font01'>"+obj.PERSON_NAME+"("+obj.ORG_NAME+")</p>";
				}
				div+="<p class='font02'>预约:"+obj.ONE_ONE+" &nbsp;&nbsp;意向:"+obj.ONE_TWO+"&nbsp;&nbsp;跟进:"+obj.ONE_THREE+"</p>";
				div+="</dd>";
				div+="<div class='arrow02'></div></dl></a></div>";
			}
			
			$("#dataDiv").append(div);
			/**
			 * 手机触摸事件
			 */
			var myLinks = document.getElementsByTagName('dl');
			for(var i = 0; i < myLinks.length; i++){
			myLinks[i].addEventListener('touchstart', function(){this.className = "hoverClass";}, false);
			myLinks[i].addEventListener('touchend', function(){this.className = "";}, false);
			}
			$.mobile.loading( "hide" );
			//loading('close');
		}
	},'json');
}

function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}