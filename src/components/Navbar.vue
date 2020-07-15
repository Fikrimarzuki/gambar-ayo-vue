<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/lobby">Lobby</router-link> |
    <router-link to="/room">Room</router-link>
    <Language />
  </div>
</template>

<script>
import Language from "./Language";

export default {
  name: "Navbar",
  components: {
    Language
  }
};
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
