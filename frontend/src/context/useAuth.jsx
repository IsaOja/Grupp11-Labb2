import { useContext } from "react";
import AuthContext from "./AuthContext.jsx";

export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
