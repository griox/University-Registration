import React, { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip } from 'antd';
import 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { BankOutlined,InfoCircleOutlined } from '@ant-design/icons';

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
  const [inputError, setInputError] = useState('');

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    let hasError = false;
    // Initial checks
    if (uniName === '' || address === '' || averageScore === null || registeredNumber === null || targetScore === null || uniCode==='') {
      toast.error('Please fill in all information');
      hasError = true;
      if(uniName!==''){
        if(uniCode!==''){
          if(!validateName(uniCode)){
            toast.error('Invalid uniCode format')
            hasError = true;
          }
          else{
            const snapshot = await get(child(ref(db), `University/`));
            if(snapshot.exists()){
              const inFors = snapshot.val();
              const uniCodeExists = Object.values(inFors).some((uni) => uni.uniCode === uniCode.toLowerCase());
              if(uniCodeExists){
                toast.error('This uniCode has already exists');
                hasError = true;
              }
            }
          }
        }
      }else{
        const snapshot = await get(child(ref(db), `University/`));
        if(snapshot.exists()){
          const inFors = snapshot.val();
          const uniCodeExists = Object.values(inFors).some((uni) => uni.nameU === uniName);
          if(uniCodeExists){
            toast.error('This university has already exists');
            hasError = true;
          }
        }
      }
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

  

  const AddSchool = async () => {
    const uniRef = ref(db, `University/${uniCode}`);
    await set(uniRef, {
      nameU: uniName,
      uniCode: uniCode,
      address: address,
      averageS: averageScore,
      isRegistered: 0,
      target: targetScore,
    });
    toast.success('Added a university');
  };

  function validateName(uniName) {
    return /^[A-Za-zÀ-ÿ]+$/.test(uniName);
  }
  function validateNameUni(uniName) {
    return /^[^\d!@#$%^&*()_+={[}\]|\\:;"'<,>.?/]+$/.test(uniName);
}
  return (
    <>
      <Button style={{ marginBottom: '20px' }} type='primary' onClick={showModal}>
        Add University
      </Button>
      <Modal title="Add a university" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={700} okText='Add' destroyOnClose>
        <Space direction='vertical'>
          <Form>
            <Form.Item
              label="University Name"
              validateStatus={!validateNameUni(uniName) && uniName ? 'error' : ''}
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
                style={{ marginLeft: '10px', width: '326px' }}
                onChange={(e) => setUniName(e.target.value)}
                value={uniName}
                allowClear
                suffix={
                  <Tooltip title="Name just only contain letters and no numbers">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>

            <Form.Item
              label="University Code"
              validateStatus={!validateName(uniCode) && uniCode ? 'error' : ''}
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
                maxLength={6}
                style={{
                  marginLeft: '13px',
                  maxWidth: '165px',
                }}
                suffix={
                  <Tooltip title="uniCode just contain only letters ">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
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
                style={{ marginLeft: '63px', width: '393px' }}
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
                maxLength={2}
                style={{
                  marginLeft: '20px',
                  maxWidth: '34%',
                }}
                value={averageScore}
                onChange={(value)=>setAverageScore(value)}
                min={0}
                max={30}
                step={0.2}
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
                maxLength={5}
                style={{
                  marginLeft: '75px',
                  maxWidth: '30%',
                }}
                value={targetScore}
                onChange={(value)=>setTargetScore(value)}
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