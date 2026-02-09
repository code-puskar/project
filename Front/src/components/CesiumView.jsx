// import { Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEvent } from "resium";
// import * as Cesium from "cesium";
// import { useEffect, useRef, useState } from "react";

// export default function CesiumView({ position, issues, baseLayer = "osm", onExit3D, onMapClick, onEntityClick }) {
//   // Read token from Vite env. If not present warn (safer than hardcoding)
//   const token = import.meta.env.VITE_CESIUM_ION_TOKEN;
//   if (token) {
//     Cesium.Ion.defaultAccessToken = token;
//   } else {
//     // In development it's okay to warn; in production ensure a token is set
//     console.warn("VITE_CESIUM_ION_TOKEN not set. Cesium features may be limited.");
//   }

//   const viewerRef = useRef(null);
//   const initialFlyRef = useRef(false);
//   const [ready, setReady] = useState(false);
//   // Terrain UI/message removed; using flat globe by default (EllipsoidTerrainProvider)
//   const [terrainMessage, setTerrainMessage] = useState("");

//   // Choose imagery based on requested base layer (ESRI for satellite clarity)
//   const imageryProvider =
//     baseLayer === "satellite"
//       ? new Cesium.UrlTemplateImageryProvider({ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" })
//       : new Cesium.UrlTemplateImageryProvider({ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", subdomains: ["a", "b", "c"] });

//   // Terrain disabled by default (do not attempt STK/public terrain automatically)
//   // If you want to enable terrain, provide a valid Cesium Ion token and call a manual method.
//   const attemptEnableTerrain = (viewer) => {
//     // no-op: disabled to avoid failed STK attempts
//     console.log('Terrain automatic enablement disabled');
//   };

//   // Poll for cesiumElement readiness
//   useEffect(() => {
//     let mounted = true;
//     let checks = 0;
//     const check = () => {
//       const viewer = viewerRef.current?.cesiumElement;
//       if (viewer) {
//         if (mounted) {
//           console.log("Cesium viewer ready");
//           // Diagnostic info
//           try {
//             console.log("canvas size", viewer.canvas?.width, viewer.canvas?.height);
//             console.log("imagery layers", viewer.scene?.imageryLayers?.length);
//             console.log("terrain provider ready", !!viewer.terrainProvider?.ready);

//             // Improve visuals if possible
//             try {
//               // enable lighting and depth test
//               viewer.scene.globe.enableLighting = true;
//               viewer.scene.globe.depthTestAgainstTerrain = true;

//               // Default to flat globe: use EllipsoidTerrainProvider to avoid STK attempts
//               try {
//                 viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
//               } catch (e) {
//                 /* ignore */
//               }

//               viewer.scene.fxaa = true;
//               viewer.scene.requestRender();
//             } catch (e) {
//               console.warn("Could not enable advanced scene features", e);
//             }
//           } catch (e) {
//             console.warn("Diagnostic check failed", e);
//           }
//           setReady(true);
//         }
//         return true;
//       }
//       return false;
//     };

//     if (!check()) {
//       const id = setInterval(() => {
//         checks += 1;
//         if (check()) {
//           clearInterval(id);
//         } else if (checks > 100) {
//           // after ~10s failover
//           console.warn("Cesium viewer did not initialize after timeout");
//           clearInterval(id);
//           if (mounted) setReady(false);
//         }
//       }, 100);

//       return () => {
//         mounted = false;
//         clearInterval(id);
//       };
//     }
//   }, []);

//   // Only fly once on the first position update to avoid constant recenters
//   useEffect(() => {
//     const viewer = viewerRef.current?.cesiumElement;
//     if (viewer && position && !initialFlyRef.current) {
//       // fly to user's position
//       try {
//         viewer.camera.flyTo({
//           destination: Cesium.Cartesian3.fromDegrees(position[1], position[0], 2000),
//           duration: 1.5,
//         });
//         initialFlyRef.current = true;
//         // Ensure canvas has correct size / force a render pass
//         if (typeof viewer.render === "function") viewer.render();
//         if (typeof viewer.resize === "function") viewer.resize();
//       } catch (err) {
//         console.warn("Error when flying camera or forcing render", err);
//       }
//     }
//   }, [position]);

//   return (
//     <div className="absolute inset-0 z-40">
//       <div className="absolute top-4 left-4 z-50">
//         <button
//           onClick={onExit3D}
//           className="bg-white/90 px-3 py-1 rounded shadow"
//         >
//           Exit 3D
//         </button>
//       </div>

//       {!ready && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
//           <div className="bg-white p-4 rounded shadow">Loading 3D view…</div>
//         </div>
//       )}


//       {/* Provide a fallback OSM imagery provider to avoid blank tiles if Ion imagery isn't available */}
//       <Viewer
//         ref={viewerRef}
//         full
//         imageryProvider={imageryProvider}
//       >
//         <ScreenSpaceEventHandler>
//           <ScreenSpaceEvent
//             action={(e) => {
//               const viewer = viewerRef.current?.cesiumElement;
//               if (!viewer) return;

//               // Try to pick an entity first
//               const picked = viewer.scene.pick(e.position);
//               if (picked && picked.id) {
//                 // If entity has id (we set it to the issue _id below), call onEntityClick
//                 const entityId = picked.id.id || picked.id;
//                 if (entityId && typeof onEntityClick === "function") {
//                   onEntityClick(entityId);
//                   return;
//                 }
//               }

//               // Otherwise, find geographic coords and call onMapClick
//               let cartesian = viewer.scene.pickPosition(e.position);
//               if (!cartesian) {
//                 cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
//               }
//               if (!cartesian) return;

//               const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//               const lat = Cesium.Math.toDegrees(cartographic.latitude);
//               const lng = Cesium.Math.toDegrees(cartographic.longitude);

//               if (typeof onMapClick === "function") onMapClick({ lat, lng });
//             }}
//             type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
//           />
//         </ScreenSpaceEventHandler>

//         {/* User location marker */}
//         {position && (
//           <Entity
//             position={Cesium.Cartesian3.fromDegrees(position[1], position[0], 0)}
//             point={{ pixelSize: 10, color: Cesium.Color.CYAN }}
//             name="You are here"
//           />
//         )}

//         {/* Issue markers */}
//         {issues.map((issue) => {
//           if (!issue.location?.coordinates) return null;
//           const [lng, lat] = issue.location.coordinates;

//           return (
//             <Entity
//               id={issue._id}
//               key={issue._id}
//               // add a small lift so points/labels are rendered above terrain and avoid z-fighting
//               position={Cesium.Cartesian3.fromDegrees(lng, lat, 1)}
//               point={{
//                 pixelSize: 10,
//                 color: issue.status === "Verified" ? Cesium.Color.GREEN : issue.validations > 0 ? Cesium.Color.ORANGE : Cesium.Color.RED,
//                 heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//               }}
//               name={issue.issue_type}
//               label={{
//                 text: issue.issue_type,
//                 show: true,
//                 font: "12px sans-serif",
//                 style: 2,
//                 // use Cesium types for offsets
//                 pixelOffset: new Cesium.Cartesian2(12, 0),
//                 heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//               }}
//               description={`<div style="max-width:200px"><strong>${issue.issue_type}</strong><p>${issue.description}</p><p>Status: ${issue.status}</p></div>`}
//             />
//           );
//         })}

//         {/* Force a render pass when issues change so newly added markers are shown immediately */}
//         {(() => {
//           const viewer = viewerRef.current?.cesiumElement;
//           if (viewer) {
//             try {
//               viewer.scene.requestRender();
//             } catch (e) {
//               /* ignore */
//             }
//           }
//           return null;
//         })() }
//       </Viewer>
//     </div>
//   );
// }
