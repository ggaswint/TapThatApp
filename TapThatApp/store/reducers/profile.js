import {CREATE_PROFILE, SET_PROFILE, EDIT_PROFILE, ADD_FRIEND } from '../actions/profile';
import Profile from '../../models/profile';

const initialState = {
    profiles: [],
    profile: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            if (action.profiles.length === 0){
                return {...state} 
            } else if (action.profile.length === 0){
                return {
                    profile: [],
                    profiles: action.profiles,
                }                 
            }
            return {
                profiles: action.profiles,
                profile: action.profile
            };
        case EDIT_PROFILE:
            let newProfile = new Profile(action.pid, state.profile[0].ownerId, action.profileData.userName, action.profileData.image, state.profile[0].friends)
            return {
              ...state,
              profile: [newProfile]
            };
        case ADD_FRIEND:
            newProfile = new Profile(action.pid, state.profile[0].ownerId, state.profile[0].userName, state.profile[0].image, action.profileData.friends)
            return {
              ...state,
              profile: [newProfile]
            };
        case CREATE_PROFILE:
            newProfile = new Profile(action.pid, action.profileData.ownerId, action.profileData.userName, action.profileData.image, action.profileData.friends)
            return {
              ...state,
              profile: [newProfile]
            };
    }
    return state;
};