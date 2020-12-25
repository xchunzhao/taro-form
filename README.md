### Taro-Form
> 一个适用在Taro项目中Form表单组件

### 设计思路
> 主要参考 [`rc-field-form`](https://github.com/react-component/field-form)的实现

[设计文档](./src/components/StandardForm/README.md)

### API

- hooks `useForm`

- `StandardForm`

| Props | Type | Required | Default | Description |
| ------ | ------ | ------ | ------ | ------- |
| `form` | `FormInstance` | false | undefined | form表单实例 |
| `initialValues` | `{ [key: string]: any }` | false | undefined | 表单初始值 |


- `FormItem`

| Props | Type | Required | Default | Description |
| ------ | ------ | ------ | ------ | ------ |
| `style | `CSSProperties` | false | {} | 表单项样式 |
| `label` | string | true | '' | 表单项label |
| `name` | string | true | '' | 表单项name |
| `initialValue` | any | false | {} | 表单项初始值 |
| `rules` | ValidationRule[] | false | [] | 表单项校验规则 |
| `type` | ItemType | false | 'input' | 表单项类型 |
| `itemProps` | `{ [props: string]: any }` | false | {} | 表单项props |
| `validateTrigger` | string | false | 'onChange' | 触发校验的trigger |
| `renderExtra` | JSX.Element | false | undefined | 表单项额外节点 |

### 基本使用

```javascript
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
```


### TODO
- [ ] 支持 `class 组件`
- [ ] 支持 其他常用自定义组件