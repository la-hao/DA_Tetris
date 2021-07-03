import { SettingOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
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

            <Modal title="Customize Hard Levels" visible={isModalVisible} width="60vw"
                onOk={handleOk} onCancel={handleCancel} style={{ maxWidth: "60vw", minWidth: 300 }} >
                <div className="demo-infinite-container" style={{ minHeight: 260, maxHeight: "40vh", overflow: "auto" }}>

                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        useWindow={false}
                    >
                        <EditableTable customHardLevelList={customHardLevelList} onSave={onSave} />
                    </InfiniteScroll>
                </div>
            </Modal>
        </>
    );
};

export default CustomPage;