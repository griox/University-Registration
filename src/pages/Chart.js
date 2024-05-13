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
            <div className="number-data">
                <div className="item zoom-effect">
                    <div>
                        <UserOutlined className="icon-item" />
                    </div>
                    <div className="content-item">
                        <h5>Total Students</h5>
                        <h3>$350.4</h3>
                        <h3 style={{ float: 'left' }}>Demo</h3>
                        <h3 style={{ float: 'right' }}>Demo2</h3>
                    </div>
                </div>
                <div className="item zoom-effect">
                    <div>
                        <UserOutlined className="icon-item" />
                    </div>
                    <div className="content-item">
                        <h5>Earning</h5>
                        <h3>$350.4</h3>
                    </div>
                </div>
                <div className="item zoom-effect">
                    <div>
                        <UserOutlined className="icon-item" />
                    </div>
                    <div className="content-item">
                        <h5>Earning</h5>
                        <h3>$350.4</h3>
                    </div>
                </div>
            </div>
            <div className="chart">
                <div className="chart-item">
                    <h1>Table</h1>
                    {/* { <Pie {...cf} />} */}
                    {/* <DemoPie /> */}
                </div>
                <div className="chart-item">
                    <DualAxes {...config} />
                </div>
                <div className="chart-item">
                    <DualAxes {...config} />
                </div>
                <div className="chart-item">
                    <DualAxes {...config} />
                </div>
                <div className="chart-item">
                    <DualAxes {...config} />
                </div>
                <div className="chart-item">
                    <DualAxes {...config} />
                </div>
            </div>
            {/* //   {todos.length}  */}
        </div>
    );
};

export default Chart;
