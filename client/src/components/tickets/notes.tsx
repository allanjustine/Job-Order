import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardItem, NotesType } from "./view";
import { Fragment } from "react";
import Swal from "sweetalert2";
import { api } from "@/lib/api";

export default function TicketNotes({
  notes,
  handleAddNote,
  fetchData,
}: {
  notes: NotesType[];
  handleAddNote: () => void;
  fetchData: () => Promise<void>;
}) {
  const handleDeleteNote = (noteId: string | null) => () => {
    Swal.fire({
      title: "Are you sure you want to delete this note?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/notes/${noteId}/delete`);
          if (response.status === 200) {
            fetchData();
          }
        } catch (eror: any) {
          console.error(eror);
        }
      }
    });
  };
  return (
    <Card
      title="Ticket Notes"
      button={
        <Button
          type="button"
          onClick={handleAddNote}
          className="bg-blue-500 hover:bg-blue-600 hover:scale-105 duration-300 ease-in-out hover:translate-x-1"
        >
          <Plus /> Add Note
        </Button>
      }
      cols={notes?.length > 0 ? "grid-cols-[40%_50%_10%]" : "grid-cols-1"}
    >
      {notes?.length > 0 ? (
        notes?.map((item, index) => (
          <Fragment key={index}>
            <CardItem title="Noted By" value={item.noted_by.name} />
            <CardItem title="Content" value={item.content} />
            <Button
              type="button"
              variant="link"
              className="text-red-500 hover:text-red-600 hover:scale-105 duration-300 ease-in-out hover:translate-x-1"
              onClick={handleDeleteNote(item.id)}
            >
              <Trash />
            </Button>
          </Fragment>
        ))
      ) : (
        <p className="text-center text-gray-500">No notes found</p>
      )}
    </Card>
  );
}
