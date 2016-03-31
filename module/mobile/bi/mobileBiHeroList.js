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
	 //$.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){	
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $('h1 a').bind("click",function(){
		 $(this).hasClass("icon-svg7");
		 var oType='down';
		 if($(this).hasClass("icon-svg7")){
			 oType='up'; 
		 }
		 changeMonth(oType);
		 });	
	 $("#share").bind("click",function(){
		  if (typeof window.shareUtil == 'undefined') {
			  commonTipShow("分享功能仅限于鼎尖浏览器使用！",1000);
		      return false;
		    } else {
			shareTo();}
		});
	 if(share!=null&&share!=''){
		 var obj = $("#"+$("#queryModelId").val());
		 $(obj).addClass("selected").siblings("td").removeClass("selected");
		 var sortType = $("#sortType").val();
		 if(sortType=="DESC"){
			 $(obj).attr("sort","DESC");
			 var html=$(obj).html();
			 $(obj).html(html.substring(0,html.length-1)+"↓"); 
		 }else{
			 $(obj).attr("sort","ASC");
			 var html=$(obj).html();
			 $(obj).html(html.substring(0,html.length-1)+"↑"); 
		 }
	 }
		$("#orderTypeTable tr td").bind("click",function(){
			if($(this).hasClass("selected")){
				if($(this).attr("sort")=="DESC"){
				$(this).attr("sort","ASC");
				var html=$(this).html();
				$(this).html(html.substring(0,html.length-1)+"↑");
				}else{
				$(this).attr("sort","DESC");
				var html=$(this).html();
				$(this).html(html.substring(0,html.length-1)+"↓");
				}
			}else{
			$(this).addClass("selected").siblings("td").removeClass("selected");}
			$("#orderType").val($(this).attr("key"));
			$("#sortType").val($(this).attr("sort"));
			$("#queryModelId").val($(this).attr("id"))
			searchData('0');
		 });
		searchData('0');
});
function shareTo(){
	var title="英雄榜";
	var content;
	content=$("#queryMonth").val()+"英雄榜";	
	var pram="&currentMonth="+$("#queryMonth").val()+"&orgId="+$("#orgId").val()+"&orgName="+$("#orgName").html()
	+"&orderType="+$("#orderType").val()+"&sortType="+$("#sortType").val()+"&queryModelId="+$("#queryModelId").val()
	+"&orgDesc="+$("#orgDesc").val()+"&orgDescName="+$("#orgDesc option:selected").text();
    var url_=window.location.href;
	var url=url_.replace(/heroList/, "heroList4Share")+"?dataCenter="+currdataCenter+"&share=share"+pram;
	 window.shareUtil.baiduShare(title,content,url,getPath()+"/default/style/images/mobile/sharexfkb.jpg");
}
function queryData(){
	searchData('0');
}
function checkDate(startTime){  
	   var aStart=startTime.split('-'); //转成成数组，分别为年，月，日，下同  
	   var startDate = aStart[0]+"/" + aStart[1]+ "/" + aStart[2];  
	   var d=new Date();
	   var endTime=d.format('yyyy-MM-dd');
	   var aEnd=endTime.split('-');  
	   var endDate = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];  
	   if (startDate > endDate) {  
		   commonTipShow("无法查询还未到的日期哦！",1000);
	    return false;  
	   }  
	    return true;  
	  }  
function initScroll(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　searchData('1');
		　　}
	});
}
var sortNumber=0;
function searchData(str){
	showLoader();
	//$.mobile.loading( "hide" );
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
	para.pageSize = 10;
	
	para.orderType=$("#orderType").val();
	para.sortType=$("#sortType").val();
	para.orgId=$("#orgId").val();
	para.queryMonth = $("#queryMonth").val();
	para.queryModelId =$("#queryModelId").val();
	para.orgLevelDesc =$("#orgDesc").val()=="selectArea"?"":$("#orgDesc").val();
	$.post(base+'/weixinapi/mobile/bihero/listPagData',para,function(res){
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
				// 判别等级
				var level = judgeLevel(obj.totalFight);
				indnumber++;
				var name="未定义";
				var orgName="未定义";
				if(obj.T_NAME)
				name=obj.T_NAME;
				if(obj.T_ORGNAME)
			    orgName=obj.T_ORGNAME;
				div+=" <div class='yilantwo-white'>"
	              
				div+=" <div class='growinglist pt5' style='line-height:21px;'>"
				div+="    <span class='fl font14'>"
				div+="         <b class='a-ico bold font16 fl'>"+indnumber+"</b>"
				div+="        <b class='color333 bold fl'><em class='font18'>"+name+"—"+orgName+"</em> <em class='colororange'> 综合战斗力:"+obj.totalFight+"</em></b>"
				div+="   </span>"
				div+="   <b class='fr font14 bold colorred'>"+level+"</b>"
				div+="  </div>"
	            var data=obj.data;
	            for(var j=0;j<data.length;j++) { 
	            var coloerBg ="bluebg";
	            if(j==1){
	            	coloerBg ="greenbg";
	            }else if(j==2){
	            	coloerBg ="orangebg";
	            }
				div+="<div class='growingjq mb10'>"
				div+="  <div class='growingjq-title "+coloerBg+"'>"
				div+="  <span class='fl'>"
				div+="        <b class='bold font20 fl'>"+data[j].modelName+"</b>"
				div+="         <b class='bold font14 fl ml10'>权重:"+(data[j].modelWeight*100)+"%</b>"
				div+="    </span>"
				div+="    <b class='fr font14 bold'>战斗力:"+data[j].modelFight+"</b>"
				div+="</div>"
				div+=" <div class='growingjq-body lightbluebg'>"
				div+=" <ul>"
				var weidudata =data[j].modelWeidu;
				for(var n=0;n<weidudata.length;n++){
					div+="<li>"+weidudata[n].weiduName+"<br> <b class='font20 bold'>"+weidudata[n].weiduValue+"</b></li>"
				}
				div+="  </ul>"
			    div+="</div>"
				div+="  </div>"
	            }
				div+=" </div>"
			}
			if(str == '0'){//初始化
				$("#biHeroList").html("");
			}
			$("#biHeroList").append(div);
			sortNumber = indnumber;
			$.mobile.loading( "hide" );
			$("#wechatinP").hide();
		}else{
			
			$("#biHeroList").html("");
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#biHeroList").append(html);
			$.mobile.loading( "hide" );
			$("#wechatinP").hide();
		}
	},'json');
}
function judgeLevel(fighting){
	var fightingCapacity=fighting;
	var level="外星人！";
	if(-400>fightingCapacity&&fightingCapacity>=-500){
		level="lv.1 班长";
	}else if(-300>fightingCapacity&&fightingCapacity>=-400){
		level="lv.2 下士";
	}else if(-200>fightingCapacity&&fightingCapacity>=-300){
		level="lv.3 上士";
	}else if(-100>fightingCapacity&&fightingCapacity>=-200){
		level="lv.4 少尉";
	}else if(0>fightingCapacity&&fightingCapacity>=-100){
		level="lv.5 上尉";
	}else if(100>fightingCapacity&&fightingCapacity>=0){
		level="lv.6 少校";
	}else if(200>fightingCapacity&&fightingCapacity>=100){
		level="lv.7上校";
	}else if(300>fightingCapacity&&fightingCapacity>=200){
		level="lv.8 少将";
	}else if(400>fightingCapacity&&fightingCapacity>=300){
		level="lv.9上将";
	}else if(500>fightingCapacity&&fightingCapacity>=400){
		level="lv.10 元帅";
	}
	return level;
}

function changeEvent(){
    searchData('0');
}


//月的累加减
function changeMonth(type) {
	var showMonth = $("#queryMonth").val();
	if (null != showMonth && showMonth != '') {
		var y = parseInt(showMonth.split("-")[0], 10);// 年
		var m = parseInt(showMonth.split("-")[1], 10);// 月
		var year;
		var month;
		if (type == 'up') {// 上一月
			if (m == 1) {
				year = (y - 1) + "";
				month = "12";
			} else {
				year = y + "";
				if (m < 11) {// 月份 需加0
					month = "0" + (m - 1);
				} else {
					month = (m - 1) + "";
				}
			}
		} else {// 下一月
			if (m == 12) {
				year = (y + 1) + "";
				month = "01";
			} else {
				year = y + "";
				if (m < 9) {//月份 需加0
					month = "0" + (m + 1);
				} else {
					month = (m + 1) + "";
				}
			}
		}
		if(checkDate(year + "-" + month+"-01")){
		$("#queryMonth").val(year + "-" + month);
		searchData('0');
		}
	}
}
function chooseOrg(obj){
	$.mobile.changePage( "#listPage", { role: "page" } );
	$("#orgId").val($(obj).attr("key"));
	var orgLevelDesc = $(obj).attr("orgLevelDesc");
	changeOrgLevel(orgLevelDesc );
	$("#orgName").html($(obj).attr("name")+" "+"<b style='color:red;' onclick='clearchoose(event)'>清</b>");
	changeEvent();
}
//组织选择器参数设置
function setOrgPickerPara(para){};
function clearchoose(event){
	$("#orgName").html('选择组织');
	$("#orgDesc").val("");
	$("#orgId").val("");
	var p = $('select[name="orgDesc"]');
	p.val("");
	p.html("<option value='selectArea'>选区域</option>");
	$("#orgDesc").trigger('change');
	event.stopPropagation();	
}
function changeOrgLevel(orgLevelDesc){
	var p = $('select[name="orgDesc"]');
	p.val("");
	p.html("");
	var div ="";
	if(orgLevelDesc!=''&&orgLevelDesc!=null){
		$.post(getPath()+'/weixinapi/mobile/bihero/getOrgLevelDesc',{orgleveldesc:orgLevelDesc},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					div+="<option value='"+res[i].DESC_ID+"'>"+res[i].DESC_NAME+"</option>";
				}
			}
			div+="<option value='personLevel'>个人级</option>";
			p.html(div);
		    p.trigger('change');
		},'json');
	}else{
		div+="<option value='personLevel'>个人级</option>";
		p.html(div);
	    p.trigger('change');
	}
		
}