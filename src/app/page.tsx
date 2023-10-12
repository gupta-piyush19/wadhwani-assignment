"use client";

import React, { useRef, useState } from "react";

interface TranslatedData {
  headers: string[];
  data: string[][];
}

export default function Home() {
  const [file, setFile] = useState<Blob | null>();
  const [csvData, setCsvData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedData, setTranslatedData] = useState<TranslatedData>();
  const [loading, setLoading] = useState(false);

  const languages = ["Hindi", "Telugu", "Punjabi", "Marathi"];

  const secretKeyRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0] as Blob;
    setFile(file);
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const content = event.target.result;
      const rows = content.split("\n").map((row: any) => row.split(","));
      setCsvData(rows);
      setErrorMessage("");
    };

    reader.onerror = (event) => {
      setErrorMessage("Error reading the file");
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const handleTranslate = async () => {
    try {
      if (!file) {
        return;
      }

      const secretKey = secretKeyRef.current?.value;

      if (!secretKey) {
        alert("Please enter secret key");
        return;
      }

      setLoading(true);
      setTranslatedData(undefined);

      const formData = new FormData();
      formData.append("csv", file);
      formData.append("convertTo", selectedLanguage.toLowerCase());

      const response = await fetch("/api/translate-csv", {
        headers: {
          secret_key: secretKey,
        },
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data: TranslatedData = await response.json();
      setTranslatedData(data);
    } catch (err: any) {
      alert(err.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full min-h-screen">
      <div className="max-w-5xl mx-auto my-10">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Wadhwani AI assignment
        </h1>
        <h2 className="text-2xl font-bold mb-4 mt-10">CSV File Uploader</h2>

        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="secret_key">Secret Key:</label>
          <input
            type="password"
            name="secret key"
            id="secret_key"
            placeholder="Enter Secret Key"
            className="block border border-gray-300 rounded-md p-2"
            ref={secretKeyRef}
          />
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <table className="table-auto">
          <thead>
            <tr>
              {csvData.length > 0 &&
                (csvData[0] as []).map((header, index) => (
                  <th key={index} className="border px-4 py-2">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {csvData.length > 1 &&
              csvData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {(row as []).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

        {csvData.length > 0 && (
          <div className="mb-4 mt-4">
            <label htmlFor="language" className="mr-2">
              Select Language:
            </label>
            <select
              id="language"
              onChange={(e) => setSelectedLanguage(e.target.value)}
              value={selectedLanguage}
            >
              <option value="">Select a Language</option>
              {languages.map((language, index) => (
                <option key={index} value={language.toLowerCase()}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedLanguage && (
          <button
            onClick={handleTranslate}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Translate
          </button>
        )}

        {
          <div className="mt-4">
            {loading && <p className="text-blue-500">Loading...</p>}
          </div>
        }

        {!!translatedData && !loading && (
          <table className="table-auto mt-4">
            <thead>
              <tr>
                {translatedData?.headers.map((header, index) => (
                  <th key={index} className="border px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {translatedData.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
