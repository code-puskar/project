import { useState } from "react";

export default function IssueModal({ onSubmit }) {
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Submit Issue
      </button>
    </form>
  );
}
