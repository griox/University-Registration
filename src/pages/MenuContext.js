// MenuContext.js
import { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard'); // Mặc định là Dashboard

    return <MenuContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>{children}</MenuContext.Provider>;
};
