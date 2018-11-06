import React, { Component } from 'react';
import axios from 'axios';

import '../index.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      Password:''
    }
  }
  submit(){
    axios.get(`https://chby.hopto.org:5678/login?username=${this.state.username}&password=${this.state.Password}`)
      .then( (res)=> {
        console.log(res.data);
        if(res.data == 'success'){
          localStorage.setItem('user',this.state.username)
          localStorage.setItem('islogin',true)
        }else{
          localStorage.removeItem('user')
          localStorage.removeItem('islogin')
        }
      })
  }

  render() {
    return (
      <div className='d-flex justify-content-center mb-2' style={{width:'100vw'}}>
        <div className ='loginDiv px-5 py-3'>
          <div className="login-form ">
            <div className="form-group mb-3">
            <img className='mt-5' src="img/icon/ddd2.png" alt="" style={{width:'100px'}}/>

              <h2>Login</h2><br/>
              <input type="text" className="loginInput" aria-describedby="helpId" placeholder="Username" value={this.state.username} onChange={e=>{this.setState({username:e.target.value})}} />
              <input type="password" className="loginInput" aria-describedby="helpId" placeholder="Password" value={this.state.Password} onChange={e=>{this.setState({Password:e.target.value})}} />
              <button type="button" className="btn  btn-block" style={{backgroundColor:'rgb(249, 178, 47)'}} onClick={()=>this.submit()}>Login</button><br/>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Login;