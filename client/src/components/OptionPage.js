import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Slider, Col } from 'antd';

const OptionPage = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [width, setWidth] = useState(props.stageWidth);
    const [height, setHeight] = useState(props.stageHeight);

    useEffect(() => {
        setWidth(props.stageWidth);
        setHeight(props.stageHeight);
    }, [isModalVisible, setIsModalVisible, props.stageHeight, props.stageWidth])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        props.onOK(width, height);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //Change width

    function onAfterChangeWidth(value) {
        setWidth(value);
    }

    function onAfterChangeHeight(value) {
        setHeight(value);
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Options
            </Button>
            <Modal title="Options" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Row>
                    <Col span={4}>
                        <p>Width: {width}</p>
                    </Col>
                    <Col span={12}>
                        <Slider defaultValue={width} onAfterChange={onAfterChangeWidth} min={12} max={height} step={2} />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <p>Height: {height} </p>
                    </Col>
                    <Col span={12}>
                        <Slider defaultValue={height} onAfterChange={onAfterChangeHeight} min={width} max={30} step={2} />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default OptionPage;