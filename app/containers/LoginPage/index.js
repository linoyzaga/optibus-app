import React from 'react';
import { Form, Icon, Input, Button, notification } from 'antd';
import H1 from '../../components/H1';
import styles from './LoginPage.css';
import API from '../../API/api';

const FormItem = Form.Item;

export class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null,
    };

    this.login = this.login.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(name, value) {
    this.setState({
      [name]: value.target.value,
    });
  }

  login() {
    const openNotificationWithIcon = (type) => {
      notification[type]({
        message: 'Error Notification',
        description: this.state.error,
      });
    };

    API.login(this.state.username, this.state.password).then((res) => {
      localStorage.setItem('token', JSON.stringify(res.data.token));

      this.props.history.push('/home');
    }).catch((error) => {
      this.setState({
        error: error.response.data.message,
      });

      openNotificationWithIcon('error');
    });
  }

  render() {
    return (
      <div>
        <H1>Login</H1>
        <Form className="login-form">
          <FormItem>
            <Input
              className={styles['login-form']}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              onChange={(value) => this.handleSelectChange('username', value)}
            />
          </FormItem>
          <FormItem>
            <Input
              className={styles['login-form']}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              onChange={(value) => this.handleSelectChange('password', value)}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['login-form']}
              onClick={this.login}
            >
              Let me in
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedLoginPage = Form.create()(LoginPage);

export default WrappedLoginPage;
