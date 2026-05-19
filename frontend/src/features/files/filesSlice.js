import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client.js";

export const fetchFiles = createAsyncThunk("files/list", async (userId, { rejectWithValue }) => {
    try {
        const query = userId ? `?user_id=${userId}` : "";
        return await api.get(`/storage/files/${query}`);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const uploadFile = createAsyncThunk(
    "files/upload",
    async ({ file, comment, userId }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("comment", comment || "");

            const query = userId ? `?user_id=${userId}` : "";
            return await api.post(`/storage/files/upload/${query}`, formData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteFile = createAsyncThunk("files/delete", async (fileId, { rejectWithValue }) => {
    try {
        await api.delete(`/storage/files/${fileId}/`);
        return fileId;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateFile = createAsyncThunk(
    "files/update",
    async ({ fileId, original_name, comment }, { rejectWithValue }) => {
        try {
            return await api.patch(`/storage/files/${fileId}/update/`, {
                original_name,
                comment
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const filesSlice = createSlice({
    name: "files",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearFilesError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(uploadFile.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(deleteFile.fulfilled, (state, action) => {
                state.items = state.items.filter((f) => f.id !== action.payload);
            })

            .addCase(updateFile.fulfilled, (state, action) => {
                const index = state.items.findIndex((f) => f.id === action.payload.id);
                if (index >= 0) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const { clearFilesError } = filesSlice.actions;
export default filesSlice.reducer;