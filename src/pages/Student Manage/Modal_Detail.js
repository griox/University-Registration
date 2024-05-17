import React from 'react';
import {Modal} from 'antd';
const Modal_Detail = ({ visible, onClose, student }) => {
  if (!visible) return null;

  return (
    <Modal title="Information" onCancel={onClose} open={visible} >
      <p>{student.id}</p>
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
       <p>{student.Address}</p>
    </Modal>
  );
};

export default Modal_Detail