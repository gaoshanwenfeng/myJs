/**
 * 通过校验规则校验指定数据
 * 
 * @author zhangyun
 */
function validateText(regex, text) {
    var patrn = new RegExp(regex);
    if (!patrn.test(text)) {
        return false;
    } else {
        return true;
    }
}

function validateObj(regex, dataObj) {
    if (typeof (dataObj.val()) == 'undefined') {
        alert("要校验的数据不存在");
        return false;
    }
    var data = dataObj.val();
    return validateText(regex, data);
}

function validate(regex, dataId) {
    var dataObj = $("#" + dataId);
    return validateObj(regex, dataObj);
}
