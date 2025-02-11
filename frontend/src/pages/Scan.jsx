import React, { useState } from "react";
import axios from "axios";

const Scan = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(droppedFile);
      setPreview(previewUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/analyze/scan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 mt-4">
      <h2 className="text-2xl font-bold mb-6">Scan Analysis</h2>
      
      {/* Upload Area */}
      <div 
        className="flex flex-col items-center justify-center w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain p-4"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {file && !analysis && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Analyzing..." : "Analyze Scan"}
        </button>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">{analysis.analysis}</p>
          </div>
          
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc list-inside">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700 mb-1">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            Analysis completed at: {new Date(analysis.timestamp).toLocaleString()}
          </div>
          
          {/* Reset Button */}
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
              setAnalysis(null);
            }}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Analyze Another Scan
          </button>
        </div>
      )}
    </div>
  );
};

export default Scan;