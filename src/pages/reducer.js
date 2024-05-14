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
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'update':
            const { propertyName, newValue } = action.payload;
            return {
                ...state,
                [propertyName]: newValue,
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

// const initialState = {
//   thap: 0,
//   tb: 0,
//   cao: 0,
// };
// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "thap":
//       return {
//         thap: state.thap + 1,
//         tb: state.tb,
//         cao: state.cao,
//       };
//     case "tb":
//       return {
//         thap: state.thap,
//         tb: state.tb + 1,
//         cao: state.cao,
//       };
//     case "cao":
//       return {
//         thap: state.thap,
//         tb: state.tb,
//         cao: state.cao + 1,
//       };
//     default:
//       return state;
//   }
// };
// export default reducer;
