function beforesave(){
	var remark=$("textarea[name='description']").val();
	if(remark.length>300){
		art.dialog.tips("字符数量不能超过300个!");
		return false ;
	}
//	if(!hwFlag){
//		art.dialog.tips("你还未点击验证码!");
//		return false;
//	}
	return true ;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}

var hwFlag=false;//标志是否已经点击过验证码
function getIdCode(obj){
	var displayNbr=$('#displayNbr').val();
	if(!displayNbr){
		art.dialog.tips('请填写号码');
		return false;
	}
	var mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
	if(!(mobile.test(displayNbr) || phone.test(displayNbr))){
		art.dialog.tips("请填写正确的号码!");
		return false;
	}
	$.post(getPath()+'/cmct/phoneMainShow/getIdCode',{displayNbr:displayNbr},function(res){
		if(res.STATE=='SUCCESS'){
			hwFlag=true;
			setTimeBar(obj);
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

var wait=40;  
function setTimeBar(o) {  
        if (wait == 0) {  
            o.removeAttribute("disabled");            
            o.value="获取";  
            wait = 60;  
        } else {  
            o.setAttribute("disabled", true);  
            o.value="重新发送(" + wait + ")";  
            wait--;  
            setTimeout(function() {  
            	setTimeBar(o)  
            },  
            1000)  
        }  
}  