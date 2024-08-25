import { http, HttpResponse } from "msw";
import documentsData from "../data.json";
import { DocumentInterface } from "../types/document";

interface PostRequestInterface {
  documents: DocumentInterface[];
}

const loadInitialData = () => {
  const storedData = localStorage.getItem("documents");
  if (!storedData) {
    const initialData = documentsData as DocumentInterface[];
    localStorage.setItem("documents", JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(storedData);
};

export const handlers = [
  http.get("/api/documents", () => {
    const documents = loadInitialData();
    return HttpResponse.json(documents);
  }),

  http.post("/api/documents", async ({ request }) => {
    const documents = await request.json() as PostRequestInterface;

    localStorage.setItem("documents", JSON.stringify(documents.documents));
    return HttpResponse.json(documents, { status: 201 });
  }),
];
