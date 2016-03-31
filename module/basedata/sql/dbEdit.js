$(document).ready(function(){
	
	
	
});



function save(currentDialog){
	if(!isNotNull($("#dbhost").val())){
		art.dialog.tips("服务器地址不能为空！");
		$("#dbhost").select();
		return false;
	}
	
	if(!isNotNull($("#user").val())){
		art.dialog.tips("用户名不能为空！");
		$("#user").select();
		return false;
	}
	
	if(!isNotNull($("#password").val())){
		art.dialog.tips("密码不能为空！");
		$("#password").select();
		return false;
	}
	
	if(!isNotNull($("#dbname").val())){
		art.dialog.tips("数据库名称不能为空！");
		$("#dbname").select();
		return false;
	}
	
	$.post(getPath()+"/basedata/dbeSql/save",$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					content: res.MSG,
					time:1,
					close:function(){
						art.dialog.close();
					},
					width:200
				});
				setTimeout(function(){parent.reLoadData();},300);
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.tips(res.MSG);
		}
    },'json');
}

function test(){
	if(!isNotNull($("#dbhost").val())){
		art.dialog.tips("服务器地址不能为空！");
		$("#dbhost").select();
		return false;
	}
	
	if(!isNotNull($("#user").val())){
		art.dialog.tips("用户名不能为空！");
		$("#user").select();
		return false;
	}
	
	if(!isNotNull($("#password").val())){
		art.dialog.tips("密码不能为空！");
		$("#password").select();
		return false;
	}
	
	if(!isNotNull($("#dbname").val())){
		art.dialog.tips("数据库名称不能为空！");
		$("#dbname").select();
		return false;
	}
	
	$.post(getPath()+"/basedata/dbeSql/test",$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					content: res.MSG,
					time:1,
					close:function(){
						art.dialog.close();
					},
					width:200
				});
				
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.tips(res.MSG);
		}
    },'json');
}


function dataBlur(){
	var dbType = $("#dbtype").val();
	var dbhost = $("#dbhost").val();
	var dbport = $("#dbport").val();
	var dbname = $("#dbname").val();
	var mysql = "jdbc:mysql://dbhost:dbport/dbname";
	var oracle = "jdbc:oracle:thin:@dbhost:dbport:dbname";
	if(dbType == 'ORACLE'){
		if(isNotNull(dbhost)){
			oracle = oracle.replace("dbhost",dbhost);
		}
		if(isNotNull(dbport)){
			oracle = oracle.replace("dbport",dbport);
		}
		if(isNotNull(dbname)){
			oracle = oracle.replace("dbname",dbname);
		}
		$("#url").val(oracle);
	}else if(dbType == 'MYSQL'){
		if(isNotNull(dbhost)){
			mysql = mysql.replace("dbhost",dbhost);
		}
		if(isNotNull(dbport)){
			mysql = mysql.replace("dbport",dbport);
		}
		if(isNotNull(dbname)){
			mysql = mysql.replace("dbname",dbname);
		}
		$("#url").val(mysql);
	}
	
//	var dbType = $("#dbtype").val();
//	var dbhost = $("#dbhost").val();
//	var dbport = $("#dbport").val();
//	var dbname = $("#dbname").val();
//	if(dbType == 'ORACLE'){
//		$("#url").val("jdbc:oracle:thin:@" + dbhost + ":" + dbport + ":" + dbname);
//	}else if(dbType == 'MYSQL'){
//		$("#url").val("jdbc:mysql//" + dbhost + ":" + dbport + "/" + dbname);
//	}
}