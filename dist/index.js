import { useEffect, useState } from "react";
import Validator from "./Validator";
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";

/**
 * Custom form class
 */
class Form {
  /**
   * Constructor
   *
   * @param fields
   * @param rules
   * @param config
   */
  constructor({
    fields,
    rules,
    config
  }) {
    const [state, setState] = useState(fields);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    this.state = state;
    this.setState = setState;
    this.errors = errors;
    this.setErrors = setErrors;
    this.errorMessage = errorMessage;
    this.setErrorMessage = setErrorMessage;
    this.validator = new Validator({
      rules
    });
    if (config && config.debug) {
      console.log('Form starts with debug. All steps will be described.');
      this.debug = true;
    }
    if (config && config.withRedux) {
      const dispatch = useDispatch();
      useEffect(() => {
        if (this.debug) {
          console.log('Setting state into dispatch. State: ', this.state);
        }
        dispatch(config.withRedux(this.state));
      }, [this.state]);
    }
  }

  /**
   * Update
   *
   * @param object
   */
  update(object) {
    this.setState(object);
  }

  /**
   * Set value in state
   *
   * @param name
   * @param value
   */
  setValue(name, value) {
    if (this.debug) {
      console.log('Updating value into state. Name: ', name, 'Value: ', value);
    }
    this.setState({
      ...this.state,
      [name]: value
    });
    console.log({
      ...this.state,
      [name]: value
    });
    this.setErrorMessage('');
    const errors = Object.assign(this.errors);
    delete errors[name];
    this.setErrors(errors);
  }

  /**
   * Validate form
   *
   * @returns {boolean}
   */
  validate() {
    if (this.validator.validate() && isEmpty(this.errors)) {
      return true;
    }
    this.showErrors();
    return false;
  }

  /**
   * Show errors
   */
  showErrors() {
    return this.validator.showErrors();
  }

  /**
   * Request to server
   *
   * @param callback
   * @param success
   * @param failed
   */
  request(callback = () => {}, success = () => {}, failed = () => {}) {
    callback(this.state).then(({
      data
    }) => success(data)).catch(({
      response
    }) => {
      this.setErrors(response.data.errors ?? {});
      this.setErrorMessage(response.data.message ?? '');
      failed(response);
    });
  }

  /**
   * Get error message for field
   *
   * @param name
   * @returns {any}
   */
  getErrors(name) {
    return this.validator.rules[name] ? this.validator.validator.message(name, this.state[name], this.validator.rules[name]) : null ?? this.errors[name];
  }
}
export default Form;