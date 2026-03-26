'use client';
import Image from "next/image";
import { use, useState } from "react";

export default function Home() {

  const [longURL, setLongURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const [generatedURL, setGeneratedURL] = useState('');
  const [retrivedLongURL, setRetrivedLongURL] = useState('');
  const [error, setError] = useState<any>('');

  const handleGenerateShortURL = async () => {
      try {

        const response = await fetch("http://localhost:3001/shorten",{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            "originalUrl" : longURL
          })
        });

        const data = await response.json();
        if(response.ok){
          setGeneratedURL(data.data);
        } else{
          setError("Error generating short url");
        }

      } catch (error) {
        console.log(error);
        setError(error);
      }
  }
  const handleRetrivedLongURL = async () => {
      try {
        const response = await fetch(`http://localhost:3001/${shortURL}` , {
          method : "GET"
        });
        const data = await response.json();
        if(response.ok){
          setRetrivedLongURL(data.data);
        } else{
          setError("Error retriving long url");
        }

      } catch (error) {
        console.log(error);
        setError(error);
      }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Url Shortner app 👋</h1>

      {/* short url genereation */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl mb-4">Generate short URL</h2>
        <input
          type="text"
          placeholder="Enter your long url"
          value={longURL}
          onChange={(e) => setLongURL(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-200"
        />

        <button
          onClick={handleGenerateShortURL}
          className="w-full mt-8 bg-blue-600 rounded-lg hover:bg-blue-700 text-white py-2">
          Generate short URL
        </button>

        {generatedURL && (
          <p className="mt-4 text-green-400">
            Short URL: <a href={`/${generatedURL}`} target="_blank">
              {`https://demo.com/${generatedURL}`} 
            </a>
          </p>
        )}

      </div>

      {/* long url */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl mb-4">Retrive long URL</h2>
        <input
          type="text"
          placeholder="Enter your short url id"
          value={shortURL}
          onChange={(e) => setShortURL(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-200"
        />

        <button
          onClick={handleRetrivedLongURL}
          className="w-full mt-8 bg-red-600 rounded-lg hover:bg-red-700 text-white py-2">
          Generate long URL
        </button>

        {retrivedLongURL && (
          <p className="mt-4 text-green-400">
            Long URL: <a href={`/${retrivedLongURL}`} target="_blank">
              {retrivedLongURL}
            </a>
          </p>
        )}

      </div>

    </div>
  );
}
