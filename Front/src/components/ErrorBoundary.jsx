import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // You could log to an external service here
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded p-4 shadow max-w-md text-center">
            <h3 className="font-bold mb-2">Something went wrong</h3>
            <p className="mb-4">An error occurred while loading the 3D view.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => this.setState({ error: null }, () => this.props.onReset && this.props.onReset())}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Close 3D
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
