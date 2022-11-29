import SimpleReactValidator from 'simple-react-validator';
import { useState } from 'react';

/**
 * Validator
 */
class Validator {
  /**
   * Constructor
   *
   * @param options
   */
  constructor(options = {}) {
    const [validator, setValidator] = useState(new SimpleReactValidator(options));
    this.rules = options.rules;
    this.validator = validator;
    this.setValidator = setValidator;
    this.options = options;
  }

  /**
   * Shows validate error
   */
  showErrors() {
    const simpleValidator = new SimpleReactValidator(this.options);
    simpleValidator.showMessages();
    this.setValidator(Object.assign(simpleValidator));
  }

  /**
   * Gets validator
   *
   * @returns {SimpleReactValidator}
   */
  getValidator() {
    return this.validator;
  }

  /**
   * Validate scope
   *
   * @returns {boolean}
   */
  validate() {
    return this.validator.allValid();
  }
}
export default Validator;