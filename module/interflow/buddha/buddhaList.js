var key = null;// 查询条件
var curPersonStr = '人员信息';
var pageSize = 8; // 每页显示条数初始化，修改显示条数，修改这里即可
var panelNameStr = '盘源编号';
$(document).ready(function() {
	var count=$("#count").val();
	count = count==null || count == '' ? 0:count;
	initMarketData(1);
	$list_editHeight = ($(window).height() - 190);
	$("#dataList").height($list_editHeight);
});
/**
 * 发布数据
 */
function releaseData() {
	
	if($("#btn_submit_buddha").hasClass("graybtn")){
		art.dialog.tips("正在处理中，请稍等片刻...");
		return false ;
	}
	var content = $("#content").val();
	var buddhaid = $("#buddhaid").val();
	content = content.replace(/(^\s*)|(\s*$)/g, "")
	if(content == null || content == ''){
		art.dialog.tips('请填写内容！');
		return false;
	}
	$("#btn_submit_buddha").addClass("graybtn");
	$.post(getPath() + "/interflow/buddha/save", {
		buddhaid : buddhaid,
		content : content,
	}, function(res) {
		$("#btn_submit_buddha").removeClass("graybtn");
		if (res.STATE == "SUCCESS") {
			art.dialog({
				icon : 'succeed',
				time : 1.5,
				content : '拜成功啦！'
			});
			$("#content").val('');
			
			var count=res.count;
			count = count==null? 0:count;
			$("#count").html(count);
			$("#count1").html(count);
			initMarketData(1);
		} else {
			art.dialog.tips(res.MSG);
		}
	}, 'json');
}
/**
 * 初始化数据
 */
function initMarketData(pageIndex) {

	var buddhaid = $("#buddhaid").val();
	$.post(getPath() + "/interflow/buddha/listData",
					{
						buddhaid : buddhaid,
						page : pageIndex,
						size : 8,
					},
					function(data) {
						$("#cxtDiv").html("");
						var items = data.items;
						for ( var i = 0; i < items.length; i++) {
							var cxtHtml = "";
							cxtHtml = "<div class='bm05 blues' id="
									+ items[i].id + "><dl>";
							cxtHtml += '<input type=hidden value='
									+ items[i].id + ' id=objId />';
							cxtHtml += '<input type=hidden value=BUDDHA id=type />';

							var photo = "";
							if (items[i].creator.photo) {
								photo = "images/" + items[i].creator.photo;
							} else {
								photo = "default/style/images/home/man_head.gif";
							}
							cxtHtml = "";
							cxtHtml += "<div class='list' id=" + items[i].id
									+ ">";
							cxtHtml += "<div id='div_person_pop'  pop-name='"+items[i].creator.name+"' person-pop='"+items[i].creator.number+"'>";//class='kd-avatar'
							cxtHtml += "<p class='photo1'>" ;
							cxtHtml += "<img src='" + getPath() + "/" + photo + "'>"; 
							cxtHtml += "</p>";
							cxtHtml += "</div>" ;
							cxtHtml += "<div class='zdin'><div class='zd'>";
							cxtHtml += "<p><span class='fl font12'>"
									+ items[i].creator.name + "  " + items[i].org.name
									+ "</span><span class='fr grayfont'>"
									+ items[i].createTime + "</span></p>";
							cxtHtml += "<p class='pt' style='width:90%;'>" + items[i].content
									+ "</p>";
							if(loginUserId==items[i].creator.id){
								cxtHtml +="<span style='float:right;padding-top:5px;'><a  style='color: #1262b3;' href=\"javascript:delData('"+items[i].id+"')\">删除</a></span>&nbsp;&nbsp;";
							}
							cxtHtml += "</div></div>";
							
							cxtHtml += "</div>"
								
							// 如果为当前人，则可执行删除操作
							
								

							$("#cxtDiv").append(cxtHtml);
							// 滚动条滚到顶部
							window.scrollTo(0, document.body.scrollHeight);
							
							//人员头像悬浮
							personPop.init() ;
						}
						// 分页
						if (items.length > 0 && pageIndex != null) {
							var totalPage = data.recordCount % data.pageSize == 0 ? (data.recordCount / data.pageSize)
									: Math.floor(data.recordCount
											/ data.pageSize) + 1;
							$("#cxtPage").html(
									initpagelist(data.currentPage, totalPage));
						} else {
							$("#cxtPage")
									.html(
											"<div style='width: 100%;text-align: center;height: 400px;display: table-cell;vertical-align: middle; overflow: hidden;'></div>");
						}
					}, 'json');
}
/**
 * bai yi bai
 */
function worship() {
	
	var buddhaid = $("#buddhaid").val();
	$.post(getPath() + "/interflow/buddha/click", {
		buddhaid : buddhaid,
	}, function(data) {
		var count=data.count;
		count = count==null? 0:count;
		$("#count").html(count);
		$("#count1").html(count);
	}, 'json');
}
function pagesearch(cur) {
	initMarketData(cur);
}
// 删除
function delData(id){
	$.post(getPath()+"/interflow/buddha/deleted",{id:id},function(res){
		if (res.STATE == 'SUCCESS') {
			art.dialog({
				icon : 'succeed',
				time : 1,
				content : res.MSG
			});
			var count=res.count;
			count = count==null? 0:count;
			$("#count").html(count);
			$("#count1").html(count);
			initMarketData(1);
			$("#"+id).slideToggle(1000); 
		} else {
			art.dialog({
				icon : 'warning',
				time : 1.5,
				content : res.MSG
			});
		}
	},'json');
}
//字数
function changeWordCount(obj){
	if(obj.value=='') $("#word").html(200);
	if(obj.value.length>200){
		$("#word").html(0);
		$(obj).val(obj.value.substring(0,200));
		return
	}else{
		if(obj.value!=''){
			$("#word").html(200-Math.floor(obj.value.length));
		}
	}
}