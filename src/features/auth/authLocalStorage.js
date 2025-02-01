const KEY = "user";
export const getUserLocal = () => {
  return JSON.parse(localStorage.getItem(KEY));
};
export const setUserLocal = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};
