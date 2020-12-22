import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import FieldContext from './FieldContext'
import { FormItemProps } from './type'
import { AtInput } from 'taro-ui'
import { validateRules } from './utils/validateUtils'
import './formItem.scss'

class FormItem extends Taro.PureComponent<FormItemProps> {

  constructor(props) {
    super(props)
    this.state = {
      errorMsg: undefined,
      forceUpdate: {}
    }
  }

  static externalClasses = ['wrapper-class', 'bottom-line-class']
  

  componentDidMount() {
    this.cancelRegistField = this.context.registeField(this)
  }


  getControlledProps = () => {
    const { name, validateTrigger='onChange' } = this.props
    // clone props中的其他属性
    const restProps = {...this.props } as FormItemProps
    const formInstance = this.context

    // value: store.getByName(name)
    // onChange: value => store.add({name: name, value: value })
    /**
     * 原事件绑定
     * <Form
     *  items=[]
     *  validateTrigger="onChange"
     *  onChange= ()=> {}
     * />
     * 
     * */
    const control = formInstance.getFieldValue ? {
      ...restProps,
      value: formInstance.getFieldValue(name),
      onChange: value => {
        formInstance.setFieldsValue({ [name]: value })
        // 受控组件 onChange
        const originTriggerFunc = restProps['onChange']
        // 执行自定义onChange
        if(originTriggerFunc) {
          originTriggerFunc(value)
        }
      },
    } : {}
    const originValidateTriggerFunc = control[validateTrigger]
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
      if(originValidateTriggerFunc) {
        originValidateTriggerFunc(value)
      }
      this.validateField(value)
    }
    return control
  }

  onStoreChange = () => {
    this.setState({
      forceUpdate: {}
    })
  }

  componentWillUnmount() {
    this.cancelRegistField && this.cancelRegistField()
  }

  validateField = value => {
    const { rules=[], name } = this.props;
    const cloneRule = [...rules];
  
    return new Promise((resolve, reject) => {
      validateRules(name, value, cloneRule)
        .then(v => {
          this.setState({
            errorMsg: undefined
          })
          resolve(v)
        })
        .catch(e => {
          this.setState({
            errorMsg: e
          })
          reject(e)
        })
    })
  }

  renderFormItem = () => {
    const { type } = this.props
    const controlledProps = this.getControlledProps()
    let renderComp
    // 需要根据type 匹配不同表单项 参考 type定义
    switch (type) {
      case 'input': {
        renderComp = <AtInput {...controlledProps} />
        break;
      }
      default: {
        renderComp = <AtInput {...controlledProps} />
        break;
      }
    }
    return renderComp
  }

  render() {
    const { label, name, errorHandler="view", rules } = this.props
    const { errorMsg } = this.state
    const formWrapperClassname = `formItem-wrapper ${!!errorMsg ? 'formItem-error' : ''} wrapper-class`
    return (
      <View
        className={formWrapperClassname}
      >
        <View
          className="formItem-bottomLine bottom-line-class"
        >
          <Text
            className={`formItem-label`}
          >
            {label}
          </Text>
          <View className="formItem">
            {this.renderFormItem()}
          </View>
        </View>
        <View className="formItem-msg" style={{ textAlign: 'left' }}>
          <Text>{errorMsg}</Text>
        </View>
      </View>
    )
  }
}

FormItem.contextType = FieldContext

export default FormItem