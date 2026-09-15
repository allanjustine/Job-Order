import { Card, CardItem, NotesType } from "./view";
import { Fragment } from "react";

export default function TicketNotes({ notes }: { notes: NotesType[] }) {
  return (
    <Card title="Ticket Notes">
      {notes?.map((item, index) => (
        <Fragment key={index}>
          <CardItem title="Noted By" value={item.noted_by.name} />
          <CardItem title="Content" value={item.content} />
        </Fragment>
      ))}
    </Card>
  );
}
