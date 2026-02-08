import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      console.log("Map clicked:", e.latlng);

      onMapClick(e.latlng);
    },
  });

  return null;
}
