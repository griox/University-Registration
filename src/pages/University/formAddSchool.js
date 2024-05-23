import React, { useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Space, Tooltip, Col, Row } from 'antd';
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
 
  const [inputError, setInputError] = useState('');

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    let hasError = false;
    // Initial checks
    if (uniName === '' || address === '' || averageScore === null || targetScore === null || uniCode==='') {
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
              const uniCodeExists = Object.values(inFors).some((uni) => uni.uniCode === uniCode);
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
    return /^[A-Za-zÀ-ÿ\s]+$/.test(uniName);
  }

  // function validateUniCode(uniCode) {
  //   return /^[A-Za-z]+$/.test(uniCode);
  // }

  function validateNumber(EntranceScore) {
    return /^[0-9.]+$/.test(EntranceScore);
  }

  function validateTarget(targetScore) {
    return /^[0-9]+$/.test(targetScore);
  }
  
  return (
    <>
      <Button style={{ marginBottom: '20px' }} type='primary' onClick={showModal}>
        Add University
      </Button>
      <Modal
      title="Add a university"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText="Add"
      destroyOnClose
      style={{ top: 80 }}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
              <Form.Item
              label="University Name"
              validateStatus={!validateName(uniName) && uniName ? 'error' : ''}
              help={!validateName(uniName) && uniName ? 'University Name must contain only letters and spaces' : ''}
              name="uniName"
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
                onChange={(e) => setUniName(e.target.value)}
                value={uniName}
                allowClear
                suffix={
                  <Tooltip title="Name must contain only letters and no numbers">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
              <Form.Item
              label="University Code"
              validateStatus={!validateName(uniCode) && uniCode ? 'error' : ''}
              help={!validateName(uniCode) && uniCode ? 'University Code must contain only letters and no spaces' : ''}
              name="uniCode"
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
                suffix={
                  <Tooltip title="University Code must contain only letters">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                value={uniCode}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  label="Entrance Score"
                  style={{ fontWeight: 600 }}
                  name="entranceScore"
                  validateStatus={
                    (!validateNumber(averageScore) && averageScore) || (averageScore && parseFloat(averageScore) > 30)
                      ? 'error'
                      : ''
                  }
                  help={
                    !validateNumber(averageScore) && averageScore
                      ? 'Entrance Score must contain only numbers and no spaces'
                      : (averageScore && parseFloat(averageScore) > 30)
                      ? 'Entrance Score must be less than or equal to 30'
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
                    allowClear
                    maxLength={4}
                    value={averageScore}
                    onChange={(e) => setAverageScore(e.target.value)}
                    suffix={
                      <Tooltip title="Entrance Score must contain only numbers">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  label="Target"
                  style={{ fontWeight: 600 }}
                  name="target"
                  validateStatus={
                    targetScore && (!validateTarget(targetScore) || Number(targetScore) > 10000)
                      ? 'error'
                      : ''
                  }
                  help={
                    targetScore
                      ? !validateTarget(targetScore)
                        ? 'Target must contain only positive numbers and no spaces'
                        : Number(targetScore) > 10000
                        ? 'Target must be less than 10,000'
                        : ''
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
                    allowClear
                    maxLength={5}
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    suffix={
                      <Tooltip title="Target must contain only numbers">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item
          label="Address"
          style={{ fontWeight: 600}}
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input!',
            },
          ]}
        >
          <Input.TextArea
            placeholder="University's address"
            allowClear
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};

export default FormAdd;