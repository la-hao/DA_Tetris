import React, { useEffect, useState } from 'react';
import { Modal, Button, Tooltip, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import EditableTable from './EditableTable';


const CustomPage = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customHardLevelList, setCustomHardLevelList] = useState(props.customHardLevelList);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        props.onOK(customHardLevelList);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onSave = (list) => {
        localStorage.setItem('customHardLevelList', JSON.stringify(list));
        setCustomHardLevelList(list);
        props.onOK(list);
    }
    return (
        <>
            <Tooltip title="Customize">
                <Button shape="circle" style={{ width: "30px", height: "30px", border: 0 }} onClick={showModal}>
                    <SettingOutlined style={{ fontSize: 20 }} />
                </Button>
            </Tooltip>

            <Modal title="Customize Hard Levels" visible={isModalVisible}
                onOk={handleOk} onCancel={handleCancel} width={"60%"}>
                <EditableTable customHardLevelList={customHardLevelList} onSave={onSave} />
            </Modal>
        </>
    );
};

export default CustomPage;