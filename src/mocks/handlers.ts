import { http, HttpResponse } from "msw";
import documentsData from "../data.json";

const loadInitialData = () => {
  const storedData = localStorage.getItem("documents");
  if (!storedData) {
    const initialData = documentsData;
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

  http.post("/api/documents", ({ request }) => {
    const newDocument = request.body;
    const documents = loadInitialData();
    documents.push(newDocument);
    localStorage.setItem("documents", JSON.stringify(documents));
    return HttpResponse.json(newDocument, { status: 201 });
  }),
];
