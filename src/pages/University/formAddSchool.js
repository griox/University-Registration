import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip, Result } from 'antd';
import 'firebase/auth';
import { ref, child, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ref, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import '../University/css/formAddSchool.css';

const FormAdd = ({ UniData, setUniData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uniName, setUniName] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [averageScore, setAverageScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const { t } = useTranslation('modalUni');
    // const [showSuccess, setShowSuccess] = useState(false);
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
                validateName(uniCode) &&
                validateUniName(uniName)
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

    const validateName = (name) => {
        return /^[A-Za-zÀ-ÿ]+$/.test(name);
    };

    const validateUniCode = (code) => {
        return /^\D+$/u.test(code);
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
            toast.success('University added successfully');
        } catch (error) {
            toast.error('An error occurred while adding university');
        }
    };

    const handleReload = () => {
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
        setShowSuccessModal(true);
    };

    const Success = () => (
        <Result
          status="success"
          title={<div className='result-title'>{t('title.success')}</div>}
          style={{width: '100%', height: 'auto'}}
          extra={[
            <Button type="primary" onClick={handleReload} style={{width: '100px', height: 'auto'}}>
              {t('title.reload')}
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
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                destroyOnClose
                okButtonProps={{disabled: !isFormValid}}
            >
                <Space direction="vertical">
                    <Form layout="horizontal">
                        <Form.Item
                            label={t('label.uniname')}
                            validateStatus={!validateUniCode(uniName) && uniName ? 'error' : ''}
                            help={!validateUniCode(uniName) && uniName ? 'Invalid university name' : ''}
                        >
                            <Input
                                placeholder={t('placeholder.name')}
                                onChange={(e) => setUniName(e.target.value)}
                                value={uniName}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('label.unicode')}
                            validateStatus={!validateName(uniCode) && uniCode ? 'error' : ''}
                            help={!validateName(uniCode) && uniCode ? t('warning.unicode') : ''}
                            name="InputCode"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t('placeholder.code')}
                                onChange={(e) => setUniCode(e.target.value)}
                                maxLength={6}
                                value={uniCode}
                            />
                        </Form.Item>

                        <Form.Item label={t('label.address')}>
                            <Input.TextArea
                                placeholder={t('placeholder.address')}
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </Form.Item>

                        <Form.Item label={t('label.entrance')}>
                            <InputNumber
                                placeholder={t('placeholder.entrance')}
                                value={averageScore}
                                onChange={(value) => setAverageScore(value)}
                                min={0}
                                max={10}
                                step={0.2}
                            />
                        </Form.Item>

                        <Form.Item label={t('label.target')}>
                            <InputNumber
                                placeholder={t('placeholder.target')}
                                value={targetScore}
                                onChange={(value) => setTargetScore(value)}
                                max={500}
                                min={0}
                                step={100}
                            />
                        </Form.Item>
                    </Form>
                </Space>
            </Modal>
        </>
    );
};

export default FormAdd;
