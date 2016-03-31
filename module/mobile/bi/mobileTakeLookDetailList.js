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
	  $.mobile.selectmenu.prototype.options.nativeMenu = false;
}).ready(function(){
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	searchData('0');
});

function searchData(str){
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
	para.pageSize = 10;
	para.flag = flag;
	para.dataId = dataId;
	para.startDay = startDay;
	para.endDay = endDay;
	para.startMonth = startMonth;
	para.endMonth = endMonth;
	para.weekDate = weekDate;
	para.queryType = queryType;
	showLoader();
	$.post(base+'/mobile/bi/fastsalereport/searchTakeLookDetailData',para,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			if(str == '0'){//初始化
				$("#takeDetailList").html("");
			}
			for(var i=0;i<showList.length;i++){												
				var photo = showList[i].personPhoto==null || showList[i].personPhoto==''?"default/style/images/mobile/man.jpg":"images/"+showList[i].personPhoto;
				$('<dl>'+
			    	'<dt>'+
			    		'<img width="48" height="48" alt="" enlarger="'+getPath()+'/'+ photo+'"  src="'+getPath()+'/'+photo+'" />'+
			    	'</dt>'+
					'<dd>'+
						'<div class="page"><h3>'+showList[i].orgName+'--'+showList[i].personName+'</h3>'+
							'<ul class="Houseshow"><li>'+showList[i].projectName+'</li><li>带客量：'+showList[i].guestNumber.toFixed(2)+'</li><li>客户：'+showList[i].customerName+'</li><li class="HouseDate">'+showList[i].arriveTime+'到场</li></ul>'+        
						'</div>'+    		
					'</dd>'+
				'</dl>').appendTo('#takeDetailList');
			}
		}else{
			$("#takeDetailList").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#takeDetailList").append(html);
		}
		$.mobile.loading( "hide" );
	},'json');
}
