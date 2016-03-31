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
}).ready(function(){
	 var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $("#add").bind("click",function(){
		  window.location.href = base+"/mobile/roomlisting/roomEditView";
	  });
	 searchData('0');
});

function queryData(){
	searchData('0');
}

var sortNumber=0;
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
	para.pageSize = 50;

	para.queryType = $("#qeuryType").val();
	para.intelligentInput = $("#keyword").val();
	
	para.priceType = $("#priceType").val();
	if(para.priceType){
		para.priceStartValue =  $("#priceType").attr("priceStartValue");
		para.priceEndValue =  $("#priceType").attr("priceEndValue");
	}
	para.areaids = $("#areaids").val();
	para.propertyType = $("#propertyType").val();
	
	
	$.post(base+'/mobileAllRoom/listPagData',para,function(res){
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
			var div='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var msg="";
				if(obj.relateId==null || obj.relateId==''){
					msg="(新增盘)"
				}else{
					msg="(收藏盘)"
				}
				var listingType ="";
				var receiveDate =""
				var listingtypecss = "";
				if(obj.listingType=="SALE"){
					listingType ="售";	
					listingtypecss="pan-red";
					receiveDate = obj.saleReceiveDate?obj.saleReceiveDate:obj.createTime;
				}else if(obj.listingType=="RENT"){
					listingType ="租";
					listingtypecss="pan-green";
					receiveDate = obj.rentReceiveDate?obj.rentReceiveDate:obj.createTime;
				}else if(obj.listingType=="RENT_SALE"){
					listingType ="租售";	
					listingtypecss="pan-blue";
					receiveDate = obj.saleReceiveDate?obj.saleReceiveDate:obj.createTime;
				}else{
					listingtypecss="pan-gray";
					listingType =obj.listingTypeDesc;	
					receiveDate = obj.saleReceiveDate?obj.saleReceiveDate:obj.createTime;
				}
				var price=0;
				if(obj.price){
					price = parseInt(obj.price/10000);
				}
				div+=' <div class="ric" id="bg_'+obj.id+'" onclick=viewDtail("'+obj.id+'")>';
				div+='   <div class="ricin">';
		               
				div+='      <div class="kanpan-l">';
				div+='          <div class="kanpan-lin">';
				div+='               <p>';
				div+='                    <b class="'+listingtypecss+' fl">'+listingType+'</b>';
				div+='                    <b class="fl ml5 font16">'+obj.gardenname+' '+obj.buildingname+' '+obj.roomNumber+'</b>'+msg;
				if(obj.keyNumber){
				div+='                     <b data-role="none" class="icon-pan02 fl colorred font24"></b>';
				}
				if(obj.photoNum>0){
				
				div+='                     <b data-role="none" class="icon-pan01 fl colorgreen font24"></b>';
				}
				div+='                  </p>';
		        var direction ='';
		        if(obj.direction)
		        direction ='朝'+obj.direction;
				div+='                   <p class="font14">'+obj.bedRoom+'室  '+obj.livingRoom+'厅     '+obj.bathRoom+'卫     '+obj.buildArea+'㎡     '+direction+'</p>';
		        
				if(obj.description!=null && obj.description != ''){
		        	div+='                    <p class="font14 colororange">'+obj.description+'</p>';
		        }                 
		                         
				div+='                    <p class="font12 color999">'+(obj.listingType=="RENT"? obj.rentPersonName : obj.salePersonName)+'　　登记'+receiveDate+'  <span style="float:right;margin-right:-80px;">最后跟进'+obj.lastFollowDate+'</span></p>';
				div+='               </div>';
				div+='           </div>';
				div+='            <div class="kanpan-r colororange font16">';
				
				if(obj.listingType=="SALE"){
				div+='                 <p class="colororange2"><b class="font16">'+price+'</b>万</p>';
				}else if(obj.listingType=="RENT"){
				div+='                <p><b class="font16">'+obj.rent+'</b>元/'+obj.rentPaymentTypeName+'</p>';
				}else if(obj.listingType=="RENT_SALE"){
				div+='                 <p class="colororange2"><b class="font16">'+price+'</b>万</p>';
				div+='                <p><b class="font16">'+obj.rent+'</b>元/'+obj.rentPaymentTypeName+'</p>';
				}
				div+='            </div>';
			    div+='          </div>';
				div+='      </div>';
			}
			if(str == '0'){//初始化
				$("#listData").html("");
			}
			$("#listData").append(div);
			sortNumber = indnumber;
			$.mobile.loading( "hide" );
		}else{
			
			$("#listData").html("");
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#listData").append(html);
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
    searchData('0');
}
function  viewDtail(id){
	  window.location.href = base+"/mobile/roomlisting/roomlistingView?roomListingId="+id+"&queryType="+$("#qeuryType").val();
  /*  showLoader();
	 $("#loading").show();
	 $("#iframeId").remove();  
	 $.mobile.changePage( "#showDetail", { role: "page" } ); 
	 $('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
	 setTimeout(function(){
		 $.mobile.loading( "hide" );
		 $("#iframeId").attr("src", base+"/weixinapi/mobile/fastsalereport/listViewPer?id="+id+"&wechatId="+wechatId+"&from="+from+"&cid="+cid+"&chargePersonId"+chargePersonId+pram);
	 },500);
	$("#iframeId").bind('load', function() { 
	    $(this).height($(window).height());
		$("#loading").hide();
	});*/
	}

function typeTdClick(obj,str){
	
	var now = $("td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
	$("#qeuryType").val(str);
	queryData();
}

function querypage_callback(data){
	var html = '';
	for(var i=0;i<data.length;i++){
		if(data[i].label=='area'){
			$("#areaids").val(data[i].id);
		}else if(data[i].label=='price'){
			$("#priceType").val(data[i].pid);
			var ary = data[i].id.split('-');
			$("#priceType").attr("priceStartValue",ary[0]);
			if(ary.length>1)
				$("#priceType").attr("priceEndValue",ary[1]);
			
		}else if(data[i].label=='purpose'){
			$("#propertyType").val(data[i].id);
		}
		
		html += data[i].display+',';
	}
	$("#conditiondiv").html(html);
	queryData();
}
