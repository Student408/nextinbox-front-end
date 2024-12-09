import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    toast.error("Something went wrong. Please try again later.");
  }

  render() {
    if (this.state.hasError) {
      return <h2 className="text-red-500">Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

