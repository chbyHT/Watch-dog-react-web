import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client'
import 'jquery';
import 'popper.js';
import './App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const socket = socketIOClient('https://chby.hopto.org:5678',{'reconnection':true,transports: ['websocket', 'polling', 'flashsocket']})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doorImg:"img/icon/door-close-W.png",
      lockData:{class:'btnOFF',img:'img/icon/Lock.png',text1:'Door lock',text2:'已上鎖'},
      alermData:{class:'btnOFF',img:'img/icon/speaker.png',text1:'Alaem',text2:'已關閉'},
      alermClass:'btnOFF',
      alermImg:'img/icon/speaker.png',
      loginUser:'HT',
      doorST:false,
      lockST:false,
      alerm:false,
      newName:'',
      newPwd:'',
      newLine:'',
      edituser:{},
      ip:'尚未設定',
      msg:'___',
      setTime:'',
      openTime:[],
      closeTime:[],
      buttonTime:[],
      userList:[],
      blackDIV:'none',
      showUser:'none',
      showaddUser:'none',
      showEditUser:'none',
      showHistory:'none',
      showWaitRFID:'none'
    }
  }
  getTime(){
    var NowDate=new Date();
    var Y = NowDate.getFullYear()
    var M = NowDate.getMonth()+1
    var D = NowDate.getDate()
    // var h = NowDate.getHours();
    // var m = NowDate.getMinutes();
    // var s = NowDate.getSeconds();
    if(M<10){
      M='0'+M
    }
    if(D<10){
      D='0'+D
    }
    this.setState({ setTime: Y+'-'+M+'-'+D });
  }
  componentDidMount(){

    socket.on('lockST',(val)=> {
      this.setState({lockST:val})
      if (val) {
        this.setState({lockData:{class:'btnON',img:'img/icon/unlock.png',text1:'Door lock',text2:'已解鎖'}});
      } else {
        this.setState({lockData:{class:'btnOFF',img:'img/icon/Lock.png',text1:'Door lock',text2:'已上鎖'}});
      }
    })
    socket.on('doorST',(val)=> {
      this.setState({ doorST: val});
      if (val){
        this.setState({ doorImg: "img/icon/door-open-W.png" });
      } else {
        this.setState({ doorImg: "img/icon/door-close-W.png" });
      }
    })
    socket.on('warning',(val)=> {
      this.setState({ alerm: val});
      if (val) {
        this.setState({alermData:{class:'btnON',img:'img/icon/speakers.png',text1:'Alaem',text2:'已開啟'}});
      } else {
        this.setState({alermData:{class:'btnOFF',img:'img/icon/speaker.png',text1:'Alaem',text2:'已關閉'}});
      }
    })
    socket.on('userList',(val)=> {
      console.log(val);
      this.setState({ userList: val});
    })
    socket.on('signupMode',(val)=> {
      console.log('註冊模式'+val);
      if(val === false){
        this.setState({ showUser: ''});
        this.setState({ showEditUser: '' });
        this.setState({ showWaitRFID: 'none' });
      }
    })
    socket.on('weak',(val)=> {
      console.log(val);
    })
    this.getTime()
  }
  changeLock(){ //開鎖
    if (this.state.lockST) {
      socket.emit("changeLock",false)
    } else {
      socket.emit("changeLock",true)
    }
  }
  changeAlerm(){  //開警報
    if (this.state.alerm) {
      socket.emit("changeAlerm",false)
    } else {
      socket.emit("changeAlerm",true)
    }
  }
  setIP(){ //設定IP
    let inputText=prompt("請輸入攝影機的IP ", " ")
    if(inputText!=null){
      document.getElementById("CAMview").src="http://"+inputText+"/browserfs.html";
      this.setState({ip: inputText});
    }
  }
  sendMSG(){ //發送訊息
    let inputText=prompt("請輸入欲傳送的訊息 ", " ")
    if(inputText!=null){
      axios.get('https://chby.hopto.org:5678/sendMSG?msg='+inputText)
      .then( (res)=> {
        console.log(res.data);
      })
      this.setState({ msg: inputText });
    }
  }
  openUserList(){
      this.setState({ blackDIV: 'flex' });
      this.setState({ showUser: ''});
      axios.get(`https://chby.hopto.org:5678/userlist`)
      .then((res)=> {
        this.setState({ userList: res.data});
        console.log(res.data);
      })
      

  }
  closeUserListDiv(){
      this.setState({ blackDIV: 'none' });
      this.setState({ showUser: 'none'});
      this.setState({ showaddUser: 'none' });
      this.setState({ showEditUser: 'none' });
  }
  addUser(){
    this.setState({ showaddUser: '' });
    this.setState({ showEditUser: 'none' });

  }
  delUser(user){ //刪除成員
    axios.get('https://chby.hopto.org:5678/delUser?name='+user)
      .then( (res)=> {
        console.log(res.data);
      })
  }
  submitAddUser(){ //新增成員
    axios.get(`https://chby.hopto.org:5678/addNewUser?name=${this.state.newName}&password=${this.state.newPwd}&RFID=${''}&lineID=${this.state.newLine}`)
      .then( (res)=> {
        console.log(res.data);
      }).then(()=>{
        this.setState({ newName: ''});
        this.setState({ newPwd: ''}); 
        this.setState({ newLine: ''});
        this.setState({ showaddUser: 'none'})
      })
  }
  editUser(user,line,password){ //編輯成員
    let edituser = this.state.edituser
    this.setState({ showEditUser: '' });
    this.setState({ showaddUser: 'none'})
    edituser.user = user
    edituser.line = line
    edituser.password = password
    this.setState({ edituser:edituser});
  }
  signUpRFID(user){//註冊
    axios.get('https://chby.hopto.org:5678/signUpRFID?name='+user)
      .then( (res)=> {
        console.log(res.data);
      })
    this.setState({ showUser: 'none'});
    this.setState({ showEditUser: 'none' });
    this.setState({ showWaitRFID: '' });
  }
  cancel(){//取消註冊
    axios.get('https://chby.hopto.org:5678/cancelRFID')
      .then( (res)=> {
        console.log(res.data);
      })
    this.setState({ showUser: ''});
    this.setState({ showEditUser: '' });
    this.setState({ showWaitRFID: 'none' });
  }
  delRFID(user){//刪除rfid資料欄
    axios.get('https://chby.hopto.org:5678/delRFID?name='+user)
    .then( (res)=> {
      console.log(res.data);
    })
  }
  submitEditUser(){  //送出修改
    this.setState({ showEditUser:'none' });
    axios.get(`https://chby.hopto.org:5678/editUser?name=${this.state.edituser.user}&password=${this.state.edituser.password}&lineID=${this.state.edituser.line}`)
      .then( (res)=> {
        console.log(res.data);
      })
    this.setState({edituser : {} });
  }
  openHistoryDiv(){
    this.setState({ blackDIV: 'flex' });
    this.setState({ showHistory: ''});
    this.searchTime()
  }
  closeHistoryDiv(){
    this.setState({ blackDIV: 'none' });
    this.setState({ showHistory: 'none'});
  }
  searchTime(){
    axios.get(`https://chby.hopto.org:5678/openTime?time=${this.state.setTime}`)
    .then( (res)=> {
      console.log(res.data);
      this.setState({openTime :Object.values(res.data)})
    })
    axios.get(`https://chby.hopto.org:5678/closeTime?time=${this.state.setTime}`)
    .then( (res)=> {
      console.log(res.data);
      this.setState({closeTime :Object.values(res.data)})
    })
    axios.get(`https://chby.hopto.org:5678/buttonTime?time=${this.state.setTime}`)
    .then( (res)=> {
      console.log(res.data);
      this.setState({buttonTime :Object.values(res.data)})
    })
  }
  render() {
    return (
      <div className="App">

        <div className="container d-flex justify-content-center ">
          <div className="row">
              <div className="col-md-4">
                <iframe title="webcam" src='' id="CAMview" frameBorder='0' style={{height:'480px',width:'320px',backgroundColor:'rgb(255, 246, 237,0.8)',borderRadius:'15px'}}>
                  <p>Your browser does not support iframes.</p>
                </iframe>
                
              </div>
              <div className="col-md-2 ">
                <div className="d-flex flex-column">
                  <img src={this.state.doorImg} style={{width:'100px'}} alt=""/>
                  <span className='text-white'>{this.state.setTime}</span>
                  
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="buttonrow d-flex flex-wrap">
                  <div className={`position ${this.state.lockData.class}`} onClick={this.changeLock.bind(this)}><img src={this.state.lockData.img} alt="" style={{width:'40px'}}/><br/>門鎖<br/>{this.state.lockData.text1}<br/> <span className="text-muted">{this.state.lockData.text2}</span></div>
                  <div className={`position ${this.state.alermData.class}`} onClick={this.changeAlerm.bind(this)}> <img src={this.state.alermData.img} alt="" style={{width:'40px'}}/><br/> 警報<br/>Alaem<br/> <span className="text-muted">{this.state.alermData.text2}</span></div>                  
                  <div className="position btnON" onClick={this.openHistoryDiv.bind(this)}> <img src="img/icon/history.png" alt="" style={{width:'40px'}}/><br/> 紀錄<br/>History</div>
                  <div className="position btnON" onClick={this.setIP.bind(this)}> <img src="img/icon/settings.png" alt="" style={{width:'40px'}}/><br/>  IP設定<br/>IP setting<br/> <span className="text-muted" style={{fontSize:'12px'}}>{this.state.ip}</span></div>
                  <div className="position btnON" onClick={this.sendMSG.bind(this)}> <img src="img/icon/message.png" alt="" style={{width:'40px'}}/><br/> 訊息<br/>Message<br/> <span className="text-muted">{this.state.msg}</span></div>
                  <div className="position btnON" onClick={this.openUserList.bind(this)}> <img src="img/icon/user.png" alt="" style={{width:'40px'}}/><br/> 成員<br/>Member</div>
                </div>
              </div>
            </div>
          </div>

          <div className='justify-content-center align-items-center doubleClickBG' style={{display:this.state.blackDIV}}>
            <div className='doubleClickDiv' style={{minWidth:'300px',display:this.state.showUser}}>
                <span style={{fontSize:'1.6em'}}>成員管理</span> 
                <button type="button" className="close float-right" aria-label="Close" onClick={this.closeUserListDiv.bind(this)}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div style={{overflow:'auto'}}>
                  <table className="table mt-2 text-center">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>RFID</th>
                        <th>LineID</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userList.map((val,index)=>(
                        <tr key={index}>
                          <td>{val.name}</td>
                          <td>{val.RFID===''?'無':val.RFID}</td>
                          <td>{val.lineID===''?'無':val.lineID}</td>
                          <td><button type="button" className="btn btn-success btn-sm mr-2" onClick={()=>this.editUser(val.name,val.lineID,val.password)}>編輯</button>
                              <button type="button" className="btn btn-danger btn-sm" onClick={()=>this.delUser(val.name)}>刪除</button> 
                          </td>
                        </tr>
                      ))}                   
                    </tbody>
                  </table>
                </div>
                <button type="button" className="btn btn-primary btn-sm btn-block" onClick={this.addUser.bind(this)}>新增成員</button>
            </div>

            <div className='doubleClickDiv' style={{minWidth:'300px',display:this.state.showaddUser}}>
              <span style={{fontSize:'22px'}}>新增成員</span><hr style={{backgroundColor:'rgb(249, 178, 47)'}}/>
              <input className="form-control mb-2" type="text" placeholder="姓名" defaultValue={this.state.newName} onChange={e=>{this.setState({newName:e.target.value})}} />
              <input className="form-control mb-3" type="password" placeholder="密碼" defaultValue={this.state.newPwd} onChange={e=>{this.setState({newPwd:e.target.value})}}/>
              <input className="form-control mb-3" type="text" placeholder="lineID" defaultValue={this.state.newLine} onChange={e=>{this.setState({newLine:e.target.value})}}/>
              <button type="button" className="btn btn-primary mr-2" onClick={()=>this.setState({ showaddUser: 'none'})}>取消</button>
              <button type="button" className="btn btn-primary" onClick={this.submitAddUser.bind(this)}>新增</button>
            </div>

            <div className='doubleClickDiv' style={{minWidth:'300px',display:this.state.showEditUser}}>
                <span style={{fontSize:'22px'}}>編輯{this.state.edituser.user}</span><hr/>
                <form className="form-inline mb-3">
                  <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">密碼</label>
                    <input className="form-control ml-3" type="password" placeholder="密碼" value={this.state.edituser.password} onChange={e=>{let edituser=this.state.edituser;edituser.password=e.target.value;this.setState({edituser:edituser})}}/>
                  </div>
                </form>
                <form className="form-inline mb-3">
                  <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">lineID</label>
                    <input className="form-control ml-2" type="text" placeholder="lineID" value={this.state.edituser.line} onChange={e=>{let edituser=this.state.edituser;edituser.line=e.target.value;this.setState({edituser:edituser})}}/>
                  </div>
                </form>
                <form className="form-inline mb-3">
                  <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">RFID</label>
                    <button type="button" className="btn btn-success ml-3" onClick={()=>this.signUpRFID(this.state.edituser.user)}>註冊</button>
                    <button type="button" className="btn btn-success ml-3" onClick={()=>this.delRFID(this.state.edituser.user)}>清除</button>
                  </div>
                </form>
                <button type="button" className="btn btn-primary mr-2" onClick={()=>{this.setState({ showEditUser:'none'})}} >關閉</button>
                <button type="button" className="btn btn-primary" onClick={this.submitEditUser.bind(this)}>修改</button>
            </div>

            <div className='doubleClickDiv' style={{minWidth:'300px',display:this.state.showHistory}}>
                <span style={{fontSize:'1.6em'}}>歷史紀錄</span> 
                <button type="button" className="close float-right" aria-label="Close" onClick={this.closeHistoryDiv.bind(this)}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <hr style={{backgroundColor:'rgb(249, 178, 47)'}}/>
                <div className="form-inline mb-3">
                    <input className="form-control" id="date" type="date" value={this.state.setTime} onChange={e=>{this.setState({setTime:e.target.value})}} />
                    <button type="button" className="btn btn-primary ml-2" onClick={this.searchTime.bind(this)}>搜尋</button>
                </div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">開門</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">關門</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">按門鈴</a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent" style={{maxHeight:'300px',overflow:'auto'}}>
                  <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <table className="table text-center">
                      <tbody>
                        {this.state.openTime.map((val,i)=>(
                          <tr key={i}>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <table className="table text-center">
                      <tbody>
                        {this.state.closeTime.map((val,i)=>(
                          <tr key={i}>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                    <table className="table text-center">
                      <tbody>
                        {this.state.buttonTime.map((val,i)=>(
                          <tr key={i}>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>

            <div className='doubleClickDiv text-center' style={{backgroundColor:'#fff',zIndex:'100',display:this.state.showWaitRFID}}>
              <h4>請讀卡...<img src="img/icon/loading.gif" alt="" style={{width:'40px'}}/></h4>
              <button type="button" className="btn btn-warning" onClick={()=>this.cancel()}>取消</button>
            </div>

          </div>

            

        </div>

    );
  }
}

export default App;
