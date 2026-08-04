import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error: error.message }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="status-msg error">
          Chart error: {this.state.error}
        </div>
      )
    }
    return this.props.children
  }
}
