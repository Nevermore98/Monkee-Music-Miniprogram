// 格式化日期
export default function formatDate(time, isShowTime = false) {
  let date = new Date(time)

  let YY = date.getFullYear()
  let MM =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

  if (isShowTime) {
    return YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
  } else {
    return YY + '-' + MM + '-' + DD
  }
}
