import { OverlayInterface } from "../types/document";

interface OverlayProps {
  overlay: OverlayInterface;
  closeOverlay: () => void;
}

const Overlay = ({ overlay, closeOverlay }: OverlayProps) =>
  overlay.isVisible ? (
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
  ) : null;

export default Overlay;
