import Vue from "vue";
import Vuex from "vuex";
import firebaseServer from "../api/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    error: null,
    open: false,
    name: false,
    avatar: null,
    canvass: null,
    playerId: null,
    inRoom: null,
    gameLoading: false,
    rooms: [],
    roomName: "",
    password: "",
    openPass: false,
    passEntry: "",
    openAlert: false,
    playersInRoom: []
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_OPEN(state, payload) {
      state.open = payload;
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
    postPlayer(context, payload) {
      firebaseServer
        .post("/players", payload)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    getOnePlayer(context, payload) {
      firebaseServer
        .get("/players/", payload.id)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
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
    fetchRooms(context) {
      console.log(context);
      firebaseServer
        .get("/rooms")
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    postRooms(context, value) {
      firebaseServer
        .post("/rooms", value)
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err.response);
        });
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
