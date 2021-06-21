import { CaretDownFilled } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Row } from 'antd';
import { StyledDisplay } from '../styles/StyledDisplay';
import ChangePasswordPage from './ChangePasswordPage';
import HistoryListPage from './HistoryListPage';

const ProfileMenu = (props) => {
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <ChangePasswordPage username={props.username} />
            </Menu.Item>
            <Menu.Item key="1">
                <HistoryListPage userId={props.userId} />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3"><a onClick={() => props.onLogOut()}>Log out</a></Menu.Item>
        </Menu>
    );

    return (
        <StyledDisplay className="justify-content-center">
            <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link " onClick={e => e.preventDefault()}>
                    <Row className="justify-content-center">
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Row>
                    <Row className="justify-content-center">
                        <span>{props.username}</span>
                    </Row>
                    <Row className="justify-content-center">
                        <CaretDownFilled />
                    </Row>
                </a>
            </Dropdown>
        </StyledDisplay>
    )
}

export default ProfileMenu;