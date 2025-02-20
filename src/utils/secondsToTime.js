// 转换秒数为时分秒格式的字符串
export default (secs) => {
    const roundSecs = Math.round(secs); // 对秒数进行四舍五入处理
    const hours = Math.floor(roundSecs / (60 * 60)).toString(); // 计算小时部分并转为字符串
    const divisorForMinutes = roundSecs % (60 * 60); // 计算剩余的分钟数
    const minutes = Math.floor(divisorForMinutes / 60).toString(); // 计算分钟部分并转为字符串
    const divisorForSeconds = divisorForMinutes % 60; // 计算剩余的秒数
    const seconds = Math.ceil(divisorForSeconds).toString(); // 计算秒数部分并转为字符串
  
    // 检查转换后的值是否有效，确保不是 NaN
    if (!(Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))) {
      // 返回格式化后的时间字符串，小时、分钟、秒都进行格式化
      return `${hours === '0' ? '' : `${hours.length === 1 ? `0${hours}` : hours}:`}` // 如果小时为 0，则不显示小时
        + (minutes === '0' ? '00' : minutes.length === 1 ? `0${minutes}` : minutes) // 如果分钟为 0，则显示 '00'
        + ':' 
        + (seconds === '0' ? '00' : seconds.length === 1 ? `0${seconds}` : seconds); // 如果秒数为 0，则显示 '00'
    }
  
    // 如果计算过程中出现无效值，则返回空字符串
    return '';
  };
  