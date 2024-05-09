"use client";
import { useEffect, useState } from "react";

const Compass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]); // Store debug messages

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.absolute && event.alpha !== null) {
      setHeading(event.alpha);
      setDebugInfo((prev) => [...prev, `Heading: ${event.alpha}`]); // Log heading
    } else {
      setDebugInfo((prev) => [...prev, "No alpha value or not absolute"]);
    }
  };

  const requestPermission = async () => {
    // Check if DeviceOrientationEvent and requestPermission function are available
    setDebugInfo((prev) => [
      ...prev,
      JSON.stringify(window.DeviceOrientationEvent),
    ]);
    setDebugInfo((prev) => [...prev, typeof window.DeviceOrientationEvent]);
    setDebugInfo((prev) => [...prev, "AAAA"]);
    if (window.DeviceOrientationEvent) {
      setDebugInfo((prev) => [...prev, "Requesting permission..."]);
      try {
        // const permissionState =
        //   await DeviceOrientationEvent.requestPermission();
        // setDebugInfo((prev) => [
        //   ...prev,
        //   `Permission state: ${permissionState}`,
        // ]);
        //if (permissionState === "granted") {
        window.addEventListener("deviceorientation", handleOrientation);
        // } else {
        //   setError("Permission not granted for device orientation");
        // }
      } catch (error: any) {
        setError("Error requesting device orientation permission");
        setDebugInfo((prev) => [...prev, `Error: ${error.message}`]);
      }
    } else {
      setDebugInfo((prev) => [
        ...prev,
        "DeviceOrientationEvent not supported or permission not needed",
      ]);
      window.addEventListener("deviceorientation", handleOrientation);
    }
  };

  useEffect(() => {
    // Add an initial debug message
    setDebugInfo(["Component mounted."]);

    // Clean up on unmount
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div>
      <button onClick={requestPermission}>Enable Compass</button>
      <h1>
        Compass Heading:{" "}
        {heading !== null ? `${Math.round(heading)}°` : "Unavailable"}
      </h1>
      {error && <p>Error: {error}</p>}
      {/* Display all debug messages */}
      {debugInfo.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};

export default Compass;
