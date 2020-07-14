import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const i18n = new VueI18n({
  messages: {
    eng: {
      message: {}
    },
    id: {
      message: {}
    }
  }
});

const setLocale = locale => {
  if (locale === undefined) {
    i18n.locale = window.localStorage.language || "en";
  } else {
    i18n.locale = locale;
  }

  try {
    window.localStorage.language = i18n.locale;
  } catch (error) {
    // eslint-disable-next-line
		console.error(error)
  }
};

export default {
  i18n,
  setLocale
};
