$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 searchData('0');
});

function backListPage(){
	 $.mobile.changePage( "#listPage", { role: "page" } );
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

function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
		sortNumber=0;
		$("#mylist").html('');
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var param = {};
	//setDateParam(param);
	param.currentPage = thePage;
	param.pageSize = 10;
	$("#currentPage").val(thePage);
	var keyWord=$("#keyWord").val();
	var status = $(".selected").attr("key");
	param.mobileQueryKeyWord = keyWord;
	$.post(base+'/mobile/insideshowup/listPagData',param,function(res){
		alert(res.recordCount);
		$("#totalPage").val(res.pageCount);
		$("#totalCount").html(res.recordCount);
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
				var reg = /(\d{3})\d{4}(\d{4})/;
				var customerPhone = obj.intentionCustomer.customerPhone.replace(reg,"$1****$2");
				/*div +=('<div class="yilan-list" objid="'+obj.id+'"  id="bg_'+obj.id+'">'+
		          '<p class="fl" style="width:100%;line-height:21px;">'+
		             '<span class="fl">'+
		                // '<b class="'+colorClass+'">'+obj.customerLevelValue+'</b>'+
		                 '<em class="font14 bold fl" style="line-height:28px;">'+obj.intentionCustomer.customerName+'</em>'+
		                 '<em class="font14 fl ml5" style="line-height:28px;">'+customerPhone+'</em>'+
		             '</span>'+
		             '<span class="fr color999">  <a class="lightblue-btn mr5 fl"  href="javascript:void(0);" id="'+obj.id+'" key="'+obj.id+'" key1="'+obj.intentionCustomer.id+'" key2="'+obj.intentionCustomer.customerName+'" onclick="turnPage(\''+obj.id+'\');">到场</a>     <a class="lightgreen-btn fr"  href="javascript:void(0);" onclick="toNotShowUp(\''+obj.id+'\')">未到场</a></span>'+
		          '</p>'+
		          '<p class="fl mt10" style="width:100%;">'+
		            '<b class="bold font14">归属人：</b> <em class="color999  font14">'+(obj.intentionCustomer.org==null?"缺失信息":obj.intentionCustomer.org.name)+' '+(obj.intentionCustomer.person==null?"缺失信息":obj.intentionCustomer.person.name)+'</em>'+
		          '</p>'+
		     '</div>');*/
				div +='<div class="yilan-list" objid="'+obj.id+'"  id="bg_'+obj.id+'"';
				if(obj.intentionCustomer.status == 'HAVEBEENTO'||obj.intentionCustomer.status == 'NOBEENTO'){
					div +=        ' onclick=showDetail("'+obj.intentionCustomer.id+'") ';
					}
				div +=         '>';
				div +=         '<p class="fl" style="width:100%;line-height:21px;">';
				div +=             '<span class="fl">';
				                // '<b class="'+colorClass+'">'+obj.customerLevelValue+'</b>'+
				div +=                 '<em class="font14 bold fl" style="line-height:28px;">'+obj.intentionCustomer.customerName+'</em>';
				div +=                 '<em class="font14 fl ml5" style="line-height:28px;">'+customerPhone+'</em>';
				div +=             '</span>';
				if(obj.intentionCustomer.status != 'HAVEBEENTO'&&obj.intentionCustomer.status != 'NOBEENTO'){
				div +=             '<span class="fr color999">  ';
				div +=             '<a class="lightblue-btn mr5 fl"  href="javascript:void(0);" id="'+obj.id+'" key="'+obj.id+'" key1="'+obj.intentionCustomer.id+'" key2="'+obj.intentionCustomer.customerName+'" onclick="turnPage(\''+obj.id+'\');">到场</a>';
				div +=             '<a class="gray-btn fr"  href="javascript:void(0);" onclick="toNotShowUp(\''+obj.id+'\')">未到场</a>';
				div +=             '</span>';}
				div +=	          '</p>'
				div +=	          '<p class="fl mt10" style="width:100%;">';
				
				div +=	            '<b class="bold font14">归属人：</b> <em class="color999  font14">'+(obj.intentionCustomer.org==null?"缺失信息":obj.intentionCustomer.org.name)+' '+(obj.intentionCustomer.person==null?"缺失信息":obj.intentionCustomer.person.name)+'</em>';
				div +=	          '</p>';
				div +=     '</div>';
			}
			
			if(str == '0'){//初始化
				$("#listData").html("");
			}
			$("#listData").append(div);
			$.mobile.loading( "hide" );
		}else{
			
			$("#listData").html("");
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#listData").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}
function showDetail(id){
	window.location.href=base+"/mobilefastsale/intention/view?id="+id;
	
}
function shouwUp(id){
	var obj =$("#"+id);
	//$("#belonPerson").html(obj.attr("key2"));
	$("#customerBeSpeakId").val(obj.attr("key"));
	$("#customerId").val(obj.attr("key1"));
	$("#showUpDiv" ).popup( "open" );
}
function saveArrive(){ 	
	setPerson();
	$.post($('#arriveForm').attr('action'),$('#arriveForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			$("#arriveOpDiv" ).popup( "close" );
			//initBeSpeakData();
			$("#arriveForm")[0].reset();
		}else{
			//错误信息
			//msgDialog(res.MSG);
		}
    },'json');
}

function toNotShowUp(id){
	$("#toDoId").val(id);
	$( "#notBeenToDiv" ).popup( "open" );	
	//commonCfmShow("确定该操作么?",'notShowUp()');
}
function clearTitle(){
	$("#lableTitle").html("");
	$("#notBeentoRemark").html("");
}	 
function notShowUp(){
	var sendType = "DEAL";
	var param ={};
	param.id=$("#toDoId").val();
	param.sendType=sendType;
	var notBeentoRemark = $("#notBeentoRemark").val();
	if(notBeentoRemark==''||notBeentoRemark == null){
	$("#lableTitle").html("请输入原因！");
	}else{
	param.notBeentoRemark = notBeentoRemark;
    $.post(base+'/mobile/customershowup/updateCustomerBeSpeak',param,function(res){
			 if(res.STATE == 'SUCCESS'){
				 $( "#notBeenToDiv" ).popup( "close" );	
					searchData('0');
				}else{
				}
		 },'json');}
	}
function turnPage(id){
	window.location.href=base+'/mobile/customershowup/customerShowUpEdit?id='+id+'&houseProjectId='+$("#houseProject").val();
}