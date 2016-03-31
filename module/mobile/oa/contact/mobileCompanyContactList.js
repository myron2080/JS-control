$(document).on("click", "#moreBtn,#searchBtn", function() {
	showLoader();
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
});

function queryData(){
	searchData('0');
}

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
		sortNumber=0;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 20;
	para.keyWord =$("#keyword").val();
	$.post(base+'/mobileOa/mobileAddressBook/listPagData',para,function(res){
		var indnumber = 0;
		if(str == '0'){
			indnumber = 0;
		}else{
			indnumber = sortNumber;
		}
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
				var personList = obj.personList;
				if(personList.length>0){
				
				div+="<div class='colorblue title' '>"+obj.ORG_NAME+"</div>"			     
				for(var j=0;j<personList.length;j++){
				var p=personList[j];
				var positionName = p.positionName;
				div+="<div class='communication' onclick=detailView('"+personList[j].id+"') id='bg_"+personList[j].id+"'>"			     				 
				div+="	 <div class='cktop'>"
				div+="		   <div class='cktop-c'>"
				var shortNumber = personList[j].shortNumber;
				if(positionName){
					div+="<div class='cktop-cin01' >"+personList[j].name+"("+positionName+")</div>"
				}else{
					div+="<div class='cktop-cin01' >"+personList[j].name+"</div>"
				}
				div+="		   </div>"
				if(p.sex=='MAN'){
					div+='<div class="cktop-l"><img src="'+base+'/default/style/images/mobile/man.jpg"></img></div>';
				}else{
					div+='<div class="cktop-l"><img src="'+base+'/default/style/images/mobile/women.jpg"></img></div>';
				}
//				div+='<img src="'+base+'/default/style/images/mobile/women.jpg"></img>';
//				div+="		   <div class='cktop-l'><div class='cktop-lin icon-svg font28 colorblue'></div></div>"
					
				div+="	 </div>"
				div+="	</div>"
				}
				
			}}
			if(str == '0'){//初始化
				$("#listData").html("");
			}
			$("#listData").append(div);
			$.mobile.loading( "hide" );
		}else{
			$("#listData").html("");
			var html="";
			html+=' <div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html+='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html+='</div>'
			$("#listData").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}
function detailView(id){
	window.location.href=base+"/mobileOa/mobileAddressBook/showDetailView?personId="+id;
}