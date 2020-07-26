import Vue from "vue";
import Vuex from "vuex";
import firebaseServer from "../api/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
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
      try {
        const { data } = await firebaseServer.post("/players", payload);
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async getPlayer(context, id) {
      try {
        const { data } = await firebaseServer.get(`/players/${id}`);
        return data;
      } catch (err) {
        return err.response;
      }
    },
    async fetchRooms(context) {
      try {
        const { data } = await firebaseServer.get("/rooms");
        if (data === null || data.length === 0) {
          context.commit("SET_ROOMS", []);
        } else {
          context.commit("SET_ROOMS", data);
        }
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async createRoom(context, value) {
      try {
        const { data } = await firebaseServer.post("/rooms", value);
        context.dispatch("fetchRoom");
        context.commit("SET_INROOM", data);
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async mapPlayers(context, payload) {
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
      let players = await context.dispatch("mapPlayers", data.Players);
      await context.commit("SET_INROOM", data);
      await context.commit("SET_PLAYERSINROOM", players);
      return data;
    },
    async leaveRoom(context, payload) {
      const leaveData = await firebaseServer.put(`/rooms/${payload.id}/leave`, {
        playerId: payload.playerId
      });
      if (!leaveData.data.isRoomDeleted) {
        const { data } = await firebaseServer.get(`/rooms/${payload.id}`);
        const players = await context.dispatch("mapPlayers", data.Players);
        await context.commit("SET_INROOM", null);
        await context.commit("SET_PLAYERSINROOM", []);
        return { data, players };
      }
      return false;
    },
    async getPlayersInRoom(context, roomNumber) {
      console.log(roomNumber, "get players");
      const { data } = await firebaseServer.get(`/rooms/${roomNumber}`);
      let players = [];
      if (data.Players && data.Players.length !== 0) {
        await data.Players.forEach(async el => {
          let player = await firebaseServer.get(`/players/${el}`);
          players.push(player.data);
        });
      }
      context.commit("SET_PLAYERSINROOM", players);
    },
    async fetchRoom(context, roomNumber) {
      try {
        const { data } = await firebaseServer.get(`/rooms/${roomNumber}`);
        console.log(data, "fetch room");
        context.commit("SET_ROOM", data);
        return data;
      } catch (err) {
        console.log(err.response, "fetch");
      }
    },
    async updateRoom(context, payload) {
      try {
        const data = await firebaseServer.put(
          `/rooms/${payload.roomNumber}`,
          payload
        );
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async playGame(context, roomNumber) {
      try {
        const { data } = await firebaseServer.get(`/rooms/${roomNumber}/play`);
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async resetRoom(context, roomNumber) {
      try {
        const { data } = await firebaseServer.get(
          `/rooms/${roomNumber}/resetRoom`
        );
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async votingPlayer(context, payload) {
      try {
        const { data } = await firebaseServer.patch(
          `/rooms/${payload.roomNumber}/voting`,
          payload
        );
        return data;
      } catch (err) {
        console.log(err.response);
      }
    },
    async getGameResult(context, roomNumber) {
      try {
        const { data } = await firebaseServer.get(
          `/rooms/${roomNumber}/result`
        );
        console.log(data);
        return data;
      } catch (err) {
        console.log(err.response);
      }
    }
  },
  modules: {}
});
