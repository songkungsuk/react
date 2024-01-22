import { useState } from "react"
import { ChatUserInfo } from "../types/ChatUserInfo.type";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const SignUp = () => {
    const [error, setError] = useState<boolean>(false);
    const [chatUser, setChatUser] = useState<ChatUserInfo>({});
    const [errMsg, setErrMsg] = useState<string>('');
    const navigate = useNavigate();
    const join = async () => {
        if (!chatUser.uiId) {
            setErrMsg('아이디를 입력해주세요');
            return;
        }
        console.log(chatUser);
        const res = await axios.post('http://localhost/join', chatUser, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8;'
            }
        }).then((res) => {
            alert('회원가입 완료');
            console.log(res);
            navigate('sign-in')

        })
            .catch((err) => {
                setError(true);
                setErrMsg(err);
                console.log(err);
            })
    }
    const changeUser = (event: any) => {

        setChatUser({
            ...chatUser,
            [event.target.id]: event.target.value
        })
        console.log(chatUser);
    }
    return (
        <div className="auth-inner">
            <form>
                <h3>Sign Up</h3>

                <div className="mb-3">

                    <div className='text-danger'>
                        {errMsg !== '' ? errMsg : ''}
                    </div>

                    <label>아이디</label>
                    <input type="text" className="form-control" placeholder="아이디" id='uiId' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>비밀번호</label>
                    <input type="password" className="form-control" placeholder="비밀번호" id='uiPwd' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>비밀번호 확인</label>
                    <input type="password" className="form-control" placeholder="비밀번호 확인" id='uiPwdCheck' />
                </div>

                <div className="mb-3">
                    <label>이름</label>
                    <input type="text" className="form-control" placeholder="이름" id='uiName' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>핸드폰</label>
                    <input type="text" className="form-control" placeholder="핸드폰" id='uiPhone' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>이메일</label>
                    <input type="text" className="form-control" placeholder="이메일" id='uiEmail' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>생일</label>
                    <input type="date" className="form-control" placeholder="생일" id='uiBirth' onChange={changeUser} />
                </div>

                <div className="mb-3">
                    <label>성별</label>
                    <select id="uiGender" className="form-select" onChange={changeUser}>
                        <option>성별을 선택해주세요</option>
                        <option value={"M"}>남자</option>
                        <option value={"F"}>여자</option>
                    </select>
                </div>

                <div className="d-grid">
                    <button type="button" className="btn btn-primary" onClick={join} >
                        회원가입
                    </button>
                </div>
                <p className="forgot-password text-right">
                    <a href="#">로그인하러가기</a>
                </p>
            </form>
        </div>
    )
}