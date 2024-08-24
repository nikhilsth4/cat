import React, { useCallback, useState } from "react";
import Card from "./components/Card";
import documentsData from "./data.json";
import { DocumentInterface } from "./types/document";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { documentToImage } from "./functions/helper";

interface OverlayInterface {
  isVisible: boolean;
  imageSrc?: string;
}

const App = (): JSX.Element => {
  const [documents, setDocuments] = useState<DocumentInterface[]>(
    documentsData as DocumentInterface[]
  );

  const [overlay, setOverlay] = useState<OverlayInterface>({ isVisible: false });

  const openOverlay = (item: DocumentInterface) => {
    setOverlay({ isVisible: true, imageSrc: documentToImage(item.type) });
  };

  const closeOverlay = () => {
    setOverlay({ isVisible: false });
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeOverlay();
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDocuments(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="documents" direction="horizontal">
        {(provided) => (
          <div
            className="m-10 grid grid-cols-3 gap-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {documents.map((doc, index) => (
              <Draggable key={`${doc.type}${doc.title}`} draggableId={`${doc.type}${doc.title}`} index={index}>
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {overlay.isVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeOverlay}
        >
          <img
            src={overlay.imageSrc}
            alt="Overlay"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </DragDropContext>
  );
};

export default App;
