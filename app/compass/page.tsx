"use client";
import React from "react";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";

const Demo = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setHeading(event.alpha);
    }
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div>
      {!isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
      ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
      ) : coords ? (
        <table>
          <tbody>
            <tr>
              <td>latitude</td>
              <td>{coords.latitude}</td>
            </tr>
            <tr>
              <td>longitude</td>
              <td>{coords.longitude}</td>
            </tr>
            <tr>
              <td>altitude</td>
              <td>{coords.altitude}</td>
            </tr>
            <tr>
              <td>heading</td>
              <td>{coords.heading}</td>
            </tr>
            <tr>
              <td>speed</td>
              <td>{coords.speed}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div>Getting the location data&hellip; </div>
      )}
      <div style={{ textAlign: "center" }}>
        <h1>
          Compass Heading:{" "}
          {heading !== null ? `${Math.round(heading)}°` : "Unavailable"}
        </h1>
        <div
          style={{
            width: "10px",
            height: "200px",
            backgroundColor: "white",
            transform: `rotate(${(heading || 0) + 90}deg)`,
          }}
          className="absolute top-32 left-32"
        />
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
};

export default Demo;
