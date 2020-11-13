export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOGIN':
      return { ...state, auth: true, token: payload, loading: false };
    case 'LOGOUT':
      return { ...state, auth: false, token: null };
    case 'SET_ALERT':
      return { ...state, errors: [...state.errors, payload], loading: false };
    case 'REMOVE_ALERT':
      return {
        ...state,
        errors: state.errors.filter((error) => error.id !== payload.id),
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: payload };
    case 'SET_NAVBAR':
      return { ...state, navbar: payload };
    default:
      throw new Error();
  }
};
