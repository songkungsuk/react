interface Props {
    header:string;
}
const Login = function(props:Props) {
    const idLabel:string = '아이디';
    const pwdLabel:string = '비밀번호';
    const btnLabel:string = '로그인';
    const btnClick = function():void {
        alert(`${btnLabel}을 클릭했군요?`);
    }
    return(
        <div>
            <h3>{props.header}</h3>
            <input type="text" id="id" placeholder={idLabel}/><br></br>
            <input type="password" id="pwd" placeholder={pwdLabel}/><br></br>
            <button onClick={btnClick}>{btnLabel}</button>
        </div>
    )
}
export default Login;