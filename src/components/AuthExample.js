import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  HashRouter
} from "react-router-dom";
import axios from 'axios';
import 'jquery';
import 'popper.js';
import './App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import App from './App';


const AuthExample = () => (
  <HashRouter>
    <div>
        <nav className="navbar navbar-light mb-5">
          <span className="navbar-brand mb-0 h1"><img className='mr-2' src='img/icon/ddd2.png' style={{width:'30px'}} alt=""/>看門狗門禁系統</span>
          <div className="form-inline">
              <AuthButton />
          </div>
        </nav>
      <Route exact path="/" component={Login} />
      <PrivateRoute path="/app" component={App} />
    </div>
  </HashRouter>
);

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
  fakeAuth.isAuthenticated?(<p>Welcome!<button className="btn btn-outline-warning my-2 mx-2 my-sm-0" onClick={() => {fakeAuth.signout(() => history.push("/"))}} >登出</button></p>) : (<p>請先登錄。</p>)
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{pathname: "/",state: { from: props.location }}}/>
      )
    }
  />
);

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    username:'',
    Password:''
  };
  login =()=>{
    fakeAuth.authenticate(async()=>{
      let loginState
      await axios.get(`https://chby.hopto.org:5678/login?username=${this.state.username}&password=${this.state.Password}`)
      .then( async(res)=> {
        console.log(res.data);
        loginState = res.data
      })
      if(loginState=='success'){
        await this.setState({ redirectToReferrer: true });
        this.props.history.push("/app");
      }
    });
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state.redirectToReferrer;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      // <div>
      //   <p>您必須登錄才能查看該頁面 {from.pathname}</p>
      //   <button onClick={this.login}>登入</button>
      // </div>

      <div className='d-flex justify-content-center mb-2' style={{width:'100vw'}}>
        <div className ='loginDiv px-5 py-3'>
          <div className="login-form ">
            <div className="form-group mb-3">
            <img className='mt-5' src="img/icon/ddd2.png" alt="" style={{width:'100px'}}/>

              <h2>Login</h2><br/>
              <input type="text" className="loginInput" aria-describedby="helpId" placeholder="Username" value={this.state.username} onChange={e=>{this.setState({username:e.target.value})}} />
              <input type="password" className="loginInput" aria-describedby="helpId" placeholder="Password" value={this.state.Password} onChange={e=>{this.setState({Password:e.target.value})}} />
              <button type="button" className="btn  btn-block" style={{backgroundColor:'rgb(249, 178, 47)'}} onClick={this.login}>Login</button><br/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthExample;