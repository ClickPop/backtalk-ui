import React, { createContext, useReducer } from 'react';
import { reducer } from './Reducers';

export const initialState = {
  auth: false,
  token: null,
  errors: [],
  loading: false,
};

export const context = createContext(initialState);

export const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
};
