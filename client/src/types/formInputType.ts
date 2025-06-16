export interface FormInputType {
  branchCode: string;
  branchName: string;
  branch: number | string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInputType {
  branchCodeOrEmail: string;
  password: string;
}
