import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DocumentItem from "./DocumentItem";
import { DocumentInterface } from "../types/document";

interface DocumentListProps {
  documents: DocumentInterface[];
  onDragEnd: (items: DocumentInterface[]) => void;
  openOverlay: (item: DocumentInterface) => void;
}

const DocumentList = ({ documents, onDragEnd, openOverlay }: DocumentListProps) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onDragEnd(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="documents" direction="horizontal">
        {(provided) => (
          <div
            className="grid grid-cols-3 gap-4 m-10"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {documents.map((doc, index) => (
              <DocumentItem
                key={`${doc.type}${doc.title}`}
                doc={doc}
                index={index}
                openOverlay={openOverlay}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DocumentList;
