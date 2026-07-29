import { useEffect } from "react";

const DEFAULT_TITLE = "Your Places | Share Your World";
const DEFAULT_DESCRIPTION =
  "YourPlaces - Share your favorite locations with the world.";

const setMetaTag = (attr, key, content) => {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  return tag;
};

// Sets document title + meta description/OG tags for the current page,
// restoring the app-wide defaults when the page unmounts.
const useDocumentMeta = ({ title, description, image } = {}) => {
  useEffect(() => {
    const resolvedTitle = title || DEFAULT_TITLE;
    const resolvedDescription = description || DEFAULT_DESCRIPTION;

    document.title = resolvedTitle;
    setMetaTag("name", "description", resolvedDescription);
    setMetaTag("property", "og:title", resolvedTitle);
    setMetaTag("property", "og:description", resolvedDescription);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", window.location.href);
    if (image) {
      setMetaTag("property", "og:image", image);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag("name", "description", DEFAULT_DESCRIPTION);
      setMetaTag("property", "og:title", DEFAULT_TITLE);
      setMetaTag("property", "og:description", DEFAULT_DESCRIPTION);
    };
  }, [title, description, image]);
};

export default useDocumentMeta;
