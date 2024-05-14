import React, { useState } from 'react';
import { Button, Divider, Modal, Space, Select, InputNumber, DatePicker } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import './Modal_add.css'
const Modal_Add = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const genders = [
    {
      value: 'female',
      label: 'Female',
    },
    {
      value: 'male',
      label: 'Male',
    },
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
    { value: 'bana', label: 'Bana' }, // Removed space after Ba
    { value: 'xodang', label: 'Xodang' },
    { value: 'coho', label: 'Coho' },
    { value: 'santieng', label: 'Santieng' },
    { value: 'ede', label: 'Ede' }, // Removed space after Ê
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
    { value: 'khmum', label: 'Khmu' }, // Changed from khmum to Khmu
    { value: 'laha', label: 'Laha' },
    { value: 'lolo', label: 'Lolo' },
    { value: 'chero', label: 'Chero' },
    { value: 'khmerdam', label: 'Khmer Dam' },
    { value: 'khmersrei', label: 'Khmer Srei' },
    { value: 'xtieng', label: 'Xtieng' },
    { value: 'muong2', label: 'Muong' }, // Changed from muong to Muong2
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
    { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' }
  ];
  
  
  
  const { TextArea } = Input;
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add a new student
      </Button>
      <Modal title="Register for Student" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={{ width: '80%' }}>
        <Space direction="vertical" >
          <Space.Compact size='small'>
            <Space >
              <label className='font_label'> Name:</label>
              <Input
                placeholder="Enter Student's name"
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
              <label className='font_label'>Gender:</label>
              <Select defaultValue="Female " options={genders} />
            </Space>
          </Space.Compact>
          <Space.Compact>
            <Space>
              <label className='font_label'>Email:</label>
              <Input
                placeholder="Enter Student's email"
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={
                  <Tooltip title="Private Email">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                style={{ width: '100%' }}
              />
              <label className='font_label'>Enthicity:</label>
              <Select defaultValue="Kinh " options={enthicities} />
            </Space>

          </Space.Compact>
          <Space.Compact>
            <Space>
              <label className='font_label'>Date of birth</label>
              <DatePicker />
            </Space>
          </Space.Compact>
          <Space.Compact>
            <Space>
              <label className='font_label'>Place of Birth</label>
              <Select defaultValue="Khanh Hoa " options={cities} />
            </Space>
          </Space.Compact>
          <Space.Compact>
            <Space>
              <label className='font_label'>Identify number</label>
              <Input variant='filled'></Input>
            </Space>
          </Space.Compact>
          <Space.Compact>
            <Space wrap>
              <div>
                <label className='font_label'>Math: </label>
                <InputNumber min={0} max={10} />
              </div>
              <div>
                <label className='font_label'>English: </label>
                <InputNumber min={0} max={10} />
              </div>
              <div>
                <label className='font_label'>Literature: </label>
                <InputNumber min={0} max={10} />
              </div>
            </Space>
          </Space.Compact>
          <Space.Compact>
            <Space>
            <label className='font_label'>Address:</label>
            <TextArea showCount maxLength={100} placeholder="Student's Address" />
            </Space>
          </Space.Compact>
        </Space>
      </Modal >
    </>
  );
};
export default Modal_Add;
