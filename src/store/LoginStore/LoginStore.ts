import { computed, reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";
import firebase from "firebase/app";
import "firebase/auth";
import { fireBaseUtil } from "@/main";

/**
 * 表示するタグを管理するためのStore
 */
/* eslint-disable class-methods-use-this */
class LoginStore implements StoreBase {
  createStore() {
    const state = reactive({
      user: null as null | firebase.User,
    });

    const isLogin = computed(() => {
      return !!state.user;
    });

    const loadLoginedData = () => {
      state.user = firebase.auth().currentUser;
    };
    const login = async () => {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase.auth().signInWithRedirect(fireBaseUtil.googleAuthProvider);
        });
    };
    const redirectLogin = async () => {
      return firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
          console.log("ログイン成功！！！");
          if (result.credential) {
            const credential = result.credential as firebase.auth.OAuthCredential;
            // ...
          }
          // The signed-in user info.
          state.user = result.user;
        })
        .catch((error) => {
          console.error(error);
          // // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // // The email of the user's account used.
          // var email = error.email;
          // // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential;
        });
    };
    const logout = async () => {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          // An error happened.
        });
    };
    return {
      state,
      login,
      logout,
      redirectLogin,
      loadLoginedData,
      isLogin,
    };
  }
}

const value: ValueType<LoginStore> = {};

export default {
  createStore: new LoginStore().createStore,
  value,
};
