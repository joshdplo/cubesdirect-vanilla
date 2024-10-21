import { getUserDataFromPage } from './formUtils.js';
import extractFields from '../../../validation/extractFields.js';

class FormHandler {
  constructor(formElement, schema, endpoint) {
    this.form = formElement;
    this.schema = schema;
    this.endpoint = endpoint;
    this.messageContainer = formElement.querySelector('.messages');

    this.init();
  }

  // Initialize form event listener
  init() {
    this.form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  // Collect form data into an object
  getFormData() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }

  // Validate form data with Joi schema
  async validate(data) {
    try {
      const fields = Object.keys(data);
      const extractedSchema = extractFields(this.schema, fields);
      const value = await extractedSchema.validateAsync(data, { abortEarly: false }); // validate all fields

      return { value, errors: null };
    } catch (error) {
      console.log('VALIDATION ERROR:', error);

      const errors = error.details ?
        error.details.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {})
        : { general: 'Validation failed' }; // fallback error message if details are missing
      return { value: null, errors };
    }
  }

  // Check if password and password confirmation match
  // register: { password, passwordConfirm }
  // change pass: { newPassword, newPasswordConfirm }
  validatePasswordConfirmations(data) {
    const errorText = 'Passwords do not match';

    // Standard password confirms (register)
    if (data.password &&
      data.passwordConfirm &&
      data.password !== data.passwordConfirm) {
      return { passwordConfirm: errorText };
    }

    // New Password confirms (change password)
    if (data.newPassword &&
      data.newPasswordConfirm &&
      data.newPassword !== data.newPasswordConfirm) {
      return { newPasswordConfirm: errorText };
    }

    return null;
  }

  // Display errors to user
  displayErrors(errors) {
    this.messageContainer.innerHTML = Object.values(errors)
      .map((err) => `<p>${err}</p>`)
      .join('');
  }

  // Display message to user
  displayMessage(message) {
    if (!message) return;
    this.messageContainer.innerHTML = message;
  }

  // Clear existing errors
  clearErrors() {
    this.messageContainer.innerHTML = '';
  }

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault();
    this.clearErrors();

    const data = this.getFormData();

    // validate form data
    const { value, errors } = await this.validate(data);

    if (errors) {
      this.displayErrors(errors);
    } else {
      const passwordErrors = this.validatePasswordConfirmations(data);
      if (passwordErrors) {
        this.displayErrors(passwordErrors);
      } else {
        console.log('Validation Success:', value);

        // Get user data
        const userData = getUserDataFromPage();
        if (userData) value.user = userData;

        // Submit form
        try {
          const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value)
          });

          if (!response.ok) {
            let errorMessage = 'Error with form response';
            if (response.status === 400) {
              const result = await response.json();
              errorMessage = result.error ? result.error : 'Email or password is incorrect'
            };
            throw new Error(errorMessage);
          }

          const result = await response.json();
          this.handleSuccess(result);
        } catch (error) {
          console.error('Error submitting form:', error);
          this.displayErrors({ server: error.message });
        }
      }
    }
  }

  // Handle Success
  handleSuccess(result) {
    if (result.success) {
      this.displayMessage(result.message || 'Success!');
      if (result.redirect) window.location.href = result.redirect;
    } else {
      this.displayMessage(result.error || 'Something went wrong.');
    }
  }
}

export default FormHandler;