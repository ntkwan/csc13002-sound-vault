import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import { api } from '@services/api';
import { authReducer } from '@features/authentication/slices';
import { profileReducer } from '@features/profilepage/slices';
import { playerReducer } from '@features/player/slices';
import storage from 'redux-persist/lib/storage';
import playerTransform from '@features/player/transform';

const persistConfig = {
    key: 'root',
    storage,
    transforms: [playerTransform],
    whitelist: ['auth', 'player'],
};

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    profile: profileReducer,
    player: playerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(api.middleware),
    devTools: true,
});

export let persistor = persistStore(store);
