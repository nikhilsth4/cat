export type DocumentTypeInterface = 'bank-draft' | 'bill-of-lading' | 'invoice' | 'bank-draft-2' | 'bill-of-lading-2';

export interface DocumentInterface {
    type: DocumentTypeInterface;
    title: string;
    position: number;
}

export interface OverlayInterface {
    isVisible: boolean;
    imageSrc?: string;
  }