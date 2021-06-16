import React, { useEffect, useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    min,
    max,
    step,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={min} max={max} step={step} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const cloneData = (data) => {
    const originData = [];
    for (let i = 0; i < 3; i++) {
        if (data[i]) {
            originData.push({
                id: data[i].id,
                key: i.toString(),
                name: data[i].name,
                baseSpeed: data[i].baseSpeed,
                upSpeed: data[i].upSpeed,
                target: data[i].target,
                linePoints: data[i].linePoints,//[1000, 4000, 7000],
                pointPerRow: data[i].pointPerRow,//[200, 250, 300, 350],
            });
        }
        else {
            originData.push({
                id: i,
                key: i.toString(),
                name: ``,
                baseSpeed: 0,
                upSpeed: 0,
                target: 0,
                linePoints: [],//[1000, 4000, 7000],
                pointPerRow: [],//[200, 250, 300, 350],
            });
        }

    }

    return originData;
}

const EditableTable = (props) => {
    const originData = cloneData(props.customHardLevelList);
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const [customHardLevelList, setCustomHardLevelList] = useState(props.customHardLevelList);
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            baseSpeed: '',
            upSpeed: '',
            target: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const saveToCustomHardLevelList = async (data) => {
        let list = [];
        await data.map(item => {
            if (item.name != '') {
                const target = Math.round(parseInt(item.target) * 0.04);
                const line = Math.round(parseInt(item.target) * 0.08);
                item.pointPerRow = [target, target + 20, target + 40, target + 60];
                item.linePoints = [line, line * 3, line * 5];
                list.push(item);
            }
        });
        return list;
    }

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key == item.key);

            if (index > -1) {
                const item = newData[index];
                //Add props
                item.id = item.key;
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
                const newList = await saveToCustomHardLevelList(newData);
                setCustomHardLevelList(newList);
                props.onSave(newList);
            } else {
                newData.push(row);
                setData(newData);
                const newList = await saveToCustomHardLevelList(newData);
                setCustomHardLevelList(newList);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'Target',
            dataIndex: 'target',
            width: '15%',
            editable: true,
        },
        {
            title: 'Base Speed',
            dataIndex: 'baseSpeed',
            width: '15%',
            editable: true,
        },
        {
            title: 'Up Speed',
            dataIndex: 'upSpeed',
            width: '15%',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        let min = null;
        let max = null;
        let step = null;
        if (col.dataIndex === 'upSpeed') {
            min = 0;
            max = 1;
            step = 0.05;
        } else if (col.dataIndex === 'baseSpeed') {
            min = 100;
            max = 1000;
            step = 20;
        }
        else if (col.dataIndex === 'target') {
            min = 100;
            max = 100000;
            step = 100;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: (col.dataIndex === 'upSpeed' || col.dataIndex === 'baseSpeed' || col.dataIndex === 'target')
                    ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                min: min,
                max: max,
                step: step,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
            />
        </Form>
    );
};

export default EditableTable;
