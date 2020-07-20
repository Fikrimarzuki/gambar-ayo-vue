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
    room: null,
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
    },
    room(state) {
      return state.room;
    },
    inRoom(state) {
      return state.inRoom;
    },
    playersInRoom(state) {
      return state.playersInRoom;
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
    SET_ROOM(state, payload) {
      state.room = payload;
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
    async getPlayer(context, id) {
      const { data } = await firebaseServer.get("/players/", id);
      return data;
    },
    async fetchRooms(context) {
      const { data } = await firebaseServer.get("/rooms");
      console.log(data, "====");
      if (data === null || data.length === 0) {
        context.commit("SET_ROOMS", []);
      } else {
        context.commit("SET_ROOMS", data);
      }
      return data;
    },
    async postRooms(context, value) {
      const { data } = await firebaseServer.post("/rooms", value);
      console.log(data, "post room");
      context.dispatch("fetchRoom");
      context.commit("SET_INROOM", data);
      return data;
    },
    async mapPlayers(context, payload) {
      console.log(context, payload);
      let players = [];
      await payload.slice().forEach(async id => {
        let player = await context.dispatch("getPlayer", id);
        players.push(player);
      });
      return players;
    },
    async joinRoom(context, payload) {
      await firebaseServer.put(`/rooms/${payload.id}/join`, {
        playerId: payload.playerId
      });
      const { data } = await firebaseServer.get(`/rooms/${payload.id}`);
      console.log(data, "join room");
      let players = await context.dispatch("mapPlayers", data.Players);
      await context.commit("SET_INROOM", data);
      await context.commit("SET_PLAYERSINROOM", players);
      return data;
    },
    async leaveRoom(context, payload) {
      console.log(payload);
      const leaveData = await firebaseServer.put(`/rooms/${payload.id}/leave`, {
        playerId: payload.playerId
      });
      console.log(leaveData.data, "leave Data");
      if (!leaveData.data.isRoomDeleted) {
        const { data } = await firebaseServer.get(`/rooms/${payload.id}`);
        console.log(data, "leave room");
        const players = await context.dispatch("mapPlayers", data.Players);
        await context.commit("SET_INROOM", null);
        await context.commit("SET_PLAYERSINROOM", []);
        return { data, players };
      }
      return false;
    },
    async getPlayersInRoom(context, roomNumber) {
      const { data } = await firebaseServer.get(`/rooms/${roomNumber}`);
      console.log(data, "get players in room");
      let players = [];
      if (data.Players && data.Players.length !== 0) {
        console.log(data.Players, "players");
        await data.Players.forEach(async el => {
          let player = await firebaseServer.get(`/players/${el}`);
          console.log(player.data);
          players.push(player.data);
        });
      }
      context.commit("SET_PLAYERSINROOM", players);
    },
    async fetchRoom(context, roomNumber) {
      console.log(roomNumber, "roomNumber");
      const { data } = await firebaseServer.get(`/rooms/${roomNumber}`);
      console.log(data, "data");
      context.commit("SET_ROOM", data);
      return data;
    }
  },
  modules: {}
});
