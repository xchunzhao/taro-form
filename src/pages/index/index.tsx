import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { StandardForm, FormItem, useForm } from '../../components/StandardForm'
import './index.css'




const Index = () => {
  const [form] = useForm()

  const handleSubmit = () => {
    form.submit(values => console.log(values), errors => console.log(errors))
  }
  return (
    <View>
      <StandardForm
        form={form}
      >
        <FormItem
          label="姓名"
          name="name"
          itemProps={{
            placeholder: '请填写姓名'
          }}
          rules={[
            {
              required: true,
              message: '请填写姓名'
            },
            {
              max: 10,
              type: 'string',
              message: '姓名最长为10个字符'
            }
          ]}
        />
        <FormItem
          label="手机号"
          name="phone"
          itemProps={{
            placeholder: '请填写phone'
          }}
          rules={[
            {
              required: true,
              message: '请填写姓名'
            },
            {
              pattern: /^1[3456789]\d{9}$/,
              message: '请输入正确的手机号'
            }
          ]}
        />
      </StandardForm>
      <Button onClick={handleSubmit}>提交</Button>
    </View>
    
  )
}

export default Index