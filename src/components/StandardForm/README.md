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
>
   <FormItem label='' name='' render={<Input />} />
</Form>

// 方案3
<Form
>
   <FormItem label='' name='' type='input' />
</Form>
```
最终选用最后的方案三。原因有两点：
- 方案1的实现需要在 `FormItem` 改变 `this.props`， 这在 `Taro小程序场景` 中是不被允许的。具体可见[`Taro` Children 与组合](https://taro-docs.jd.com/taro/docs/2.x/children#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
- 方案二通过将 `children` 作为参数传递。 Taro会处理成 `React.createElement`，导致编译失败。


- 方案三在 `Form` 中根据 `type` 匹配具体的组件

----

其次是双向绑定的实现。

这个思路比较简单，劫持 `value及onChange`。这就涉及到 `value`的 `set/get`。关于 `value`状态的维护，有大概两种思路

- value维护在 `from` 的 `state`中
- 参考 `rc-field-form`中 `store`的设计

最终采用的是 `rc-field-form` 的方案。

通过提供 `FormStore` 实例，内部维护了两个数据

```javascript
  class FormStore {
     // 这是维护表单项的value集合
     private store = {}
     // 这是维护表单项组件实例本身
     private fieldEntities = []
  }
```

关于 `store` 的维护，onChange的时候会将 `setStore`, 将value存进去。
而在劫持 `value` 属性时，就是通过 `getStore` 。

但是这样会存在一个问题，表单项不会渲染
> 这是因为 `FormStore`中维护的 `store`是一个值，并不是组件中的 `state或者props`， 不会导致组件渲染

解决方案是让 `FormItem` 提供一个强制更新的方法 `forceUpdate`。这也就是 `FormStore` 内部还需要维护 `fieldEntites`的原因。

至此，`FormItem` 的双向绑定就已完成。

----
最后是字段的校验。由于 `FormStore` 中维护了所有表单项的`value`，那么做校验就比较简单了。

需要注意的有两点：
1、校验的结果回显
2、`validateTrigger`的处理

### 问题
- 由于上述方案二的限制，不支持 `FormItem` 中添加自定义的 `JSX`。
> 此问题会导致 获取手机号码input、验证码input等场景不适用

- 由于采用的方案三，导致组件原本支持的 `props` 书写起来比较麻烦
- `Taro` 中 `forwardRef`存在问题，导致 `class组件` 无法获取 `Form` 实例。[issue跟踪](https://github.com/NervJS/taro/issues/8343)



### TODO
- [ ] `form` 支持 `resetFields` 方法
- [ ] 支持 `class component`

