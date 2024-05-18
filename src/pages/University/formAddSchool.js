import React, { useState } from 'react';
import { Modal, Button, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect, Space } from 'antd';
import 'firebase/auth';
import { getDatabase, ref, child, get,set,push } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;

const formItemLayout = {
  //format size according to device 
    labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

const { TextArea } = Input;
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
    const [uniName, setUniName] = useState('quang');
    const [uniCode, setUniCode] = useState('');
    const [address, setAddress] = useState('');
    const [cutoffScore, setCutoffScore] = useState(null);
    const [targetScore, setTargetScore] = useState(null);
    const [registeredNumber, setRegisteredNumber] = useState(null);

    const showModal = () => {
        setVisible(true);
    }

    const handleOk = async () => {
        let hasError = false;    
        // Initial checks
        if (uniName === '' || address === '' || cutoffScore === null || registeredNumber === null || targetScore === null) {
            toast.error('please fill in all information');
            hasError = true;
        } else if (!validateName(uniName)) {
            toast.error('Invalid name');
            hasError = true;
        }
        
        // Final check before closing the modal
        if (!hasError) {
            setUniName('');
            setUniCode('');
            setAddress('');
            setCutoffScore(null);
            setRegisteredNumber(null);
            setTargetScore(null);
            setVisible(false);
        }
    };

    const handleCancel = () => {
        setUniName('');
        setUniCode('');
        setAddress('');
        setCutoffScore(null);
        setRegisteredNumber(null);
        setTargetScore(null);
        setVisible(false);
    };
    const generateID = async () => {
        const snapshot = await get(child(ref(db), 'ListUni'));
        if (snapshot.exists()) {
            // Lấy ra danh sách các trường trong snapshot
            const universities = snapshot.val();
            // Lấy ra danh sách tên trường
            const universityNames = Object.values(universities).map((university) => university.name);
            // Lấy tên trường cuối cùng trong danh sách
            const lastUniversityName = universityNames[universityNames.length - 1];
            // Tạo ID mới từ tên trường
            const newID = lastUniversityName
                .split(' ')
                .map((word) => word[0].toUpperCase()) // Lấy ký tự đầu tiên và chuyển thành chữ hoa
                .join('');
            return newID;
        } else {
            // Nếu danh sách trường trống, trả về ID mặc định
            return 'Uni001'; // Hoặc bạn có thể trả về một giá trị khác tùy ý
        }
    };

    
    const AddSchool = async () => {
        try {
          const newID = await generateID();
          const uniRef = ref(db, `ListUni/${newID}`); // Reference to the new student
          await set(uniRef, {
            id: newID, // Use the generated ID
            name: uniName,
            ucode: uniCode,
            adddress: address,
            cutoff: cutoffScore,
            number: registeredNumber,
            targets: targetScore,
          });
          toast.success('Added a university');
          setVisible(false);
        } catch (error) {
          console.error('Error adding university:', error);
          toast.error('An error occurred while adding university');
        }
      };

      function validateName(uniName) {
        return /^[A-Za-z]+$/.test(uniName);
      }
      function validateUniCode(uniCode) {
        return /^[A-Za-z]+$/.test(uniCode);
      }
    return (
        <>
        <Button type='primary' onClick={showModal}> 
            Add University 
        </Button>
        <Modal title="Add a university" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={600} okText='Add'>
            <Space direction='vertical'>
                    <Form
                    {...formItemLayout}
                    // variant="filled"
                    style={{
                        maxWidth: 600,
                        marginTop: '20px',
                    }}
                >
                    <Form.Item
                        label="University Name"
                        // validateStatus={!validateName(uniName) && uniName ? 'error' : ''}
                        // help= {validateName(uniName) && uniName ? 'Name must contain only letter' : ''}
                        name="Input"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                            },
                        ]}
                    >
                        <Input
                            style={{
                                marginLeft: '10px',
                            }}
                            allowClear
                            onChange={(e) => setUniName(e.target.value)}
                            value={uniName}
                        />
                    </Form.Item>
                    <Form.Item
                        label="University Code"
                        validateStatus={!validateUniCode(uniCode) && uniCode ? 'error' : ''}
                        help= {validateUniCode(uniCode) && uniCode ? '' : 'Name must contain only letter and no space'}
                        name="InputCode"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            onChange={(e) => setUniCode(e.target.value)}
                            maxLength={3}
                            style={{
                                marginLeft: '10px',
                                maxWidth: '50%',
                            }}
                            value={uniCode}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="TextArea"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                            },
                        ]}
                    >
                        <Input.TextArea
                            style={{
                                marginLeft: '10px',
                            }}
                            allowClear
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Entrance Score"
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
                                marginLeft: '10px',
                                maxWidth: '30%',
                            }}
                            value={cutoffScore}
                            onChange={(value) => setCutoffScore(value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Registered "
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
                                marginLeft: '10px',
                                maxWidth: '30%',
                            }}
                            value={registeredNumber}
                            onChange={(value) => setRegisteredNumber(value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Targets"
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
                                marginLeft: '10px',
                                maxWidth: '30%',
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
