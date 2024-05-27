import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Button, Modal, Select, InputNumber, DatePicker, Form } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Input, Tooltip, Row, Col } from 'antd';
import './css/modal_add.css';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const firebaseConfig = {
    apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
    authDomain: 'mock-proeject-b.firebaseapp.com',
    databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
    projectId: 'mock-proeject-b',
    storageBucket: 'mock-proeject-b.appspot.com',
    messagingSenderId: '898832925665',
    appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ModalAdd = ({ studentData, setStudentData }) => {
    const [Fullname, setFullname] = useState('');
    const [Gender, setGender] = useState('Female');
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
    const { t } = useTranslation('student');
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
        const snapshot = await get(child(ref(db), 'Detail'));
        if (snapshot.exists()) {
            // lấy ra từng sinh viên
            const students = snapshot.val();
            // Lấy ra danh sách ID của tất cả sinh viên
            const studentIDs = Object.keys(students);
            // Lấy ID của sinh viên cuối cùng trong danh sách
            const lastStudentID = studentIDs[studentIDs.length - 1];
            // Lay ra so cuoi cua Id
            const lastIDNumber = parseInt(lastStudentID.slice(2));
            // Tạo ID mới bằng cách tăng ID của sinh viên cuối cùng lên 1
            const newIDNumber = lastIDNumber + 1;
            const newID = `SV${newIDNumber}`;
            return newID;
        } else {
            // Nếu danh sách sinh viên trống, trả về ID đầu tiên
            return 'SV001';
        }
    };

    useEffect(() => {
        const calculateAverage = () => {
            if (Mathscore !== null && Englishscore !== null && Literaturescore !== null) {
                const totalScore = Mathscore + Englishscore + Literaturescore;
                setAverageS(totalScore.toFixed(1)); // Set the average score state
            }
        };
        calculateAverage();
    }, [Mathscore, Englishscore, Literaturescore]);
    const addStudent = async () => {
        try {
            const formattedDateOfBirth = dateOfBirth ? dateOfBirth.format('DD/MM/YYYY') : '';
            const newID = await generateID(); // Await for the ID generation
            const studentRef = ref(db, `Detail/${newID}`); // Reference to the new student
            await set(studentRef, {
                id: newID, // Use the generated ID
                email: Email,
                name: Fullname,
                enthicity: enthicity,
                gender: Gender,
                dateObirth: formattedDateOfBirth,
                placeOBirth: placeOfBirth,
                idenNum: Identify,
                MathScore: Mathscore,
                EnglishScore: Englishscore,
                LiteratureScore: Literaturescore,
                AverageScore: round(Mathscore + Englishscore + Literaturescore, 1),
                Address: Address,
                uniCode: [],
                isRegister: 'true',
            });
            const encodeEmail = encodeEmails(Email);
            const accountRef = ref(db, `Account/${encodeEmail}`);
            await set(accountRef, {
                email: Email,
                password: 'Tvx1234@',
                name: Fullname,
                Role: 'user',
            });
            const newData = {
                id: newID, // Use the generated ID
                email: Email,
                name: Fullname,
                enthicity: enthicity,
                gender: Gender,
                dateObirth: formattedDateOfBirth,
                placeOBirth: placeOfBirth,
                idenNum: Identify,
                MathScore: Mathscore,
                EnglishScore: Englishscore,
                LiteratureScore: Literaturescore,
                AverageScore: round(Mathscore + Englishscore + Literaturescore, 1),
                Address: Address,
                uniCode: [],
                isRegister: 'true',
            };
            setStudentData([...studentData, newData]);
            toast.success('Added a new student');
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            console.error(error);
            toast.error('An error occurred while adding student');
        }
    };

    const handleOk = async () => {
        let hasError = false;

        // Initial checks
        if (
            Fullname === '' ||
            Address === '' ||
            dateOfBirth === '' ||
            Mathscore === null ||
            Englishscore === null ||
            Literaturescore === null ||
            Email === '' ||
            Identify === ''
        ) {
            toast.error('please fill in all information');
            hasError = true;
        } else if (!validateFullname(Fullname)) {
            toast.error('Invalid name');
            hasError = true;
        }

        // Validate Email
        if (Email !== '') {
            if (!validateEmailFormat(Email)) {
                toast.error('Invalid Email');
                hasError = true;
            } else {
                const snapshot = await get(child(ref(db), `Detail/`));
                if (snapshot.exists()) {
                    const students = snapshot.val();
                    const emailExists = Object.values(students).some((user) => user.email === Email);
                    if (emailExists) {
                        toast.error('This email has already exists');
                        hasError = true;
                    }
                }
            }
        }

        // Validate Identify Number
        if (Identify !== '') {
            if (!validateIdenNumber(Identify)) {
                toast.error('Invalid identify');
                hasError = true;
            } else {
                const snapshot = await get(child(ref(db), `Detail/`));
                if (snapshot.exists()) {
                    const Infors = snapshot.val();
                    const IdenExists = Object.values(Infors).some((user) => user.idenNum === Identify);
                    if (IdenExists) {
                        toast.error('This identify number has already exists');
                        hasError = true;
                    }
                }
            }
        }

        // Final check before closing the modal
        if (!hasError) {
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
        }
    };

    const handleCancel = () => {
        setAddress('');
        setIsModalOpen(false);
        // Reset form validation status
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
        return /^[A-Za-zÀ-ÿ]+$/.test(name);
    }
    function validateIdenNumber(idenNum) {
        return idenNum.length === 12 && /^[0-9]+$/.test(idenNum);
    }

    function validateNumber(EntranceScore) {
        return /^[0-9.]+$/.test(EntranceScore);
    }

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
            <Button type="primary" onClick={showModal}>
                {t('button.Add')}
            </Button>
            <Modal
                title="Register for Student"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                destroyOnClose
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className="form-item"
                                label="Name"
                                name="name"
                                validateStatus={!validateFullname(Fullname) && Fullname ? 'error' : ''}
                                help={
                                    !validateFullname(Fullname) && Fullname
                                        ? 'University Name must contain only letters and spaces'
                                        : ''
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter Student's name"
                                    prefix={<UserOutlined className="icon" />}
                                    onChange={(e) => setFullname(e.target.value)}
                                    suffix={
                                        <Tooltip title="Name must contain letters and no space ">
                                            <InfoCircleOutlined className="icon" />
                                        </Tooltip>
                                    }
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                className="form-item"
                                label="Gender"
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <Select
                                    initialvalues="Female"
                                    options={genders}
                                    onChange={(value) => setGender(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                className="form-item"
                                label="Date of Birth"
                                name="dob"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <DatePicker
                                    className="Date"
                                    minDate={dayjs('01/01/2004', dateFormat)}
                                    maxDate={dayjs('31/12/2004', dateFormat)}
                                    format="DD/MM/YYYY"
                                    onChange={(value) => setDateOfBirth(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Place of Birth" className="form-item">
                                <Select
                                    initialvalues="Khánh Hòa"
                                    options={cities}
                                    showSearch
                                    onChange={(value) => setPlaceOfBirth(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Email"
                        name="email"
                        className="form-item"
                        validateStatus={!validateEmailFormat(Email) && Email ? 'error' : ''}
                        help={validateEmailFormat(Email) && Email ? ' ' : ''}
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter Student's email"
                            prefix={<MailOutlined className="icon" />}
                            suffix={
                                <Tooltip title="Email must contain @example">
                                    <InfoCircleOutlined className="icon" />
                                </Tooltip>
                            }
                            onChange={(e) => setEmail(e.target.value)}
                            allowClear
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Identify Number"
                                name="identify"
                                className="form-item"
                                validateStatus={!validateIdenNumber(Identify) && Identify ? 'error' : ''}
                                help={
                                    !validateIdenNumber(Identify) && Identify
                                        ? 'Identify number must be 12 digits and contain only number '
                                        : ''
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) => setIdentify(e.target.value)}
                                    showCount
                                    maxLength={12}
                                    value={Identify}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ethnicity"
                                name="ethnicity"
                                className="form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <Select
                                    initialvalues="Kinh"
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
                                label="Address"
                                name="address"
                                className="form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <TextArea
                                    showCount
                                    maxLength={100}
                                    allowClear
                                    placeholder="Student's Address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={Address}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label="Math"
                                className="form-item"
                                name="math"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    className="input-num"
                                    min={0}
                                    max={10}
                                    step={0.2}
                                    onChange={(value) => setMathscore(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="English"
                                name="english"
                                className="form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={10}
                                    step={0.2}
                                    className="input-num"
                                    onChange={(value) => setEnglishscore(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Literature"
                                name="literature"
                                className="form-item"
                                validateStatus={
                                    (!validateNumber(Literaturescore) && Literaturescore) ||
                                    (Literaturescore && parseFloat(Literaturescore) > 10)
                                        ? 'error'
                                        : ''
                                }
                                help={
                                    !validateNumber(Literaturescore) && Literaturescore
                                        ? 'Literature Score must contain only numbers and no spaces'
                                        : Literaturescore && parseFloat(Literaturescore) > 10
                                        ? 'Literature Score must be less than or equal to 10'
                                        : ''
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={10}
                                    step={0.2}
                                    className="input-num"
                                    onChange={(value) => setLiteraturescore(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Entrance Score" className="form-item">
                                <Input readOnly className="input-num" value={averageS} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default ModalAdd;
