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
              <p>5</p>
            </div>
          </div>
        </div>

        <!-- MODAL EXIT ROOM -->
        <!-- <Dialog v-if="isExit">
          <h2 class="card-title">Exit the room ?</h2>
          <div style="display: flex">
            <AnchorButton type="text" @click="handleExit">Yes</AnchorButton>
            <AnchorButton type="text" @click="isExit = !isExit"
              >No</AnchorButton
            >
          </div>
        </Dialog> -->
        <div>
          <md-dialog :md-active.sync="isExit">
            <h2 class="card-title">Exit the room ?</h2>
            <div style="display: flex">
              <button type="text" @click="handleExit">Yes</button>
              <button type="text" @click="isExit = !isExit">No</button>
            </div>
          </md-dialog>
        </div>
      </div>

      <div class="rightSide">
        <div class="container-top">
          <h1>Ulat Bulu</h1>
          <button class="btn">
            <span icon="log-out" @click="openModal('exit-room')">Exit</span>
          </button>
        </div>
        <!-- CANVASS -->
        <div class="canvass">
          <canvass id="canvass"></canvass>
        </div>
        <div>
          <md-progress-bar
            md-mode="determinate"
            :md-value="progress"
          ></md-progress-bar>
          <input type="range" v-model.number="progress" style="disable: none" />
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
import "./style.css";

export default {
  name: "Room",
  data() {
    return {
      isExit: false,
      playersInRoom: [],
      message: "",
      progress: 0,
      vueCanvass: null,
      rectWidth: 200
    };
  },
  methods: {
    handleExit() {
      console.log("exit room");
    },
    openModal(name) {
      console.log(name);
    },
    handleTurn() {
      console.log("next");
    },
    sendChat() {
      console.log(this.message);
    },
    drawRect() {
      // Clear Canvas
      this.vueCanvass.clearRect(0, 0, 400, 200);

      // Draw Rect
      this.vueCanvass.beginPath();
      this.vueCanvass.rect(20, 20, this.rectWidth, 100);
      this.vueCanvass.stroke();
    },
    addWidth() {
      this.rectWidth += 10;
      this.drawRect();
    },
    subWidth() {
      this.rectWidth -= 10;
      this.drawRect();
    }
  },
  mounted() {
    const canvass = document.getElementById("canvass");
    const ctx = canvass.getContext("2d");
    this.vueCanvass = ctx;
  },
  async created() {
    setInterval(() => {
      this.progress += 33;
      setInterval(() => {
        this.prgoress += 33;
        setInterval(() => {
          this.progress += 34;
        }, 3000);
      }, 2000);
    }, 1000);
  }
};
</script>

<style lang="scss" scoped></style>
