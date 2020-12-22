import Taro, { Component, Config, useRef } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import WForm from '../Form'
import './index.css'
import useForm from '../Form/useForm'
import { FormItemProps } from '../Form/type';



const Index = () => {
  const [form] = useForm()


  const items = [
    {
      label: 'input1',
      name: 'input1',
      initialValue: 'wewe',
      rules: [
        {
          max: 4,
          type: 'string',
          message: '最多三个字符'
        }
      ],
      validateTrigger: 'onBlur',
      type: 'input',
      onChange: v => {
        form.setFieldsValue({'input2': v.length})
      }
    },
    {
      label: 'input2',
      name: 'input2',
      initialValue: '123',
      rules: [
        {
          max: 500,
          type: 'number',
        }
      ],
      type: 'input',
    }
  ] as FormItemProps[]

  const handleClick = () => {
    form.submit(values => {
      console.log(values)
    }, errors => {
      console.log(errors)
    })
  }

  return (
    <View>
      <WForm
        form={form}
        items={items}
        errorHandler="view"
      />
      <Button onClick={handleClick}>提交</Button>
    </View>
    
  )
}

export default Index