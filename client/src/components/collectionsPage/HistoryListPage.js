import { Avatar, Button, List, message, Modal, Popconfirm } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { BASE_URL } from '../../constants';

const HistoryListPage = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = () => {
            fetch(`${BASE_URL}/user/${props.userId}/history`)
                .then(res => res.json())
                .then(list => setData(list))
                .catch(err => setData([]));
            ;
        }
        getData();
        console.log("userId HisPage", props.userId);
    }, [isModalVisible, setIsModalVisible]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const confirmDelete = () => {
        deleteHistory();
    }

    const deleteHistory = () => {
        axios.delete(`${BASE_URL}/user/${props.userId}/history`)
            .then(res => {
                message.success(res.data.message, 3);
                setData([]);
            })
            .catch(error => {
                if (error.response) {
                    message.warning(error.response.data.message);
                }
            });
    }

    return (
        <>
            <a onClick={showModal}>
                View history
            </a>
            <Modal title="Your Histories" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className="demo-infinite-container" style={{ height: "40vh", overflow: "auto" }}>

                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        useWindow={false}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item key={item._id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                        }
                                        title={`Score: ${item.score}`}
                                        description={`Time: ${item.time}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
                {(data.length != []) ?
                    <Popconfirm placement="topLeft" title="Do you want to delete history?"
                        onConfirm={confirmDelete} okText="Yes" cancelText="No">
                        <Button type="link">
                            Clear all history?
                        </Button>
                    </Popconfirm> : ''
                }
            </Modal>
        </>
    );
};

export default HistoryListPage;