<template>
  <div class="board">
    <div class="main">
      <div class="avatarboard">
        <div style="display: flex; justifyContent: center">
          <div class="circle">
            <label class="paper-btn margin" for="modal-1">
              <img :src="useAvatar" alt="" style="width: 80%" />
            </label>
          </div>
          <input class="modal-state" id="modal-1" type="checkbox" />
          <div class="modal">
            <label class="modal-bg" for="modal-1"></label>
            <div class="modal-body">
              <label class="btn-close" for="modal-1" style="cursor: pointer">
                X
              </label>
              <h4 class="modal-title">Modal Title</h4>
              <div class="table">
                <div v-for="(avatar, index) in avatars" :key="index">
                  <label for="modal-1">
                    <div
                      class="card card-avatar"
                      @click="selectAvatar(avatar.src)"
                    >
                      <div class="card-body">
                        <img
                          :src="avatar.src"
                          alt=""
                          width="15%"
                          style="cursor: pointer"
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style="display: flex; flexDirection: column; alignItems: center; margin: 20px"
        >
          <label for="inputName">Name</label>
          <input
            type="text"
            id="inputName"
            placholder="name 24434"
            @keyup.enter="login"
            v-model="name"
          />
          <button style="margin: 20px" @click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import "../../../node_modules/papercss/dist/paper.css";

export default {
  name: "LandingPage",
  data() {
    return {
      name: "",
      useAvatar: "",
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
    async login() {
      const playerData = {
        name: this.name,
        avatar: this.useAvatar
      };
      console.log(playerData);
      this.$router.push("/lobby");
    },
    selectAvatar(avatar) {
      console.log(avatar);
      this.useAvatar = avatar;
    }
  },
  async created() {
    this.useAvatar = this.avatars[0].src;
  }
};
</script>

<style lang="scss" scoped>
.board {
  display: "flex";
  justify-content: "center";
  align-items: "center";
  height: "969px";
  background-color: "rgb(216, 227, 231)";
}

.main {
  // backgroundColor: 'cadetblue',
  background-image: "url(https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-031.jpg)";
  width: "60%";
  height: "60%";
  display: "flex";
  justify-content: "center";
  // borderRadius: '50px',
  border-bottom-left-radius: "15px 255px";
  border-bottom-right-radius: "225px 15px";
  border-top-left-radius: "255px 15px";
  border-top-right-radius: "15px 225px";
  align-items: "center";
  box-shadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
}

.avatarboard {
  margin-bottom: "80px";
  margin-top: "60px";
  display: "flex";
  flex-direction: "column";
  justify-content: "center";
  align-items: "center";
  font-family: '"Patrick Hand SC",sans-serif';
}
</style>
