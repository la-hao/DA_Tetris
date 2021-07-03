import { Button as ButtonAntd, Col, Modal, Row, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

const OptionPage = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [width, setWidth] = useState(props.stageWidth);
    const [height, setHeight] = useState(props.stageHeight);

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

    //Change size
    function onAfterChangeWidth(value) {
        setWidth(value);
    }

    function onAfterChangeHeight(value) {
        setHeight(value);
    }

    return (
        <>
            <Button text="Option" callback={() => showModal()} />
            <Modal title="Options" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <ButtonAntd type="success" shape="round" block>
                            <Link to="/normal"><b>PLAY NORMAL</b></Link>
                        </ButtonAntd>
                    </Col>
                    <Col span={6}></Col>
                </Row>
                <Row>
                    <h1></h1>
                </Row>
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