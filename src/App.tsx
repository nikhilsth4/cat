import { useCallback, useEffect, useState } from "react";
import Card from "./components/Card";
import { DocumentInterface, OverlayInterface } from "./types/document";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { documentToImage } from "./functions/helper";
import axios from "axios";
import Spinner from "./components/Spinner";

const App = (): JSX.Element => {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [overlay, setOverlay] = useState<OverlayInterface>({
    isVisible: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<number | null>(
    null
  );

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((res) => setDocuments(res));
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDocuments(items);
    setHasChanges(true);
  };

  useEffect(() => {
    const saveData = async () => {
      if (!hasChanges) return;

      setIsSaving(true);

      await axios.post("/api/documents", { documents }).then(() => {
        setIsSaving(false);
        setHasChanges(false);
        setLastSaveTime(new Date());
      });
    };

    const interval = setInterval(() => {
      if (hasChanges) {
        saveData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasChanges, documents]);

  useEffect(() => {
    if (!lastSaveTime) return;

    const interval = setInterval(() => {
      if (lastSaveTime) {
        const minutesSinceSave = Math.floor(
          (new Date().getTime() - lastSaveTime.getTime()) / 60000
        );
        setTimeSinceLastSave(minutesSinceSave);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSaveTime]);
  if (isSaving) {
    return <Spinner />;
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {timeSinceLastSave || timeSinceLastSave === 0 ? (
        <h1 className="w-full p-4 ml-auto">
          Time since Last Save {timeSinceLastSave} minutes
        </h1>
      ) : (
        ""
      )}
      <Droppable droppableId="documents" direction="horizontal">
        {(provided) => (
          <div
            className="grid grid-cols-3 gap-4 m-10"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {documents &&
              documents.map((doc, index) => (
                <Draggable
                  key={`${doc.type}${doc.title}`}
                  draggableId={`${doc.type}${doc.title}`}
                  index={index}
                >
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
