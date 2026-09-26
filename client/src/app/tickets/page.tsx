"use client";

import TicketBaseContent from "@/components/tickets/base";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { ADMIN_ACCESS } from "@/lib/permissions";

const Tickets = () => {
  return (
    <>
      <div className="p-6">
        <TicketBaseContent />
      </div>
    </>
  );
};

export default withAuthPage(Tickets, ADMIN_ACCESS);
