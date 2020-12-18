import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.css'
import WForm from '../Form';
import useForm from '../Form/useForm';

const Index = () => {
  const [form] = useForm()
  return (
    <WForm
      items={
        [
          {
            label: 'name',
            name: 'name',
            type: 'input'
          }
        ]
      }
      form={form}
    />
  )
}

export default Index
