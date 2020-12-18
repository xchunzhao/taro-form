import { ValidationRule } from "../type";

const isNullValue = va => va === null || va === undefined || va === ''
// rules 校验
export const validateRules = (name, value, rules: ValidationRule[]) =>
  new Promise((resolve, reject) => {
    // 去除（）及其内内容
    const title = (name || '').replace(/\（.*?\）/g, '')
    if (!rules || !rules.length) resolve()
    for (const rule of rules) {
      const { message, required, type, min, max, pattern, validator } = rule || {}
      if (required && isNullValue(value)) {
        reject(message || `${title}不能为空！`)
        return
      }
      if (type && !isNullValue(value)) {
        if (type === 'string') {
          if (min && String(value).length < min) {
            reject(message || `${title}不少于${min}个字！`)
            return
          } else if (max && String(value).length > max) {
            reject(message || `${title}不超过${max}个字！`)
            return
          }
        }
        if (type === 'number') {
          if (Number.isNaN(Number(value))) {
            reject(message || `${title}请输入数字！`)
            return
          }
          if (!isNullValue(min) && Number(value) < min!) {
            reject(message || `${title}不小于${min}！`)
            return
          } else if (!isNullValue(max) && Number(value) > max!) {
            reject(message || `${title}不大于${max}！`)
            return
          }
        }
      }
      if (pattern && !pattern.test(String(value))) {
        reject(message || false)
        return
      }
      if (validator) {
        validator(
          value,
          error => {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          },
          rule,
          { ...item, title },
        )
        return
      }
    }
    resolve()
  })