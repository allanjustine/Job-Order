<?php

namespace App\Enums;

enum TicketStatus: string
{
    case PENDING = 'pending';
    case EDITED = 'edited';
    case REJECTED = 'rejected';
}
