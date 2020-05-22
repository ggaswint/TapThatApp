import HighScore from "../../models/highScore";

export const CREATE_HIGHSCORE = 'CREATE_HIGHSCORE';
export const SET_HIGHSCORE = 'SET_HIGHSCORE';
export const SET_FILTERS = 'SET_FILTERS';
export const EDIT_HIGHSCORE = 'EDIT_HIGHSCORE';

export const fetchHighScores = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        // any async code
        try {
            const response = await fetch('https://doubletap-3ef65.firebaseio.com/highscores.json'); //.then(response => {}) and catch(listens for erros)
            
            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong ' + errorId
                throw new Error(message);
              }
          

            const resData = await response.json();
            const loadedHighScores = [];
            
            for (const key in resData){
                loadedHighScores.push(new HighScore(key, resData[key].ownerId, resData[key].userName, resData[key].date, resData[key].score, resData[key].gameLevel));
            }
        
            dispatch({type: SET_HIGHSCORE, highScore: loadedHighScores, userHighScores: loadedHighScores.filter(score => score.ownerId === userId), userId: userId})
        } catch (err) {
            // send to custom analytics server
            throw err;
        }
    };
};

export const filterScores = (filterSettings, userId, friendsIds) => {
    return {
        type: SET_FILTERS,
        filters: filterSettings,
        userId: userId,
        friendsIds: friendsIds,
    };
}

export const createHighScore = (userName, date, score, gameLevel) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // any async code
        const response = await fetch(`https://doubletap-3ef65.firebaseio.com/highscores.json?auth=${token}`, {
            method: 'POST', // GET, PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                date,
                score,
                gameLevel,
                ownerId: userId
            })
        }); //.then(response => {}) and catch(listens for erros)

        const resData = await response.json();


        dispatch({ type: CREATE_HIGHSCORE, highScoreData: {
            id: resData.name,
            userName,
            date,
            score,
            gameLevel,
            ownerId: userId
        }});
    };

};


export const editHighScore = (id, userName, date, score, gameLevel) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://doubletap-3ef65.firebaseio.com/highscores/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName,
            date,
            score,
            gameLevel,
            })
        }
      );
  
      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong ' + errorId
        throw new Error(message);
      }

      dispatch({ type: EDIT_HIGHSCORE, highScoreData: {
        id: id,
        ownerId: userId,
        userName,
        date,
        score,
        gameLevel,
    }});

    };
  };
