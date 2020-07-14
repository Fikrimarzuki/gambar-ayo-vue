import Vue from "vue";
import VueRouter from "vue-router";

const Navbar = () => import("../components/Navbar.vue");

const LandingPage = () => import("../views/LandingPage/Index.vue");

const Lobby = () => import("../views/Lobby/Index.vue");

const Room = () => import("../views/Room/Index.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LandingPage",
    components: {
      default: LandingPage,
      navbar: Navbar
    }
  },
  {
    path: "/lobby",
    name: "Lobby",
    components: {
      default: Lobby,
      navbar: Navbar
    }
  },
  {
    path: "/room",
    name: "Room",
    components: {
      default: Room,
      navbar: Navbar
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
