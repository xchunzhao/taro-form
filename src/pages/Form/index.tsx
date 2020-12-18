import Taro, { useRef } from '@tarojs/taro';
import FieldContext from './FieldContext';
import FormItem from './FormItem';
import { FormProps } from './type';
import useForm from './useForm';
import { useEffect } from 'react';


const Form: Taro.FC<FormProps> = ({
  form,
  items=[],
  initialValues={},
}) => {
  const [formInstance] = useForm(form)
  const mountedRef = useRef(false)

  if(!mountedRef.current) {
    mountedRef.current = true
  }
  formInstance.setInitialValues(initialValues, !mountedRef.current)
  
  return (
    <View>
      <FieldContext.Provider value={formInstance}>
        {items.map(item => <FormItem key={item.name} {...item} />)}
      </FieldContext.Provider>
    </View>
  )
}

export default Taro.memo(Form)

/**
 * 1、表单项value 及 error信息 需要维护在Form 内部
 * 2、由于value维护在Form内部，存在表单联动的话，需要暴露 getFieldsValue 及 setFieldsValue，
 * 可以通过某种手段暴露form实例，该实例上保留部分方法。
 * 
 * 大致思路是为组件自动添加 {value, onChange }属性，有两种思路
 * 
 * 
 * 
 * const form = useForm()
 * form = {
 *  xxx; xx
 * }
 * <Form
 *  items={
 *    [{
 *      label: '',
 *      name: '',
 *      rules: [],
 *      tag: 'input'
 *     }]
 *  }
 *  initialValues={[]}
 * />
 * 
 * 校验
 * 1、正常流程
 * 2、支持自定义trigger
 */