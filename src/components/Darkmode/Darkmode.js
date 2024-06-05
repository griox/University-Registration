  import React from 'react'
  import  { Switch } from 'antd';
  import { SunOutlined, MoonOutlined } from '@ant-design/icons';
  import { useDispatch, useSelector } from 'react-redux';
  const DarkMode = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector(state=>state)
    const setDarkMode =()=>{
      document.querySelector("body").setAttribute("data-theme","dark");
    };
    const setLightMode =()=>{
      document.querySelector("body").setAttribute("data-theme","light");
    };
    const toggleTheme=(checked)=>{
      if(checked){
        dispatch({type:'theme',payload:false});
        setLightMode();
      } 
    else{
      dispatch({type:'theme',payload:true});
      setDarkMode();
    }
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
  export default DarkMode;
