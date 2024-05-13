import Cookies from "universal-cookie";

export const getCookie = (name: string) => {
  const cookie = new Cookies();
  return cookie.get(name);
};

export const isSuperAdminFn = () => {
  const user = getCookie("user");
  return user?.role_id === 3;
};
