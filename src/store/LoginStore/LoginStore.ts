import { computed, reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";
import firebase from "firebase/app";
import "firebase/auth";
import { fireBaseUtil } from "@/main";

export type AudioData = {
  id: string;
  title: string;
  tag: string[];
  color?: string;
  start: number;
  end: number;
  videoId: string;
  isOwnData?: boolean;
};

/**
 * 表示するタグを管理するためのStore
 */
/* eslint-disable class-methods-use-this */
class LoginStore implements StoreBase {
  createStore() {
    const state = reactive({
      token: undefined as string | undefined,
      user: null as null | firebase.User,
    });

    const isLogin = computed(() => {
      return !!(state.user && state.token);
    });

    const login = async () => {
      await firebase.auth().signInWithRedirect(fireBaseUtil.googleAuthProvider);
    };
    const redirectLogin = async () => {
      return firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
          console.log("ログイン成功！！！");
          if (result.credential) {
            const credential = result.credential as firebase.auth.OAuthCredential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            state.token = credential.accessToken;
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
      isLogin,
    };
  }
}

const value: ValueType<LoginStore> = {};

export default {
  createStore: new LoginStore().createStore,
  value,
};
