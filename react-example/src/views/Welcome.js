import { Link } from "react-router-dom"

export default function Welcome () {
    return (
        <div className="App-content">
            <h1 className="Content-header">Welcome!</h1>
            <div className="Content-subtitle">Hit next to get started.</div>
            <button className="Content-button" style={{
                marginTop: 13
            }}><Link to="/login">Next</Link></button>
        </div>
    )
}