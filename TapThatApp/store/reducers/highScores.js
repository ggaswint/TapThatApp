import { SET_HIGHSCORE, CREATE_HIGHSCORE, SET_FILTERS, EDIT_HIGHSCORE } from '../actions/highScores';
import HighScore from '../../models/highScore';

const initialState = {
    availableHighScores: [],
    usersHighScores: [],
    filteredScores: [],
    filters: {isSelf: false,isFriend: false,isBasic: false,isDynamicEasy: false,isDynamicHard: false, isManyTouch: false}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_HIGHSCORE:
            return {
                ...state,
                availableHighScores: action.highScore,
                filteredScores: !state.filters.isSelf && !state.filters.isFriend && !state.filters.isBasic && !state.filters.isDynamicEasy && !state.filters.isDynamicHard && !state.filters.isManyTouch ? action.highScore : state.filteredScores,
                usersHighScores: action.userHighScores
            };
        case CREATE_HIGHSCORE:
            const newHighScore = new HighScore(action.highScoreData.id, action.highScoreData.ownerId, action.highScoreData.userName, action.highScoreData.date, action.highScoreData.score, action.highScoreData.gameLevel);
            return {
                ...state,
                availableHighScores: state.availableHighScores.concat(newHighScore),
                usersHighScores: state.usersHighScores.concat(newHighScore),
            }
        case EDIT_HIGHSCORE:
            const hsIndex = state.availableHighScores.findIndex(hs => hs.ownerId === action.highScoreData.ownerId && hs.gameLevel === action.highScoreData.gameLevel);
            const updatedScores = [...state.availableHighScores];
            updatedScores[hsIndex].score = action.highScoreData.score;
            return {
                ...state,
                availableHighScores: updatedScores,
                usersHighScores: state.usersHighScores.concat(newHighScore),
            }
        case SET_FILTERS:
            const appliedFilters = action.filters;
            const updatedFilteredScores = state.availableHighScores.filter(score => {
                if (!appliedFilters.guest && appliedFilters.self && (score.ownerId == action.userId)) {
                    if(!appliedFilters.basic && !appliedFilters.dynamicEasy && !appliedFilters.dynamicHard && !appliedFilters.manyTouch){
                        return true;
                    }
                    if (appliedFilters.basic && (score.gameLevel == 'basic')) {
                        return true;
                    }
                    if (appliedFilters.dynamicEasy && (score.gameLevel == 'dynamic (easy)')) {
                        return true;
                    }
                    if (appliedFilters.dynamicHard && (score.gameLevel == 'dynamic (hard)')) {
                        return true;
                    }
                    if (appliedFilters.manyTouch && (score.gameLevel == 'many touch')) {
                        return true;
                    }
                    if(!appliedFilters.friends){
                        return false;
                    }
                }
                if (appliedFilters.self && !appliedFilters.friends){
                    return false;
                }
                if(!appliedFilters.guest){
                    for(let i = 0; i < action.friendsIds.length; i++){
                        if (appliedFilters.friends && (score.ownerId == action.friendsIds[i].ownerId)) {
                            if(!appliedFilters.basic && !appliedFilters.dynamicEasy && !appliedFilters.dynamicHard && !appliedFilters.manyTouch){
                                return true;
                            }
                            if (appliedFilters.basic && (score.gameLevel == 'basic')) {
                                return true;
                            }
                            if (appliedFilters.dynamicEasy && (score.gameLevel == 'dynamic (easy)')) {
                                return true;
                            }
                            if (appliedFilters.dynamicHard && (score.gameLevel == 'dynamic (hard)')) {
                                return true;
                            }
                            if (appliedFilters.manyTouch && (score.gameLevel == 'many touch')) {
                                return true;
                            }
                            return false;
                        } 
                    }
                }
                if (appliedFilters.friends){
                    return false;
                }
                if (appliedFilters.basic && (score.gameLevel == 'basic')) {
                    return true;
                }
                if (appliedFilters.dynamicEasy && (score.gameLevel == 'dynamic (easy)')) {
                    return true;
                }
                if (appliedFilters.dynamicHard && (score.gameLevel == 'dynamic (hard)')) {
                    return true;
                }
                if (appliedFilters.manyTouch && (score.gameLevel == 'many touch')) {
                    return true;
                }
                if (!appliedFilters.friends && !appliedFilters.self && !appliedFilters.basic && !appliedFilters.dynamicEasy && !appliedFilters.dynamicHard && !appliedFilters.manyTouch){
                    return true;
                }
                return false;
            });
            return {
                ...state,
                filteredScores: updatedFilteredScores,
                filters: {isSelf: appliedFilters.self,isFriend: appliedFilters.friends, isBasic: appliedFilters.basic, isDynamicEasy: appliedFilters.dynamicEasy, isDynamicHard: appliedFilters.dynamicHard, isManyTouch: appliedFilters.manyTouch}
            }
    }
    return state;
};