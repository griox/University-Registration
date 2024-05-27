import React from 'react'
import  { Switch } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
export const DarkMode = () => {
  const setDarkMode =()=>{
    document.querySelector("body").setAttribute("data-theme","dark");
  };
  const setLightMode =()=>{
    document.querySelector("body").setAttribute("data-theme","light");
  };
  const toggleTheme=(checked)=>{
    if(checked) setLightMode();
    else setDarkMode();
  }
  return (
    <>
    <Switch
    className='DarkMode'
    checkedChildren={<SunOutlined />}
    unCheckedChildren={<MoonOutlined />}
    defaultChecked
    onChange={toggleTheme}
  />
    </>
  )
}
