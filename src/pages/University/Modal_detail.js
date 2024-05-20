// import React from 'react';
// import { Descriptions } from 'antd';

// const items = [
//     {
//         key: '1',
//         label: 'Name',
//         children: 'Nha Trang University',
//     },
//     {
//         key: '2',
//         label: 'Telephone',
//         children: '1810000000',
//     },
//     {
//         key: '3',
//         label: 'Address',
//         children: '2 Nguyễn Đình Chiểu, Nha Trang, Khánh Hòa',
//     },
//     {
//         key: '4',
//         label: 'University code',
//         children: 'NTU',
//     },
// ];

// const FormDetail = () => (
//     <Descriptions title="University Infomation" column={2}>
//         {items.map((item) => (
//             <Descriptions.Item key={item.key} label={item.label}>
//                 {item.children}
//             </Descriptions.Item>
//         ))}
//     </Descriptions>
// );

// export default FormDetail;


import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
export const Form_Detail = ({university}) => {

const items = [
    {
        key: '1',
        label: 'Unicode',
        children: university.uniCode,
    },
    {
        key: '2',
        label: 'Entrance Score',
        children: university.averageS,
    },
    {
        key: '3',
        label: 'Number of Registration',
        children: university.isRegistered,
    },
    {
        key: '4',
        label: 'Target',
        children: university.target,
    },
    {
        key: '5',
        label: 'Address',
        children:university.address,
    },
    {
        key: '6 ',
        label: 'Name',
        children: university.nameU,
    },
];
  return (
    <Descriptions title="University Infomation" column={2}>
        {items.map((item) => (
            <Descriptions.Item key={item.key} label={item.label}>
                {item.children}
            </Descriptions.Item>
        ))}
    </Descriptions>
  )
}
export default Form_Detail
