import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: "eng",
  messages: {
    eng: {
      landingPage: {
        title: "Change Avatar",
        name: "Name",
        placeholder: "Write your name here"
      },
      createRoom: {
        btnCreate: "Create new room",
        btnRefresh: "Refresh",
        placeholderSearch: "Search room number",
        noRoomTitle: "No Room Available",
        noRoomParagraph:
          "Create a new room and tell your friends to join the game",
        dialogCreate: {
          title: "Create a room",
          name: "Room name",
          password: "Room password"
        }
      }
    },
    id: {
      landingPage: {
        title: "Ganti Avatar",
        name: "Nama",
        placeholder: "Tulis namamu disini"
      },
      createRoom: {
        btnCreate: "Buat ruang baru",
        btnRefresh: "Muat ulang",
        placeholderSearch: "Cari nomor ruang",
        noRoomTitle: "Tidak ada ruangan tersedia",
        noRoomParagraph:
          "Buat ruangan baru dan beritahu teman-temanmu untuk bergabung kedalam game",
        dialogCreate: {
          title: "Buat ruang baru",
          name: "Nama",
          password: "Kata sandi"
        }
      }
    }
  }
});
