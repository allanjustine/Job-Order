import { Dispatch, SetStateAction } from "react";

interface Credentials {
  branchCodeOrEmail: string;
  password: string;
}

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  handleLogin: (credentials: Credentials) => Promise<void | number>;
  handleLogout: () => Promise<void>;
  branches: any[];
  error: any;
  user: null | any;
  errors: any;
  isAdmin: boolean;
}
