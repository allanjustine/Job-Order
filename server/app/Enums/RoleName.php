<?php

namespace App\Enums;

enum RoleName: string
{
    case EMPLOYEE = "employee";
    case ADMIN = "admin";
    case ADMIN_ACCESS = "admin-access";
    case EMPLOYEE_ACCESS = "employee-access";
    case APPROVER = "approver";
    case APPROVER_ACCESS = "approver-access";
}
