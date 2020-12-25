import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import FieldContext from './FieldContext'
import { FormItemProps, ControlProps, FieldEntity } from './type'
import { validateRules } from './utils/validateUtils'
import './index.scss'

// 目前只支持此种trigger
const defaultTrigger = 'onChange'
type FormItemState = {
  errorMsg: string | undefined
}
class FormItem extends Taro.PureComponent<FormItemProps, FormItemState> implements FieldEntity {
  constructor(props) {
    super(props)
    this.state = {
      errorMsg: undefined,
    }
  }

  static options = {
    addGlobalClass: true,
  }

  static contextType = FieldContext

  static externalClasses = ['wrapper-class', 'bottom-line-class']

  private cancelRegistField: Function

  componentDidMount() {
    this.cancelRegistField = this.context.registeField(this)
  }

  getControlledProps = () => {
    const { name, validateTrigger = 'onChange', itemProps = {} } = this.props
    // clone props中的其他属性
    const formInstance = this.context

    // value: store.getByName(name)
    // onChange: value => store.add({name: name, value: value })
    /**
     * 原事件绑定
     * <Form
     *  items=[]
     *  validateTrigger='onChange'
     *  onChange= ()=> {}
     * />
     *
     * */
    const control: ControlProps = formInstance.getFieldValue
      ? {
          ...itemProps,
          value: formInstance.getFieldValue(name),
          [defaultTrigger]: e => {
            // 返回类型有多种  原生组件为 e.detail.value  某些复杂自定义组件为 { value }  简单组件为  value
            const value = e.detail ? e.detail.value : e.value ? e.value : e
            formInstance.setFieldsValue({ [name]: value })
            // 受控组件 onChange
            const originTriggerFunc = itemProps[defaultTrigger]
            // 执行自定义onChange
            if (originTriggerFunc) {
              originTriggerFunc(e)
            }
          },
        }
      : {}
    const originValidateTriggerFunc: any = control[validateTrigger]
    /**
     * 如果未定义validateTrigger 或者 定义validateTrigger对应的Func
     * 如： {
     *        validateTrigger: 'onBlur',
     *        onBlur: () => {}
     *      }
     * 覆盖之前的func，增加校验逻辑
     * 否则只执行校验
     */
    control[validateTrigger] = value => {
      if (originValidateTriggerFunc) {
        originValidateTriggerFunc(value)
      }
      const validateRs = this.validateField(value)
      if (!!validateRs) {
        console.warn(`form-item validate error on field ${name}`, validateRs.error)
      }
    }
    return control
  }

  onStoreChange = () => {
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.cancelRegistField && this.cancelRegistField()
  }

  validateField = value => {
    const { rules = [], name } = this.props
    const validateRs = validateRules(name, value, rules)
    if (!!validateRs) {
      this.setState({
        errorMsg: validateRs.error,
      })
    } else {
      this.setState({
        errorMsg: undefined,
      })
    }
    return validateRs
  }

  renderFormItem = () => {
    const { type } = this.props
    const controlledProps = this.getControlledProps()

    let renderComp
    // 需要根据type 匹配不同表单项 参考 type定义
    switch (type) {
      case 'input': {
        //@ts-ignore
        renderComp = <AtInput {...controlledProps} />
        break
      }
      default: {
        //@ts-ignore
        renderComp = <AtInput {...controlledProps} />
        break
      }
    }
    return renderComp
  }

  render() {
    const { label, rules = [], style } = this.props
    const { errorMsg } = this.state
    const formWrapperClassname = `formItem-wrapper ${
      !!errorMsg ? 'formItem-error' : ''
    } wrapper-class`
    const required = !!rules.find(rule => !!rule.required === true)
    return (
      <View className={formWrapperClassname}>
        <View className="formItem-bottomLine bottom-line-class">
          <Text className={`formItem-label ${required ? 'formItem-label_require' : ''}`}>
            {label}
          </Text>
          <View className="formItem" style={style}>
            {this.renderFormItem()}
          </View>
          {this.props.renderExtra}
        </View>
        <View className="formItem-msg" style={{ textAlign: 'left' }}>
          <Text>{errorMsg}</Text>
        </View>
      </View>
    )
  }
}
export default FormItem
