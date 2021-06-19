import { Avatar, Row } from 'antd';
import { StyledDisplay } from '../styles/StyledDisplay';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import '../../App.css';
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