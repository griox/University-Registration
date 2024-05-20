import React, { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space } from 'antd';
import 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { BankOutlined } from '@ant-design/icons';

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

const FormAdd = () => {
  const [isModalVisible, setVisible] = useState(false);
  const [uniName, setUniName] = useState('');
  const [uniCode, setUniCode] = useState('');
  const [address, setAddress] = useState('');
  const [averageScore, setAverageScore] = useState(null);
  const [targetScore, setTargetScore] = useState(null);
  const [registeredNumber, setRegisteredNumber] = useState(null);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    let hasError = false;
    // Initial checks
    if (uniName === '' || address === '' || averageScore === null || registeredNumber === null || targetScore === null) {
      toast.error('Please fill in all information');
      hasError = true;
    } else if (!validateName(uniName)) {
      toast.error('Invalid name');
      hasError = true;
    }

    // Final check before closing the modal
    if (!hasError) {
      try {
        await AddSchool();
        setUniName('');
        setUniCode('');
        setAddress('');
        setAverageScore(null);
        setRegisteredNumber(null);
        setTargetScore(null);
        setVisible(false);
      } catch (error) {
        console.error('Error adding university:', error);
        toast.error('An error occurred while adding university');
      }
    }
  };

  const handleCancel = () => {
    setUniName('');
    setUniCode('');
    setAddress('');
    setAverageScore(null);
    setRegisteredNumber(null);
    setTargetScore(null);
    setVisible(false);
  };

  const generateID = async () => {
    const snapshot = await get(child(ref(db), 'University'));
    let count = 0;
  
    if (snapshot.exists()) {
      const universities = snapshot.val();
      count = Object.keys(universities).length; // Đếm số trường đã tồn tại
    }
  
    // Định dạng ID mới dựa trên số lượng trường đã tồn tại
    const newID = `Uni${String(count + 1).padStart(3, '0')}`;
    return newID;
  };
  

  const AddSchool = async () => {
    const newID = await generateID();
    const uniRef = ref(db, `University/${newID}`);
    await set(uniRef, {
      id: newID,
      nameU: uniName,
      uniCode: uniCode,
      address: address,
      averageS: averageScore,
      isRegistered: registeredNumber,
      target: targetScore,
    });
    toast.success('Added a university');
  };

  function validateName(uniName) {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(uniName);
  }

  function validateUniCode(uniCode) {
    return /^[A-Za-z]+$/.test(uniCode);
  }

  return (
    <>
      <Button style={{ marginBottom: '20px' }} type='primary' onClick={showModal}>
        Add University
      </Button>
      <Modal title="Add a university" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={600} okText='Add'>
        <Space direction='vertical'>
          <Form>
            <Form.Item
              label="University Name"
              validateStatus={!validateName(uniName) && uniName ? 'error' : ''}
              help={!validateName(uniName) && uniName ? 'Name must contain only letters and spaces' : ''}
              name="Input"
              style={{ fontWeight: 600 }}
              rules={[
                {
                  required: true,
                  message: 'Please input!',
                },
              ]}
            >
              <Input
                placeholder="Enter University's name"
                prefix={<BankOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={{ marginLeft: '10px' }}
                onChange={(e) => setUniName(e.target.value)}
                value={uniName}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="University Code"
              validateStatus={!validateUniCode(uniCode) && uniCode ? 'error' : ''}
              name="InputCode"
              style={{ fontWeight: 600 }}
              rules={[
                {
                  required: true,
                  message: 'Please input!',
                },
              ]}
            >
              <Input
                placeholder="Uni's Code"
                allowClear
                onChange={(e) => setUniCode(e.target.value)}
                maxLength={3}
                style={{
                  marginLeft: '13px',
                  maxWidth: '50%',
                }}
                value={uniCode}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              style={{ fontWeight: 600 }}
              name="TextArea"
              rules={[
                {
                  required: true,
                  message: 'Please input!',
                },
              ]}
            >
              <Input.TextArea
                placeholder="Uni's address"
                style={{ marginLeft: '63px' }}
                allowClear
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </Form.Item>

            <Form.Item
              label="Entrance Score"
              style={{ fontWeight: 600 }}
              name="Entrance"
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
                  marginLeft: '20px',
                  maxWidth: '34%',
                }}
                value={averageScore}
                onChange={(value) => setAverageScore(value)}
              />
            </Form.Item>

            <Form.Item
              label="Registered"
              style={{ fontWeight: 600 }}
              name="Regist"
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
                  marginLeft: '46px',
                  maxWidth: '30%',
                }}
                value={registeredNumber}
                onChange={(value) => setRegisteredNumber(value)}
              />
            </Form.Item>

            <Form.Item
              label="Targets"
              style={{ fontWeight: 600 }}
              name="Target"
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
                  marginLeft: '68px',
                  maxWidth: '28%',
                }}
                value={targetScore}
                onChange={(value) => setTargetScore(value)}
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

export default FormAdd;
