$list_editWidth = 680;
$list_editHeight = 540;

$(document).ready(function() {
	loadRank();
});

function loadRank() {
	//得到页面的通话话数
	var The_SUCC=$('#theSucc').text()==""?0:$('#theSucc').text();
	var reqUrl= base+'/interflow/callReport/loadRank';
	$.post(reqUrl, {
		theSucc : The_SUCC
	}, function(res) {
		if(res.RANK=="0"){
			$('#rank').html("0");
		}else{			
			$('#rank').html(res.RANK);
		}
	}, 'json');
}

function toCallReport() {
	$('body').css("overflow","hidden");
	var dlg = art.dialog.open(base + "/interflow/callReport/toCallReport", {
		id : "toCallReport",
		title : "电话量排名",
		background : '#333',
		width : $list_editWidth,
		height : $list_editHeight,
		lock:true,
		button : [ {
			name : '关闭',
			callback : function() {
				$('body').css("overflow","auto");
			}
		} ],
		close:function(){
			$('body').css("overflow","auto");
		}
	});
}