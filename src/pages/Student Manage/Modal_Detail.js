
import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Space, Select, InputNumber, DatePicker, Form } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import dayjs from 'dayjs';
const Modal_Detail = ({ visible, onClose, student }) => {
  const [Fullname, setFullname] = useState('');
  const [Gender, setGender] = useState('');
  const [Email, setEmail] = useState('');
  const [Identify, setIdentify] = useState('');
  const [Address, setAddress] = useState('');
  const [enthicity, setEnthicity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [Mathscore, setMathscore] = useState(null);
  const [Englishscore, setEnglishscore] = useState(null);
  const [Literaturescore, setLiteraturescore] = useState(null);
   {/* <p>{student.id}</p>
      <p>{student.name}</p>
      <p>{student.gender}</p>
      <p>{student.enthiciy}</p>
      <p>{student.placeOBirth}</p>
      <p>{student.dateObirth}</p>
      <p>{student.idenNum}</p>
      <p>{student.MathScore}</p>
      <p>{student.EnglishScore}</p>
      <p>{student.LiteratureScore}</p>
      <p>{student.AverageScore}</p>
       <p>{student.Address}</p> */}
       useEffect(() => {
        if (student) {
          setFullname(student.name || '');
          setGender(student.gender || '');
          setEmail(student.email || '');
          setIdentify(student.idenNum || '');
          setAddress(student.Address || '');
          setEnthicity(student.enthicity || '');
          setDateOfBirth(dayjs(student.dateObirth,'DD/MM/YYYY') || '')
          setPlaceOfBirth(student.placeOfBirth || '');
          setMathscore(student.MathScore || 0);
          setEnglishscore(student.EnglishScore || 0);
          setLiteraturescore(student.LiteratureScore || 0);
        }
      }, [student]);
  if (!visible) return null;
  function validateEmailFormat(email) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
  }
  function validateFullname(name) {
    return /^[A-Za-z]+$/.test(name);
  }

  function validateIdenNumber(idenNum) {
    return idenNum.length === 12;
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
  return (
    <Modal title="Information" onCancel={onClose} open={visible} width={600} >
     
       <Space direction="vertical">
          <Form>
            <Space.Compact size="small">
              <Space size={'large'}>
                <Form.Item
                  label="Name"
                  validateStatus={!validateFullname(Fullname) && Fullname ? 'error' : ''}
                  help={validateFullname(Fullname) && Fullname ? '' : 'Name must contain only letters and no spaces'}
                  style={{fontWeight:600}}
                >
                  <Input
                    placeholder="Enter Student's name"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    value={Fullname}
                    onChange={(e) => {
                      setFullname(e.target.value);
                    }}
                    allowClear
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item label="Gender" style={{fontWeight:600}}>
                  <Select value={Gender} options={genders} onChange={(value) => setGender(value)} disabled={true} />
                </Form.Item>
              </Space>
            </Space.Compact>
            <Space.Compact>
              <Space size={'large'}>
                <Form.Item
                  label="Email"
                  validateStatus={!validateEmailFormat(Email) && Email? 'error' : ''}
                  help={validateEmailFormat(Email) && Email ? '':'Email must contain @example'}
                  style={{fontWeight:500}}
                >
                  <Input
                    placeholder="Enter Student's email"
                    prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                      <Tooltip title="Private Email">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    style={{ width: '100%' }}
                    value={Email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    showClear
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item label="Enthicity"  style={{fontWeight:500}}>
                  <Select defaultValue="Kinh" options={enthicities} onChange={(value) => setEnthicity(value)} showSearch style={{ width: 150 }} disabled={true}/>
                </Form.Item>
              </Space>
            </Space.Compact>
            <Space.Compact>
              <Space size={'large'}>
                <Form.Item label="Date of Birth"  style={{fontWeight:500}}>
                  <DatePicker format="DD/MM/YYYY"  value={dateOfBirth} onChange={(value) => setDateOfBirth(value)} disabled={true} />
                </Form.Item>
                <Form.Item label="Place of Birth" style={{fontWeight:500}}>
                  <Select defaultValue='Khánh Hòa'  options={cities} showSearch style={{ width: 150 }} onChange={(value) => setPlaceOfBirth(value)} disabled={true}/>
                </Form.Item>
              </Space>
              </Space.Compact>
            <Space.Compact>
              <Space>
                <Form.Item
                  label="Identify number"
                  validateStatus={! validateIdenNumber(Identify) && Identify? 'error' : ''}
                  style={{fontWeight:500}}
                >
                  <Input
                    onChange={(e) => {
                      setIdentify(e.target.value);
                    }}
                    value={Identify}
                    suffix={
                      <Tooltip title="Identify number must has 12 digits">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    disabled={true}
                  />
                </Form.Item>
              </Space>
            </Space.Compact>
            <Space.Compact>
              <Space wrap>
                <Form.Item label="Math" style={{fontWeight:500}}>
                  <InputNumber min={0} max={10} step={0.2} value={Mathscore} onChange={(value) => setMathscore(value)} disabled={true} />
                </Form.Item>
                <Form.Item label="English" style={{fontWeight:500}}>
                  <InputNumber min={0} max={10} step={0.2} value={Englishscore} onChange={(value) => setEnglishscore(value)} disabled={true} />
                </Form.Item>
                <Form.Item label="Literature" style={{fontWeight:500}}>
                  <InputNumber min={0} max={10} step={0.2} value={Literaturescore} onChange={(value) => setLiteraturescore(value)} disabled={true}/>
                </Form.Item>
              </Space>
            </Space.Compact>
            <Space.Compact>
              <Space>
                <Form.Item label="Address" style={{fontWeight:500}}>
                  <TextArea showCount maxLength={100} placeholder="Student's Address" onChange={(e) => setAddress(e.target.value)} value={Address} disabled={true} />
                </Form.Item>
              </Space>
            </Space.Compact>
          </Form>
        </Space>
    </Modal>
  );
};

export default Modal_Detail