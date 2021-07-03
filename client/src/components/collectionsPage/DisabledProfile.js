import { UserOutlined } from '@ant-design/icons';
import { Avatar, Row } from 'antd';
import React from 'react';
import '../../App.css';
import { StyledDisplay } from '../styles/StyledDisplay';

const DisabledProfile = () => {
    return (
        <StyledDisplay className="justify-content-center">
            <a>
                <Row className="justify-content-center">
                    <Avatar icon={<UserOutlined />} />
                </Row>
                <Row className="justify-content-center">
                    <p className="breakline">UserName</p>
                </Row>
            </a>
        </StyledDisplay>
    )
}

export default DisabledProfile;