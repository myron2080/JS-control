

function getCount() {
	//统计
	$.ajax({type:"POST",
			url:getPath()+"/ebsite/weixin/participants/getCount",
			dataType:"json",
			data:{},
			success:function(res){
				setCount(res.items);
		   }

		});
}

function setCount(data){
	var home = "";
	$(".nav").html("");
	home += "<ul><li>参与选手<span>"+data[0].personCount+"</span></li>" +
			"<li>累计投票<span>"+data[0].votesCount+"</span></li>" +
			"<li>访问量<span>"+(parseInt(data[0].personCount)+parseInt(data[0].votesCount)+50)+"</span></li></ul>";
	$(".nav").append(home);
}

function setPage(data){
	var page = parseInt(data.currentPage);//当前页
	var count = parseInt(data.count);//总条数
	var pagesize = 10;//每页数
	$(".paging").html("");
	var pagehtml = "";
	//总页数
	var pagecount = 0;
	if (count != 0) {
		pagecount = Math.ceil(count/pagesize);
	} else {
		pagecount = 1;
	}
	if (pagecount == 1 || page == 1) {
		pagehtml = "<a href='javascript:void(0);' onclick='searchData(1);'>首页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData(1);'>上一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+page+");'>下一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+pagecount+");'>末页</a>";
	}
	if (page == pagecount && pagecount != 1) {
		pagehtml = "<a href='javascript:void(0);' onclick='searchData(1);'>首页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+(page-1)+");'>上一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+pagecount+");'>下一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+pagecount+");'>末页</a>";
	}
	if (page != pagecount && pagecount != 1) {
		if (page == 1) {
			pagehtml = "<a href='javascript:void(0);' onclick='searchData(1);'>首页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData(1);'>上一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+(page+1)+");'>下一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+pagecount+");'>末页</a>";
		} else {
			pagehtml = "<a href='javascript:void(0);' onclick='searchData(1);'>首页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+(page-1)+");'>上一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+(page+1)+");'>下一页</a>&nbsp;" +
				"<a href='javascript:void(0);' onclick='searchData("+pagecount+");'>末页</a>";
		}
	}
	
//	pagehtml += "&nbsp;&nbsp;&nbsp;当前/总数(页)：&nbsp;"+page+"/"+pagecount+"&nbsp;&nbsp;每页："+pagesize+"&nbsp;条";
	$(".paging").append(pagehtml);
	
}

//拉票输入编号
function setNumber(){
	$("#numberDiv").html("");
	$("#numberDiv").show();
	var numberhtml = "<div class='searchCanvassing'><input id='numberValue' type='text' placeholder='请输入编号进行拉票'/>" +
			"<a href='javascript:void(0);' onclick='personInfo();'>拉票</a><span class='canvassClose' onclick='closeDiv();'>&times;</span></div>"
	$("#numberDiv").append(numberhtml);
}

function personInfo(){
	var number = $("#numberValue").val();
	if (number != null || number != "") {
		window.location.href = getPath()+"/ebsite/weixin/participants/imgDetail?number="+number;
	}
}
//关闭弹出框
function closeDiv(){
	$("#numberDiv").hide();
}

//弹出提示框
function openWindow(str){
	$("#windowDiv").text(str);
	$("#windowDiv").show();
	setTimeout('$("#windowDiv").hide();',3000);
}

//弹出二维码关注
function isAttention(){
	var vcode = $("#vId").val();
	if (null == vcode) {
		openWindow("您未关注我们的公众号，不能投票，请关注");//提示
		$("#numberDiv").html("");
		var erweima = "<div class='searchCanvassing1'><img style='width:auto;height:160px' src='"+getPath()+"/default/js/module/ebsite/weixin/ui/images/two-dimensional.jpg' />" +
				"<span class='canvassClose' onclick='closeDiv()'><img style='width:16px;' src='"+getPath()+"/default/js/module/ebsite/weixin/ui/images/Close.png' /></span></div>"
		$("#numberDiv").append(erweima);
		$("#numberDiv").show();//显示
		return  true;
	}
	
	return false;
}

//图片加载出错，显示默认图片
function errorImg(t){
	t.src = getPath()+"/default/js/module/ebsite/weixin/ui/images/default.jpg";
}
