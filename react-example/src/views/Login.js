import { Link } from "react-router-dom"

export default function Login () {
    return (
        <div className="App-content">
            <h1 className="Content-header">Welcome!</h1>
            <input type="text" className="Content-input" placeholder="username"></input>
            <input type="text" className="Content-input" placeholder="password"></input>
            <button className="Content-button filled">Login</button>
        </div>
    )
}