<script>
import router from "../router";
import { ref } from "vue";
import { parseJwt } from "../utils";
export default {
  setup() {
    const authKey = ref("");
    const authToken = ref("");
    const dashboardId = ref("");
    const dashboardInstance = ref(null);

    const user = parseJwt(window.localStorage.getItem("authorization"));

    window
      .fetch(`http://localhost:4001`, {
        headers: {
          authorization:
            "Bearer " + window.localStorage.getItem("authorization"),
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data);
          authKey.value = data.key;
          authToken.value = data.token;

          setTimeout(() => {
            // do a get accessible dashboards call.
            dashboardInstance.value.getAccessibleDashboards().then((data) => {
              dashboardId.value = data[0].id;
            });
          }, 1000);
        }
      });

    return {
      dashboardId,
      appServer: "APP_SERVER_HERE",
      apiHost: "API_HOST_HERE",
      logout: () => {
        window.localStorage.removeItem("authorization");
        router.push("/");
      },
      user,
      authKey,
      authToken,
      dashboardInstance,
    };
  },
};
</script>
<template>
  <div>
    <div class="position-relative">
      <nav
        class="navbar navbar-dark"
        :style="{
          'background-color':
            user.brand === 'Mars Boots' ? '#f06292' : '#d32f2f',
        }"
      >
        <div class="container">
          <a class="navbar-brand" href="#">{{ user.brand }}</a>
          <span class="d-flex navbar-email position-relative">
            <strong>{{ user.email }}</strong>
            <div
              class="position-absolute btn btn-dark btn-logout"
              @click="logout"
            >
              Logout
            </div>
          </span>
        </div>
      </nav>
      <div class="container mt-4">
        <cumulio-dashboard
          ref="dashboardInstance"
          :authKey="authKey"
          :authToken="authToken"
          :dashboardId="dashboardId"
          :appServer="appServer"
          :apiHost="apiHost"
        ></cumulio-dashboard>
      </div>
    </div>
  </div>
</template>

<style>
h1,
h2,
h3,
h4 {
  font-family: "Bangers", cursive;
}

.navbar-brand {
  font-family: "Bangers", cursive;
  font-size: 2.5rem;
}

.navbar-email {
  font-family: "Gudea", sans-serif;
  color: white;
  font-size: 1.25rem;
}

.btn-logout {
  left: 2rem;
  top: 2.2rem;
  z-index: 2;
}

.loader {
  position: absolute;
  left: 48%;
  top: 30%;
}

template {
  display: block !important;
}
</style>
