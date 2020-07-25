import Cookies from "js-cookie";
import firebaseServer from "../api/firebase";
import store from "../store";

export const authentication = async (to, from, next) => {
  const playerId = Cookies.get("g-a-player-data");
  if (!playerId) {
    if (to.path !== "/") {
      next("/");
    }
    next();
  } else {
    try {
      await firebaseServer.get(`/players/${playerId}`);
      Cookies.set("g-a-player-data", playerId, { expires: 2 });
      store.commit("SET_PLAYERID", playerId);
      next();
    } catch (err) {
      Cookies.remove("g-a-player-data");
      localStorage.removeItem("roomId");
      next("/");
    }
  }
};

export default {};
