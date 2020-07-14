<template>
  <div>
    <div v-if="loading">
      <!-- <Overlay class="loading-spinner" :isOpen="loading" usePortal hasBackdrop>
        <Spinner intent="primary" size="{145}" />
      </Overlay> -->
      <div>
        LOADING
      </div>
    </div>
    <div v-else>
      <!-- <Alert
        class="border border-danger"
        confirmButtonText="Try Again"
        v-if="isError"
        :onClose="closeAlert"
      >
        <h4 class="alert-text card-title">Incorrect Password</h4>
      </Alert> -->
      <div v-if="isError" class="border border-danger">
        <h4 class="alert-text card-title">Incorrect Password</h4>
      </div>

      <!-- MODAL ENTER PASSWORD -->
      <!-- <Dialog v-if="isLocked">
        <h3 class="card-title">Enter Password</h3>
        <form @submit.prevent="enterPassRoom">
          <div class="form-group">
            <input
              placeholder="Password Here"
              autofocus
              type="password"
              large
              v-model="password"
            />
          </div>
          <button class="btn btn-primary" text="Enter">
            Enter
          </button>
        </form>
      </Dialog> -->
      <div v-if="isLocked">
        <h3 class="card-title">Enter Password</h3>
        <form @submit.prevent="enterPassRoom">
          <div class="form-group">
            <input
              placeholder="Password Here"
              autofocus
              type="password"
              large
              v-model="password"
            />
          </div>
          <button class="btn btn-primary" text="Enter">
            Enter
          </button>
        </form>
      </div>

      <!-- MODAL CREATE ROOM -->
      <!-- <Dialog v-else class="border border-success">
        <h3 class="card-title">New Room</h3>
        <form @submit.prevent="createRoom">
          <div class="form-group">
            <label for="room-name-input">Room Name</label>
            <input
              autofocus
              large
              type="text"
              id="room-name-input"
              maxLength="20"
              placeholder="Maximum length = 20"
              v-model="roomName"
              required
            />
          </div>
          <div class="form-group">
            <label for="password-input">Input Password</label>
            <input
              type="password"
              v-model="roomPassword"
              id="password-input"
              placeholder="The longer, the more secure"
            />
          </div>
          <button type="submit" class="row flex-center">
            Create
          </button>
        </form>
      </Dialog> -->
      <div v-else class="border border-success">
        <h3 class="card-title">New Room</h3>
        <form @submit.prevent="createRoom">
          <div class="form-group">
            <label for="room-name-input">Room Name</label>
            <input
              autofocus
              large
              type="text"
              id="room-name-input"
              maxLength="20"
              placeholder="Maximum length = 20"
              v-model="roomName"
              required
            />
          </div>
          <div class="form-group">
            <label for="password-input">Input Password</label>
            <input
              type="password"
              v-model="roomPassword"
              id="password-input"
              placeholder="The longer, the more secure"
            />
          </div>
          <button type="submit" class="row flex-center">
            Create
          </button>
        </form>
      </div>

      <!-- <div class="margin-large container-height border">
        <div class="row flex-spaces btn-lobby">
          <Button
            class="margin"
            icon="new-object"
            text="Create New Room"
            :intent="success"
            @click="openModal('create-room')"
          />
          <Button
            class="margin"
            icon="refresh"
            text="Refresh"
            intent="none"
            @click="refreshRooms"
          />
          <div class="margin form-group">
            <input
              type="text"
              v-model.lazy="searchKeyword"
              placeholder="Search Room Number"
              id="paperInputs1"
            />
          </div>
        </div>
        <div class="rooms">
          <div v-if="rooms.length === 0">
            <NonIdealState
              icon="cross"
              title="No Room Available"
              description="Create a new room and tell your friends and mates to join the game"
            />
          </div>
          <div v-else>
            <div v-for="(room, index) in rooms" :key="index">
              <Card class="room-card border" @click="handleRoomEnter(room)">
                <Icon icon="user"></Icon>
                <span v-if="room.password && room.password.length > 0">
                  <Icon icon="lock" :size="1" intent="warning"></Icon>
                </span>
                <h6 class="card-subtitle">#{{ room.roomNumber }}</h6>
                <h5 class="card-title">{{ room.roomName }}</h5>
              </Card>
            </div>
          </div>
        </div>
      </div> -->
      <div class="margin-large container-height border">
        <div class="row flex-spaces btn-lobby">
          <button
            class="margin"
            icon="new-object"
            @click="openModal('create-room')"
          >
            Create New Room
          </button>
          <button class="margin" icon="refresh" @click="refreshRooms">
            Refresh
          </button>
          <div class="margin form-group">
            <input
              type="text"
              v-model.lazy="searchKeyword"
              placeholder="Search Room Number"
              id="paperInputs1"
            />
          </div>
        </div>
        <div class="rooms">
          <div v-if="rooms.length === 0">
            <div>
              <h3>No Room Available</h3>
              <p>Create a new room and tell your friends to join the game</p>
            </div>
          </div>
          <div v-else>
            <div v-for="(room, index) in rooms" :key="index">
              <div class="room-card border" @click="handleRoomEnter(room)">
                <span icon="user"></span>
                <span v-if="room.password && room.password.length > 0">
                  <span icon="lock"></span>
                </span>
                <h6 class="card-subtitle">#{{ room.roomNumber }}</h6>
                <h5 class="card-title">{{ room.roomName }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import "./style.css";
// import "papercss/dist/paper.css";
// import "papercss/dist/paper.min.css";
// import {
//   Button,
//   Icon,
//   NonIdealState,
//   Card,
//   Dialog,
//   Alert,
//   Spinner,
//   Overlay
// } from "@blueprintjs/core";

export default {
  name: "Lobby",
  watch: {
    searchKeyword(val) {
      console.log(val);
    }
  },
  data() {
    return {
      loading: false,
      rooms: [],
      playerId: null,
      openForm: null,
      roomName: "",
      roomPassword: "",
      password: "",
      openPass: "",
      passEntry: "",
      openAlert: "",
      searchKeyword: "",
      isError: false,
      isLocked: false
    };
  },
  // components: {
  //   Button,
  //   Icon,
  //   NonIdealState,
  //   Card,
  //   Dialog,
  //   Alert,
  //   Spinner,
  //   Overlay
  // },
  methods: {
    async enterPassRoom() {
      if (this.password === this.passEntry) {
        // if join
        console.log("go to /room");
      } else {
        console.log("open alert password wrong");
      }
    },
    async createRoom() {
      const newRoom = {
        roomName: this.roomName,
        password: this.password,
        playerId: this.playerId
      };
      console.log(newRoom);
    },
    openModal(name) {
      console.log(name);
    },
    async refreshRooms() {
      console.log("refresh");
    },
    async handleRoomEnter(room) {
      console.log(room);
    }
  }
};
</script>

<style lang="scss" scoped></style>
