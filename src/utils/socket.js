import io from "socket.io-client";

const socket = (route = "", options = null) => {
  return io.connect(`${process.env.VUE_APP_BASEURL}/${route}`, options);
};

export default socket;
