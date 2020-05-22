import {AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, GUEST} from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    didTryAutoLogin: false,
    isGuest: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                didTryAutoLogin: true,
                isGuest: false
            }
        case LOGOUT:
            return {
                ...initialState,
                didTryAutoLogin: true,
                isGuest: false
            };
        case SET_DID_TRY_AL:
            return {
                ...state,
                didTryAutoLogin: true
            };
            case GUEST:
                return {
                    ...state,
                    isGuest: true
                };
        default:
            return state;
    }
};