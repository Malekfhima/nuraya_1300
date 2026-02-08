import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error("Error caught by ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{ padding: "50px", textAlign: "center", fontFamily: "serif" }}
        >
          <h1>Une erreur est survenue.</h1>
          <p>
            Nous nous excusons pour le désagrément. Veuillez essayer de
            rafraîchir la page.
          </p>
          <details
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "20px",
              textAlign: "left",
              background: "#f5f5f5",
              padding: "20px",
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#8B7355",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Vider le Cache & Recharger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
