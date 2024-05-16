import React, { useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect } from 'antd';
const { RangePicker } = DatePicker;

const formItemLayout = {
    //format size according to device
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const { TextArea } = Input;

const FormAdd = () => {
    const [uniName, setUniName] = useState('quang');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [entSocre, setEntScore] = useState(0);
    const [registedStudents, setRegistedStudents] = useState(0);
    const [target, setTarget] = useState(0);

    return (
        <Form
            {...formItemLayout}
            // variant="filled"
            style={{
                maxWidth: 600,
                marginTop: '20px',
            }}
        >
            <Form.Item
                label="University Name"
                name="Input"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                    style={{
                        marginLeft: '10px',
                    }}
                    allowClear
                    onChange={(e) => setUniName(e.target.value)}
                    value={uniName}
                />
            </Form.Item>
            <Form.Item
                label="University Code"
                name="InputCode"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input
                    allowClear
                    onChange={(e) => setUniCode(e.target.value)}
                    maxLength={3}
                    style={{
                        marginLeft: '10px',
                        maxWidth: '30%',
                    }}
                    value={uniCode}
                />
            </Form.Item>
            <Form.Item
                label="Address"
                name="TextArea"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <Input.TextArea
                    style={{
                        marginLeft: '10px',
                    }}
                    allowClear
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                />
            </Form.Item>
            <Form.Item
                label="Entrance Score"
                name="Entrance"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    min={0}
                    max={10000}
                    maxLength={5}
                    style={{
                        marginLeft: '10px',
                        maxWidth: '30%',
                    }}
                    value={entSocre}
                    onChange={(e) => setEntScore(e.target.value)}
                />
            </Form.Item>
            <Form.Item
                label="Registered "
                name="Regist"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    min={0}
                    max={10000}
                    maxLength={5}
                    style={{
                        marginLeft: '10px',
                        maxWidth: '30%',
                    }}
                    value={registedStudents}
                    onChange={(e) => setRegistedStudents(e.target.value)}
                />
            </Form.Item>
            <Form.Item
                label="Targets"
                name="Target"
                rules={[
                    {
                        required: true,
                        message: 'Please input!',
                    },
                ]}
            >
                <InputNumber
                    min={0}
                    max={10000}
                    maxLength={5}
                    style={{
                        marginLeft: '10px',
                        maxWidth: '30%',
                    }}
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                />
            </Form.Item>
        </Form>
    );
};
export default FormAdd;
