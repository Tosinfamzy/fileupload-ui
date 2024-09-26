import React, { useState } from "react";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface UploadedFile {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        password,
      });
      alert(`User registered: ${response.data.username}`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      alert("Login successful!");
      fetchUploadedFiles(); // Fetch the uploaded files after login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

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
    setIsAuthenticated(false);
    setUploadedFiles([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        PDF Viewer & File Manager
      </h1>

      {!isAuthenticated ? (
        <div className="auth-section">
          <h2 className="text-xl font-bold">Register / Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default App;
