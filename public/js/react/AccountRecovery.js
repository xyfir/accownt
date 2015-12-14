!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var SmsVerify=require("./login/SmsVerifyStep.jsx"),RandCode=require("./login/RandomCodeStep.jsx"),Button=require("./forms/Button.jsx"),Alert=require("./misc/Alert.jsx"),AccountRecovery=React.createClass({displayName:"AccountRecovery",getInitialState:function(){return{error:!1,message:"",email:"",auth:"",uid:0}},next:function(){ajax({url:"api/recover",method:"POST",dataType:"json",data:{email:this.refs.email.value},success:function(result){result.error?this.setState(result):this.setState(result)}.bind(this)})},verify:function(){var data={phone:this.state.security.phone,email:this.state.email,auth:this.state.auth,uid:this.state.uid,code:this.state.security.code?$("#code").value:0,codeNum:this.state.security.code?this.state.security.codeNumber:0,smsCode:this.state.security.phone?$("#smsCode").value:0};ajax({url:"api/recover/verify",method:"POST",dataType:"json",data:data,success:function(result){this.setState(result)}.bind(this)})},render:function(){var userAlert;if(this.state.error?userAlert=React.createElement(Alert,{type:"error",title:"Error!"},this.state.message):this.state.message&&(userAlert=React.createElement(Alert,{type:"success",title:"Success!"},this.state.message)),this.state.security){var sms,code,steps=0;return this.state.security.phone&&(sms=React.createElement(SmsVerify,null),steps++),this.state.security.code&&(code=React.createElement(RandCode,{codeNum:this.state.security.codeNumber+1}),steps++),React.createElement("div",{className:"form-step"},React.createElement("div",{className:"form-step-header"},React.createElement("h2",null,"Security"),React.createElement("p",null,"Your account has extra security measures enabled. You must enter the correct information before receiving an account recovery email."),React.createElement("hr",null)),React.createElement("div",{className:"form-step-body"},userAlert,sms,steps>1?React.createElement("hr",null):"",code),React.createElement(Button,{onClick:this.verify},"Recover Account"))}return React.createElement("div",{className:"form-step"},React.createElement("div",{className:"form-step-header"},React.createElement("h2",null,"Account Recovery"),React.createElement("p",null,"Enter the email you use to login with. Emails only linked to a profile will not work."),React.createElement("hr",null)),React.createElement("div",{className:"form-step-body"},userAlert,React.createElement("input",{type:"email",placeholder:"Enter your email",ref:"email"})),React.createElement(Button,{onClick:this.next},"Next"))}});ReactDOM.render(React.createElement(AccountRecovery,null),$("#content"))},{"./forms/Button.jsx":2,"./login/RandomCodeStep.jsx":3,"./login/SmsVerifyStep.jsx":4,"./misc/Alert.jsx":5}],2:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",getDefaultProps:function(){return{type:"primary"}},render:function(){return React.createElement("button",{className:"btn-"+this.props.type,onClick:this.props.onClick},this.props.children)}})},{}],3:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",render:function(){return React.createElement("input",{type:"text",id:"code",placeholder:"Security Code #"+this.props.codeNum})}})},{}],4:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",render:function(){return React.createElement("input",{type:"text",id:"smsCode",placeholder:"SMS Code"})}})},{}],5:[function(require,module,exports){module.exports=React.createClass({displayName:"exports",getDefaultProps:function(){return{type:"info"}},render:function(){return React.createElement("div",{className:"alert alert-"+this.props.type},React.createElement("h3",null,this.props.title),React.createElement("p",null,this.props.children))}})},{}]},{},[1]);