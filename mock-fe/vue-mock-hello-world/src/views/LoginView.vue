<template>
  <div class="position-relative">
    <nav class="navbar navbar-dark" style="background-color: #ab47bc">
      <div class="container">
        <a class="navbar-brand" href="#">UNIVERSAL SHOES</a>
        <span class="d-flex navbar-investor position-relative"> </span>
      </div>
    </nav>
  </div>

  <div class="login-page">
    <div class="row justify-content-center align-center mb-2">
      <div
        class="col-5 text-center btn btn-outline-danger mx-2"
        @click="login('brad')"
      >
        Login as Brad
      </div>
      <div
        class="col-5 text-center btn btn-outline-warning mx-2"
        @click="login('angelina')"
      >
        Login as Angelina
      </div>
    </div>
    <div class="form">
      <form class="login-form">
        <input type="email" placeholder="email" name="email" v-model="email" />
        <input
          type="password"
          placeholder="password"
          name="password"
          v-model="password"
        />
        <div class="btn btn-primary login-button" @click="login()">login</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import router from '../router';
export default {
  setup() {
    const email = ref("");
    const password = ref("");
    return {
      email,
      password,
      login(username) {
        if (username === "brad") {
          email.value = "brad@mars-boots.com";
          password.value = "brad";
        } else if (username === "angelina") {
          email.value = "angelina@earthly-shoes.com";
          password.value = "angelina";
        }
        console.log(email.value, password.value);

        window
          .fetch(`http://localhost:4001/login`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            window.localStorage.setItem("authorization", data.token);
            router.push('/portal');
          });
      },
    };
  },
};
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.navbar-investor {
  font-family: "Gudea", sans-serif;
  color: white;
  font-size: 1.25rem;
}

.navbar-brand {
  font-family: "Bangers", cursive;
  font-size: 2.5rem;
}

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #4caf50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,
.form button:active,
.form button:focus {
  background: #43a047;
}

.login-button {
  width: 100%;
}

body {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
