import React from 'react';
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

const onChange = (e) => {
    console.log(e);
};

const FormAdd = () => (
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
                onChange={onChange}
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
                onChange={onChange}
                maxLength={3}
                style={{
                    marginLeft: '10px',
                    maxWidth: '30%',
                }}
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
                onChange={onChange}
            />
        </Form.Item>

        <Form.Item
            label="Cutoff Score"
            name="InputNumber"
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
            />
        </Form.Item>

        <Form.Item
            label="Registered "
            name="InputNumber"
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
            />
        </Form.Item>
        <Form.Item
            label="Targets"
            name="InputNumber"
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
            />
        </Form.Item>
    </Form>
);
export default FormAdd;
