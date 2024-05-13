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
        variant="filled"
        style={{
            maxWidth: 600,
            marginTop: '20px',
        }}
    >
        <Form.Item
            label="Tên Trường"
            name="Input"
            rules={[
                {
                    required: true,
                    message: 'Please input!',
                },
            ]}
        >
            <Input allowClear onChange={onChange} />
        </Form.Item>

        <Form.Item
            label="Mã trường"
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
                    maxWidth: '30%',
                }}
            />
        </Form.Item>

        <Form.Item
            label="Địa chỉ"
            name="TextArea"
            rules={[
                {
                    required: true,
                    message: 'Please input!',
                },
            ]}
        >
            <Input.TextArea allowClear onChange={onChange} />
        </Form.Item>

        <Form.Item
            label="Chỉ tiêu"
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
                    maxWidth: '30%',
                }}
            />
        </Form.Item>

        {/* <Form.Item
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item> */}
    </Form>
);
export default FormAdd;
