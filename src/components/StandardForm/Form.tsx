import Taro, { useRef } from '@tarojs/taro'
import FieldContext from './FieldContext'
import { FormProps } from './type'
import useForm from './useForm'

const Form: Taro.FC<FormProps> = ({ form, initialValues = {}, children }) => {
  const [formInstance] = useForm(form)
  const mountedRef = useRef(false)

  if (!mountedRef.current) {
    mountedRef.current = true
  }
  formInstance.setInitialValues(initialValues, !mountedRef.current)

  return <FieldContext.Provider value={formInstance}>{children}</FieldContext.Provider>
}

export default Taro.memo(Form)
