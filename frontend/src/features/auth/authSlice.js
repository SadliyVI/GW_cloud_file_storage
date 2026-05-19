import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client.js";

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
        return await api.get("/auth/me/");
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
    try {
        return await api.post("/auth/register/", payload);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
    try {
        return await api.post("/auth/login/", payload);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await api.post("/auth/logout/", {});
        return null;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        initialized: false
    },
    reducers: {
        clearAuthError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.initialized = true;
                state.user = null;
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;