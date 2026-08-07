import React from "react";
import PremiumErrorState from "./PremiumErrorState";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <PremiumErrorState
          title="Component Render Error"
          message="A critical error occurred while rendering the page. Our team has been notified. Try reloading the page."
          errorCode="500"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
