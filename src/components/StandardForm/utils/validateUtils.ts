import { ValidationRule } from '../type'

const isNullValue = va => va === null || va === undefined || va === ''
// rules 校验
export const validateRules = (name, value, rules: ValidationRule[]) => {
  // 去除（）及其内内容
  const title = (name || '').replace(/\（.*?\）/g, '')
  if (!rules || !rules.length) return
  for (const rule of rules) {
    const { message, required, type, min, max, pattern, validator } = rule
    if (required && isNullValue(value)) {
      return { name, error: message || `${title}不能为空！` }
    }
    if (type && !isNullValue(value)) {
      if (type === 'string') {
        if (min && String(value).length < min) {
          return { name, error: message || `${title}不少于${min}个字！` }
        } else if (max && String(value).length > max) {
          return { name, error: message || `${title}不超过${max}个字！` }
        }
      }
      if (type === 'number') {
        if (Number.isNaN(Number(value))) {
          return { name, error: message || `${title}请输入数字！` }
        }
        if (!isNullValue(min) && Number(value) < min!) {
          return { name, error: message || `${title}不小于${min}！` }
        } else if (!isNullValue(max) && Number(value) > max!) {
          return { name, error: message || `${title}不大于${max}！` }
        }
      }
    }
    if (pattern && !pattern.test(String(value))) {
      return { name, error: message || `${name} validate failed ` }
    }
    if (validator && !validator(value)) {
      return { name, error: message || `${name} validate failed` }
    }
  }
  return
}
