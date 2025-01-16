"use client";
import { useState } from "react";

export default function EncryptURL() {
  const [encryptedURL, setEncryptedURL] = useState("");
  const [plainURL, setPlainURL] = useState("");
  const [decryptedURL, setDecryptedParams] = useState("");
  const [loading, setLoading] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [error, setError] = useState("");

  const generateEncryptedURL = async () => {
    if (!referenceNo || !transactionAmount) {
      setError("Both Reference Number and Transaction Amount are required.");
      return;
    }

    setError(""); // Clear any existing error messages
    setLoading(true);

    const requestBody = {
      merchantID: "386949",
      mandatoryFields: "1234686|11|1",
      optionalFields: "",
      returnURL: "https://khit.campusify.io/dashboard/return-url",
      referenceNo,
      subMerchantID: "11",
      transactionAmount,
      payMode: "9",
    };

    try {
      const response = await fetch(
        "https://osaw.in/v1/payment/api/encryption/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      setEncryptedURL(data.encryptedURL);
      setPlainURL(data.plainURL);
    } catch (error) {
      console.error("Failed to generate encrypted URL:", error);
    } finally {
      setLoading(false);
    }
  };

  const decryptEncryptedURL = async () => {
    try {
      const response = await fetch(
        "https://osaw.in/v1/payment/api/encryption/decrypt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ encryptedURL }),
        }
      );

      const data = await response.json();
      setDecryptedParams(data.decryptedURL);
    } catch (error) {
      console.error("Failed to decrypt URL:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center text-primary">
          Encrypt/Decrypt ICICI Payment URL
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700">
            Reference Number
          </label>
          <input
            type="text"
            id="referenceNo"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Reference Number"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="transactionAmount" className="block text-sm font-medium text-gray-700">
            Transaction Amount
          </label>
          <input
            type="text"
            id="transactionAmount"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Transaction Amount"
          />
        </div>

        <button
          onClick={generateEncryptedURL}
          disabled={loading}
          className={`w-full py-2 px-4 mb-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
          }`}
        >
          {loading ? "Generating..." : "Generate Encrypted URL"}
        </button>

        {encryptedURL && (
          <div className="text-center">
            <p className="text-green-700 mb-2 break-all">
              Encrypted URL Generated Successfully!
            </p>
            {/* <p className="text-green-700 mb-2 break-all">Plain URL: {plainURL}</p>
            <p className="text-blue-500">Encrypted URL: {encryptedURL}</p> */}
            {/* <button
              onClick={decryptEncryptedURL}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Decrypt URL
            </button> */}
          </div>
        )}

        <a
          href={encryptedURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Proceed to Payment
        </a>

        {/* {decryptedURL && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Decrypted URL Parameters:
            </h2>
            <pre className="text-left bg-gray-100 p-2 rounded text-sm">
              {decryptedURL}
            </pre>
          </div>
        )} */}
      </div>
    </div>
  );
}
