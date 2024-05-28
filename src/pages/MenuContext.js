import { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const { t } = useTranslation('sidebar');
    const [selectedMenuItem, setSelectedMenuItem] = useState(t('title.dashboard'));
    return <MenuContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>{children}</MenuContext.Provider>;
};
