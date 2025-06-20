import { Dispatch, SetStateAction } from "react";

interface Credentials {
  branchCodeOrEmail: string;
  password: string;
}

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  handleLogin: (
    credentials: Credentials,
    router: any
  ) => Promise<void | number>;
  handleLogout: (router: any) => Promise<void>;
  branches: any[];
  error: any;
  user: null | any;
  errors: any;
  isLogin: boolean;
  isAdmin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}
