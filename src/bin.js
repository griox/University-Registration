import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/charts';

const Bin = () => {
    const saveThemeToLocalStorage = (theme) => {
        localStorage.setItem('chartTheme', JSON.stringify(theme));
    };

    const loadThemeFromLocalStorage = () => {
        const theme = localStorage.getItem('chartTheme');
        return theme ? JSON.parse(theme) : null;
    };
    const [theme, setTheme] = useState(loadThemeFromLocalStorage() || 'dark');

    useEffect(() => {
        saveThemeToLocalStorage(theme);
    }, [theme]);

    const config = {
        data: [
            { month: 'Jan.', profit: 387264, start: 0, end: 387264 },
            { month: 'Feb.', profit: 772096, start: 387264, end: 1159360 },
            { month: 'Mar.', profit: 638075, start: 1159360, end: 1797435 },
            { month: 'Apr.', profit: -211386, start: 1797435, end: 1586049 },
            { month: 'May', profit: -138135, start: 1586049, end: 1447914 },
            { month: 'Jun', profit: -267238, start: 1447914, end: 1180676 },
            { month: 'Jul.', profit: 431406, start: 1180676, end: 1612082 },
            { month: 'Aug.', profit: 363018, start: 1612082, end: 1975100 },
            { month: 'Sep.', profit: -224638, start: 1975100, end: 1750462 },
            { month: 'Oct.', profit: -299867, start: 1750462, end: 1450595 },
            { month: 'Nov.', profit: 607365, start: 1450595, end: 2057960 },
            { month: 'Dec.', profit: 1106986, start: 2057960, end: 3164946 },
            { month: 'Total', start: 0, end: 3164946 },
        ],
        xField: 'month',
        yField: ['start', 'end'],
        colorField: (d) => (d.month === 'Total' ? 'Total' : d.profit > 0 ? 'Increase' : 'Decrease'),
        theme: theme,
        yAxis: {
            labelFormatter: '~s',
        },
        tooltip: {
            items: ['start', 'end'],
        },
    };

    return (
        <div>
            <Column {...config} />
            <button onClick={() => setTheme('dark')}>Dark Theme</button>
            <button onClick={() => setTheme('light')}>Light Theme</button>
        </div>
    );
};

export default Bin;
