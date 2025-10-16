// In your Redux slice (assuming you have a slice for authentication)
const initialState = {
    isAuthenticated: false,
    user: null,
    // other authentication related state
};

// Reducer logic to handle authentication actions
const authReducer = (state = initialState, action) => {
    if (!action || !action.type) {
        return state; // Return initial state if action is undefined or has no type
    }


    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer();
