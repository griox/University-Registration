import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip } from 'antd';
import 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import '../University/css/formAddSchool.css';
import { BankOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const FormAdd = ({ UniData, setUniData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uniName, setUniName] = useState('');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [averageScore, setAverageScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const { t } = useTranslation('modalUni');
    const [isFormValid, setIsFormValid] = useState(false);
    const [tempAverageScore, setTempAverageScore] = useState('');
    const [errorAverageScore, setErrorAverageScore] = useState('');
    const [tempTarget, setTempTarget] = useState('');
    const [errorTarget, setErrorTarget] = useState('');
    const [errorUnicode, setErrorUnicode] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorAddress, setErrorAddress] = useState('');
    useEffect(() => {
        // Hàm kiểm tra tính hợp lệ của form
        const checkFormValidity = () => {
            return (
                uniName !== '' &&
                address !== '' &&
                averageScore !== null &&
                targetScore !== null &&
                uniCode !== '' &&
                validateUniName(uniName) &&
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
        setErrorAddress('');
        setErrorAverageScore('');
        setErrorName('');
        setErrorTarget('');
        setErrorUnicode('');
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

    const validateUniName = (uniName) => {
        return /^[\p{L}\s]+$/u.test(uniName);
    };

    const handleOk = async () => {
        if (!uniName || !uniCode || !address || tempAverageScore === '' || tempTarget === '') {
            toast.error('Please fill in all information');
            return;
        }

        if (!validateUniName(uniName)) {
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
            toast.success('Adding new school successfuly');
            setIsModalVisible(false);
            resetForm();
        } catch (error) {
            toast.error('An error occurred while adding university');
        }
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
    };
    const checkInValidTarget = (value) => {
        if (value === '') {
            setErrorTarget('Please input');
            return;
        }
        if (!/^\d+$/.test(value)) {
            setErrorTarget('Target must contain only numbers and integer number');
            return;
        }
        if (!(value <= 10000 && value >= 0)) {
            setErrorTarget('Target must be <= 10000 and >=0');
            return;
        }

        setErrorTarget('');

        setTargetScore(parseFloat(value));
        setTempTarget(value);
    };
    const checkInvalidAverageScore = (value) => {
        if (value === '') {
            setErrorAverageScore('Please input');
            return;
        }
        if (/^[-+]?(?:\d*\.?\d+|\d+\.)$/.test(value) === false) {
            setErrorAverageScore('Score only contain number');
            return;
        }
        if (parseFloat(value) < 0 || parseFloat(value) > 10) {
            setErrorAverageScore('Score must >= 0 and <= 10 ');
            return;
        }
        if (value.length > 4) {
            setErrorAverageScore('Grade contain 2 decimal number');
            return;
        }

        setErrorAverageScore('');

        setAverageScore(parseFloat(value));
        setTempAverageScore(value);
    };

    const checkName = (value) => {
        if (value === '' || value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorName('Please input');
            return;
        }

        if (/^[a-zA-Z\u00C0-\u017F\s]*$/.test(value) === false) {
            setErrorName('Name only contain A-Z a-z and space');
            return;
        }
        setErrorName('');
    };

    const checkExist = (value) => {
        if (value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorUnicode('Please input');
            return;
        }
        if (/^[a-zA-Z]+$/.test(value) === false) {
            setErrorUnicode('Unicode only contain A-Z a-z and no space');
            return;
        }
        if (value.length > 10) {
            setErrorUnicode('Length must not > 10 ');
            return;
        }
        const exists = UniData.some((element) => element.uniCode === value);
        if (exists) {
            setErrorUnicode('Unicode has existed');
        } else {
            setErrorUnicode('');
            setUniCode(value);
        }
    };
    const checkAdrress = (value) => {
        if (value === '' || value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorAddress('Please input');
            return;
        }
        setErrorAddress('');
        setAddress(value);
    };
    return (
        <>
            <Button className="btn-addUni" type="primary" onClick={showModal}>
                {t('button.Add')}
            </Button>
            <Modal
                title={t('title.modaladd')}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                destroyOnClose
                okButtonProps={{ disabled: !isFormValid, className: 'custom-ok-button' }}
            >
                <Space direction="vertical">
                    <Form layout="horizontal">
                        <Form.Item
                            className="form-item2"
                            label={t('label.uniname')}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="uniname"
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                            validateStatus={errorName !== '' ? 'error' : ''}
                            help={
                                errorName !== '' ? (
                                    <div>
                                        <span>Invalid template </span>
                                        <Tooltip
                                            title={errorName}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ color: 'red' }}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        >
                            <Input
                                className="ip-UniName"
                                placeholder={t('placeholder.name')}
                                prefix={<BankOutlined className="ic-bank" />}
                                onChange={(e) => checkName(e.target.value)}
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
                            validateStatus={errorUnicode !== '' ? 'error' : ''}
                            help={
                                errorUnicode !== '' ? (
                                    <div>
                                        <span>Invalid template </span>
                                        <Tooltip
                                            title={errorUnicode}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ color: 'red' }}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    ''
                                )
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
                                onChange={(e) => checkExist(e.target.value)}
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
                            validateStatus={errorAverageScore !== '' ? 'error' : ''}
                            help={
                                errorAverageScore !== '' ? (
                                    <div>
                                        <span>Invalid template </span>
                                        <Tooltip
                                            title={errorAverageScore}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ color: 'red' }}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input
                                className="ip-number1"
                                placeholder={t('placeholder.entrance')}
                                value={tempAverageScore}
                                onChange={(value) => checkInvalidAverageScore(value.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.target')}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="Target"
                            validateStatus={errorTarget !== '' ? 'error' : ''}
                            help={
                                errorTarget ? (
                                    <div>
                                        <span>Invalid template </span>
                                        <Tooltip
                                            title={errorTarget}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ color: 'red' }}
                                        >
                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                            rules={[
                                {
                                    required: true,
                                    message: t('warning.input'),
                                },
                            ]}
                        >
                            <Input
                                className="ip-number2"
                                placeholder={t('placeholder.target')}
                                value={tempTarget}
                                onChange={(value) => checkInValidTarget(value.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            className="form-item2"
                            label={t('label.address')}
                            labelCol={{ span: 9 }}
                            wrapperCol={{ span: 15 }}
                            name="TextArea"
                            validateStatus={errorAddress !== '' ? 'error' : ''}
                            help={
                                errorAddress !== '' ? (
                                    <div>
                                        <span>Please input</span>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
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
                                onChange={(e) => checkAdrress(e.target.value)}
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
