import React, { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip } from 'antd';
import 'firebase/auth';
import { ref, child, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { database } from '../firebaseConfig.js';
import './css/formAddSchool.css';
import { useTranslation } from 'react-i18next';

const FormAdd = ({ UniData, setUniData }) => {
    const [isModalVisible, setVisible] = useState(false);
    const [uniName, setUniName] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [averageScore, setAverageScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const { t } = useTranslation('modalUni');

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        let hasError = false;
        if (uniName === '' || address === '' || averageScore === null || targetScore === null || uniCode === '') {
            toast.error('Please fill in all information');
            hasError = true;
            if (uniName !== '') {
                if (uniCode !== '') {
                    if (!validateName(uniCode)) {
                        toast.error('Invalid uniCode format');
                        hasError = true;
                    } else {
                        const snapshot = await get(child(ref(database), `University/`));
                        if (snapshot.exists()) {
                            const inFors = snapshot.val();
                            const uniCodeExists = Object.values(inFors).some((uni) => uni.uniCode === uniCode);
                            if (uniCodeExists) {
                                toast.error('This uniCode has already exists');
                                hasError = true;
                            }
                        }
                    }
                }
            } else {
                const snapshot = await get(child(ref(database), `University/`));
                if (snapshot.exists()) {
                    const inFors = snapshot.val();
                    const uniCodeExists = Object.values(inFors).some((uni) => uni.nameU === uniName);
                    if (uniCodeExists) {
                        toast.error('This university has already exists');
                        hasError = true;
                    }
                }
            }
        } else if (!validateUniName(uniName)) {
            toast.error('Invalid name');
            hasError = true;
        }

        if (!hasError) {
            try {
                await AddSchool();
                setUniName('');
                setUniCode('');
                setAddress('');
                setAverageScore(null);
                setTargetScore(null);
                setVisible(false);
            } catch (error) {
                toast.error('An error occurred while adding university');
            }
        }
    };

    const handleCancel = () => {
        setUniName('');
        setUniCode('');
        setAddress('');
        setAverageScore(null);
        setTargetScore(null);
        setVisible(false);
    };

    const AddSchool = async () => {
        const uniRef = ref(database, `University/${uniCode}`);
        await set(uniRef, {
            nameU: uniName,
            uniCode: uniCode,
            address: address,
            averageS: averageScore,
            isRegistered: 0,
            target: targetScore,
        });
        const newUni = {
            nameU: uniName,
            uniCode: uniCode,
            address: address,
            averageS: averageScore,
            isRegistered: 0,
            target: targetScore,
        };
        setUniData([...UniData, newUni]);
        toast.success('Added a university');
    };

    function validateName(uniName) {
        return /^[A-Za-zÀ-ÿ]+$/.test(uniName);
    }
    function validateUniName(uniName) {
        return /^\D+$/u.test(uniName);
    }

    return (
        <>
            <Button className="btn-addUni" type="primary" onClick={showModal}>
                {t('button.Add')}
            </Button>
            <Modal
                title="Add a university"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                okText="Add"
                destroyOnClose
            >
                <Space direction="vertical">
                    <Form>
                        <Form.Item
                            className="form-item"
                            label={t('label.uniname')}
                            validateStatus={!validateUniName(uniName) && uniName ? 'error' : ''}
                            name="Input"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}
                        >
                            <Input
                                className="ip-UniName"
                                placeholder="Enter University's name"
                                prefix={<BankOutlined className="ic-bank" />}
                                onChange={(e) => setUniName(e.target.value)}
                                value={uniName}
                                allowClear
                                suffix={
                                    <Tooltip title="Name just only contain letters and no numbers">
                                        <InfoCircleOutlined className="ic-info" />
                                    </Tooltip>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item"
                            label={t('label.unicode')}
                            validateStatus={!validateName(uniCode) && uniCode ? 'error' : ''}
                            name="InputCode"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}
                        >
                            <Input
                                className="ip-UniCode"
                                placeholder="Uni's Code"
                                allowClear
                                onChange={(e) => setUniCode(e.target.value)}
                                maxLength={6}
                                suffix={
                                    <Tooltip title="uniCode just contain only letters ">
                                        <InfoCircleOutlined className="ic-info" />
                                    </Tooltip>
                                }
                                value={uniCode}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item"
                            label={t('label.address')}
                            name="TextArea"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}
                        >
                            <Input.TextArea
                                className="ip-textArea"
                                placeholder="Uni's address"
                                allowClear
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </Form.Item>

                        <div className="div">
                            <Form.Item
                                className="form-item"
                                label={t('label.entrance')}
                                name="Entrance"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    className="ip-number1"
                                    maxLength={2}
                                    value={averageScore}
                                    onChange={(value) => setAverageScore(value)}
                                    min={0}
                                    max={10}
                                    step={0.2}
                                />
                            </Form.Item>

                            <Form.Item
                                className="form-item"
                                label={t('label.target')}
                                name="Target"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    className="ip-number2"
                                    maxLength={5}
                                    value={targetScore}
                                    onChange={(value) => setTargetScore(value)}
                                    max={500}
                                    min={0}
                                    step={100}
                                />
                            </Form.Item>
                        </div>
                    </Form>
                </Space>
            </Modal>
        </>
    );
};

export default FormAdd;
