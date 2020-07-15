import Vue from "vue";
import Vuex from "vuex";
import firebaseServer from "../api/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    name: false,
    avatar: null,
    playerId: null,
    rooms: [],
    roomName: "",
    password: "",
    canvass: null,
    inRoom: null,
    gameLoading: false,
    passEntry: "",
    playersInRoom: []
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    playerName(state) {
      return state.name;
    },
    usedAvatar(state) {
      return state.avatar;
    },
    playerId(state) {
      return state.playerId;
    },
    rooms(state) {
      return state.rooms;
    }
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_NAME(state, payload) {
      state.name = payload;
    },
    SET_AVATAR(state, payload) {
      state.avatar = payload;
    },
    SET_CANVAS(state, payload) {
      state.canvass = payload;
    },
    SET_PLAYERID(state, payload) {
      state.playerId = payload;
    },
    SET_INROOM(state, payload) {
      state.inRoom = payload;
    },
    SET_GAME_LOADING(state, payload) {
      state.gameLoading = payload;
    },
    SET_ROOMS(state, payload) {
      state.rooms = payload;
    },
    SET_ROOM_NAME(state, payload) {
      state.roomName = payload;
    },
    SET_PASSWORD(state, payload) {
      state.password = payload;
    },
    SET_OPEN_PASS(state, payload) {
      state.openPass = payload;
    },
    SET_PASS_ENTRY(state, payload) {
      state.passEntry = payload;
    },
    SET_OPEN_ALERT(state, payload) {
      state.openAlert = payload;
    },
    SET_PLAYERSINROOM(state, payload) {
      state.playersInRoom = payload;
    }
  },
  actions: {
    async postPlayer(context, payload) {
      const { data } = await firebaseServer.post("/players", payload);
      return data;
    },
    async getOnePlayer(context, payload) {
      const data = await firebaseServer.get("/players/", payload.id);
      return data;
      // .then(({ data }) => {
      //   console.log(data);
      // })
      // .catch(err => {
      //   console.log(err.response);
      // });
    },
    onePlayer(context, id) {
      firebaseServer
        .get("/players/", id)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    async fetchRooms(context) {
      const { data } = await firebaseServer.get("/rooms");
      console.log(data, "====");
      if (data === null || data.data === null) {
        context.commit("SET_ROOMS", []);
      } else {
        context.commit("SET_ROOMS", data.data);
      }
      return data;
    },
    async postRooms(context, value) {
      const data = await firebaseServer.post("/rooms", value);
      context.dispatch("fetchRoom");
      context.commit("SET_INROOM", true);
      return data;
    },
    async mapPlayers(context, payload) {
      console.log(context, payload);
      // let players = [];
      // await payload.slice().forEach(async (id) => {
      //   let player = await dispatch(onePlayer(id));
      //   players.push(player);
      // });
      // return players;
    },
    joinRoom(context, payload) {
      firebaseServer
        .put(`/rooms/${payload.id}/join`, {
          playerId: "payload/playerId"
        })
        .then(() => {
          console.log("join room");
          // return firebaseServer.get("/rooms/", payload.id)
        })
        .then(async ({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    leaveRoom(context, payload) {
      firebaseServer
        .put(`/rooms/${payload.id}/leave`, { playerId: payload.playerId })
        .then(() => {
          console.log("leave");
          // return firebaseServer.get("rooms/", payload.id)
        })
        .then(async ({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    fetchRoom(context, roomNumber) {
      firebaseServer
        .get("/rooms/", roomNumber)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  },
  modules: {}
});
