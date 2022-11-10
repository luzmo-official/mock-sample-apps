import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function login(username?: string) {
    let emailId = email;
    let passwordLocal = password;
    if (username === 'brad') {
      emailId = 'brad@mars-boots.com';
      passwordLocal = 'brad';
    } else if (username === 'angelina') {
      emailId = 'angelina@earthly-shoes.com';
      passwordLocal = 'angelina';
    }
    setEmail(emailId);
    setPassword(passwordLocal);

    console.log(emailId, passwordLocal);
    window.fetch(`http://localhost:4001/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailId,
        password: passwordLocal
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      window.localStorage.setItem('authorization', data.token as string);
      navigate('/portal', { replace: true });
    });
  }

  return <div>
    <div className="position-relative">
      <nav className="navbar navbar-dark" style={{
        'backgroundColor': '#ab47bc'
      }}>
        <div className="container">
          <Link className="navbar-brand" to="/">UNIVERSAL SHOES</Link>
          <span className="d-flex navbar-investor position-relative">
          </span>
        </div>

      </nav>
    </div>
    <div className="login-page">
      <div className="row justify-content-center align-center mb-2">
        <div
          className="col-5 text-center btn btn-outline-danger mx-2"
          id="login-as-brad"
          onClick={e => login('brad')}
        >
          Login as Brad
        </div>
        <div
          className="col-5 text-center btn btn-outline-warning mx-2"
          id="login-as-angelina"
          onClick={e => login('angelina')}
        >
          Login as Angelina
        </div>
      </div>
      <div className="form">
        <form className="login-form">
          <input type="email" placeholder="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
          <input type="password" placeholder="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="btn btn-primary login-button" id="login-btn" onClick={e => login()}>login</div>
        </form>
      </div>
    </div>
  </div>;
}

export default Login;