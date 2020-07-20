<template>
  <div class="md-layout md-gutter md-alignment-center-center">
    <div class="md-alignment-center-center">
      <div style="max-width: 300px">
        <img :src="selectedAvatar" alt="" style="width: 80%" />
        <md-button @click="showDialog = !showDialog">{{
          $t("landingPage.title")
        }}</md-button>
      </div>

      <div
        style="display: flex; flexDirection: column; alignItems: center; margin: 20px"
      >
        <label style="color: white">{{ $t("landingPage.name") }}</label>
        <input
          type="text"
          :placeholder="$t('landingPage.placeholder')"
          @keyup.enter="login"
          v-model="name"
        />
        <md-button class="md-raised md-primary btn-login" @click="login"
          >Login</md-button
        >
      </div>
    </div>

    <!-- MODAL CHOOSE AVATAR -->
    <md-dialog :md-active.sync="showDialog">
      <div
        class="md-medium-size-33 md-small-size-100 md-xsmall-size-100"
        style="padding: 20px; width: 100%"
      >
        <div>
          <md-dialog-title>CHOOSE YOUR AVATAR</md-dialog-title>
        </div>
        <div style="display: flex">
          <div
            v-for="(item, index) in avatars"
            :key="index"
            style="text-align: center;"
          >
            <md-card>
              <md-card-media>
                <img
                  :src="item.src"
                  alt=""
                  width="50%"
                  style="cursor: pointer"
                  @click="selectAvatar(item.src)"
                  :style="
                    item.src === selectedAvatar ? 'background-color: white' : ''
                  "
                />
              </md-card-media>
            </md-card>
          </div>
        </div>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="cancelChoose">Cancel</md-button>
        <md-button class="md-primary" @click="applyAvatar">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "LandingPage",
  computed: {
    ...mapGetters(["playerName", "usedAvatar"])
  },
  data() {
    return {
      name: "",
      selectedAvatar: "",
      showDialog: false,
      avatars: [
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-chameleon.png")
        },
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-bear.png")
        },
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-cat.png")
        },
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-panda.png")
        },
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-snake.png")
        },
        {
          src: require("../../assets/avatar/gambar-ayo-avatar-squirrel.png")
        }
      ]
    };
  },
  methods: {
    ...mapActions(["postPlayer"]),
    ...mapMutations(["SET_AVATAR", "SET_PLAYERID"]),
    async login() {
      const playerData = {
        name: this.name,
        avatar: this.usedAvatar
      };
      const { playerId } = await this.postPlayer(playerData);
      if (playerId) {
        localStorage.setItem("g-a-player-data", playerId);
        this.SET_PLAYERID(playerId);
        this.$router.push("/lobby");
      }
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    applyAvatar() {
      this.SET_AVATAR(this.selectedAvatar);
      this.showDialog = !this.showDialog;
    },
    cancelChoose() {
      this.showDialog = !this.showDialog;
      this.selectedAvatar = this.usedAvatar;
    }
  },
  async created() {
    this.selectedAvatar = this.avatars[0].src;
    this.SET_AVATAR(this.avatars[0].src);
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  box-shadow: none;
}

.md-card:hover {
  background-color: white;
}

.btn-login {
  margin-top: 20px;
  border-radius: 3px;
}
</style>
