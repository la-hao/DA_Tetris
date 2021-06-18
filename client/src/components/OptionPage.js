import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Slider, Col, Select } from 'antd';
import { Link } from 'react-router-dom';
import CustomPage from './CustomPage';
const { Option, OptGroup } = Select;

const OptionPage = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [width, setWidth] = useState(props.stageWidth);
    const [height, setHeight] = useState(props.stageHeight);
    const [presentHardLevel, setPresentHardLevel] = useState(props.presentHardLevel);
    const [presentHardLevelId, setPresentHardLevelId] = useState(props.presentHardLevel.id);
    const [customHardLevelList, setCustomHardLevelList] = useState(props.customHardLevelList);

    useEffect(() => {

    });
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        localStorage.setItem('presentHardLevel', JSON.stringify(customHardLevelList));
        props.onOK(width, height, presentHardLevelId, customHardLevelList);
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

    function handleChangeHardLevel(value) {
        setPresentHardLevelId(value);
    }

    function onSaveCustomHardLevel(value) {//value: list
        setCustomHardLevelList(value);
        //setPresentHardLevelId(value.id);
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Options
            </Button>
            <Modal title="Options" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <Button type="success" shape="round" block>
                            <Link to="/online"><b>PLAY ONLINE</b></Link>
                        </Button>
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
                <Row>
                    <Col span={4}>
                        <p>Hard Level: </p>
                    </Col>
                    <Col span={10}>
                        <Select defaultValue={presentHardLevel.id} style={{ width: "100%" }} onChange={handleChangeHardLevel}>
                            <OptGroup label="Basic Levels">
                                {
                                    props.basicHardLevelList?.map((item) => {
                                        return <Option value={item.id} key={item.id}>{item.name}</Option>
                                    })
                                }
                            </OptGroup>
                            {
                                customHardLevelList ?
                                    <OptGroup label="Custom Levels">
                                        {
                                            customHardLevelList?.map((item) => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            })
                                        }
                                    </OptGroup> : ''
                            }
                        </Select>
                    </Col>
                    <Col span={2}>
                        <CustomPage customHardLevelList={customHardLevelList} onOK={onSaveCustomHardLevel} />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default OptionPage;