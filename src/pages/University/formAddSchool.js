import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip, Result } from 'antd';
import 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import '../University/css/formAddSchool.css';
import { BankOutlined, InfoCircleOutlined  } from '@ant-design/icons';
const FormAdd = ({ UniData, setUniData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uniName, setUniName] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [averageScore, setAverageScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const { t } = useTranslation('modalUni');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Hàm kiểm tra tính hợp lệ của form
        const checkFormValidity = () => {
            return (
                uniName !== '' &&
                address !== '' &&
                averageScore !== null &&
                targetScore !== null &&
                uniCode !== '' &&
                validateName(uniName) &&
                validateUniCode(uniCode)
            );
        };

        // Cập nhật trạng thái hợp lệ của form
        setIsFormValid(checkFormValidity());
    }, [uniName, address, averageScore, targetScore, uniCode]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setUniName('');
        setUniCode('');
        setAddress('');
        setAverageScore(null);
        setTargetScore(null);
    };

    const validateUniCode = (uniCode) => {
        return /^[a-zA-Z]+$/.test(uniCode);
    };

    const validateName = (name) => {
        // return /^\D+$/u.test(name);
        return /^[\p{L}\s]+$/u.test(name);
    };

    const handleOk = async () => {
        if (!uniName || !uniCode || !address || averageScore === null || targetScore === null) {
            toast.error('Please fill in all information');
            return;
        }

        if (!validateName(uniName)) {
            toast.error('Invalid name');
            return;
        }

        if (!validateUniCode(uniCode)) {
            toast.error('Invalid uniCode format');
            return;
        }

        const snapshot = await get(ref(database, `University/`));
        if (snapshot.exists()) {
            const universities = snapshot.val();
            const uniCodeExists = Object.values(universities).some((uni) => uni.uniCode === uniCode);
            const uniNameExists = Object.values(universities).some((uni) => uni.nameU === uniName);
            if (uniCodeExists) {
                toast.error('This uniCode already exists');
                return;
            }
            if (uniNameExists) {
                toast.error('This university name already exists');
                return;
            }
        }

        try {
            await AddSchool();
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            toast.error('An error occurred while adding university');
        }
    };

    // const handleReload = () => {
    //     window.location.reload()
    // }

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
        setShowSuccessModal(true);
    };

    const Success = () => {
        useEffect(() => {
            window.location.reload()
        }, []);
        
        return (
        <Result
          status="success"
          title={<div className='result-title'>{t('title.success')}</div>}
          style={{width: '100%', height: 'auto'}}>
        </Result>
        );
    };

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
                onCancel={handleCancel}
                width={700}
                destroyOnClose
                okButtonProps={{disabled: !isFormValid}}
                footer={[
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: '550'}}>
                            <p>Những thông tin có đánh dấu <span style={{color: 'red'}}>*</span> là bắt buộc nhập. </p>
                        </div>
                        <div style={{justifyContent: 'right'}}>
                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button key="submit" type="primary" disabled={!isFormValid} onClick={handleOk}>
                                Submit
                            </Button>
                        </div>
                    </div>
                    
                  ]}
            >
                <Space direction="vertical">
                    <Form layout="horizontal">
                        <Form.Item
                            className="form-item2"
                            label={t('label.uniname')}
                            labelCol={{ span: 9 }} 
                            wrapperCol={{ span: 15 }} 
                            validateStatus={!validateName(uniName) && uniName ? 'error' : ''}
                            help={
                                !validateName(uniName) && uniName
                                    ? t('warning.uniname')
                                    : ''
                            }
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
                            validateStatus={!validateUniCode(uniCode) && uniCode ? 'error' : ''}
                            help={
                                !validateUniCode(uniCode) && uniCode
                                    ? t('warning.unicode')
                                    : ''
                            }
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
                                placeholder='Entrance score'
                                maxLength={4}
                                value={averageScore}
                                onChange={(value) => setAverageScore(value)}
                                min={0}
                                max={10.0}
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
                                placeholder='Target'
                                maxLength={3}
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
