import { ElMessage } from 'element-plus'

export function toBtnConfig (item) {
  const _items = item.split(':')
  return {
    label: _items[0] || '',
    type: _items[1] || '',
    methodName: _items[2] || '',
    model: _items[3] || '',
    rule: _items[4] || '',
    powerCode: _items[5] || ''
  }
}


export function getField (fieldsJson = [], prop) {
  return fieldsJson.find(ele => ele.prop === prop)
}

export function getEnumFieldOptions (fieldsJson = [], prop) {
  let options = []
  const field = getField(fieldsJson, prop)
  if (field && field.inputType === 'enum') {
    options = field.options
  }
  return options
}

export function doCopy (content) {
  (function () {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(content)
    } else if (document.execCommand) {
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textarea)
      // eslint-disable-next-line
      return result ? Promise.resolve() : Promise.reject()
    }
    return Promise.reject(new Error('浏览器不支持复制'))
  })().then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(err => {
    ElMessage.warning(err || '复制失败')
  })
}

export function numberChinese (num) {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum = (i === 0 && strArr[i] === 0 ? '' : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? '' : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) { noWan = '0' + noWan }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
