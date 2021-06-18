import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//Adding antd modules and style
import { Button, Modal, Form, Input, Alert, message as showMessage } from 'antd';
import "antd/dist/antd.css";
import { BASE_URL } from '../../constants';

const CollectionCreateForm = ({ visible, onCreate, onCancel, message }) => {
    const [form] = Form.useForm();
    const displayMessage = message ? "block" : "none";
    return (
        <Modal
            visible={visible}
            title="Register"
            okText="Sign up"
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
                <Form.Item name="confirmPassword" label="Confirm Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Please confirm your password!" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// const success = (text, callback) => {
//     message.success(text, 3);
//     callback();
// };

const RegisterPage = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [visible, setVisible]);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        //validate values before post to server
        if (values.username.length <= 3) {
            setMessage("Username must be longer than 3 characters !");
            return;
        }
        if (values.password != values.confirmPassword) {
            setMessage("Please check your password confirmation !");
            return;
        }
        axios.post(BASE_URL + '/user/signup', {
            username: values.username,
            password: values.password,
        })
            .then(function (response) {//Thanh cong
                console.log(response);
                setVisible(false);
                showMessage.success('Creat new account successfully !!', 3);
                //Luu user vao localStorage
                // const userInfo = response.data;
                // console.log('user', userInfo);
                // localStorage.setItem('user', JSON.stringify(userInfo));
                // props.callback(userInfo);
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
                type="link"
                onClick={() => {
                    setVisible(true);
                }}
            >
                Create new account?
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

export default RegisterPage;