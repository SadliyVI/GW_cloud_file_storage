import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client.js";

export const fetchUsers = createAsyncThunk("users/list", async (_, { rejectWithValue }) => {
    try {
        return await api.get("/auth/users/");
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteUser = createAsyncThunk("users/delete", async (userId, { rejectWithValue }) => {
    try {
        await api.delete(`/auth/users/${userId}/`);
        return userId;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateUserAdminFlag = createAsyncThunk(
    "users/updateAdmin",
    async ({ userId, is_staff }, { rejectWithValue }) => {
        try {
            return await api.patch(`/auth/users/${userId}/admin/`, { is_staff });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const usersSlice = createSlice({
    name: "users",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.items = state.items.filter((u) => u.id !== action.payload);
            })

            .addCase(updateUserAdminFlag.fulfilled, (state, action) => {
                const index = state.items.findIndex((u) => u.id === action.payload.id);
                if (index >= 0) {
                    state.items[index] = {
                        ...state.items[index],
                        ...action.payload
                    };
                }
            });
    }
});

export default usersSlice.reducer;