<template>
  <div>
    <div v-if="isLoading">
      <!-- LOADING -->
      <div>
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>
    </div>
    <div v-else>
      <div class="md-layout md-gutter md-alignment-center-center">
        <div
          class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100"
        >
          <button class="margin" @click="isCreate = !isCreate">
            {{ $t("createRoom.btnCreate") }}
          </button>
          <button class="margin" @click="refreshRooms">
            {{ $t("createRoom.btnRefresh") }}
          </button>
          <div class="margin form-group">
            <input
              type="text"
              v-model.lazy="searchKeyword"
              :placeholder="$t('createRoom.placeholderSearch')"
            />
          </div>
        </div>
        <div
          class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100"
        >
          <div v-if="rooms.length === 0">
            <div>
              <h3>{{ $t("createRoom.noRoomTitle") }}</h3>
              <p>{{ $t("createRoom.noRoomParagraph") }}</p>
            </div>
          </div>
          <div v-else>
            <div v-for="(room, index) in rooms" :key="index">
              <div @click="enterRoom(room)" style="cursor: pointer">
                <md-card>
                  <md-card-header
                    ><div class="md-title">
                      #{{ room.roomNumber }}
                    </div></md-card-header
                  >
                  <md-card-content>
                    <span v-if="room.password && room.password.length > 0">
                      <span>LOCKED</span>
                    </span>
                    <h4>{{ room.roomName }}</h4>
                  </md-card-content>
                </md-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL ERROR -->
    <div>
      <md-dialog-alert
        :md-active-sync="isError"
        md-title="Error"
        md-content="Incorrect Password"
        md-confirm-text="Try Again"
      />
    </div>

    <!-- MODAL ENTER PASSWORD -->
    <div>
      <md-dialog :md-active.sync="isLocked">
        <md-dialog-title>Enter Password</md-dialog-title>
        <input
          placeholder="Password Here"
          autofocus
          type="password"
          v-model="passEntry"
          @keyup.enter="onConfirm"
        />
        <div v-if="isErrorPassEntry">
          <p style="color: red">Incorrect Password</p>
        </div>
        <md-dialog-actions>
          <md-button class="md-primary" type="submit" @click="onConfirm">
            Submit
          </md-button>
          <md-button class="md-primary" @click="onCancel">
            Cancel
          </md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>

    <!-- MODAL CREATE ROOM -->
    <div>
      <md-dialog :md-active.sync="isCreate">
        <md-dialog-title>{{
          $t("createRoom.dialogCreate.title")
        }}</md-dialog-title>
        <div class="form-group">
          <label>{{ $t("createRoom.dialogCreate.name") }}</label>
          <input
            autofocus
            large
            type="text"
            maxLength="20"
            placeholder="Maximum length = 20"
            v-model="roomName"
            required
          />
        </div>
        <div class="form-group">
          <label>{{ $t("createRoom.dialogCreate.password") }}</label>
          <input
            type="password"
            v-model="roomPassword"
            placeholder="The longer, the more secure"
          />
        </div>
        <md-dialog-actions>
          <md-button class="md-primary" type="submit" @click="createRoom">
            Create
          </md-button>
          <md-button class="md-primary" @click="isCreate = !isCreate">
            Cancel
          </md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import socket from "../Room/socket";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Lobby",
  watch: {
    searchKeyword(val) {
      console.log(val);
    }
  },
  computed: {
    ...mapGetters(["isLoading", "playerName", "avatar", "playerId", "rooms"])
  },
  data() {
    return {
      roomName: "",
      roomPassword: "",
      password: "",
      passEntry: "",
      isErrorPassEntry: false,
      searchKeyword: "",
      isError: false,
      isLocked: false,
      isCreate: false
    };
  },
  methods: {
    ...mapActions(["fetchRooms", "postRooms", "joinRoom"]),
    ...mapMutations(["SET_PLAYERID"]),
    closeModal() {
      this.isCreate = false;
      this.isLocked = false;
      this.isError = false;
    },
    async createRoom() {
      const newRoom = {
        roomName: this.roomName,
        password: this.roomPassword,
        playerId: this.playerId
      };
      const data = await this.postRooms(newRoom);
      this.roomPassword = "";
      this.roomName = "";
      this.closeModal();
      if (data) {
        const payload = {
          roomNumber: data.roomNumber,
          playerId: data.playerId
        };
        socket.emit("room has been created");
        socket.emit("join room", payload);
        localStorage.setItem("roomId", data.roomNumber);
        this.$router.replace("/room");
      }
    },
    async refreshRooms() {
      await this.fetchRooms();
    },
    async enterRoom(room) {
      if (room.password) {
        this.isLocked = true;
        this.password = room.password;
      } else {
        const payload = {
          id: room.roomNumber,
          playerId: this.playerId
        };
        const data = await this.joinRoom(payload);
        // axios enter room
        if (data) {
          console.log(data, "enter room");
          const room = { roomNumber: data.roomNumber, playerId: this.playerId };
          socket.emit("join room", room);
          localStorage.setItem("roomId", data.roomNumber);
          this.$router.replace("/room");
        }
      }
    },
    onCancel() {
      this.passEntry = "";
      this.isErrorPassEntry = false;
      this.closeModal();
    },
    onConfirm() {
      if (this.passEntry === this.password) {
        // axios enter room
        this.passEntry = "";
        this.isErrorPassEntry = false;
        this.closeModal();
        this.$router.replace("/room");
      } else {
        this.isErrorPassEntry = true;
      }
    }
  },
  async created() {
    await this.fetchRooms();
    const playerId = localStorage.getItem("g-a-player-data");
    if (playerId) {
      this.SET_PLAYERID(playerId);
    }

    socket.on("room has been created", () => {
      this.fetchRooms();
    });

    socket.on("all players has left room", () => {
      this.fetchRooms();
    });
  }
};
</script>

<style lang="scss" scoped></style>
