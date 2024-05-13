const initState = {
    surname: '',
    middlename: '',
    lastname: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    birthplace: '',
    address: '',
    ethnicity: '',
    CCCD: '',
    school: '',
    phonenumber: '',
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
        // console.log(action.payload);
        // const { position, newValue } = action.payload;
        // const updatedState = { ...state };
        // updatedState[Object.keys(state)[position]] = newValue;
        // return updatedState;
        // return {
        //   surname: action.payload.surname,
        //   middlename: action.payload.middlename,
        //   lastname: action.payload.lastname,
        //   gender: action.payload.gender,
        //   day: action.payload.day,
        //   month: action.payload.month,
        //   year: action.payload.year,
        //   birthplace: action.payload.birthplace,
        //   address: action.payload.address,
        //   ethnicity: action.payload.ethnicity,
        //   CCCD: action.payload.CCCD,
        //   school: action.payload.school,
        //   phonenumber: action.payload.phonenumber,
        // };
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
