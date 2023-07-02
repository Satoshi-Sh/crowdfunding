import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {config} from './Config'
import {PublicClientApplication} from '@azure/msal-browser'
import {Component} from 'react'

/*const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form submission logic here
    console.log("Submitted:", { email, password });
  };

  return (
    <div className="max-w-md mx-auto pt-48">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mr-2 ml-2"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p className="text-center m-5">
          * If you don't have an account.{" "}
          {
            <Link to="/Signup" className="text-blue-500">
              Signup
            </Link>
          }
        </p>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};*/

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isAuthenticated: false,
      user: {},
    }
    this.login = this.login.bind(this)
    //
    this.PublicClientApplication = new PublicClientApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
        authority: config.authority,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
      },
    })
  }
  async login() {
    console.log('hello')
    try {
      console.log('bye')
      await this.PublicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      })
      console.log('insiseawait')
      this.setState({isAuthenticated: true})
    } catch (err) {
      console.log(err.errorCode)
      this.setState({
        isAuthenticated: false,
        user: {},
        error: err,
      })
    }
  }
  logout() {
    this.PublicClientApplication.logout()
  }
  render() {
    return (
      <div className="max-w-md mx-auto pt-48">
        <form>
          <div className="flex items-center justify-center">
            {this.state.isAuthenticated ? (
              <p>Succesfully logged in</p>
            ) : (
              <p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => this.login()}
                >
                  Login with Microsoft
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
