import { Viewer, Worker } from "@react-pdf-viewer/core";
import axios from "axios";
import { useState } from "react";
import "./App.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Auth from "./auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfFileUrl(fileUrl);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleSendFile = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/upload/pdf",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(`File uploaded successfully: ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">PDF Viewer & Auth</h1>

      {isAuthenticated ? (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <>
          <div className="mb-4 flex flex-col items-center">
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 mr-2 rounded hover:bg-blue-700"
            >
              Upload PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {pdfFileUrl && (
            <>
              <div className="pdf-viewer-container">
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <div style={{ height: "500px" }}>
                    <Viewer fileUrl={pdfFileUrl} />
                  </div>
                </Worker>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleSendFile}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
