import React from "react";

import Card from "../components/UIElements/Card";
import Button from "../components/FormElements/Button";
import useDocumentMeta from "../hooks/document-meta-hook";

const NotFound = () => {
  useDocumentMeta({
    title: "Page Not Found | Your Places",
    description: "The page you're looking for doesn't exist or may have been moved.",
  });

  return (
    <div className="center" style={{ margin: "3rem auto", maxWidth: "30rem" }}>
      <Card style={{ padding: "2rem", textAlign: "center" }}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or may have been moved.</p>
        <Button to="/">Back to Homepage</Button>
      </Card>
    </div>
  );
};

export default NotFound;
