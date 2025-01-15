import React, { useState } from 'react';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

export default function DocumentSigningFlow() {
  const BACKEND_URL = process.env.BACKEND_URL;
  console.log(BACKEND_URL);
  const [templateData, setTemplateData] = useState(null);
  const [signingResponse, setSigningResponse] = useState(null);
  const [signData, setSignData] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    template: false,
    signing: false,
    signData: false
  });
  const [error, setError] = useState("");

  // Form states
  const [templateId, setTemplateId] = useState("efc5003903e69a22660f3f34d7fe1a10e937708d");
  const [signDataId, setSignDataId] = useState("81e5c6c18891b7975f9670e2f8010816bb678044");
  const [subject, setSubject] = useState("Purchase Order");
  const [message, setMessage] = useState("Glad we could come to an agreement.");
  const [sellers, setSellers] = useState([
    { role: "SELLER", name: "", emailAddress: "" }
  ]);
  const [buyers, setBuyers] = useState([
    { role: "BUYER", name: "", emailAddress: "" }
  ]);

  const updateSeller = (index: number, field: string, value: string) => {
    const newSellers = [...sellers];
    newSellers[index] = { ...newSellers[index], [field]: value };
    setSellers(newSellers);
  };

  const updateBuyer = (index: number, field: string, value: string) => {
    const newBuyers = [...buyers];
    newBuyers[index] = { ...newBuyers[index], [field]: value };
    setBuyers(newBuyers);
  };

  const getTemplate = async () => {
    setLoadingStates(prev => ({ ...prev, template: true }));
    setError("");
    try {
      const response = await fetch(
        `https://drop-be.vercel.app/documents/getTemplate/${templateId}`
      );
      const data = await response.json();
      setTemplateData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching template: ' + err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, template: false }));
    }
  };

  const sendForSigning = async () => {
    setLoadingStates(prev => ({ ...prev, signing: true }));
    setError("");
    try {
      const signers = [...sellers, ...buyers];
      const response = await fetch(`https://drop-be.vercel.app/documents/send-for-signing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          subject,
          message,
          signers
        }),
      });
      const data = await response.json();
      setSigningResponse(data);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching template: ' + err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, signing: false }));
    }
  };

  const getSignData = async () => {
    setLoadingStates(prev => ({ ...prev, signData: true }));
    setError("");
    try {
      const response = await fetch(
        `https://drop-be.vercel.app/documents/getSignData/${signDataId}`
      );
      const data = await response.json();
      setSignData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching template: ' + err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, signData: false }));
    }
  };

  // Rest of the code remains the same until the return statement

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Document Signing Flow</h1>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Get Template */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Get Template</h2>
          <div className="bg-gray-800 p-6 rounded mb-4">
            <div>
              <label className="block mb-2">Template ID</label>
              <input
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white mb-4"
              />
            </div>
            <button
              onClick={getTemplate}
              disabled={loadingStates.template}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center space-x-2"
            >
              {loadingStates.template ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {loadingStates.template ? 'Getting Template...' : 'Get Template'}
            </button>
          </div>
          {templateData && (
            <div className="bg-gray-800 p-4 rounded">
              {/* <JsonView
                src={templateData}
                theme="twilight"
                displayDataTypes={false}
                enableClipboard={false}
              /> */}
              <JsonView src={templateData} theme="default" />            </div>
          )}
        </div>

        {/* Step 2: Send for Signing */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 2: Send for Signing</h2>
          <div className="bg-gray-800 p-6 rounded mb-4">
            <div className="space-y-4 mb-4">
              {/* ... (Subject, Message, Seller, Buyer inputs remain the same) ... */}
              <div>
                <label className="block mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  rows={3}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Seller Details</h3>
                {sellers.map((seller, index) => (
                  <div key={index} className="space-y-3 mb-3">
                    <div>
                      <label className="block mb-2">Name</label>
                      <input
                        type="text"
                        value={seller.name}
                        onChange={(e) => updateSeller(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email</label>
                      <input
                        type="email"
                        value={seller.emailAddress}
                        onChange={(e) => updateSeller(index, 'emailAddress', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Buyer Details</h3>
                {buyers.map((buyer, index) => (
                  <div key={index} className="space-y-3 mb-3">
                    <div>
                      <label className="block mb-2">Name</label>
                      <input
                        type="text"
                        value={buyer.name}
                        onChange={(e) => updateBuyer(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Email</label>
                      <input
                        type="email"
                        value={buyer.emailAddress}
                        onChange={(e) => updateBuyer(index, 'emailAddress', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={sendForSigning}
              disabled={loadingStates.signing}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center space-x-2"
            >
              {loadingStates.signing ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {loadingStates.signing ? 'Sending...' : 'Send for Signing'}
            </button>
          </div>
          {signingResponse && (
            <div className="bg-gray-800 p-4 rounded">
              {/* <ReactJson
                src={signingResponse}
                theme="twilight"
                displayDataTypes={false}
                enableClipboard={false}
              /> */}
              <JsonView src={signingResponse} theme="default" />
            </div>
          )}
        </div>

        {/* Step 3: Get Sign Data */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 3: Get Sign Data (fetch from PostgreSQL DB)</h2>
          <div className="bg-gray-800 p-6 rounded mb-4">
            <div>
              <label className="block mb-2">Sign Data ID</label>
              <input
                type="text"
                value={signDataId}
                onChange={(e) => setSignDataId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white mb-4"
              />
            </div>
            <button
              onClick={getSignData}
              disabled={loadingStates.signData}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center space-x-2"
            >
              {loadingStates.signData ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {loadingStates.signData ? 'Getting Sign Data...' : 'Get Sign Data'}
            </button>
          </div>
          {signData && (
            <div className="bg-gray-800 p-4 rounded">
              {/* <ReactJson
                src={signData}
                theme="twilight"
                displayDataTypes={false}
                enableClipboard={false}
              /> */}
              <JsonView src={signData} theme="default" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}