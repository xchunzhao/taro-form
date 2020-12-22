## 表单组件的设计思路

### 最终目的

- 实现表单项组件受控。不需要外部维护状态
- 表单项组件的校验（`async-validator`）


### 思路
- 受控。受控的话，在 `Form`内部需要维护所有表单项的 `value`，同时需要劫持表单项组件添加 `value及onChange` 等 `props`
- 校验。由于内部维护 `value`， 所以就可以在内部执行校验流程，需要内部维护校验信息
- 由于value维护在 `Form` 内部，存在表单联动，需要暴露 `getFieldsValue` 及 `setFieldsValue` 等方法。两种思路 (都可行)：
   - 可以通过某种手段暴露form实例，该实例上保留部分方法。
   - 通过 `ref` 调用内部方法


### 实现
> 大体参考 [`rc-filed-form`](https://github.com/react-component/field-form) 的实现，但是对于小程序场景下，有一些改动

首先确定 `Form` 的使用方式：


```javascript
// 方案1
<Form>
   <FormItem>
      <Input />
   </FormItem>
</Form>

// 方案2 
<Form
  items={[
     {
        label: ,
        name: ,
        render: <Input />
     }
  ]}
>
</Form>

// 方案3
<Form
  items={[
     {
        label: ,
        name: ,
        type: 'input' | ...
     }
  ]}
>
</Form>
```
最终选用最后的方案三。原因有两点：
- 方案1的实现需要在 `FormItem` 改变 `this.props`， 这在 `Taro小程序场景` 中是不被允许的。具体可见[`Taro` Children 与组合](https://taro-docs.jd.com/taro/docs/2.x/children#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
- 方案二通过将 `children` 作为参数传递。 Taro会处理成 `React.createElement`，导致编译失败。原因未知
- 方案三在 `Form` 中根据 `type` 匹配具体的组件



### TODO
- [ ] 支持所有 `type`
- [ ] 支持 `required` 样式
- [ ] `form` 支持 `resetFields` 方法
- [ ] 支持 `class component`

