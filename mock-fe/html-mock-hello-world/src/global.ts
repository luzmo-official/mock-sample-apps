import renderPortal from './portal';


let globalRoot = document.getElementById('root');

$(document).ready(() => {
  globalRoot = document.getElementById('root');
});

function parseJwt (token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export { globalRoot, parseJwt };


if (window.localStorage.getItem('authorization')) {
  renderPortal(globalRoot, null, parseJwt(window.localStorage.getItem('authorization')));
}