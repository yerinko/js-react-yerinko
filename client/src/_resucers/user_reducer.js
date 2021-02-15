import {
    LOGIN_USER, REGISTER_USER
} from "../_actions/types";

export default function (state={}, action) {
    switch (action.type) {
        case LOGIN_USER:
                return { ...state, loginSuccess: action.payload}; // 위에 state를 똑같이 가져오는 것
                 break;
        case REGISTER_USER:
            return { ...state, register: action.payload}; // 위에 state를 똑같이 가져오는 것
            break;
        default:
            return state;
    }
}