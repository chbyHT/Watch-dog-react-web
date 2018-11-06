import React, { Component } from 'react';
import { BrowserRouter,HashRouter,Switch,Route,Link,Redirect } from 'react-router-dom'

import App from './App';
import Login from './Login';
import Homepage from './Homepage';
import AuthExample from './AuthExample';

class RouterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin:localStorage.getItem("islogin")
    }
  }
  componentDidMount(){
    
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-light mb-5">
            <span className="navbar-brand mb-0 h1"><img className='mr-2' src='img/icon/ddd2.png' style={{width:'30px'}} alt=""/>看門狗門禁系統</span>
            <div className="form-inline">
                <button className="btn btn-outline-warning my-2 mx-2 my-sm-0" type="button">Home</button>
                <button className="btn btn-outline-warning my-2 mx-2 my-sm-0" type="button">LogIn</button>
            </div>
          </nav>

          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/homepage' component={Homepage}/>
            <Route path='/app' component={App}/>
            <Route path='/AuthExample' component={AuthExample}/>
            
          </Switch>
        </div>
      </BrowserRouter>  
    );
  }
}

export default RouterPage;