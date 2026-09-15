import { Card, CardItem, ChangeRequestsType } from "./view";
import { Fragment } from "react";

export default function TicketChangeRequests({
  changeRequests,
}: {
  changeRequests: ChangeRequestsType[];
}) {
  return (
    <Card title="Change Requests">
      {changeRequests?.map((item, index) => (
        <Fragment key={index}>
          <CardItem title="From" value={item.from} />
          <CardItem title="To" value={item.to} />
        </Fragment>
      ))}
    </Card>
  );
}
