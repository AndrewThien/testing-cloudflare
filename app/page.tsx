"use client";
import React, { useState } from "react";
export const runtime = "edge";
const Page = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const res = await fetch("api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "variables" }),
      });
      const data = await res.text();
      console.log("🚀 ~ handleClick ~ data:", res);
      setResponse(JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error) {
        setResponse("Error: " + error.message);
      } else {
        setResponse("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Send POST Request</button>
      {response && <div>Response: {response}</div>}
    </div>
  );
};

export default Page;
