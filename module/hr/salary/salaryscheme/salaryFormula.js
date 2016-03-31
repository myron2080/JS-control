
//增加项目到公式
function addItem2Formula(e,item){
	addTextToFormula(item);
}
//添加关键字到公式
function addKeyToFormula(key){
	addTextToFormula(key);
}
//将文本添加到输入框中光标位置
function addTextToFormula(txt){
	var tt = $('#formula');
	tt.focus();
	tt = document.getElementById('formula');
	if(document.selection && document.selection.createRange!='undefined'){//ie
		document.selection.createRange().text=txt;
	}else if (typeof tt.selectionStart === 'number' && typeof tt.selectionEnd === 'number') {
        var startPos = tt.selectionStart,
        endPos = tt.selectionEnd,
        cursorPos = startPos,
        tmpStr = tt.value;
	    tt.value = tmpStr.substring(0, startPos) + txt + tmpStr.substring(endPos, tmpStr.length);
	    cursorPos += txt.length;
	    tt.selectionStart = tt.selectionEnd = cursorPos;
	}
}


function changeFormula(id,formula,obj){
	$("#formula").val(formula.replace(/~!~/g,"\n"));
	$(".calculators01").find("span").removeClass("btn bluebtn mb5");
	$(".calculators01").find("span").addClass("btn graybtn mb5");
	$(obj).parent().removeClass("btn graybtn mb5");
	$(obj).parent().addClass("btn bluebtn mb5");
}