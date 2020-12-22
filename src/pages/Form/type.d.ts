import AtForm, { AtFormProps } from 'taro-ui/types/Form'
import { AtInputProps } from 'taro-ui/types/input'

export interface FormProps extends AtFormProps {
  items?: (FormItemProps | FormItemProps[])[]
  initialValues?: { [key: string]: any }
  // 表单值变化监听
  onValuesChange?: (
    changeValues: { [key: string]: any },
    allValues?: { [key: string]: any },
  ) => void
}

export type ValidationRule = {
  // message?: React.ReactNode
  message?: string
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: 'string' | 'number'
  /** indicates whether field is required */
  required?: boolean
  /** validate the min length of a field */
  min?: number
  /** validate the max length of a field */
  max?: number
  /** validate from a regular expression */
  pattern?: RegExp
  /** custom validate function (Note: callback must be called) */
  validator?: (value: any, callback: any, rule: any, source?: any) => any
}

export interface FormItemProps extends Omit<AtInputProps, 'onChange'> {
  label?: string
  name: string
  initialValue?: any
  rules?: ValidationRule[]
  type?: 'input' | 'textarea' | 'picker' | 'adressPicker' | 'checkbox' | 'radio'
  // 触发时机 默认onChange
  validateTrigger?: string | string [] | false
  /**
   * toast 将错误信息toast
   * view 将toast信息展示
   * 默认view
   */
  errorHandler?: 'toast' | 'view'
}