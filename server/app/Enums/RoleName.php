<?php

namespace App\Enums;

enum RoleName: string
{
    case EMPLOYEE = "employee";
    case ADMIN = "admin";
    case ADMIN_ACCESS = "admin-access";
    case EMPLOYEE_ACCESS = "employee-access";
    case AUDIT = "audit";
    case AUDIT_ACCESS = "audit-access";
    case ACCOUNTING = "accounting";
    case ACCOUNTING_ACCESS = "accounting-access";
}
