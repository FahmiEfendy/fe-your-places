import { useEffect, useState } from "react";

const useFetchImage = (imagePath) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!imagePath) return;

    // Images are now served from Openinary
    const openinaryBaseUrl =
      import.meta.env.VITE_OPENINARY_URL || "https://openinary.fahmiefendy.dev";

    setImageUrl(`${openinaryBaseUrl}/uploads/${imagePath}`);
  }, [imagePath]);

  return { imageUrl };
};

export default useFetchImage;
