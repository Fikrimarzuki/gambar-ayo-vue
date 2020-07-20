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

        <!-- MODAL EXIT ROOM -->
        <div>
          <md-dialog :md-active.sync="isExit">
            <h2 class="card-title">Exit the room ?</h2>
            <div style="display: flex">
              <md-dialog-actions>
                <md-button class="md-primary" @click="handleExit"
                  >Yes</md-button
                >
                <md-button class="md-primary" @click="isExit = !isExit"
                  >No</md-button
                >
              </md-dialog-actions>
            </div>
          </md-dialog>
        </div>
      </div>

      <div class="rightSide">
        <div class="container-top">
          <h1>Ulat Bulu</h1>
          <md-button
            class="md-raised md-primary btn-login"
            @click="openModal('exit-room')"
          >
            Exit
          </md-button>
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
        <button @click="handleTurn">Next</button>
      </div>
    </div>

    <div class="bottomSide">
      <!-- MODAL VOTE -->
      <!-- <Dialog class="vote-modal" :isCloseButtonShown="true" :isOpen="false" :usePortal="true">
        <h3>It's Vote Time!!!</h3>
        <h5>click to select the wrong one</h5>
        <RadioGroup :selectedValue="selected" class="vote-radio">
          <Radio label="budi" value="budi" />
          <Radio label="ayu" value="ayu" />
          <Radio label="dewi" value="dewi" />
          <Radio label="agung" value="agung" />
          <Radio label="putri" value="putri" />
          <Radio label="putra" value="putra" />
        </RadioGroup>
        <h4>Time Out</h4>
        <ProgressBar />
      </Dialog> -->
      <div></div>

      <div class="chatSide">
        <ul id="messages"></ul>
        <input type="text" v-model="message" @keyup.enter="sendChat" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import socket from "./socket";
import "./style.css";

export default {
  name: "Room",
  computed: {
    ...mapGetters(["inRoom", "playersInRoom", "rooms", "room"]),
    isTurn() {
      if (localStorage.isTurn === "false") {
        return false;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      isExit: false,
      message: "",
      progress: 0,
      canvas: null,
      x: 0,
      y: 0,
      isDrawing: false,
      points: []
    };
  },
  methods: {
    ...mapActions(["leaveRoom", "getPlayersInRoom", "fetchRoom"]),
    ...mapMutations(["SET_PLAYERSINROOM"]),
    async handleExit() {
      console.log("exit room");
      console.log(this.inRoom, "inRoom");
      const id = this.inRoom
        ? this.inRoom.roomNumber
        : localStorage.getItem("roomId");
      const left = await this.leaveRoom({
        id,
        playerId: localStorage.getItem("g-a-player-data")
      });
      console.log(left, "left");
      if (left) {
        socket.emit("leave room", id);
      } else {
        socket.emit("all players has left room");
      }
      localStorage.removeItem("roomId");
      this.isExit = false;
      this.$router.replace("/lobby");
    },
    openModal(name) {
      console.log(name);
      this.isExit = true;
    },
    handleTurn() {
      console.log("next");
      const c = document.getElementById("canvasListen");
      this.canvas.clearRect(0, 0, c.width, c.height);
      const points = [...this.points];
      this.points = [];
      console.log(points, "points");
      points.forEach(el => {
        this.listenLine(el.x1, el.y1, el.x2, el.y2);
      });
    },
    sendChat() {
      if (this.message) {
        console.log(this.message);
        const roomId = Number(localStorage.getItem("roomId"));
        const playerId = localStorage.getItem("g-a-player-data");
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
    }
  },
  mounted() {
    let c;
    if (this.isTurn) {
      c = document.getElementById("canvas");
    } else {
      c = document.getElementById("canvasListen");
    }
    if (c.getContext) {
      this.canvas = c.getContext("2d");
    }
  },
  async created() {
    await this.fetchRoom(localStorage.getItem("roomId"));
    await this.getPlayersInRoom(localStorage.getItem("roomId"));
    console.log(this.room, "rooms");
    socket.on("chat message", payload => {
      const li = document.createElement("LI");
      const strong = document.createElement("STRONG");
      let text;
      if (payload.isJoin) {
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
      console.log(room, "socket on joined the room");
      await this.getPlayersInRoom(room.roomNumber);
    });

    socket.on("player left the room", async room => {
      console.log(room, "socket leave room");
      await this.getPlayersInRoom(room.roomNumber);
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
