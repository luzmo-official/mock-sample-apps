import './login.scss';
import renderHome from '../home';
import renderPortal from '../portal';
import { globalRoot, parseJwt } from '../global';

$(document).on('click', '#go-to-home', () => {
  renderHome(globalRoot);
});

$(document).on('click', '#login-as-brad', () => {
  (document.getElementById('email') as HTMLInputElement).value = 'brad@mars-boots.com';
  (document.getElementById('password') as HTMLInputElement).value = 'brad';
  login();
});

$(document).on('click', '#login-as-angelina', () => {
  (document.getElementById('email') as HTMLInputElement).value = 'angelina@earthly-shoes.com';
  (document.getElementById('password') as HTMLInputElement).value = 'angelina';
  login();
});

$(document).on('click', '#login-btn', () => {
  login();  
});

function login() {
  window.fetch(`http://localhost:4001/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: (document.getElementById('email') as HTMLInputElement).value,
      password: (document.getElementById('password') as HTMLInputElement).value
    })
  })
  .then(res => res.json())
  .then((data) => {
    console.log(data);
    window.localStorage.setItem('authorization', data.token as string);
    renderPortal(globalRoot, null, parseJwt(data.token));
  });
}

const render = (root: HTMLElement, auth?: {
  status: string;
  key?: string;
  token?: string;
}) => {
  root.innerHTML = `
  <div class="position-relative">
  <nav class="navbar navbar-dark" style="
    background-color: #ab47bc">
    <div class="container">
      <a class="navbar-brand" id="go-to-home" href="#">UNIVERSAL SHOES</a>
    </div>

  </nav>
  
</div>
  <div class="login-page">
    <div class="row justify-content-center align-center mb-2">
      <div
        class="col-5 text-center btn btn-outline-danger mx-2"
        id="login-as-brad"
      >
        Login as Brad
      </div>
      <div
        class="col-5 text-center btn btn-outline-warning mx-2"
        id="login-as-angelina"
      >
        Login as Angelina
      </div>
    </div>
    <div class="form">
      <form class="login-form">
        <input type="email" placeholder="email" name="email" id="email"/>
        <input type="password" placeholder="password" name="password" id="password" />
        <div class="btn btn-primary login-button" id="login-btn">login</div>
      </form>
    </div>
  </div>
  `;
};

export default render;