$(document).on("click", "#moreBtn,#searchBtn", function() {
/*	  var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "加载中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html
	  });*/
}).on("mobileinit", function() {
	 // $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	$("#addCustomer").bind("click",function(){
		window.location.href = base+"/mobilefastsale/mobileCustomer/addCustomer";
	});
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	searchData('0');
});

function typeTdClick(obj,str){	
	var now = $("td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
	
	$("#orderType").val(str);	
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
	var orderType=$("#orderType").val();
	var key=$("#key").val();
	$.post(base+'/mobilefastsale/mobileCustomer/listPagData',{orderType:orderType,key:key,currentPage:thePage,mobileSort:"yes",type:"PRIVATE"},function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		if(null != res.items  && res.items.length!=0){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				
				 var colorClass='a-ico fl';
				  if(obj.publicLevel == 'B'){
				   colorClass='b-ico fl';
		          }else if(obj.publicLevel == 'C'){
		           colorClass='c-ico fl'; }
				
				var intentionDescription="无"
				if(obj.intentionDescription!=""){
				intentionDescription = obj.intentionDescription;
				}
				if(obj.facility!="其它意向" && obj.facility!=""){//其他意向不为空
					intentionDescription += " 其他意向:"+obj.facility;	
				}
				  
				
				var belongdesc = "";
				if(obj.cooperationType == 'COLLABORATE'){
					belongdesc+="<span style='margin-left:10px;color:red;'>合作";
					if(obj.layouts!=null&&obj.layouts!=''){
						if(obj.layouts.indexOf("%") == -1){
							obj.layouts+="%";
						}
						belongdesc+=obj.layouts+"</span>";
					}
				}else if(obj.cooperationType =='REFERRAL'){
					belongdesc+="<span style='margin-left:10px;color:green;'>【转介】";
					if(obj.layouts!=null&&obj.layouts!=''){
						if(obj.layouts.indexOf("%") == -1){
							obj.layouts+="%";
						}
						belongdesc+=obj.layouts+"</span>";
					}
				}
					
				div +=('<div class="yilan-list" onclick=showDetail("'+obj.id+'") objid="'+obj.id+'"  id="bg_'+obj.id+'">'+
				          '<p class="fl" style="width:100%;line-height:21px;">'+
				             '<span class="fl">'+
				                 '<b class="'+colorClass+'">'+obj.publicLevel+'</b>'+
				                 '<em class="font16 bold fl" style="line-height:21px;">'+obj.contactPersonName+'</em>'+
				                
				             '</span>'+belongdesc+
				             '<span class="fr color666">'+(obj.intentionType == 'BUY'?"求售":"求租")+'</span>'+
				          '</p>'+
				          '<p class="fl font14" style="width:100%;padding:2px 0 4px 0;">'+
				            '<b class="bold color666">描述：</b> <em class="color666">'+intentionDescription+'</em>'+
				          '</p>'+
				          '<p class="fl" style="width:100%;">'+
				            '<em class="color999">'+obj.followDate+'</em>'+
				            '<em class="fr color999">'+obj.name+'  '+obj.onFollowDay+'天未跟进  '+'</em>'+
				          '</p>'+
				     '</div>');
				
				
				
				
//				div+="<h3>"+obj.contactPersonName;
//				if(obj.intentionType == 'BUY'){//买
//					div+="(<span class='font04'>买</span>";
//				}else{//租
//					div+="(<span class='font05'>租</span>";
//				}
//				div+=obj.publicLevel+"级 )";
//				if(obj.cooperationType == 'COLLABORATE'){
//					div+="<span class='orangeico'>合作</span> "+obj.layouts+"%</h3><p>";
//				}else if(obj.cooperationType == 'REFERRAL'){
//					div+="<span class='greenico'>转介</span></h3><p>";
//				}else{
//					div+="</h3><p>";
//				}
//				if(obj.facility!="其它意向" && obj.facility!=""){//其他意向不为空
//					div+="意向:"+obj.intentionDescription+" 其他意向:"+obj.facility;
//				}else{
//					div+="意向:"+obj.intentionDescription;
//				}
//				div+="</p>";
//				div+="<p>"+obj.onFollowDay+"天未跟进&nbsp;&nbsp;"+obj.need+"</p>";
//				div+="</a></li>";
			}
			$("#mylist").append(div);
			//$('ul').listview('refresh');
			$.mobile.loading( "hide" );
		}else{
			$("#mylist").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#mylist").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}

function showDetail(id){
	/*$("[id^='bg_']").removeClass(" hover-bg");
	 $("#bg_"+id).addClass(" hover-bg");
	 $("#iframeId").remove();
	 $.mobile.changePage( "#showDetail", { role: "page" } );
	 $('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
	 setTimeout(function(){
			$("#iframeId").attr("src",base+"/mobilefastsale/mobileCustomer/customerView?id="+id);
	 },500);
	$("#iframeId").bind('load', function() {
		$.mobile.loading( "hide" );
		 //window.location.href = "#showDetail";
		
	});*/
	
	
//	$("#loading").show();
//	 $("#iframeId").remove();
//	 $.mobile.changePage( "#showDetail", { role: "page" } );
//	 $('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
//	 setTimeout(function(){
//	$("#iframeId").attr("src",base+"/mobilefastsale/mobileCustomer/customerView?id="+id);
//	 },500);
//	$("#iframeId").bind('load', function() {
//		$("#loading").hide();
//	});
	
	window.location.href=base+"/mobilefastsale/mobileCustomer/customerView?id="+id;
	
}


function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}