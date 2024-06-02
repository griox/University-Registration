const initState = {
    name: '',
    gender: '',
    placeOBirth: '',
    Address: '',
    enthicity: '',
    idenNum: '',
    email: '',
    EnglishScore: 0,
    MathScore: 0,
    LiteratureScore: 0,
    uniCode: [],
    img: '',
    id: '',
    dateObirth: '0/0/0',
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'logout':
            return {
                name: '',
                gender: '',
                placeOBirth: '',
                Address: '',
                enthicity: '',
                idenNum: '',
                email: '',
                EnglishScore: 0,
                MathScore: 0,
                LiteratureScore: 0,
                uniCode: [],
                img: '',
                id: '',
            };
        case 'update':
            const { propertyName, newValue } = action.payload;
            return {
                ...state,
                [propertyName]: newValue,
            };
        case 'pushUniCode':
            if (state.uniCode.length === 5) {
                return state;
            }
            return {
                ...state,
                uniCode: [...state.uniCode, action.newValue],
            };
        case 'user':
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
};
export default reducer;
