import Profile from "../../models/profile";

export const EDIT_PROFILE = 'EDIT_PROFILE';
export const SET_PROFILE = 'SET_PROFILE';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const ADD_FRIEND = 'ADD_FRIEND';

export const fetchProfile = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        // any async code
        try {
            const response = await fetch('https://doubletap-3ef65.firebaseio.com/profiles.json'); //.then(response => {}) and catch(listens for erros)
            
            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong ' + errorId
                throw new Error(message);
              }
          

            const resData = await response.json();

            let loadedProfiles = [];
            
            for (const key in resData){
                loadedProfiles.push(new Profile(key, resData[key].ownerId, resData[key].userName, resData[key].image, resData[key].friends));
            }

            dispatch({type: SET_PROFILE, profiles: loadedProfiles, profile: loadedProfiles.filter(prof => prof.ownerId === userId)})
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

export const createProfile = (userName, image, friends) => {
    return async (dispatch, getState) => {
      // any async code you want!
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://doubletap-3ef65.firebaseio.com/profiles.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName,
            image,
            friends,
            ownerId: userId,
          })
        }
      );
  
      const resData = await response.json();

      dispatch({
        type: CREATE_PROFILE,
        pid: resData.name,
        profileData: {
          userName,
          image: image,
          ownerId: userId,
          friends: friends
        }
      });
    };
  };


  export const addFriend = (id, friend) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      const response = await fetch(
        `https://doubletap-3ef65.firebaseio.com/profiles/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            friends: friend,
          })
        }
      );
  
      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong ' + errorId
        throw new Error(message);
      }

      dispatch({
        type: ADD_FRIEND,
        pid: id,
        profileData: {
          friends: friend
        }
      });
    };
  };



export const editProfile = (id, userName, image) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      const response = await fetch(
        `https://doubletap-3ef65.firebaseio.com/profiles/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName,
            image,
          })
        }
      );
  
      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong ' + errorId
        throw new Error(message);
      }

      dispatch({
        type: EDIT_PROFILE,
        pid: id,
        profileData: {
          userName,
          image: image
        }
      });
    };
  };

