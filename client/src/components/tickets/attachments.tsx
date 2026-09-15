import Storage from "@/utils/storage";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "../ui/attachment";
import { AttachmentsType, Card } from "./view";
import { formatBytes } from "@/utils/format-bytes";
import Link from "next/link";

export default function TicketAttachments({
  attachments,
}: {
  attachments: AttachmentsType[];
}) {
  return (
    <Card title="Ticket Attachments" cols="grid-cols-1">
      <AttachmentGroup>
        {attachments?.map((attachment: AttachmentsType) => (
          <Attachment
            key={attachment.id}
            orientation="vertical"
            className="hover:shadow-xl hover:scale-102 duration-300 ease-in-out"
          >
            <AttachmentMedia variant="image">
              <img
                src={Storage(attachment.file_path)}
                alt={attachment.file_name}
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle title={attachment.file_name}>
                {attachment.file_name}
              </AttachmentTitle>
              <AttachmentDescription
                title={`${attachment.file_type} | ${formatBytes(Number(attachment.file_size))}`}
              >{`${attachment.file_type} | ${formatBytes(Number(attachment.file_size))}`}</AttachmentDescription>
            </AttachmentContent>
            <Link
              href={Storage(attachment.file_path)}
              className="text-blue-500 hover:underline text-center"
              target="_blank"
            >
              View
            </Link>
          </Attachment>
        ))}
      </AttachmentGroup>
    </Card>
  );
}
