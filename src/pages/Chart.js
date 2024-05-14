import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { DualAxes } from '@ant-design/plots';
import '../assets/admin/css/chart.css';

const Chart = () => {
    const data = [
        { year: '1991', value: 3, count: 10 },
        { year: '1992', value: 4, count: 4 },
        { year: '1993', value: 3.5, count: 5 },
        { year: '1994', value: 5, count: 5 },
        { year: '1995', value: 4.9, count: 4.9 },
        { year: '1996', value: 6, count: 35 },
        { year: '1997', value: 7, count: 7 },
        { year: '1998', value: 9, count: 1 },
        { year: '1999', value: 13, count: 20 },
    ];
    const config = {
        data,
        xField: 'year',
        legend: true,
        children: [
            {
                type: 'line',
                yField: 'value',
                style: {
                    stroke: '#5B8FF9',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        title: 'value',
                        style: { titleFill: '#5B8FF9' },
                    },
                },
            },
            {
                type: 'line',
                yField: 'count',
                style: {
                    stroke: '#5AD8A6',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        position: 'right',
                        title: 'count',
                        style: { titleFill: '#5AD8A6' },
                    },
                },
            },
        ],
    };
    return (
        <div className="container">
            <div className="mainer">
                <div className="cards">
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">1234</div>
                            <div className="card-name">Students</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">1234</div>
                            <div className="card-name">Students</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">1234</div>
                            <div className="card-name">Students</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="charter">
                    <h2>Demo</h2>
                    <DualAxes {...config} />
                </div>
                <div className="charter" id="donut">
                    <h2>Demo 2</h2>
                    <DualAxes {...config} />
                </div>
            </div>
        </div>
    );
};

export default Chart;
