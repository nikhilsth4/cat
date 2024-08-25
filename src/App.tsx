import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import DocumentList from "./components/DocumentList";
import Overlay from "./components/Overlay";
import Spinner from "./components/Spinner";
import axios from "axios";
import { DocumentInterface, OverlayInterface } from "./types/document";
import { documentToImage } from "./functions/helper";

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

  const handleOnDragEnd = (items: DocumentInterface[]) => {
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
    <div>
      <Header timeSinceLastSave={timeSinceLastSave} />
      <DocumentList
        documents={documents}
        onDragEnd={handleOnDragEnd}
        openOverlay={openOverlay}
      />
      <Overlay overlay={overlay} closeOverlay={closeOverlay} />
    </div>
  );
};

export default App;
