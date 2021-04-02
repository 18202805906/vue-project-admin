/*
 * @Author: Bwrong
 * @Github: https://github.com/BWrong
 * @Date: 2020-07-17 15:45:43
 * @LastEditors: Bwrong
 * @LastEditTime: 2020-08-12 15:18:59
 */

/**
 * 校验一般的字符
 * @param {*} hasCh 是否包含中文
 * @param {*} hasEn 是否包含英文
 * @param {*} hasNum 是否包含数字
 * @param {*} otherChar 需要包含的其他特殊字符
 */
export function validateNormalChar(hasCh = true, hasEn = true, hasNum = true, otherChar = '') {
  const reg = new RegExp(`^[${hasCh ? '\\u4e00-\\u9fa5' : ''}${hasEn ? 'a-zA-Z' : ''}${hasNum ? '\\d' : ''}${otherChar}]*$`);
  return function (rule, value, callback) {
    if(!value) return callback();
    value = String(value);
    value.match(reg) ? callback() : callback(new Error(`内容包含不合法的字符，仅允许${hasCh ? '中文 ' : ''}${hasEn ? '字母 ' : ''}${hasNum ? '数字 ' : ''}${otherChar}`));
  };
}
/**
 * 校验整数
 * @param {*} minLength 最小位数
 * @param {*} maxLength 最大位数
 */
export function validateInt(minLength = 0, maxLength = '') {
  const reg = new RegExp(`^-?\\d{${minLength},${maxLength}}$`);
  return function (rule, value, callback) {
    if(!value) return callback();
    value = String(value);
    value.match(reg) ? callback() : callback(new Error('格式不正确'));
  };
}
/**
 * 校验浮点数
 * @param {*} dig 小数位数, 默认为不限制
 */
export function validateFloat(dig='') {
  const reg = new RegExp(`^-?\\d+(.\\d{0,${dig}})?$`);
  return function (rule, value, callback) {
    if(!value) return callback();
    value = String(value);
    value.match(reg) ? callback() : callback(new Error('格式不正确'));
  };
}
/**
 * 验证用户名，默认包含字母、数字，以字母开始
 * @param {*} minLength 最小长度
 * @param {*} maxLength 最大长度
 * @param {*} otherChar 允许的其他字符
 */
export function validateUsername(minLength = 5, maxLength = 20, otherChar = '_') {
  const reg = new RegExp(`^[a-z][a-zA-Z0-9${otherChar}]{${minLength-1},${maxLength-1}}`,'i');
  return function (rule, value, callback) {
    !value || value.match(reg) ? callback() : callback(new Error(`用户名格式不正确，包含字母 数字 ${otherChar}，须以字母开始，长度${minLength}-${maxLength}位`));
  };
}
/**
 * 校验密码
 * @param {*} minLength 最小位数
 * @param {*} maxLength 最大位数
 */
export function validatePassword(minLength=8, maxLength=18){
  return function (rule, value, callback) {
    if(!value.match(/^(?![^a-zA-Z]+$)(?!\D+$)/)){
      return callback(new Error('密码必须包含字母和数字'));
    }
    if (value.length < minLength || value.length > maxLength) {
      return callback(new Error(`密码长度应为${minLength}-${maxLength}位`));
    }
    callback();
  };
}
/**
 * 手机号校验
 */
export function validatePhone() {
  const reg = /^1\d{10}$/;
  return function (rule, value, callback) {
    !value || value.match(reg) ? callback() : callback(new Error('手机号格式不正确'));
  };
}
/**
 * 传真号、座机号校验
 */
export function validateFax() {
  const reg = /^\d{3}-\d{8,11}$/;
  return function (rule, value, callback) {
    !value || value.match(reg) ? callback() : callback(new Error('格式不正确'));
  };
}
/**
 * 验证身份证，暂时只是实现了简单的
 */
export function validateIdCard() {
  const reg = /^[0-9]{14,17}[0-9x]$/;
  return function(rule, value, callback) {
    !value || value.match(reg) ? callback() : callback(new Error('身份证号格式不正确'));
  };
}
/**
 * 验证url，暂时只是实现简单验证
 */
export function validateUrl() {
  const reg = /^(ht|f)tps?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
  return function(rule, value, callback) {
    !value || value.match(reg) ? callback() : callback(new Error('内容格式不正确'));
  };
}
/**
 * 验证版本号
 */
export function validateVersion() {
  let regsx = RegExp(/^[A-Za-z0-9.]+$/);
  return function(rule, value, callback){
    if (regsx.test(value)) {
        callback();
        return;
    }else{
      callback(new Error('英文字母、数字和点的组合'));
    }
  };
}
 /**
  * 校验用户输入的值是否是键盘上三个能连成一条线的（包含连续数字问题）
  * 这里并没有兼容Shift键，如p;/和p;?和p:/和p:?都是同一条线，我们只计没按Shift键的情况
  */
  export function testPassWord (v) {
    // "asdfghjkl;'\\"
    const arr = ['1234567890-=','qwertyuiop[]','asdfghjkl;','zxcvbnm,./'];
    let array = [];
    for(let i = 0;i < arr.length;i ++){
      let t = arr[i];
      for(let l = 0;l < t.length;l ++){
        if(i < 2){
          let _k = t.substring(l,l + 1) + (arr[i + 1]||'').substring(l,l + 1) + (arr[i + 2]||'').substring(l,l + 1);
          _k.length == 3 && array.push(_k,_k.split('').reverse().join(''));
        }
        if(l < t.length - 2){
          let _t = t.substring(l,l + 3);
          array.push(_t,_t.split('').reverse().join(''));
        }
      }
    };
    for(let p = array.length; p --;){
      if(v.toLowerCase().indexOf(array[p]) != -1){
        return false;
      }
    };
    return true;
  }
/**
 * 
 */