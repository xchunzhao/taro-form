import Taro, { useContext, useEffect } from '@tarojs/taro'
import Nerv from 'nervjs'
import FieldContext from './FieldContext'
import { FormItemProps } from './type'
import { AtInput } from 'taro-ui';
import { validateRules } from './utils/validateUtils';


class FormItem extends Taro.PureComponent<FormItemProps> {
  static contextType = FieldContext

  this.state = {
    errorMsg: ''
  }

  componentDidMount() {
    this.cancelRegistField = this.context.registeField(this)
  }


  getControlledProps = () => {
    const { name, validateTrigger: 'onChange' } = this.props
    // 这边存在一个问题
    // 原组件的事件会被validateTrigger截断
    const formInstance = this.context
    const originFunc = this.props[validateTrigger]
    return formInstance.getFieldValue ? {
      value: formInstance.getFieldValue(name),
      onChange: value => formInstance.setFieldsValue({ [name]: value })
      [validateTrigger]: value => {
        this.validateField()
          .catch(e => this.setState({ errorMsg: e }))
          .then(() => {
            if(originFunc){
              originFunc(value)
            }
            formInstance.setFieldsValue({ [name]: value })
          })
      }
    } : {}
  }

  onStoreChange = () => {
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.cancelRegistField && this.cancelRegistField()
  }

  validateField = () => {
    const { rules, name } = this.props;
    if (!name || !rules || !rules.length) return [];
    const cloneRule = [...rules];
    const { getFieldValue } = this.context;
    const value = getFieldValue(name);
  
    return validateRules(name, value, cloneRule);
  };

  render() {
    const { label, name } = this.props
    const controlledProps = this.getControlledProps()
    return (
      <View
        className={`formItem-wrapper wrapper-class`}
      >
        <View
          className="formItem-bottomLine bottom-line-class"
        >
          <Text
            className={'formItem-label'}
          >
            {label}
          </Text>
          {
            
            <AtInput name={name} {...controlledProps}/>
          }
        </View>
      </View>
    )
  }
}

export default FormItem