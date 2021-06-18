import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//Adding antd modules and style
import { Button, Modal, Form, Input, Alert, message as showMessage } from 'antd';
import "antd/dist/antd.css";
import { BASE_URL } from '../../constants';
import RegisterPage from './RegisterPage';

const CollectionCreateForm = ({ visible, onCreate, onCancel, message }) => {
    const [form] = Form.useForm();
    const displayMessage = message ? "block" : "none";
    return (
        <Modal
            visible={visible}
            title="Login"
            okText="Login"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        //form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form

                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item style={{ display: displayMessage }}>
                    <Alert message={message} type="error" />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter username!',
                        },
                    ]}
                >
                    <Input placeholder="Please input your username!" />
                </Form.Item>
                <Form.Item name="password" label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Please input your password!" />
                </Form.Item>
                <Form.Item>
                    <RegisterPage />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// const success = (text, callback) => {
//     message.success(text, 3);
//     callback();
// };

const LoginPage = (props) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [visible, setVisible]);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);

        axios.post(BASE_URL + '/user/signin', {
            username: values.username,
            password: values.password
        })
            .then(function (response) {//Thanh cong
                console.log(response);
                setVisible(false);
                showMessage.success('Login successfully !!', 3);
                //Luu user vao localStorage
                const userInfo = response.data;
                console.log('user', userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
                props.callback(userInfo);
            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
                    setMessage(error.response.data.message);
                }
            });
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
            >
                Login
            </Button>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
                message={message}
            />
        </div>
    );
};

export default LoginPage;