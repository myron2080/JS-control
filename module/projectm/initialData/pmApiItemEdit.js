var _index = 1;
var _rowCount = 0;
$(document).ready(function() {

    if ($edit_viewstate == "EDIT" || $edit_viewstate == "VIEW") {
        if ($edit_viewstate == "VIEW") {
            //隐藏新增按钮的层
            $("#opreator").hide();
        }
    }

    $("#isInterrupt").click(function() {
        if ($(this).attr("checked") == "checked") {
            $("#hiddenInte").val("Y");
        } else {
            $("#hiddenInte").val("N");
        }
    });

    initSelectVal(); //初始化SELECT的默认值
});

/**
 * 点击新增按钮
 */
function addRowEvent() {
    _rowCount += 1;
    _index += 1;
    var _tr = $("<tr _index=\"" + _index + "\" id=\"tr_" + _index + "\"></tr>");
    var _tdList = "<td><select style=\"width:90px\" id=\"type" + _index + "\"" + dataTypeList+ "</select></td>" ;
    _tdList += "<td ><input id='name"+_index+"' style='width: 100px;' type=\"text\" ></td>" ;
    _tdList += "<td ><input id='pdesc"+_index+"' style='width: 180px;' type=\"text\" ></td>" ;
    _tdList += "<td><input id='idx"+_index+"' style='width: 20px;' type=\"text\" ></td>" ;
    _tdList += "<td id=\"_td" + _index + "\"><input id='isNotNull"+_index+"' type=\"checkbox\" ></td>" ;
    _tdList += "<td><a href=javascript:void(0) onclick=delRowsEvent(this)>删除</a></td>" ;
    _tr.append(_tdList);
    $("#tabBody").append(_tr);
    if (_rowCount == 10) {
        $("#addBtn").attr({
            "disabled": "disabled"
        });
        return;
    }

}

/**
 * 删除行数据
 * @param obj
 */
function delRowsEvent(obj) {
    if ($edit_viewstate == "ADD") {
        $(obj).parent().parent().remove();
        _rowCount = _rowCount - 1;
        $("#addBtn").removeAttr("disabled");
        return;
    }
    art.dialog.confirm('确定删除该行数据?',
    function() {
        $(obj).parent().parent().remove();
        _rowCount = _rowCount - 1;
        $("#addBtn").removeAttr("disabled");
    });
}

/**
 * 填充select标签
 * 
 * @returns {String}
 */
function setSelectValue() {
    var _select = $("<select></select>");
    for (var i = 0; i < propertyData.length; i++) {
        _select.append("<option value=\"" + propertyData[i].name + "\">" + propertyData[i].text + "</option>");
    }
    return _select.html();
}
 

/**
 * 初始化SELECT的默认值
 */
function initSelectVal() {
    setTimeout(function() {
        _rowCount = $("#itemsTable").find("tr").length - 1;
        if (_rowCount == 10) {
            $("#addBtn").attr({
                "disabled": "disabled"
            });
        }

        var _length = $("select").length;
        for (var i = 1; i <= _length; i++) {
            var _val = $("#selPro_" + i).attr("key");
            $("#selPro_" + i).attr("value", _val);
            $("#selPro_" + i).change();
        }
        //禁用table里面form标签
        if ($edit_viewstate == "VIEW") {
            disableText();
        }

    },
    300);
}

function saveEdit() {
    var _itemsTable = $("#tabBody");
    var _trLength = _itemsTable.find("tr").length
    
    var keyCode = ""; //编号示例
    var seqCount = 0; //统计序列号  
    var jsonData = "[";
    for (var i = 0; i < _itemsTable.find("tr").length; i++) {
        var _tr = _itemsTable.find("tr")[i];
        var type = $(_tr).find("select:first").val();
        var name = $(_tr).find("input[id^='name']").val();
        var desc = $(_tr).find("input[id^='pdesc']").val();
        var idx = $(_tr).find("input[id^='idx']").val();
        var isNotNull = $(_tr).find("input[id^='isNotNull']").attr("checked");
        
        if(jsonData!='['){
        	 jsonData += ",";
        }
        jsonData += "{type:'" + type;
        if(isNotNull == null){
        	 jsonData += "',isNotNull:'" + 0;
        }else{
        	 jsonData += "',isNotNull:'" + 1;
        }
        jsonData += "',desc:'" +desc;
        if (name) {
            jsonData += "',name:'" +name;
        }else{
        	   art.dialog.tips("接口参数设置有误！", 1000);
        	   return false ;
        }
        if (idx && !isNaN(idx)) {
            jsonData += "',idx:'" +idx;
        }else{
        	   art.dialog.tips("接口参数设置有误！", 1000);
        	   return false ;
        }
        jsonData += "'}"
    }
    jsonData += "]";
    
    $("#entityJson").val(jsonData);
    $("form").submit();
    return false;
}

function saveAdd() {
    saveEdit();
}

//禁用form标签
function disableText() {

    //输入框
    $('input,textarea,select').each(function() {
        $(this).attr('disabled', 'disabled');
    });
    //超链接
    $('a').each(function() {
        $(this).removeAttr('onclick');
        $(this).attr('href', 'javascript:void(0)');
        $(this).attr('style', 'color:#d4d8de');
    });
}

function padLeft(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = '0' + num;
        len++;
    }
    return num;
}

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        //month
        "d+": this.getDate(),
        //day
        "h+": this.getHours(),
        //hour
        "m+": this.getMinutes(),
        //minute
        "s+": this.getSeconds(),
        //second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}