import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatUserInfo } from '../types/ChatUserInfo.type';

export const Login = () => {
  const [rememberId, setRememberId] = useState(false);
  const [chatUser, setChatUser] = useState<ChatUserInfo>({});
  const [error, setError] = useState<boolean>(false);
  let chiId: any = localStorage.getItem('chiId');  
  useEffect(() => {
    let chiId: any = localStorage.getItem('chiId');  
    if (chiId) {
      setChatUser({
        ...chatUser,
        chiId: chiId
      })
      setRememberId(true);
    }
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
        'Content-Type': 'application/json;chartset=UTF-8'
      }
    }).then(res => {
      alert('로그인이 완료되었습니다.');
      localStorage.setItem('user', JSON.stringify(res.data));
      if (rememberId) {
        localStorage.setItem('chiId', res.data.chiId);
      }else{
        localStorage.removeItem('chiId');
      }
    })
      .catch(err => {
        setError(true);
        console.log(err);
      })
    console.log(res);
  }

  return (
    <form>
      <h3>Sign In</h3>

      <div className="mb-3">
        {error
        ?
        <div className='text-danger'>
          아이디와 비밀번호를 확인해주세요.
        </div>:''
        }
        <label>아이디</label>
        <input
          type="text"
          className="form-control"
          placeholder="아이디"
          onChange={changeUser}
          id='chiId'
          value={chiId}
        />
      </div>

      <div className="mb-3">
        <label>비밀번호</label>
        <input
          type="password"
          className="form-control"
          placeholder="비밀번호"
          onChange={changeUser}
          id='chiPwd'
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
        <a href="#">회원가입</a>
      </p>
    </form>
  )
}
