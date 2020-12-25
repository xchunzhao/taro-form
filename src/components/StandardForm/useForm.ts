import { useRef } from '@tarojs/taro'
import { FormInstance, FieldEntity, ValidateResultType } from './type'

class FormStore {
  private store = {}
  private initialValues = {}
  private fieldEntities: FieldEntity[] = []

  private getFieldsValue = () => this.store
  private getFieldValue = name => this.store[name]

  private validateFields = () => {
    const validateResults: ValidateResultType[] = []
    let hasError = false
    this.fieldEntities.forEach(entity => {
      const { name } = entity.props
      const entityValue = this.getFieldValue(name)
      const validateResult = entity.validateField(entityValue)
      if (!!validateResult) {
        hasError = true
        validateResults.push(validateResult)
      }
    })
    if (hasError) {
      return { hasError, errors: validateResults }
    }
    return { hasError, values: this.getFieldsValue() }
  }

  private validateField = name => {
    const matchedEntity = this.fieldEntities.find(entity => entity.props.name === name)
    if (!matchedEntity) {
      console.error(`cannot find field name ${name}`)
      return
    }
    const entityValue = this.getFieldValue(name)
    const validateRs = matchedEntity.validateField(entityValue)
    if (!!validateRs) {
      return validateRs.error
    }
    return entityValue
  }

  private setFieldsValue = values => {
    this.store = {
      ...this.store,
      ...values,
    }
    this.fieldEntities.forEach(entity => {
      const { name } = entity.props
      Object.keys(values).forEach(key => {
        if (key === name) {
          // 触发组件更新
          entity.onStoreChange()
        }
      })
    })
  }

  private setErrorMsg = (name, message) => {
    const matchedEntity = this.fieldEntities.find(entity => entity.props.name === name)
    if (!matchedEntity) {
      console.error(`cannot find field name ${name}`)
      return
    }
    matchedEntity.setState({
      errorMsg: message,
    })
  }

  private registeField = field => {
    this.fieldEntities.push(field)
    const { initialValue, name } = field.props
    if (initialValue !== undefined && name) {
      this.initialValues = {
        ...this.initialValues,
        [name]: initialValue,
      }
      this.setFieldsValue({
        ...this.store,
        [name]: initialValue,
      })
    }
    return () => {
      // 删除组建实例
      this.fieldEntities.filter(item => item !== field)
      delete this.store[field.props.name]
    }
  }
  private setInitialValues = (initialValues, init) => {
    if (init) {
      this.initialValues = initialValues
      this.setFieldsValue(initialValues)
    }
  }

  private submit = (onFinish?, onFinishFailed?) => {
    const validateResults = this.validateFields()
    if (validateResults.hasError) {
      onFinishFailed && onFinishFailed(validateResults.errors)
    } else {
      onFinish && onFinish(validateResults.values)
    }
  }

  public getFormInstance = () =>
    ({
      getFieldsValue: this.getFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldsValue: this.setFieldsValue,
      registeField: this.registeField,
      setInitialValues: this.setInitialValues,
      validateField: this.validateField,
      setErrorMsg: this.setErrorMsg,
      submit: this.submit,
    } as FormInstance)
}

const useForm = (form?: FormInstance): [FormInstance] => {
  const formRef = useRef<FormInstance>()
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const formStore: FormStore = new FormStore()
      formRef.current = formStore.getFormInstance()
    }
  }
  return [formRef.current]
}

export default useForm
