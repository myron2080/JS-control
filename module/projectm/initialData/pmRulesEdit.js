var _index = 1;
var _rowCount = 0;
$(document).ready(function() {

    if ($edit_viewstate == "EDIT" || $edit_viewstate == "VIEW") {
        if ($edit_viewstate == "VIEW") {
            //隐藏新增按钮的层
            $("#opreator").hide();
        }

        $.post(getPath() + "/projectm/code/listItemsData", {
            ruleId: $("#dataId").val()
        },
        function(data) {
            if (data) {
                _item = data.items;
                for (var i = 0; i < _item.length; i++) {
                    _index = i + 1;
                    var _tr = "<tr _index=\"" + _index + "\" id=\"tr_" + _index + "\"><input id=\"itemId\" type=\"hidden\" value=\"" + _item[i].id + "\">";
                    _tr += "<td><select name=\"property\" key=\"" + _item[i].property + "\"  id=\"selPro_" + _index + "\" onchange=selectChange(" + _index + ",this)>" + setSelectValue() + "</select></td>";
                    _tr += "<td id=\"_td" + _index + "\" key=\"" + _item[i].format + "\"><input type=\"text\" ></td>";
                    _tr += "<td id=\"_td3" + _index + "\" key=\"" + _item[i].numLength + "\"></td>";
                    _tr += "<td><a href=javascript:void(0) onclick=delRowsEvent(this)>删除</a></td>";
                    _tr += "</tr>";
                    $("#tabBody").append(_tr);
                }
            }
        });
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
    _tr.append("<td><select style=\"width:110px\" id=\"selPro_" + _index + "\"  onchange=selectChange(" + _index + ",this)>" + setSelectValue() + "</select></td><td id=\"_td" + _index + "\"><input type=\"text\" ></td><td></td><td><a href=javascript:void(0) onclick=delRowsEvent(this)>删除</a></td>");
    $("#tabBody").append(_tr);
    if (_rowCount == 5) {
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
 * 选择系统属性值
 * 
 * @param _ind
 * @param _this
 */
function selectChange(_ind, _this) {
    var _tag = "";
    var _td3 = "";

    var _tdFormat = $("#_td" + _ind).attr("key");
    var _numLength = $("#_td3" + _ind).attr("key");
    if (_numLength == undefined) {
        _numLength = 0;
    }
    if (_tdFormat == undefined) {
        _tdFormat = "";
    }

    var _val = $(_this).children('option:selected').val();
    if (_val == "FIXEDVALUE") {
        _tag = "<input type=\"text\" value=\"" + _tdFormat + "\">";
    } else if (_val == "ORGABBREVIATION") {
        _tag = "<select  style=\"width:80px\" name=\"formatSelect\" id=\"_select" + _ind + "\"><option value=\"LEFT\" >左取</option><option value=\"RIGHT\" >右取</option></select>";
        _td3 = "<input id=\"numLength\" name=\"numLength\" type=\"text\" value=\"" + _numLength + "\">";
    } else if (_val == "ORGCODE") {
        _tag = "<select style=\"width:80px\" name=\"formatSelect\" id=\"_select" + _ind + "\"><option value=\"LEFT\" >左取</option><option value=\"RIGHT\" >右取</option></select>";
        _td3 = "<input id=\"numLength\" name=\"numLength\" type=\"text\" value=\"" + _numLength + "\">";
    } else if (_val == "SEQUENCE") {
        _tag = "从1开始,往左边补零。如:长度为[3],则为[001]<input type=\"hidden\" value=\"1\">";
        _td3 = "<input id=\"numLength\" name=\"numLength\" type=\"text\" value=\"" + _numLength + "\">";
    } else if (_val == "FORMATDATE") {
        _tag += "<SELECT id=\"formatDate\" name=\"formatDate\" >";
        _tag += "<option value=\"yyyy-MM-dd\">1979-01-01</option>";
        _tag += "<option value=\"yyyyMMdd\" >19790101</option>";
        _tag += "<option value=\"yyyy-MM\" >1979-01</option>";
        _tag += "<option value=\"yyMMdd\" >790101</option>";
        _tag += "<option value=\"yyyy\" >1979</option>";
        _tag += "<option value=\"MMdd\" >0101</option>";
        _tag += "</SELECT>";
    }
    $("#_td" + _ind).html(_tag);
    $("#_td" + _ind).parent().find("td").eq(2).html(_td3);
    $("#formatDate").find("option").each(function() {
        if ($(this).val() == _tdFormat) {
            $(this).attr("SELECTED", "SELECTED");
        }
    });
    $("#_select" + _ind).find("option").each(function() {
        if ($(this).val() == _tdFormat) {
            $(this).attr("SELECTED", "SELECTED");
        }
    });
}

/**
 * 初始化SELECT的默认值
 */
function initSelectVal() {
    setTimeout(function() {
        _rowCount = $("#itemsTable").find("tr").length - 1;
        if (_rowCount == 5) {
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
    var _itemsTable = $("#itemsTable");
    var _trLength = _itemsTable.find("tr").length
    if (_trLength == 1) {
        art.dialog.tips("请录入编码规则明细。");
        $("#addBtn").click();
        return;
    }
    if ($("#codeorgid").val() == null || $("#codeorgid").val() == "") {
        art.dialog.tips("请录入组织信息。");
        return;
    }
    if ($("#typeId").val() == null || $("#typeId").val() == "") {
        art.dialog.tips("请录入单据类型。");
        return;
    }
    var keyCode = ""; //编号示例
    var seqCount = 0; //统计序列号  
    var jsonData = "[";
    for (var i = 1; i < _itemsTable.find("tr").length; i++) {
        var _tr = _itemsTable.find("tr")[i];
        var _td1 = $(_tr).find("td").eq(0);
        var _td2 = $(_tr).find("td").eq(1);
        var _td3 = $(_tr).find("td").eq(2);
        var _type = _td1.find("select").val();
        jsonData += "{property:'" + _type;

        //拼接定义的编号示例
        if (_type == "FIXEDVALUE") {
            keyCode += _td2.find("select,input").val();
            if (!isNotNull(_td2.find("select,input").val())) {
                art.dialog.tips("第" + i + "行的格式不能为空");
                return;
            }
        }
        if (_type == "SEQUENCE") {
            //&&　_td3.find("input").val()>-1 && _td3.find("input").val()<10
            if ((isNaN(_td3.find("input").val()))) {
                art.dialog.tips("第" + i + "行的长度只能为0-9之间的数字");
                return;
            }

            if (! (_td3.find("input").val() >= 0 && _td3.find("input").val() < 10)) {
                art.dialog.tips("第" + i + "行的长度只能为0-9之间的数字");
                return;
            }

            keyCode += padLeft(1, _td3.find("input").val());
            seqCount += 1;
        }
        if (_type == "FORMATDATE") {
            keyCode += new Date().format(_td2.find("select,input").val());
        }
        if (_type == "ORGCODE" || _type == "ORGABBREVIATION") {
            keyCode += _type == "ORGCODE" ? "编码": "简称";
            if (isNaN(_td3.find("input").val())) {
                art.dialog.tips("第" + i + "行的长度只能为0-9之间的数字");
                return;
            }
            if (! (_td3.find("input").val() >= 0 && _td3.find("input").val() < 10)) {
                art.dialog.tips("第" + i + "行的长度只能为0-9之间的数字");
                return;
            }
        }

        if (_td2.find("select,input").val() != undefined) {
            jsonData += "',format:'" + _td2.find("select,input").val();
        }
        if (_td3.find("input").val() != undefined) {
            jsonData += "',numLength:'" + _td3.find("input").val();
        }
        if ($(_tr).find("input#itemId").val() != undefined) {
            jsonData += "',id:'" + $(_tr).find("input#itemId").val();
        }
        jsonData += "',orderBy:'" + $(_tr).attr("_index");
        jsonData += "'},"
    }
    jsonData = jsonData.substring(0, jsonData.length - 1);
    jsonData += "]";
    //检查是否有序列号
    if (jsonData.indexOf("SEQUENCE") == -1 || seqCount > 1) {
        art.dialog.tips("系统属性中必须且只能包含一条顺序号.", 1000);
        return;
    }
    $("#example").val(keyCode);
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