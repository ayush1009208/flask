"use client"
import React, { useState } from "react";

const PostExample: React.FC = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [response, setResponse] = useState("");

    const sendPostRequest = async () => {
        // Validate inputs before sending
        if (!name || !age) {
            alert("Please enter both name and age");
            return;
        }

        try {
            const fetchResponse = await fetch("http://127.0.0.1:5000/post_example", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    age: parseInt(age, 10)
                })
            });

            if (!fetchResponse.ok) {
                throw new Error(`HTTP error! status: ${fetchResponse.status}`);
            }

            const data = await fetchResponse.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error:", error);
            setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
                Send POST Request
            </h1>
            
            <div className="w-full max-w-md space-y-4 mb-6">
                <input 
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
                />
                <input 
                    type="number"
                    placeholder="Enter Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
                />
            </div>

            <button
                onClick={sendPostRequest}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
                Send Data
            </button>

            {response && (
                <div className="mt-8 p-6 w-full max-w-lg border border-gray-300 rounded-lg bg-white shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Response:
                    </h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 overflow-auto">
                        {response}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default PostExample;