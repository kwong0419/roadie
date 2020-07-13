import { createSlice } from '@reduxjs/toolkit'
import { getFirebaseIdToken } from '../../util/firebaseFunctions'
import { recieveToken } from '../token/tokenSlice'

export const clientSlice = createSlice({
    name: "client",
    initialState: null,
    reducers: {
        recieveClient: {
            reducer: (state, action) => action.payload
        },
        logout: {
            reducer: (state) => null
        }
    }
});

export const updateClient = (user) => async (dispatch) => {
    // dispatch(setLoading(true))
    try {
        if (user) {
            const { email, uid } = user;
            const lastLogin = user.metadata.lastSignInTime;
            dispatch(recieveClient({email, lastLogin, id: uid}));
            const token = await getFirebaseIdToken()
            dispatch(recieveToken(token))
        } else {
            dispatch(recieveClient(null))
        }
        // dispatch(setLoading(false))
    } catch (error) {
        console.log("error", error)
    }
}

export const { recieveClient, logout } = clientSlice.actions;
export default clientSlice.reducer;