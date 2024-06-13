import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import { ref, child, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { Button, Modal, Select, InputNumber, DatePicker, Form } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Input, Tooltip, Row, Col } from 'antd';
import '../Student Manage/css/modal_add.css';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { database } from '../firebaseConfig.js';
import CryptoJS from 'crypto-js';
import { HandleErrorEdit } from '../../commonFunctions.js';

const ModalAdd = ({ studentData, setStudentData }) => {
    const [Fullname, setFullname] = useState('');
    const [Gender, setGender] = useState('');
    const [Email, setEmail] = useState('');
    const [Identify, setIdentify] = useState('');
    const [Address, setAddress] = useState('');
    const [enthicity, setEnthicity] = useState('Kinh');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('Khánh Hòa');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Mathscore, setMathscore] = useState(null);
    const [Englishscore, setEnglishscore] = useState(null);
    const [Literaturescore, setLiteraturescore] = useState(null);
    const [averageS, setAverageS] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [emailExist, setEmailExists] = useState(false);
    const [IdenExists, setIdenExists] = useState(false);
    const [errorMath, setErrorMath] = useState('');
    const [errorEnglish, setErrorEnglish] = useState('');
    const [errorLiterature, setErrorLiterature] = useState('');

    const { t } = useTranslation('modalStudent');

    const secretKey = 'Tvx1234@';

    useEffect(() => {
        // Hàm kiểm tra tính hợp lệ của form
        const checkFormValidity = () => {
            return (
                Email !== '' &&
                Fullname !== '' &&
                enthicity !== '' &&
                Gender !== '' &&
                dateOfBirth !== '' &&
                placeOfBirth !== '' &&
                Identify !== '' &&
                Mathscore !== undefined &&
                Mathscore !== null &&
                Englishscore !== undefined &&
                Englishscore !== null &&
                Literaturescore !== undefined &&
                Literaturescore !== null &&
                validateEmailFormat(Email) &&
                validateFullname(Fullname) &&
                validateIdenNumber(Identify) &&
                !emailExist &&
                !IdenExists
            );
        };
        setIsFormValid(checkFormValidity());
    }, [
        Email,
        Fullname,
        enthicity,
        Gender,
        dateOfBirth,
        placeOfBirth,
        Identify,
        Address,
        Mathscore,
        Englishscore,
        Literaturescore,
        emailExist,
        IdenExists,
        errorEnglish,
        errorLiterature,
        errorMath,
    ]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    function encodeEmails(email) {
        return email.replace('.', ',');
    }
    function round(number, precision) {
        let factor = Math.pow(10, precision);
        return Math.round((number || 0) * factor) / factor;
    }
    const generateID = async () => {
        const snapshot = await get(child(ref(database), 'Detail'));
        if (snapshot.exists()) {
            const students = snapshot.val();
            const studentIDs = Object.keys(students);
            const lastStudentID = studentIDs[studentIDs.length - 1];
            const lastIDNumber = parseInt(lastStudentID.slice(2));
            const newIDNumber = lastIDNumber + 1;
            const newID = `SV${newIDNumber}`;
            return newID;
        } else {
            return 'SV001';
        }
    };

    useEffect(() => {
        const calculateAverage = () => {
            if (errorEnglish === '' && errorLiterature === '' && errorMath === '') {
                const totalScore = (parseFloat(Mathscore) + parseFloat(Englishscore) + parseFloat(Literaturescore)) / 3;
                setAverageS(totalScore.toFixed(2));
            }
        };
        calculateAverage();
    }, [Mathscore, Englishscore, Literaturescore, errorEnglish, errorLiterature, errorMath, averageS]);

    const addStudent = async () => {
        try {
            const formattedDateOfBirth = dateOfBirth ? dateOfBirth.format('DD/MM/YYYY') : '';
            const newID = await generateID();
            const studentRef = ref(database, `Detail/${newID}`);
            await set(studentRef, {
                id: newID,
                email: Email,
                name: Fullname,
                enthicity: enthicity,
                gender: Gender,
                dateObirth: formattedDateOfBirth,
                placeOBirth: placeOfBirth,
                idenNum: Identify,
                MathScore: parseFloat(Mathscore),
                EnglishScore: parseFloat(Englishscore),
                LiteratureScore: parseFloat(Literaturescore),
                AverageScore: parseFloat(averageS),
                Address: Address,
                uniCode: [],
                isRegister: 'true',
            });
            const encodeEmail = encodeEmails(Email);
            const accountRef = ref(database, `Account/${encodeEmail}`);
            const p = `Tvx1234@`;
            var hash = CryptoJS.AES.encrypt(p, secretKey).toString();
            await set(accountRef, {
                email: Email,
                password: hash,
                name: Fullname,
                Role: 'user',
            });
            const newData = {
                id: newID,
                email: Email,
                name: Fullname,
                enthicity: enthicity,
                gender: Gender,
                dateObirth: formattedDateOfBirth,
                placeOBirth: placeOfBirth,
                idenNum: Identify,
                MathScore: parseFloat(Mathscore),
                EnglishScore: parseFloat(Englishscore),
                LiteratureScore: parseFloat(Literaturescore),
                AverageScore: parseFloat(averageS),
                Address: Address,
                uniCode: [],
                isRegister: 'true',
            };
            setStudentData([...studentData, newData]);
            toast.success('Adding new student successfuly');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('An error occurred while adding student');
        }
    };
    const checkEmail = async (Email) => {
        const snapshot = await get(child(ref(database), `Detail/`));
        if (snapshot.exists()) {
            const students = snapshot.val();
            const emailExists = Object.values(students).some((user) => user.email === Email);
            setEmailExists(emailExists);
        }
        setEmailExists(false); // Nếu không có email tồn tại, trả về false
    };
    const checkIden = async (Identify) => {
        const snapshot = await get(child(ref(database), `Detail/`));
        if (snapshot.exists()) {
            const students = snapshot.val();
            const idenExists = Object.values(students).some((user) => user.idenNum === Identify);
            setIdenExists(idenExists);
        }
        setIdenExists(false); // Nếu không có email tồn tại, trả về false
    };
    const handleEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
        checkEmail(value);
    };
    const handleIden = (e) => {
        const { value } = e.target;
        setIdentify(value);
        checkIden(value);
    };
    const handleOk = async () => {
        setErrorEnglish('');
        setErrorLiterature('');
        setErrorMath('');
        addStudent();
        setFullname('');
        setEmail('');
        setDateOfBirth('');
        setAddress('');
        setPlaceOfBirth('');
        setIdentify('');
        setMathscore(null);
        setEnglishscore(null);
        setLiteraturescore(null);
    };

    const handleCancel = () => {
        setErrorEnglish('');
        setErrorLiterature('');
        setErrorMath('');
        setAddress('');
        setIsModalOpen(false);
        setFullname('');
        setEmail('');
        setDateOfBirth('');
        setAddress('');
        setPlaceOfBirth('');
        setIdentify('');
        setMathscore(null);
        setEnglishscore(null);
        setLiteraturescore(null);
        setAverageS(null);
    };
    function validateEmailFormat(email) {
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
    }

    function validateFullname(name) {
        if (name.trim().replace(/\s{2,}/g, ' ') === '') {
            return false;
        }
        return /^[A-Za-zđĐÁÀẢÃẠÂẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸẾỀỂÊỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤỨƯỪỬỮỰÝỲỶỸỴáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọốôồổỗộớờởơỡợúùủũụứưừửữựýỳỷỹỵ\s]+$/.test(
            name,
        );
    }
    function validateIdenNumber(idenNum) {
        return idenNum.length === 12 && /^[0-9]+$/.test(idenNum);
    }
    const checkMath = (value) => {
        if (value === '' || value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorMath('Please input!');
            return;
        }

        if (/^[-+]?(?:\d*\.?\d+|\d+\.)$/.test(value) === false) {
            setErrorMath('Score only contain number');
            return;
        }
        if (!(parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
            setErrorMath('Score must >= 0 and <= 10 ');
            return;
        }
        if (value.length > 4) {
            setErrorMath('Grade contain 2 decimal number');
            return;
        }
        setErrorMath('');
        setMathscore(value);
    };
    const checkEnglish = (value) => {
        if (value === '' || value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorEnglish('Please input!');
            return;
        }
        if (/^[-+]?(?:\d*\.?\d+|\d+\.)$/.test(value) === false) {
            setErrorEnglish('Score only contain number');
            return;
        }
        if (!(parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
            setErrorEnglish('Score must >= 0 and <= 10 ');
            return;
        }
        if (value.length > 4) {
            setErrorEnglish('Grade contain 2 decimal number');
            return;
        }
        setEnglishscore(value);
        setErrorEnglish('');
    };
    const checkLiterature = (value) => {
        if (value === '' || value.trim().replace(/\s{2,}/g, ' ') === '') {
            setErrorLiterature('Please input!');
            return;
        }
        if (/^[-+]?(?:\d*\.?\d+|\d+\.)$/.test(value) === false) {
            setErrorLiterature('Score only contain number');
            return;
        }
        if (!(parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
            setErrorLiterature('Score must >= 0 and <= 10 ');
            return;
        }
        if (value.length > 4) {
            setErrorLiterature('Grade contain 2 decimal number');
            return;
        }
        setLiteraturescore(value);
        setErrorLiterature('');
    };

    const genders = [
        { value: 'Female', label: 'Female' },
        { value: 'Male', label: 'Male' },
    ];

    const enthicities = [
        { value: 'kinh', label: 'Kinh' },
        { value: 'tay', label: 'Tay' },
        { value: 'thai', label: 'Thai' },
        { value: 'muong', label: 'Muong' },
        { value: 'khmu', label: 'Khmu' },
        { value: 'dao', label: 'Dao' },
        { value: 'cham', label: 'Cham' },
        { value: 'hoa', label: 'Hoa' },
        { value: 'nung', label: 'Nung' },
        { value: 'giay', label: 'Giay' },
        { value: 'mong', label: 'Mong' },
        { value: 'pupeo', label: 'Pupeo' },
        { value: 'raglai', label: 'Raglai' },
        { value: 'bana', label: 'Bana' },
        { value: 'xodang', label: 'Xodang' },
        { value: 'coho', label: 'Coho' },
        { value: 'santieng', label: 'Santieng' },
        { value: 'ede', label: 'Ede' },
        { value: 'giarai', label: 'Gia Rai' },
        { value: 'bruvankieu', label: 'Bru Van Kieu' },
        { value: 'tao', label: 'Tao' },
        { value: 'co', label: 'Co' },
        { value: 'hre', label: 'Hre' },
        { value: 'mnon', label: 'Mnong' },
        { value: 'chut', label: 'Chut' },
        { value: 'khmerkrom', label: 'Khmer Krom' },
        { value: 'lach', label: 'Lach' },
        { value: 'phula', label: 'Phula' },
        { value: 'pathe', label: 'Pathe' },
        { value: 'sila', label: 'Sila' },
        { value: 'chau', label: 'Chau' },
        { value: 'ma', label: 'Ma' },
        { value: 'colao', label: 'Co Lao' },
        { value: 'khmerlo', label: 'Khmer Lo' },
        { value: 'khmum', label: 'Khmu' },
        { value: 'laha', label: 'Laha' },
        { value: 'lolo', label: 'Lolo' },
        { value: 'chero', label: 'Chero' },
        { value: 'khmerdam', label: 'Khmer Dam' },
        { value: 'khmersrei', label: 'Khmer Srei' },
        { value: 'xtieng', label: 'Xtieng' },
        { value: 'muong2', label: 'Muong' },
        { value: 'khmer', label: 'Khmer' },
    ];

    const cities = [
        { value: 'An Giang', label: 'An Giang' },
        { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
        { value: 'Bạc Liêu', label: 'Bạc Liêu' },
        { value: 'Bắc Giang', label: 'Bắc Giang' },
        { value: 'Bắc Kạn', label: 'Bắc Kạn' },
        { value: 'Bắc Ninh', label: 'Bắc Ninh' },
        { value: 'Bến Tre', label: 'Bến Tre' },
        { value: 'Bình Định', label: 'Bình Định' },
        { value: 'Bình Dương', label: 'Bình Dương' },
        { value: 'Bình Phước', label: 'Bình Phước' },
        { value: 'Bình Thuận', label: 'Bình Thuận' },
        { value: 'Cà Mau', label: 'Cà Mau' },
        { value: 'Cao Bằng', label: 'Cao Bằng' },
        { value: 'Đắk Lắk', label: 'Đắk Lắk' },
        { value: 'Đắk Nông', label: 'Đắk Nông' },
        { value: 'Điện Biên', label: 'Điện Biên' },
        { value: 'Đồng Nai', label: 'Đồng Nai' },
        { value: 'Đồng Tháp', label: 'Đồng Tháp' },
        { value: 'Gia Lai', label: 'Gia Lai' },
        { value: 'Hà Giang', label: 'Hà Giang' },
        { value: 'Hà Nam', label: 'Hà Nam' },
        { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
        { value: 'Hải Dương', label: 'Hải Dương' },
        { value: 'Hậu Giang', label: 'Hậu Giang' },
        { value: 'Hòa Bình', label: 'Hòa Bình' },
        { value: 'Hưng Yên', label: 'Hưng Yên' },
        { value: 'Khánh Hòa', label: 'Khánh Hòa' },
        { value: 'Kiên Giang', label: 'Kiên Giang' },
        { value: 'Kon Tum', label: 'Kon Tum' },
        { value: 'Lai Châu', label: 'Lai Châu' },
        { value: 'Lâm Đồng', label: 'Lâm Đồng' },
        { value: 'Lạng Sơn', label: 'Lạng Sơn' },
        { value: 'Lào Cai', label: 'Lào Cai' },
        { value: 'Long An', label: 'Long An' },
        { value: 'Nam Định', label: 'Nam Định' },
        { value: 'Nghệ An', label: 'Nghệ An' },
        { value: 'Ninh Bình', label: 'Ninh Bình' },
        { value: 'Ninh Thuận', label: 'Ninh Thuận' },
        { value: 'Phú Thọ', label: 'Phú Thọ' },
        { value: 'Quảng Bình', label: 'Quảng Bình' },
        { value: 'Quảng Nam', label: 'Quảng Nam' },
        { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
        { value: 'Quảng Ninh', label: 'Quảng Ninh' },
        { value: 'Quảng Trị', label: 'Quảng Trị' },
        { value: 'Sóc Trăng', label: 'Sóc Trăng' },
        { value: 'Sơn La', label: 'Sơn La' },
        { value: 'Tây Ninh', label: 'Tây Ninh' },
        { value: 'Thái Bình', label: 'Thái Bình' },
        { value: 'Thái Nguyên', label: 'Thái Nguyên' },
        { value: 'Thanh Hóa', label: 'Thanh Hóa' },
        { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
        { value: 'Tiền Giang', label: 'Tiền Giang' },
        { value: 'Trà Vinh', label: 'Trà Vinh' },
        { value: 'Tuyên Quang', label: 'Tuyên Quang' },
        { value: 'Vĩnh Long', label: 'Vĩnh Long' },
        { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
        { value: 'Yên Bái', label: 'Yên Bái' },
        { value: 'Phú Yên', label: 'Phú Yên' },
        { value: 'Cần Thơ', label: 'Cần Thơ' },
        { value: 'Đà Nẵng', label: 'Đà Nẵng' },
        { value: 'Hải Phòng', label: 'Hải Phòng' },
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    ];
    const { TextArea } = Input;
    const dateFormat = 'DD/MM/YYYY';
    return (
        <>
            <Button className="btn-add" type="primary" onClick={showModal}>
                {t('button.Add')}
            </Button>
            <Modal
                title={t('title.modal')}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                okButtonProps={{ disabled: !isFormValid }}
                destroyOnClose
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className="form-item1"
                                label={t('label.name')}
                                name="name"
                                validateStatus={!validateFullname(Fullname) && Fullname ? 'error' : ''}
                                help={!validateFullname(Fullname) && Fullname ? t('warning.name') : ''}
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t('placeholder.name')}
                                    prefix={<UserOutlined className="icon" />}
                                    value={Fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    suffix={
                                        <Tooltip title={t('tooltip.name')}>
                                            <InfoCircleOutlined className="icon" />
                                        </Tooltip>
                                    }
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className="form-item1"
                                label={t('label.gender')}
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={'Male'}
                                    options={genders}
                                    onChange={(value) => setGender(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className="form-item1"
                                label={t('label.dofb')}
                                name="dob"
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className="Date"
                                    minDate={dayjs('01/01/2004', dateFormat)}
                                    maxDate={dayjs('31/12/2004', dateFormat)}
                                    format="DD/MM/YYYY"
                                    onChange={(value) => setDateOfBirth(value)}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={t('label.pofb')} className="form-item1">
                                <Select
                                    initialvalues="Khánh Hòa"
                                    defaultValue={'Khánh Hòa'}
                                    options={cities}
                                    showSearch
                                    onChange={(value) => setPlaceOfBirth(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={t('label.email')}
                        name="email"
                        className="form-item1"
                        validateStatus={!validateEmailFormat(Email) && Email ? 'error' : ''}
                        help={
                            Email && !validateEmailFormat(Email)
                                ? t('warning.email')
                                : emailExist
                                ? t('warning.emailExists')
                                : ''
                        }
                        rules={[
                            {
                                required: true,
                                message: t('warning.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('placeholder.email')}
                            prefix={<MailOutlined className="icon" />}
                            suffix={
                                <Tooltip title={t('tooltip.email')}>
                                    <InfoCircleOutlined className="icon" />
                                </Tooltip>
                            }
                            onChange={handleEmail}
                            allowClear
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={t('label.identify')}
                                name="identify"
                                className="form-item1"
                                validateStatus={!validateIdenNumber(Identify) && Identify ? 'error' : ''}
                                help={
                                    !validateIdenNumber(Identify) && Identify
                                        ? t('warning.identify')
                                        : IdenExists
                                        ? t('warning.idenexist')
                                        : ''
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <Input onChange={handleIden} showCount maxLength={12} value={Identify} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={t('label.ethnicity')}
                                name="ethnicity"
                                className="form-item1"
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <Select
                                    initialvalues="Kinh"
                                    defaultValue={'Kinh'}
                                    options={enthicities}
                                    onChange={(value) => setEnthicity(value)}
                                    showSearch
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={t('label.address')}
                                name="address"
                                className="form-item1"
                                rules={[
                                    {
                                        required: true,
                                        message: t('warning.input'),
                                    },
                                ]}
                            >
                                <TextArea
                                    showCount
                                    maxLength={100}
                                    allowClear
                                    placeholder={t('placeholder.address')}
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={Address}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label={t('label.math')}
                                className="form-item1"
                                name="math"
                                validateStatus={errorMath !== '' ? 'error' : ''}
                                help={
                                    errorMath !== '' ? (
                                        <Tooltip
                                            title={errorMath}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ display: 'flex' }}
                                        >
                                            <span style={{ color: 'red' }}>In valid</span>
                                            <ExclamationCircleOutlined
                                                style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                            />
                                        </Tooltip>
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
                                    className="input-num"
                                    value={Mathscore}
                                    onChange={(e) => checkMath(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t('label.english')}
                                name="english"
                                className="form-item1"
                                validateStatus={errorEnglish !== '' ? 'error' : ''}
                                help={
                                    errorEnglish !== '' ? (
                                        <Tooltip
                                            title={errorEnglish}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ display: 'flex' }}
                                        >
                                            <span style={{ color: 'red' }}>Invalid</span>
                                            <ExclamationCircleOutlined
                                                style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                            />
                                        </Tooltip>
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
                                    className="input-num"
                                    value={Englishscore}
                                    onChange={(e) => checkEnglish(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={t('label.literature')}
                                name="literature"
                                className="form-item1"
                                validateStatus={errorLiterature !== '' ? 'error' : ''}
                                help={
                                    errorLiterature !== '' ? (
                                        <Tooltip
                                            title={errorLiterature}
                                            color={'red'}
                                            key={'red'}
                                            placement="bottom"
                                            style={{ display: 'flex' }}
                                        >
                                            <span style={{ color: 'red' }}>Invalid</span>
                                            <ExclamationCircleOutlined
                                                style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                            />
                                        </Tooltip>
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
                                    className="input-num"
                                    value={Literaturescore}
                                    onChange={(e) => checkLiterature(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={t('label.entrance')} className="form-item1">
                                <Input disabled className="input-num-en" value={averageS} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default ModalAdd;
