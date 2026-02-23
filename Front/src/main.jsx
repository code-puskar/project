import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import 'leaflet/dist/leaflet.css';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Suppress harmless mapbox-gl v3 "featureNamespace" standard style warnings from cluttering console
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('featureNamespace')) return;
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
