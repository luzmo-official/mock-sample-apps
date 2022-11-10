import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCumulioDashboard from '@cumul.io/vue-cumulio-dashboard';

const app = createApp(App);

app.use(VueCumulioDashboard);
app.use(router);

app.mount("#app");
