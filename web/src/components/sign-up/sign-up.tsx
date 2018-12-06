import * as React from 'react';
import StateTree from '../../stores/tree';
import API from '../../services/api';
import { connect } from 'react-redux';
import { CheckIcon, OldPlayIcon, CautionIcon } from '../ui/icons';

import './sign-up.css';

interface PropsFromState {
  api: API;
}

interface State {
  email: string;
  buttonStyle: string;
  buttonHtml: any;
}

class SignUp extends React.Component<PropsFromState, State> {
  constructor(props: PropsFromState, context: any) {
    super(props, context);
    const { api } = this.props;
    this.state = {
      email: '',
      buttonStyle: 'submit-button',
      buttonHtml: <OldPlayIcon className="icon" />,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.setState({ email: event.target.value });
    if (this.state.buttonStyle != 'submit-button') {
      this.setState({ buttonStyle: 'submit-button' });
      this.setState({ buttonHtml: <OldPlayIcon className="icon" /> });
    }
  }

  private isValidEmailAddress() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.email);
  }

  private setButtonState = () => {
    if (this.isValidEmailAddress()) {
      this.subscribeToNewsletter();
    } else {
      this.setState({ buttonStyle: 'error-button' });
      this.setState({ buttonHtml: <CautionIcon className="icon" /> });
    }
  };

  private subscribeToNewsletter = () => {
    this.props.api
      .subscribeToNewsletter(this.state.email)
      .then(result => {
        this.setState({ email: 'Submitted' });
        this.setState({ buttonStyle: 'success-button' });
        this.setState({ buttonHtml: <CheckIcon className="icon" /> });
      })
      .catch(err => {
        this.setState({ buttonStyle: 'error-button' });
        this.setState({ buttonHtml: <CautionIcon className="icon" /> });
        throw new Error(err.message);
      });
  };

  render() {
    const { api } = this.props;

    return (
      <span className="submission">
        <input
          type="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <div className={this.state.buttonStyle} onClick={this.setButtonState}>
          {this.state.buttonHtml}
        </div>
      </span>
    );
  }
}

export default connect<PropsFromState, State>(({ api }: StateTree) => ({
  api,
}))(SignUp);
