import { DocumentTypeInterface } from "../types/document";

export function documentToImage(type: DocumentTypeInterface): string {
    switch (type) {
      case "bank-draft":
        return "cats/cat0.jpg";
      case "bill-of-lading":
        return "cats/cat1.jpg";
      case "invoice":
        return "cats/cat2.jpg";
      case "bank-draft-2":
        return "cats/cat3.jpg";
      case "bill-of-lading-2":
        return "cats/cat4.jpg";
      default:
        return "cats/cat0.jpg";
    }
  }