function formatPriceDecimal(money, sysmbol = '¥', places = 2) {
  const zero = `${sysmbol}0.00`

  if (isNaN(money) || money === '') return zero

  if (money && money != null) {
    money = `${money}`
    let left = money.split('.')[0] // 小数点左边部分
    let right = money.split('.')[1] // 小数点右边
    // 保留places位小数点，当长度没有到places时，用0补足。
    right = right
      ? right.length >= places
        ? '.' + right.substr(0, places)
        : '.' + right + '0'.repeat(places - right.length)
      : '.' + '0'.repeat(places)
    var temp = left
      .split('')
      .reverse()
      .join('')
      .match(/(\d{1,3})/g) // 分割反向转为字符串然后最多3个，最少1个，将匹配的值放进数组返回
    const numericalSymbols = Number(money) < 0 ? '-' : ''
    return (
      sysmbol +
      numericalSymbols +
      temp.join(',').split('').reverse().join('') +
      right
    ) // 补齐正负号和货币符号，数组转为字符串，通过逗号分隔，再分割（包含逗号也分割）反向转为字符串变回原来的顺序
  } else if (money === 0) {
    return zero
  } else {
    return zero
  }
}

export { formatPriceDecimal }
