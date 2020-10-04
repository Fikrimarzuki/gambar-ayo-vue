<template>
  <div class="gamePage">
    <div class="topSide">
      <div class="leftSide">
        <!-- <Card class="card-leaderboard">
          <h5>LeaderBoard</h5>
        </Card> -->
        <div class="card-leaderboard">
          <h5>LeaderBoard</h5>
        </div>
        <div v-for="(player, index) in playersInRoom" :key="index">
          <!-- <Card class="card-avatar" :key="index">
            <img :src="player.avatar" :alt="player.name" />
            <div class="card-player-name">
              <h5>{{ player.name }}</h5>
              <p>5</p>
            </div>
          </Card> -->
          <div class="card-avatar">
            <img :src="player.avatar" :alt="player.name" />
            <div class="card-player-name">
              <h5>{{ player.name }}</h5>
            </div>
          </div>
        </div>
      </div>

      <div class="rightSide">
        <div class="container-top">
          <div style="display: flex; flex-direction: column">
            <h3 v-if="gameOver">
              {{ resultMessage }}
            </h3>
            <h1 v-else>Ulat Bulu</h1>
            <div v-if="!isPlaying">
              <md-button
                class="md-raised md-primary btn-login"
                @click="isExit = !isExit"
              >
                Exit
              </md-button>
              <md-button
                class="md-raised md-primary btn-login"
                @click="isPassword = !isPassword"
              >
                Change Password
              </md-button>
            </div>
          </div>
        </div>
        <!-- CANVASS -->
        <div class="canvas" v-if="isTurn">
          <canvas
            id="canvas"
            width="600"
            height="250"
            @mousemove="draw"
            @mousedown="beginDrawing"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
          ></canvas>
        </div>
        <div class="canvas" v-else>
          <canvas id="canvasListen" ref="canvasListen" width="600" height="250">
          </canvas>
        </div>
        <div>
          <md-progress-bar
            md-mode="determinate"
            :md-value="progress"
            class="progress"
          ></md-progress-bar>
        </div>
        <h3>Time Out</h3>
        <div style="display: flex" v-if="isMaster">
          <template v-if="isPlaying">
            <md-button
              @click="handleTurn"
              class="md-raised md-primary btn-login"
              >Next</md-button
            >
            <!-- <md-button @click="resetGame" class="md-raised md-primary btn-login"
              >Reset Game</md-button
            > -->
            <!-- <md-button
              @click="isVoting = !isVoting"
              class="md-raised md-primary btn-login"
            >
              Voting
            </md-button> -->
            <!-- <md-button
              class="md-raised md-primary btn-login"
              type="submit"
              @click="endGame"
            >
              Result
            </md-button> -->
          </template>
          <md-button
            @click="startGame"
            class="md-raised md-primary btn-login"
            v-else
            >Play</md-button
          >
        </div>
      </div>
    </div>

    <div class="bottomSide">
      <div class="chatSide">
        <ul id="messages"></ul>
        <input type="text" v-model="message" @keyup.enter="sendChat" />
      </div>
    </div>

    <!-- MODAL CHANGE PASSWORD -->
    <div>
      <md-dialog :md-active.sync="isPassword">
        <h2 class="card-title">Change Password</h2>
        <div>
          <label>Password</label>
          <input type="text" v-model="password" />
          <md-dialog-actions>
            <md-button class="md-primary" @click="changePassword"
              >Save</md-button
            >
            <md-button class="md-primary" @click="isPassword = !isPassword"
              >Cancel</md-button
            >
          </md-dialog-actions>
        </div>
      </md-dialog>
    </div>
    <!-- MODAL EXIT ROOM -->
    <div>
      <md-dialog :md-active.sync="isExit">
        <h2 class="card-title">Exit the room ?</h2>
        <div style="display: flex">
          <md-dialog-actions>
            <md-button class="md-primary" @click="handleExit">Yes</md-button>
            <md-button class="md-primary" @click="isExit = !isExit"
              >No</md-button
            >
          </md-dialog-actions>
        </div>
      </md-dialog>
    </div>
    <!-- MODAL VOTE -->
    <div>
      <md-dialog :md-active.sync="isVoting">
        <md-dialog-title>Its time to vote a player</md-dialog-title>
        <div v-for="(player, index) in playersInRoom" :key="index">
          <div class="form-group">
            <input
              large
              :id="player.name"
              type="radio"
              maxLength="20"
              placeholder="Maximum length = 20"
              :value="index"
              v-model="radioValue"
              required
            />
            <label :for="player.name">{{ player.name }}</label>
          </div>
        </div>
        <md-dialog-actions>
          <md-button class="md-primary" type="submit" @click="votingUndercover">
            Vote
          </md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import socket from "./socket";
import "./style.css";

let timeoutVoting = 0;

export default {
  name: "Room",
  data() {
    return {
      isExit: false,
      isVoting: false,
      isPassword: false,
      password: "",
      radioValue: "",
      message: "",
      progress: 0,
      canvas: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      isDrawing: false,
      points: [],
      playersVoting: 0,
      resultMessage: "",
      gameOver: false
    };
  },
  computed: {
    ...mapGetters(["inRoom", "playersInRoom", "rooms", "room", "playerId"]),
    isTurn() {
      if (
        this.players &&
        this.players.length !== 0 &&
        this.players[0] === this.playerId
      ) {
        return true;
      }
      return false;
    },
    isPlaying() {
      if (this.room) {
        return this.room.isPlaying;
      }
      return false;
    },
    players() {
      if (this.room && this.room.shufflePlayers) {
        return this.room.shufflePlayers;
      }
      return [];
    },
    isMaster() {
      const isMaster = this.playersInRoom.filter(
        el => el.id === this.playerId && el.isMaster
      );
      return isMaster.length ? true : false;
    }
  },
  methods: {
    ...mapActions([
      "leaveRoom",
      "getPlayersInRoom",
      "fetchRoom",
      "playGame",
      "resetRoom",
      "updateRoom",
      "votingPlayer",
      "getGameResult"
    ]),
    ...mapMutations(["SET_PLAYERSINROOM", "SET_ROOM"]),
    async changePassword() {
      await this.updateRoom({ ...this.room, password: this.password });
      this.isPassword = !this.isPassword;
      socket.emit("fetch all room");
      socket.emit("fetch room");
    },
    async handleExit() {
      const id = this.inRoom
        ? this.inRoom.roomNumber
        : localStorage.getItem("roomId");
      const payload = { id, playerId: this.playerId };
      const left = await this.leaveRoom(payload);
      if (left) {
        socket.emit("leave room", payload);
      } else {
        socket.emit("all players has left room");
      }
      localStorage.removeItem("roomId");
      this.isExit = false;
      this.$router.replace("/lobby");
    },
    async startGame() {
      const data = await this.playGame(this.room.roomNumber);
      this.gameOver = false; // socket
      this.playersVoting = 0; // socket
      this.radioValue = ""; // socket
      this.canvas.clearRect(0, 0, this.width, this.height); // socket-reset canvass
      console.log(data, "start");
      socket.emit("fetch all room");
      socket.emit("fetch room");
    },
    async handleTurn() {
      // const c = document.getElementById("canvasListen");
      this.canvas.clearRect(0, 0, this.width, this.height);
      const points = [...this.points];
      this.points = [];
      // console.log(points, "points");
      points.forEach(el => {
        this.listenLine(el.x1, el.y1, el.x2, el.y2);
      });
      this.players.shift();
      // Players who play is no length, vote time or reset player turn and continue game
      if (this.players.length === 0) {
        // set time and show vote dialog - send isVoting and radioValue to socket
        this.radioValue = "";
        this.isVoting = true;
        console.log("next turn");
      } else {
        const payload = { ...this.room, shufflePlayers: this.players };
        const updating = await this.updateRoom(payload);
        if (updating) {
          socket.emit("fetch room");
        }
      }
    },
    async resetGame() {
      await this.resetRoom(this.room.roomNumber);
      socket.emit("fetch all room");
      socket.emit("fetch room");
    },
    async endGame() {
      const data = await this.getGameResult(this.room.roomNumber);
      console.log(data, "END GAME");
      if (data.gameOver) {
        // send with socket
        this.gameOver = true;
        this.resultMessage = data.msg;
        this.resetGame();
      } else {
        console.log("not end-reset turn, silence player and continue the game");
      }
    },
    sendChat() {
      if (this.message) {
        const roomId = Number(localStorage.getItem("roomId"));
        const playerId = this.playerId;
        const payload = { chat: this.message, playerId, roomId };
        socket.emit("chat message", payload);
      }
      this.message = "";
    },
    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      socket.emit("draw canvas", { x1, y1, x2, y2 });
    },
    listenLine(x1, y1, x2, y2) {
      this.points.push({ x1, y1, x2, y2 });
      // console.log(x1, y1, x2, y2);
      console.log(this.points);
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    draw(e) {
      if (this.isDrawing) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    beginDrawing(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },
    stopDrawing(e) {
      if (this.isDrawing) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
    },
    async votingUndercover() {
      const payload = {
        roomNumber: this.room.roomNumber,
        vote: this.room.Players[this.radioValue]
      };
      await this.votingPlayer(payload);
      this.isVoting = false;
      console.log("VOTING TIME");
      // send with socket to get number of player who has been voted and add to playersVoting
      this.playersVoting++; // socket
      if (this.playersVoting === this.playersInRoom.length || timeoutVoting) {
        console.log(this.room, "after vote");
        // set time to wait for other player to voting
        // if done, show the result
        this.endGame();
      } else {
        // set loading to wait other player voting
      }
    }
  },
  mounted() {
    let c;
    if (this.isTurn) {
      c = document.getElementById("canvas");
    } else {
      c = document.getElementById("canvasListen");
    }
    this.width = c.width;
    this.height = c.height;
    if (c.getContext) {
      this.canvas = c.getContext("2d");
    }
  },
  async created() {
    const roomId = localStorage.getItem("roomId");
    if (roomId) {
      await this.fetchRoom(roomId);
      await this.getPlayersInRoom(roomId);
      console.log(this.playersInRoom);
      if (this.room.password) {
        this.password = this.room.password;
      }
    } else {
      this.$router.go(-1);
    }
    socket.on("chat message", payload => {
      const li = document.createElement("LI");
      const strong = document.createElement("STRONG");
      let text;
      if (payload.isJoin || payload.isLeft) {
        text = document.createTextNode(`${payload.player} ${payload.message}`);
        strong.appendChild(text);
        li.appendChild(strong);
      } else {
        const username = document.createTextNode(payload.player);
        strong.appendChild(username);
        li.appendChild(strong);
        text = document.createTextNode(`: ${payload.message}`);
        li.appendChild(text);
      }
      document.querySelector("#messages").appendChild(li);
    });
    socket.on("player joined the room", async room => {
      await this.getPlayersInRoom(room.roomNumber);
    });
    socket.on("player left the room", async room => {
      await this.getPlayersInRoom(room.roomNumber);
    });
    socket.on("fetch room", async () => {
      await this.fetchRoom(roomId);
    });
    socket.on("draw canvas", ({ x1, y1, x2, y2 }) => {
      this.listenLine(x1, y1, x2, y2);
    });
  },
  beforeDestroy() {
    socket.removeAllListeners();
  }
};
</script>

<style lang="scss" scoped></style>
