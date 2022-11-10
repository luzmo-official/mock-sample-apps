import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from '../login/login';


function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem('authorization')) {
      navigate('/portal', { replace: true });
    }
  }, [navigate]);

  function login() {
    if (window.localStorage.getItem('authorization')) {
      navigate('/portal', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }

  return <div className="container container-whole text-center">
      <span className="text-center h1-bg inline-block p-2">UNIVERSAL FOOTWEAR</span>
      <div className="row text-center links-container mt-5">
        <div className="offset-lg-2 col-12 col-lg-3">
          <div className="row">
            <div className="col-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aut vero cum enim quibusdam quaerat.
              Quos modi temporibus tempora suscipit qui.
              Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
            </div>
          </div>
          <Link to='/investor' className="btn btn-lg btn-primary btn-purple mt-5" >
            Investor relations
          </Link>
      </div>
      <div className="offset-lg-2 col-12 col-lg-3 mt-5 mt-lg-0">
          <div className="row">
            <div className="col-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aut vero cum enim quibusdam quaerat.
              Quos modi temporibus tempora suscipit qui.
              Quis nemo ut labore ex. Quia aspernatur dolores eveniet minima!
            </div>
          </div>
          <div className="btn btn-lg btn-primary btn-purple mt-5" onClick={() => login()}>
            Brand portal
          </div>
      </div>
      </div>
    </div>;
}

export default Home;