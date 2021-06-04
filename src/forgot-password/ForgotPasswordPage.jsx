import React, { useState } from 'react';

import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form, StatefulButton, Hyperlink } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { forgotPassword } from './data/actions';
import { forgotPasswordResultSelector } from './data/selectors';

import messages from './messages';
import { FormGroup } from '../common-components';
import { DEFAULT_STATE, LOGIN_PAGE, VALID_EMAIL_REGEX } from '../data/constants';
import { updatePathWithQueryParams, windowScrollTo } from '../data/utils';
import ForgotPasswordAlert from './ForgotPasswordAlert';

const ForgotPasswordPage = (props) => {
  const { intl, status, submitState } = props;

  const platformName = getConfig().SITE_NAME;
  const regex = new RegExp(VALID_EMAIL_REGEX, 'i');
  const [validationError, setValidationError] = useState('');

  const getValidationMessage = (email) => {
    let error = '';

    if (email === '') {
      error = intl.formatMessage(messages['forgot.password.empty.email.field.error']);
    } else if (!regex.test(email)) {
      error = intl.formatMessage(messages['forgot.password.page.invalid.email.message']);
    }

    setValidationError(error);
    return error;
  };

  sendPageEvent('login_and_registration', 'reset');

  return (
    <div>
      <span className="nav nav-tabs">
        <Link className="nav-item nav-link" to={updatePathWithQueryParams(LOGIN_PAGE)}>
          <FontAwesomeIcon className="mr-2" icon={faChevronLeft} /> {intl.formatMessage(messages['sign.in.text'])}
        </Link>
      </span>
      <div id="main-content" className="main-content">
        <Formik
          initialValues={{ email: '' }}
          validateOnChange={false}
          validate={(values) => {
            const validationMessage = getValidationMessage(values.email);

            if (validationMessage !== '') {
              windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
              return { email: validationMessage };
            }

            return {};
          }}
          onSubmit={(values) => { props.forgotPassword(values.email); }}
        >
          {({
            errors, handleSubmit, setFieldValue, values,
          }) => (
            <>
              <Helmet>
                <title>{intl.formatMessage(messages['forgot.password.page.title'],
                  { siteName: getConfig().SITE_NAME })}
                </title>
              </Helmet>
              <Form className="mw-xs">
                <ForgotPasswordAlert email={values.email} emailError={errors.email} status={status} />
                <h4>
                  {intl.formatMessage(messages['forgot.password.page.heading'])}
                </h4>
                <p className="mb-4">
                  {intl.formatMessage(messages['forgot.password.page.instructions'])}
                </p>
                <FormGroup
                  floatingLabel={intl.formatMessage(messages['forgot.password.page.email.field.label'])}
                  name="email"
                  errorMessage={validationError}
                  value={values.email}
                  handleBlur={() => getValidationMessage(values.email)}
                  handleChange={e => setFieldValue('email', e.target.value)}
                  helpText={[intl.formatMessage(messages['forgot.password.email.help.text'], { platformName })]}
                />
                <StatefulButton
                  type="submit"
                  variant="brand"
                  className="login-button-width"
                  state={submitState}
                  labels={{
                    default: intl.formatMessage(messages['forgot.password.page.submit.button']),
                    pending: '',
                  }}
                  icons={{ pending: <FontAwesomeIcon icon={faSpinner} spin /> }}
                  onClick={handleSubmit}
                  onMouseDown={(e) => e.preventDefault()}
                />
                <Hyperlink id="forgot-password" className="btn btn-link font-weight-500 text-body" destination={getConfig().LOGIN_ISSUE_SUPPORT_LINK}>
                  {intl.formatMessage(messages['need.help.sign.in.text'])}
                </Hyperlink>
                <p className="mt-5 one-rem-font">{intl.formatMessage(messages['additional.help.text'])}
                  <span><Hyperlink destination={`mailto:${getConfig().INFO_EMAIL}`}>{getConfig().INFO_EMAIL}</Hyperlink></span>
                </p>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

ForgotPasswordPage.propTypes = {
  intl: intlShape.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  status: PropTypes.string,
  submitState: PropTypes.string,
};

ForgotPasswordPage.defaultProps = {
  status: null,
  submitState: DEFAULT_STATE,
};

export default connect(
  forgotPasswordResultSelector,
  {
    forgotPassword,
  },
)(injectIntl(ForgotPasswordPage));
