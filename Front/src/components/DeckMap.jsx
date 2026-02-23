import { useEffect, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
// css removed, added to index.html
import Map, { GeolocateControl, NavigationControl, ScaleControl, Source, Layer } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";

export default function DeckMap({
  position,
  issues = [],
  onMapClick,
  onIssueClick,
  mapboxToken,
  mapStyleId = "streets-v12",
  show3D = false,
  searchLocation,
  issueFilter,
  currentUserId,
  centerRequest,
  routePath = null,
  onUserInteract = () => { },
}) {
  const [viewState, setViewState] = useState({
    longitude: position ? position[1] : 0,
    latitude: position ? position[0] : 0,
    zoom: 14,
    pitch: 0,
    bearing: 0,
  });

  const initialFlyRef = useRef(false);
  const [tooltip, setTooltip] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const mapRef = useRef(null);

  // Detect Mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!position) return;
    if (!initialFlyRef.current) {
      setViewState((v) => ({ ...v, longitude: position[1], latitude: position[0], zoom: 14 }));
      initialFlyRef.current = true;
    }
  }, [position]);

  useEffect(() => {
    if (!searchLocation) return;
    setViewState((v) => ({
      ...v,
      longitude: searchLocation.lng,
      latitude: searchLocation.lat,
      zoom: Math.max(14, v.zoom),
    }));
  }, [searchLocation]);

  useEffect(() => {
    if (!centerRequest) return;
    setViewState((v) => ({
      ...v,
      longitude: centerRequest.lng,
      latitude: centerRequest.lat,
      zoom: centerRequest.zoom || v.zoom,
    }));
  }, [centerRequest]);

  useEffect(() => {
    setViewState((v) => ({
      ...v,
      pitch: show3D ? 60 : 0,
      bearing: show3D ? 20 : 0,
      // don't override user zoom downward
      zoom: show3D ? Math.max(v.zoom, 13) : v.zoom,
    }));
  }, [show3D]);

  const filteredIssues = issueFilter
    ? issues.filter((issue) => issue.issue_type === issueFilter)
    : issues;

  const data = filteredIssues
    .filter((i) => i.location && i.location.coordinates && i.location.coordinates.length >= 2)
    .map((i) => {
      const lng = Number(i.location.coordinates[0]);
      const lat = Number(i.location.coordinates[1]);
      return {
        ...i,
        coordinates: [lng, lat],
      };
    });

  useEffect(() => {
    if (!data || data.length === 0) return;
    const sum = data.reduce((acc, d) => {
      acc[0] += d.coordinates[0];
      acc[1] += d.coordinates[1];
      return acc;
    }, [0, 0]);
    const center = [sum[0] / data.length, sum[1] / data.length];

    // Initial center to issues without forcing zoom
    if (!initialFlyRef.current) {
      setViewState((v) => ({
        ...v,
        longitude: center[0],
        latitude: center[1],
      }));
      initialFlyRef.current = true;
    }
  }, [data]);

  const isDarkMode = mapStyleId.includes('dark') || mapStyleId.includes('satellite');
  // 1. Make markers small (neon ball core)
  const coreMarkerSize = Math.max(3, Math.min(8, viewState.zoom * 0.4));
  // 2. Glow size relative to core
  const glowMarkerSize = coreMarkerSize * 3;

  const getMarkerColor = (issue) => {
    // Neon colors: bright green for verified, cyan for validated, violet for active
    if (issue.status === "Verified") return [0, 255, 128];
    if ((issue.validations || 0) > 0) return [0, 255, 255];
    return [138, 43, 226]; // Blue-violet neon
  };

  const layers = [
    new ScatterplotLayer({
      id: "issues-glow",
      data,
      pickable: false,
      opacity: isMobile ? 0 : (isDarkMode ? 0.8 : 0.4), // Disable glow on mobile
      stroked: false,
      filled: true,
      radiusMinPixels: glowMarkerSize,
      radiusMaxPixels: 60,
      radiusUnits: "pixels",
      getPosition: (d) => d.coordinates,
      getRadius: (d) => (d.rating ? Math.max(6, d.rating * 3) : 8), // Glow radius
      getFillColor: (d) => [...getMarkerColor(d), isDarkMode ? 200 : 100], // Very bright alpha
      parameters: isMobile ? {} : {
        blend: true,
        blendFunc: [770, 1], // Additive blending for light-stacking effect
      }
    }),
    new ScatterplotLayer({
      id: "issues",
      data,
      pickable: true,
      opacity: 1,
      stroked: false,
      filled: true,
      radiusMinPixels: coreMarkerSize,
      radiusMaxPixels: 20,
      radiusUnits: "pixels",
      getPosition: (d) => d.coordinates,
      getRadius: (d) => (d.rating ? Math.max(3, d.rating * 1.5) : 4), // Core radius: Small!
      getFillColor: (d) => isDarkMode ? [255, 255, 255] : getMarkerColor(d), // White core in dark mode for neon center
      onClick: (info) => {
        if (info && info.object) {
          if (typeof onIssueClick === "function") {
            onIssueClick(info.object);
          }
        }
      },
      onHover: (info) => {
        if (info && info.object) {
          setTooltip({ x: info.x, y: info.y, object: info.object });
        } else {
          setTooltip(null);
        }
      },
    }),
  ];

  if (position) {
    layers.push(
      new ScatterplotLayer({
        id: "you-glow",
        data: [{ pos: [position[1], position[0]] }],
        pickable: false,
        radiusUnits: "pixels",
        getPosition: (d) => d.pos,
        getRadius: glowMarkerSize,
        getFillColor: [56, 189, 248, 110],
      }),
      new ScatterplotLayer({
        id: "you",
        data: [{ pos: [position[1], position[0]] }],
        pickable: false,
        radiusUnits: "pixels",
        getPosition: (d) => d.pos,
        getRadius: coreMarkerSize,
        getFillColor: [14, 165, 233],
      })
    );
  }

  if (routePath && routePath.length > 1) {
    layers.push(
      new PathLayer({
        id: "route-path",
        data: [{ path: routePath }],
        getPath: (d) => d.path,
        getColor: [59, 130, 246],
        widthUnits: "pixels",
        getWidth: 4,
        opacity: 0.9,
        pickable: false,
      })
    );
  }


  return (
    <div className="absolute inset-0 z-40">
      <DeckGL
        controller={{
          scrollZoom: true,
          dragRotate: show3D,
          doubleClickZoom: true,
          dragPan: true,
          touchZoom: true,
        }}
        viewState={viewState}
        onViewStateChange={({ viewState: vs, interactionState }) => {
          setViewState(vs);
          if (interactionState?.isDragging || interactionState?.isPanning || interactionState?.isZooming) {
            onUserInteract();
          }
        }}
        layers={layers}
        onClick={(info) => {
          // If we clicked blank space (not an object), trigger map click
          if (!info || !info.object) {
            const coord = info && info.coordinate;
            if (coord && typeof onMapClick === "function") {
              let isRoad = false;
              if (mapRef.current) {
                try {
                  const map = mapRef.current.getMap();
                  const features = map.queryRenderedFeatures([info.x, info.y]);

                  // Check if any feature belongs to a road layer
                  isRoad = features.some(f =>
                    (f.layer.id && f.layer.id.toLowerCase().includes('road')) ||
                    (f.sourceLayer && f.sourceLayer.toLowerCase().includes('road')) ||
                    (f.layer.id && f.layer.id.toLowerCase().includes('street')) ||
                    (f.sourceLayer && f.sourceLayer.toLowerCase().includes('street')) ||
                    (f.layer.id && f.layer.id.toLowerCase().includes('bridge')) ||
                    (f.layer.id && f.layer.id.toLowerCase().includes('tunnel'))
                  );
                } catch (err) {
                  console.error("Failed to query rendered features:", err);
                  isRoad = true; // Fallback to true if we can't determine
                }
              }

              onMapClick({ lat: coord[1], lng: coord[0], isRoad });
            }
          }
        }}
      >
        <Map
          ref={mapRef}
          reuseMaps
          mapLib={mapboxgl}
          mapStyle={`mapbox://styles/mapbox/${mapStyleId}`}
          mapboxAccessToken={mapboxToken}
          style={{ width: "100%", height: "100%" }}
          terrain={show3D && !isMobile ? { source: 'mapbox-dem', exaggeration: 1.5 } : undefined}
        >
          {show3D && !isMobile && (
            <>
              <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
              />
              <Layer
                id="3d-buildings"
                source="composite"
                source-layer="building"
                filter={['==', 'extrude', 'true']}
                type="fill-extrusion"
                minzoom={14}
                paint={{
                  'fill-extrusion-color': '#aaa',
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    0,
                    14.05,
                    ['get', 'height']
                  ],
                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    0,
                    14.05,
                    ['get', 'min_height']
                  ],
                  'fill-extrusion-opacity': 0.6
                }}
              />
            </>
          )}
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" showAccuracyCircle trackUserLocation />
          <ScaleControl position="bottom-left" />
        </Map>

        {tooltip && tooltip.object && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 10,
              top: tooltip.y + 10,
              background: "white",
              padding: 8,
              borderRadius: 6,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              pointerEvents: "none",
              zIndex: 999,
            }}
          >
            <strong>{tooltip.object.issue_type}</strong>
            <div style={{ fontSize: 12 }}>{tooltip.object.description}</div>
            <div style={{ fontSize: 11, color: "#666" }}>Status: {tooltip.object.status}</div>
          </div>
        )}

      </DeckGL>
    </div>
  );
}
