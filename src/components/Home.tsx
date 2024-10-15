import { Worker, Viewer } from "@react-pdf-viewer/core";
import axios from "axios";
import React, { useState } from "react";

interface UploadedFile {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
}

const Home = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/upload/my-files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadedFiles(response.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

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
      fetchUploadedFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // setIsAuthenticated(false);
    setUploadedFiles([]);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
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
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files mb-4">
          <h2 className="text-xl font-bold mb-2">Your Uploaded Files</h2>
          <ul className="list-disc pl-5">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="mb-2">
                <a
                  href={`http://localhost:3000/upload/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pdfFileUrl && (
        <>
          <div className="pdf-viewer-container">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <div style={{ height: "750px" }}>
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
  );
};

export default Home;
