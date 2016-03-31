var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May',
		'June', 'July', 'August', 'September', 'October', 'November',
		'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
		'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday',
		'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu',
		'Fri', 'Sat');


var isNotNull = function(value){
	if(!value) return false;
	if("undefined" == typeof(value)) return false;
	if("string" != typeof(value)) return true;
	//下面的方法只能字符类型使用,不然报错
	value = $.trim(value);
	var flag = false;
	if(value==null){
		flag = false;
	}else if(value==""){
		flag = false;
	}else if(value=="null"){
		flag = false;
	}else{
		flag = true;
	}
	return flag;
}

function formatDate(date, format) {
	format = format + "";
	var result = "";
	var i_format = 0;
	var c = "";
	var token = "";
	var y = date.getYear() + "";
	var M = date.getMonth() + 1;
	var d = date.getDate();
	var E = date.getDay();
	var H = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
	// Convert real date parts into formatted versions
	var value = new Object();
	if (y.length < 4) {
		y = "" + (y - 0 + 1900);
	}
	value["y"] = "" + y;
	value["yyyy"] = y;
	value["yy"] = y.substring(2, 4);
	value["M"] = M;
	value["MM"] = LZ(M);
	value["MMM"] = MONTH_NAMES[M - 1];
	value["NNN"] = MONTH_NAMES[M + 11];
	value["d"] = d;
	value["dd"] = LZ(d);
	value["E"] = DAY_NAMES[E + 7];
	value["EE"] = DAY_NAMES[E];
	value["H"] = H;
	value["HH"] = LZ(H);
	if (H == 0) {
		value["h"] = 12;
	} else if (H > 12) {
		value["h"] = H - 12;
	} else {
		value["h"] = H;
	}
	value["hh"] = LZ(value["h"]);
	if (H > 11) {
		value["K"] = H - 12;
	} else {
		value["K"] = H;
	}
	value["k"] = H + 1;
	value["KK"] = LZ(value["K"]);
	value["kk"] = LZ(value["k"]);
	if (H > 11) {
		value["a"] = "PM";
	} else {
		value["a"] = "AM";
	}
	value["m"] = m;
	value["mm"] = LZ(m);
	value["s"] = s;
	value["ss"] = LZ(s);
	while (i_format < format.length) {
		c = format.charAt(i_format);
		token = "";
		while ((format.charAt(i_format) == c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		if (value[token] != null) {
			result = result + value[token];
		} else {
			result = result + token;
		}
	}
	return result;
};


function formate_yyyyMMdd(date){
	if(!isNotNull(date)){
		return "";
	}else{
		return formatDate(date ,'yyyy-MM-dd');
	}
}

/**
 * 将数字类型的日期转为字符串
 * @param l
 */
function formateLong(l){
	if(!l) return "";
	return formate_yyyyMMdd(new Date(l));
}


/**
 * 将字符串转换为日期类型
 * @param val 字符串日期类型
 * @returns
 */
function parseDate(val) {
	var preferEuro = (arguments.length == 2) ? arguments[1] : false;
	generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d',
			'd-MMM-y', 'MMM d');
	monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
	dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
	var checkList = new Array('generalFormats', preferEuro
					? 'dateFirst'
					: 'monthFirst', preferEuro ? 'monthFirst' : 'dateFirst');
	var d = null;
	for (var i = 0; i < checkList.length; i++) {
		var l = window[checkList[i]];
		for (var j = 0; j < l.length; j++) {
			d = getDateFromFormat(val, l[j]);
			if (d != 0) {
				return new Date(d);
			}
		}
	}
	return null;
};

/**
 * 设置表单元素不可用状态
 * 
 * @param formid
 *            表单ID
 */
var OpenFormDisabled = function(formid) {
	var id = "#" +  formid + " :input";
	$(id).each(function() {
				if ($(this).is(":text") || $(this).is("textarea")) {
					$(this).attr("disabled", true);
				} else if ($(this).is("select")) {
					$(this).attr("disabled", true);
				} else if ($(this).is(":radio") || $(this).is(":checkbox")) {
					$(this).attr("disabled", true);
				}
			});
};

/**
 * 取消表单元素不可用状态
 * @param formid  表单ID
 */
var CloseFormDisabled = function(formid) {
	var id = "#" + formid + " :input";
	$(id).each(function() {
				if ($(this).is(":text") || $(this).is("textarea")) {
					$(this).attr("disabled", false);
				} else if ($(this).is("select")) {
					$(this).attr("disabled", false);
				} else if ($(this).is(":radio") || $(this).is(":checkbox")) {
					$(this).attr("disabled", false);
				}
			});
};
//-------------------------------------------------------------------
//compareDates(date1,date1format,date2,date2format)
//Compare two date strings to see which is greater.
//Returns:
//1 if date1 is greater than date2
//0 if date2 is greater than date1 of if they are the same
//-1 if either of the dates is in an invalid format
//-------------------------------------------------------------------
function compareDates(date1, dateformat1, date2, dateformat2) {
	var d1 = getDateFromFormat(date1, dateformat1);
	var d2 = getDateFromFormat(date2, dateformat2);
	if (d1 == 0 || d2 == 0) {
		return -1;
	} else if (d1 > d2) {
		return 1;
	}
	return 0;
};

//获取当天日期
function getToday(){
	var st = null;
	var today = new Date();
	st = today.getFullYear()+"-";
	var month = today.getMonth()+1 ;
	if(month<10){
		month = "0" + month;
	};
	st = st + month +"-";
	var date = today.getDate() ;
	if(date<10){
		date = "0" + date;
	};
	st = st + date;
	return st;
};

//------------------------------------------------------------------
//getDateFromFormat( date_string , format_string )
//
//This function takes a date string and a format string. It matches
//If the date string matches the format string, it returns the
//getTime() of the date. If it does not match, it returns 0.
//------------------------------------------------------------------
function getDateFromFormat(val, format) {
	val = val + "";
	format = format + "";
	var i_val = 0;
	var i_format = 0;
	var c = "";
	var token = "";
	var token2 = "";
	var x, y;
	var now = new Date();
	var year = now.getYear();
	var month = now.getMonth() + 1;
	var date = 1;
	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();
	var ampm = "";

	while (i_format < format.length) {
		// Get next token from format string
		c = format.charAt(i_format);
		token = "";
		while ((format.charAt(i_format) == c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		// Extract contents of value based on format token
		if (token == "yyyy" || token == "yy" || token == "y") {
			if (token == "yyyy") {
				x = 4;
				y = 4;
			}
			if (token == "yy") {
				x = 2;
				y = 2;
			}
			if (token == "y") {
				x = 2;
				y = 4;
			}
			year = _getInt(val, i_val, x, y);
			if (year == null) {
				return 0;
			}
			i_val += year.length;
			if (year.length == 2) {
				if (year > 70) {
					year = 1900 + (year - 0);
				} else {
					year = 2000 + (year - 0);
				}
			}
		} else if (token == "MMM" || token == "NNN") {
			month = 0;
			for (var i = 0; i < MONTH_NAMES.length; i++) {
				var month_name = MONTH_NAMES[i];
				if (val.substring(i_val, i_val + month_name.length)
						.toLowerCase() == month_name.toLowerCase()) {
					if (token == "MMM" || (token == "NNN" && i > 11)) {
						month = i + 1;
						if (month > 12) {
							month -= 12;
						}
						i_val += month_name.length;
						break;
					}
				}
			}
			if ((month < 1) || (month > 12)) {
				return 0;
			}
		} else if (token == "EE" || token == "E") {
			for (var i = 0; i < DAY_NAMES.length; i++) {
				var day_name = DAY_NAMES[i];
				if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name
						.toLowerCase()) {
					i_val += day_name.length;
					break;
				}
			}
		} else if (token == "MM" || token == "M") {
			month = _getInt(val, i_val, token.length, 2);
			if (month == null || (month < 1) || (month > 12)) {
				return 0;
			}
			i_val += month.length;
		} else if (token == "dd" || token == "d") {
			date = _getInt(val, i_val, token.length, 2);
			if (date == null || (date < 1) || (date > 31)) {
				return 0;
			}
			i_val += date.length;
		} else if (token == "hh" || token == "h") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 1) || (hh > 12)) {
				return 0;
			}
			i_val += hh.length;
		} else if (token == "HH" || token == "H") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 0) || (hh > 23)) {
				return 0;
			}
			i_val += hh.length;
		} else if (token == "KK" || token == "K") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 0) || (hh > 11)) {
				return 0;
			}
			i_val += hh.length;
		} else if (token == "kk" || token == "k") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 1) || (hh > 24)) {
				return 0;
			}
			i_val += hh.length;
			hh--;
		} else if (token == "mm" || token == "m") {
			mm = _getInt(val, i_val, token.length, 2);
			if (mm == null || (mm < 0) || (mm > 59)) {
				return 0;
			}
			i_val += mm.length;
		} else if (token == "ss" || token == "s") {
			ss = _getInt(val, i_val, token.length, 2);
			if (ss == null || (ss < 0) || (ss > 59)) {
				return 0;
			}
			i_val += ss.length;
		} else if (token == "a") {
			if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
				ampm = "AM";
			} else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
				ampm = "PM";
			} else {
				return 0;
			}
			i_val += 2;
		} else {
			if (val.substring(i_val, i_val + token.length) != token) {
				return 0;
			} else {
				i_val += token.length;
			}
		}
	}
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length) {
		return 0;
	}
	// Is date valid for month?
	if (month == 2) {
		// Check for leap year
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap
																			// year
			if (date > 29) {
				return 0;
			}
		} else {
			if (date > 28) {
				return 0;
			}
		}
	}
	if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
		if (date > 30) {
			return 0;
		}
	}
	// Correct hours value
	if (hh < 12 && ampm == "PM") {
		hh = hh - 0 + 12;
	} else if (hh > 11 && ampm == "AM") {
		hh -= 12;
	}
	var newdate = new Date(year, month - 1, date, hh, mm, ss);
	return newdate.getTime();
};

function _isInteger(val) {
	var digits = "1234567890";
	for (var i = 0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i)) == -1) {
			return false;
		}
	}
	return true;
};

function _getInt(str, i, minlength, maxlength) {
	for (var x = maxlength; x >= minlength; x--) {
		var token = str.substring(i, i + x);
		if (token.length < minlength) {
			return null;
		}
		if (_isInteger(token)) {
			return token;
		}
	}
	return null;
};

function LZ(x) {
	return (x < 0 || x > 9 ? "" : "0") + x;
}

function getEvent() //同时兼容ie和ff的写法 
{  
    if(document.all)  return window.event;    
    func=getEvent.caller;        
    while(func!=null){  
        var arg0=func.arguments[0]; 
        if(arg0) 
        { 
          if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)) 
          {  
          return arg0; 
          } 
        } 
        func=func.caller; 
    } 
    return null; 
} 
function onlyPutNum(obj) {
	// 先把非数字的都替换掉，除了数字和.    negative属性为true可输入负数
	var negative = $(obj).attr("negative");
	if(obj.value.indexOf("-") == 0 && negative == "true"){
		obj.value = "-"+obj.value.replace(/[^\d.]/g, "");
	}else{
		obj.value = obj.value.replace(/[^\d.]/g, "");
	}
	// 必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g, "");
	// 保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g, ".");
	// 保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$",
			".");
	var values = obj.value.split('.');
	if (values.length == 2 && String(values[1]).length > 2) {
		obj.value = obj.value.substring(0, obj.value.indexOf('.') + 3);
	}
}

  function sleep(seconds){
	   var d1 = new Date(); 
	   var t1 = d1.getTime(); 
	   for (;;){ 
	   var d2 = new Date(); 
	   var t2 = d2.getTime(); 
	   if (t2-t1 > seconds*1000){ 
	         break; 
	   }
	  }
	 }
  
  
//快速按钮选上一天、当天和下一天（考勤管理）
function changeDayAndColor(type){	
  	//$("input[key='key']").removeClass('greenBtn').addClass('orangeBtn');
  	if(type=='query'){	//查询		
  	}else{
  		//$("input[name='"+type+"']").removeClass('orangeBtn').addClass('greenBtn');
  		var queryDate = $("input[name='queryDate']").val();
  		if(!isNotNull(queryDate)){
  			$("input[name='queryDate']").val(today);
  			queryDate = $("input[name='queryDate']").val();
  		}
  		if($.browser.msie){	//IE浏览器
  			queryDate=queryDate.replace('-','/');		
  		}
  		var date=new Date(queryDate);
  		if(type=='today'){	//当天
  			$("input[name='queryDate']").val(today);
  		}else if(type=='before'){	//上一天	
  			date.setDate(date.getDate()-1)
  			$("input[name='queryDate']").val(formatDate(date,'yyyy-MM-dd'));
  		}else if(type=='after'){	//下一天
  			date.setDate(date.getDate()+1)
  			$("input[name='queryDate']").val(formatDate(date,'yyyy-MM-dd'));
  		}
  	}
}

//js精确计算float类型相加函数
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}
//js精确计算float类型减法函数
function accSub(arg1,arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //last modify by deeka
    //动态控制精度长度
    n=(r1>=r2)?r1:r2;
    return ((arg2*m-arg1*m)/m).toFixed(n);
}

//浮点数乘法运算  
function FloatMul(arg1,arg2){   
	var m=0,s1=arg1.toString(),s2=arg2.toString();   
	try{m+=s1.split(".")[1].length}catch(e){}   
	try{m+=s2.split(".")[1].length}catch(e){}   
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
 }   
 
 
//浮点数除法运算  
function FloatDiv(arg1,arg2){   
	var t1=0,t2=0,r1,r2;   
	try{t1=arg1.toString().split(".")[1].length}catch(e){}   
	try{t2=arg2.toString().split(".")[1].length}catch(e){}   
	with(Math){   
		r1=Number(arg1.toString().replace(".",""));   
		r2=Number(arg2.toString().replace(".",""));  
		return Math.round((r1/r2)*pow(10,t2-t1)*Math.pow(10, 2))/Math.pow(10, 2);   
	}   
}   

function getYestodayFromStr(datestr,fromformat,toformat){   
	var l = getDateFromFormat(datestr,fromformat);
	var date = new Date(l);
    return getYestoday(date,toformat);
  } 

function getTomorrowFromStr(datestr,fromformat,toformat){   
	var l = getDateFromFormat(datestr,fromformat);
	var date = new Date(l);
    return getTomorrow(date,toformat);
  } 

//得到上个月第一天 传入 / 或 -
function getLastMonthFirst(split){
	var st = null;
	var year = 0;
	var today = new Date();
	year = today.getFullYear();	
	var month = today.getMonth()+1 ;
	if(month==1){
		month = 12;
		year = year - 1;
	}else{
		month = month-1;
	}	
	if(month<10){
		month = "0" + month;
	};
	st = year + split + month +split+"01";
	return st;
}
//得到上个月最后一天
function getLastMonthLast(format,split){
	
	var st = getThisMonthFirst(split);
	
	var d = getDateFromFormat(st,format);
	
	return getYestodayByLong(d,format);
}
//得到本月第一天
function getThisMonthFirst(split){
	var st = null;
	var year = 0;
	var today = new Date();
	year = today.getFullYear();	
	var month = today.getMonth()+1 ;	
	if(month<10){
		month = "0" + month;
	};
	st = year + split + month +split+"01";
	return st;
}
//得到相隔多少天的日期
function getDateByDays(date,format,n){
	var day_mill = date.getTime()+n*1000*60*60*24;
	var dayres = new Date();  
	dayres.setTime(day_mill);  
	return formatDate(dayres,format); 
}


//得到前一天的日期
function getYestoday(date,format){      
    var yesterday_milliseconds=date.getTime()-1000*60*60*24;       
    var yesterday = new Date();       
        yesterday.setTime(yesterday_milliseconds);       
        
    return formatDate(yesterday,format); 
  } 

//得到前一天的日期
function getYestodayByLong(l,format){      
    var yesterday_milliseconds=l-1000*60*60*24;       
    var yesterday = new Date();       
        yesterday.setTime(yesterday_milliseconds);       
        
    return formatDate(yesterday,format); 
  } 

//得到后一天的日期
function getTomorrow(date,format){      
    var tomorrow_milliseconds=date.getTime()+1000*60*60*24;       
    var tomorrow = new Date();       
    tomorrow.setTime(tomorrow_milliseconds);       
        
    return formatDate(tomorrow,format); 
  } 

function replacCharStr(initStr,len,ch){
	if(initStr.length>len){
		return initStr.substring(0,len-1)+ch;
	}else{
		return initStr;
	}
}

function existObj(obj){
	return "undefined" != typeof obj ;
}

function checkint(obj){
	obj.value=obj.value.replace(/\D/g,'')
}

//li 页签切换  divId 父级别ID,key 要显示的DIV的key值
function switchTab(divId,key){
	var liList = $("#" + divId).find("li");
	var divContentList = $("div[key='" + key + "']");
	liList.each(function(i, ele){
		$(ele).click(function(){
			liList.removeClass("hover");
			$(ele).addClass("hover");
			divContentList.hide();
			$(divContentList.get(i)).show();
		});
	});
}

function ajaxSubmit(formId,func){
	if(typeof(func) == "function") func(true);
	$.ajax({
		url:$('#'+formId).attr('action'),
		dataType: "json",
		type:"POST",
		data: $('#'+formId).serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						icon: 'succeed',
					    time: 1,
					    content: res.MSG
					});
					setTimeout(function(){art.dialog.close();},1000);				
				}else{
					art.dialog.close();
				}
			}else{
				if(typeof(func) == "function") func(false);
				art.dialog.alert(res.MSG);
			}
		},
		error:function(){
			if(typeof(func) == "function") func(false);
		}
	});
}

//金钱千分位格式化
function FormatNumber(intInput) {
    //将输入参数转换为字符串形式
    var strInput = Math.abs(intInput).toString();
    //如果有小数，把小数部分提取出来
    var strXS = "";
    if (strInput.indexOf(".", 0) != -1) {
        strXS = strInput.substring(strInput.split(".")[0].length, strInput.length);
        strInput = strInput.split(".")[0];
    }
    //获取输入参数的长度
    var iLen = strInput.length;
    //如果输入参数的长度小于等于3，则直接返回
    //否则，再进行处理
    if (iLen <= 3) {
        return intInput;
    } else {
        //首先取模，以作为起始点，每3位截取一次存入数组，最后再进行拼接返回
        var iMod = iLen % 3;
        //每3位截取的起始点  
        var iStart = iMod;
        //每3位截取的存储数组
        var aryReturn = [];

        //循环处理：每3位截取一次 存储到数组
        while (iStart + 3 <= iLen) {
            aryReturn[aryReturn.length] = strInput.substring(iStart, iStart + 3);
            iStart = iStart + 3;
        }
        //将数组中的数据连接起来
        aryReturn = aryReturn.join(",");

        //处理输入参数长度不是3的倍数的情况
        if (iMod != 0) {
            aryReturn = strInput.substring(0, iMod) + "," + aryReturn;
        }
        //处理负数的情况
        if (intInput < 0) { aryReturn = "-" + aryReturn; }

        return aryReturn + strXS;
    }
}

function convertToChinese(num){
	if(num==1) return '一';
	else if(num==2) return '二';
	else if(num==3) return '三';
	else if(num==4) return '四';
	else if(num==5) return '五';
	else if(num==6) return '六';
	else if(num==7) return '七';
	else if(num==8) return '八';
	else if(num==9) return '九';
	else if(num==10) return '十';
	else if(num==11) return '十一';
	else if(num==12) return '十二';
	else if(num==13) return '十三';
	else if(num==14) return '十四';
	else if(num==15) return '十五';
	else if(num==16) return '十六';
	else if(num==17) return '十七';
	else if(num==18) return '十八';
	else if(num==19) return '十九';
	else if(num==20) return '二十';
	else if(num==21) return '二十一';
	else if(num==22) return '二十二';
	else if(num==23) return '二十三';
	else if(num==24) return '二十四';
	else if(num==25) return '二十五';
	else if(num==26) return '二十六';
	else if(num==27) return '二十七';
	else if(num==28) return '二十八';
	else if(num==29) return '二十九';
	else if(num==30) return '三十';
	else if(num==31) return '三十一';
	return '';
}