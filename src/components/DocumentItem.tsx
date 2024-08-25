import { Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import { DocumentInterface } from "../types/document";
import { documentToImage } from "../functions/helper";

interface DocumentItemProps {
  doc: DocumentInterface;
  index: number;
  openOverlay: (item: DocumentInterface) => void;
}

const DocumentItem = ({ doc, index, openOverlay }: DocumentItemProps) => (
  <Draggable draggableId={`${doc.type}${doc.title}`} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`p-2 ${
          snapshot.isDragging ? "bg-blue-100" : "bg-white"
        }`}
        onClick={() => openOverlay(doc)}
      >
        <Card
          key={`${doc.position}-${doc.title}`}
          title={doc.title}
          imageSrc={documentToImage(doc.type)}
        />
      </div>
    )}
  </Draggable>
);

export default DocumentItem;
