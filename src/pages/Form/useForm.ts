import Taro, { useRef } from '@tarojs/taro'

const useForm =  (form) => {
  const formRef = useRef()
  if(!formRef.current) {
    if(form){
      formRef.current = form
    } else {
      const formStore = new FormStore()
      formRef.current = formStore.getFormInstance()
    }
  }
  return [formRef.current]
}

class FormStore {
  // 维护
  private store = {}
  private initialValues = {}
  private fieldEntities = []

  private getFieldsValue = () => this.store
  private getFieldValue = name => this.store[name]

  private validateFields = () => {
    const validateResults = this.fieldEntities.map(entity => {
      const validateResult = entity.validateField() as Promise
      const { name } = entity.props
      return validateResult
                .then(() => ({ name, errors: [] }))
                .catch(error => Promise.reject({ name, errors }))
    })
    let hasError = false
    let count = validateResults.length
    const results = []
    return new Promise((resolve, reject) => {
      validateResults.forEach((promise, index) => {
        promise
          .then(result => {
            count -= 1
            results[index] = result
            if(count > 0) {
              return;
            }
            if(hasError) {
              reject(results)
            }
            resolve(this.getFieldsValue)
          })
          .catch(e => {
            hasError = true
            return e
          })
      })
    })
  }

  private setFieldsValue = values => {
    this.store = {
      ...this.store,
      ...values
    }
    this.fieldEntities.forEach(entity => {
      const { name } = entity.props;
      Object.keys(values).forEach(key => {
        if (key === name) {
          // 触发组件更新
          entity.onStoreChange();
        }
      })
    })
  }

  private registeField = field => {
    this.fieldEntities.push(field)
    const { initialValue, name } = field.props
    if(initialValue !== undefined && name) {
      this.initialValues = {
        ...this.initialValues,
        [name]: initialValue
      }
      this.setFieldsValue({
        ...this.store,
        [name]: initialValue
      })
    }
    return () => {
      // 删除组建实例
      this.fieldEntities.filter(item => item !== field)
      delete this.store[field.props.name]
    }
  }
  private setInitialValues = (initialValues, init) => {
    if(init) {
      this.initialValues = initialValues
      this.setFieldsValue(initialValues)
    }
  }

  public getFormInstance = () => ({
    getFieldsValue: this.getFieldsValue,
    getFieldValue: this.getFieldValue
    setFieldsValue: this.setFieldsValue,
    registeField: this.registeField,
    setInitialValues: this.setInitialValues
  })
}

export default useForm