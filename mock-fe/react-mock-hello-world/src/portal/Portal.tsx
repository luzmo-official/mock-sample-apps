import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { CumulioDashboardComponent, CumulioDashboard } from "@cumul.io/react-cumulio-dashboard";
import { parseJwt } from '../global';
import './portal.css';

const dashboardId = 'DASHBOARD_ID_HERE';
const appServer = 'APP_SERVER_HERE';
const apiHost = 'API_HOST_HERE';

function Portal() {
  const navigate = useNavigate();
  const [key, setKey] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState<{email?: string; username?: string; brand?: string;}>({});
  const ref = useRef<CumulioDashboard>(null);
  useEffect(() => {
    const authorization = window.localStorage.getItem('authorization');
    setUser(parseJwt(authorization as string));
    if (authorization) {
      window.fetch(`http://localhost:4001`, {
        headers: {
          'authorization': 'Bearer ' + authorization
        }
      })
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          setKey(data.key);
          setToken(data.token);
          console.log(data, key, token);
          if (ref) {
            // ref.current?.setAuthorization(data.key, data.token);
          }
        }, 2000);

      });
    }
  }, []);

  function logout() {
    window.localStorage.removeItem('authorization');
    navigate('/', { replace: true });
  }


  return user ? <div className="position-relative">
    <nav className="navbar navbar-dark" style={{
      'backgroundColor': user?.brand === 'Mars Boots' ? '#f06292' : '#d32f2f'
    }}>
      <div className="container">
        <Link className="navbar-brand" to="#">{ user?.brand === 'Mars Boots'  ? 'MARS BOOTS' : 'EARTHLY SHOES'}</Link>
        <span className="d-flex navbar-email position-relative">
          <strong>{user?.email}</strong>
          <div className="position-absolute btn btn-dark btn-logout" onClick={() => logout()}>Logout</div>
        </span>
      </div>

    </nav>
    <div className="container mt-4 position-relative dashboard-loader">
    { key && token ? <CumulioDashboardComponent
      ref={ref}
      dashboardId={dashboardId}
      authKey={key}
      authToken={token}
      appServer={appServer}
      apiHost={apiHost}
      mainColor="pink"
      accentColor="black"
      loaderSpinnerColor="rgb(0, 81, 126)"
      loaderSpinnerBackground="rgb(236 248 255)"
      itemsRendered={(e) => console.log("itemsRendered", e)}
      exported={(e) => console.log("exported", e)}
      load={(e) => console.log("load", e)}
    ></CumulioDashboardComponent> : <div className="spinner-border text-danger loader" role="status">
    <span className="visually-hidden">Loading...</span>
  </div> }
    </div>
    </div> : <div className="spinner-border text-danger loader" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>;
}

export default Portal;