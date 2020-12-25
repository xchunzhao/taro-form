import { CSSProperties } from "react";

export interface FormProps {
  form?: FormInstance
  initialValues?: { [key: string]: any }
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
  /** custom validate function only support sync method */
  validator?: (value: any) => boolean
}

type ItemType =
  | 'input'
  | 'textarea'
  | 'picker'
  | 'checkbox'
  | 'radio'

export interface FormItemProps {
  style?: string | CSSProperties
  label?: string
  name: string
  initialValue?: any
  rules?: ValidationRule[]
  type?: ItemType
  //这边类型无法动态推导 暂时先让lint通过
  itemProps?: {
    [props: string]: any
  }
  // 触发时机 默认onChange
  validateTrigger?: string
  renderExtra?: JSX.Element
}

export type FormInstance = {
  getFieldsValue: Function
  getFieldValue: Function
  setFieldsValue: Function
  registeField: Function
  setInitialValues: Function
  validateField: (name: string) => any
  // 当异步校验的时候，将校验信息放到表单内可使用
  setErrorMsg: (name: string, message: string) => void
  submit: (
    onFinish?: (values: Store) => void,
    onFinishFailed?: (errors: ValidateResultType[]) => void,
  ) => void
}

export type StoreValue = any
export interface Store {
  [name: string]: StoreValue
}

export interface IValidateResults {
  hasError: boolean
  errors: ValidateResultType[]
  values: Store
}

export type ValidateType = string | undefined

export type ValidateResultType =
  | {
      name: string
      error: ValidateType
    }
  | undefined
export interface FieldEntity {
  onStoreChange: () => void
  setState: Function
  validateField: (value: any) => ValidateResultType
  props: {
    name: string
    rules?: ValidationRule[]
    initialValue?: any
  }
}

export type ControlProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any
}
