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
            title="Change your password"
            okText="Submit"
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

                <Form.Item name="currentPassword" label="Current Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your current password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Please input your current password!" />
                </Form.Item>

                <Form.Item name="newPassword" label="New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your new password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Please input your new password!" />
                </Form.Item>

                <Form.Item name="confirmPassword" label="Confirm Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm new password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Please confirm your new password!" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// const success = (text, callback) => {
//     message.success(text, 3);
//     callback();
// };

const ChangePasswordPage = (props) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [visible, setVisible]);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        //validate values before post to server
        if (values.newPassword != values.confirmPassword) {
            setMessage("Please check your password confirmation !");
            return;
        }
        axios.post(BASE_URL + '/user/change-password', {
            username: props.username,
            newPassword: values.newPassword,
            currentPassword: values.currentPassword
        })
            .then(function (response) {//Thanh cong
                console.log(response);
                setVisible(false);
                showMessage.success('Change your password successfully !!', 3);
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
            <a onClick={() => {
                setVisible(true);
            }}>
                Change password
            </a>
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

export default ChangePasswordPage;