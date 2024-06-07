export const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';

export const toggleDarkMode = (checked) => {
    return {
        type: TOGGLE_DARK_MODE,
        payload: checked,
    };
};