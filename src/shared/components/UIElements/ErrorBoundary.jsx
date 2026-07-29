import React from "react";

import Card from "./Card";
import Button from "../FormElements/Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="center" style={{ margin: "2rem auto", maxWidth: "30rem" }}>
          <Card style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Something went wrong.</h2>
            <p>An unexpected error occurred. Please try reloading the page.</p>
            <Button onClick={() => window.location.assign("/")}>
              Back to Homepage
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
