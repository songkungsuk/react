import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatUserInfo } from '../types/ChatUserInfo.type';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
  const [rememberId, setRememberId] = useState(false);
  const [chatUser, setChatUser] = useState<ChatUserInfo>({});
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  let uiId: any = localStorage.getItem('uiId');
  useEffect(() => {
    let uiId: any = localStorage.getItem('uiId');
    if (uiId) {
      setChatUser({
        ...chatUser,
        uiId: uiId
      })
      setRememberId(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const checkRememberId = (evt: any) => {
    setRememberId(evt.target.checked);
  }
  const changeUser = (event: any) => {

    setChatUser({
      ...chatUser,
      [event.target.id]: event.target.value
    })
    console.log(chatUser);
  }
  const login = async () => {
    const res = await axios.post('http://localhost/api/login', chatUser, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      alert('로그인이 완료되었습니다.');
      localStorage.setItem('user', JSON.stringify(res.data));
      if (rememberId) {
        localStorage.setItem('uiId', res.data.uiId);
      } else {
        localStorage.removeItem('uiId');
      }
      navigate('/main');
      console.log(res);
    })
      .catch(err => {
        setError(true);
        console.log(err);
      })
    console.log(res);
  }

  return (
    <div className="auth-inner">
      <form>
        <h3>Sign In</h3>

        <div className="mb-3">
          {error
            ?
            <div className='text-danger'>
              아이디와 비밀번호를 확인해주세요.
            </div> : ''
          }
          <label>아이디</label>
          <input
            type="text"
            className="form-control"
            placeholder="아이디"
            onChange={changeUser}
            id='uiId'
            value={uiId}
          />
        </div>

        <div className="mb-3">
          <label>비밀번호</label>
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호"
            onChange={changeUser}
            id='uiPwd'
          />
        </div>

        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              onChange={checkRememberId}
              checked={rememberId}
            />
            <label className="custom-control-label" htmlFor="customCheck1" >
              아이디 저장
            </label>
          </div>
        </div>

        <div className="d-grid">
          <button type="button" className="btn btn-primary" onClick={login}>
            Sign In
          </button>
        </div>
        <p className="forgot-password text-right">
          <a href="#" onClick={() => navigate("/sign-up")}>회원가입</a>
        </p>
      </form>
    </div>
  )
}
