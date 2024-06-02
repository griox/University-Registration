import React, { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip, Result } from 'antd';
import 'firebase/auth';
import { ref, child, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { database } from '../firebaseConfig.js';
import '../University/css/formAddSchool.css';
import { useTranslation } from 'react-i18next';

const FormAdd = ({ UniData, setUniData }) => {
    const [isModalVisible, setVisible] = useState(false);
    const [uniName, setUniName] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [averageScore, setAverageScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const { t } = useTranslation('modalUni');
    // const [showSuccess, setShowSuccess] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const handleOkandReload = () => {
        // setShowSuccessModal(false);
        window.location.reload()
    }

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
        setUniData = [...UniData, newUni];
        // toast.success(t('toast.addsuccess'));
        setShowSuccessModal(true);
    };

    const Success = () => (
        <Result
          status="success"
          title={<div className='result-title'>Successfully Added a university</div>}
          style={{width: '100%', height: 'auto'}}
          extra={[
            <Button type="primary" onClick={handleOkandReload} style={{width: '100px', height: 'auto'}}>
              OK
            </Button>,
          ]}
        />
      );

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
            className="custom-modal"
                style={{height: '200px'}}
                width={500}
                open={showSuccessModal}
                footer={null}
                closable={false}
                onCancel={() => setShowSuccessModal(false)}
            >
                <Success />
            </Modal>
                <Modal
                title="Add a university"
                open={isModalVisible}
                onOk={handleOk}
                okText={t('title.ok')}
                onCancel={handleCancel}
                cancelText={t('title.cancel')}
                width={700}
                destroyOnClose
            >
                <Space direction="vertical">
                    <Form layout="horizontal">
                        <Form.Item
                            className="form-item2"
                            label={t('label.uniname')}
                            labelCol={{ span: 9 }} 
                            wrapperCol={{ span: 15 }} 
                            validateStatus={!validateUniName(uniName) && uniName ? 'error' : ''}
                            name="Input"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input
                                className="ip-UniName"
                                placeholder={t('placeholder.name')}
                                prefix={<BankOutlined className="ic-bank" />}
                                onChange={(e) => setUniName(e.target.value)}
                                value={uniName}
                                allowClear
                                suffix={
                                    <Tooltip title={t('tooltip.name')}>
                                        <InfoCircleOutlined className="ic-info" />
                                    </Tooltip>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.unicode')}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }} 
                            validateStatus={!validateName(uniCode) && uniCode ? 'error' : ''}
                            name="InputCode"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input
                                className="ip-UniCode"
                                placeholder={t('placeholder.code')}
                                allowClear
                                onChange={(e) => setUniCode(e.target.value)}
                                maxLength={6}
                                suffix={
                                    <Tooltip title={t('tooltip.code')}>
                                        <InfoCircleOutlined className="ic-info" />
                                    </Tooltip>
                                }
                                value={uniCode}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.entrance')}
                            labelCol={{ span: 9 }} 
                            wrapperCol={{ span: 15 }} 
                            name="Entrance"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <InputNumber
                                className="ip-number1"
                                placeholder={t('placeholder.entrance')}
                                maxLength={2}
                                value={averageScore}
                                onChange={(value) => setAverageScore(value)}
                                min={0}
                                max={30}
                                step={0.2}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.target')}
                            labelCol={{ span: 9 }} 
                            wrapperCol={{ span: 15 }}
                            name="Target"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <InputNumber
                                className="ip-number2"
                                placeholder={t('placeholder.target')}
                                maxLength={5}
                                value={targetScore}
                                onChange={(value) => setTargetScore(value)}
                                max={500}
                                min={0}
                                step={100}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.address')}
                            labelCol={{ span: 9 }} 
                            wrapperCol={{ span: 15 }} 
                            name="TextArea"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input.TextArea
                                className="ip-textArea"
                                placeholder={t('placeholder.address')}
                                allowClear
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </Form.Item>
                    </Form>
                </Space>
            </Modal>
        </>
    );
};

export default FormAdd;
