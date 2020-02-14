import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable token: string | null = null;
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    window.localStorage.setItem("jwt", token!);
    this.token = token;
  };

  @action clearToken = () => {
    window.localStorage.removeItem("jwt");
    this.token = null;
  };

  @action setAppLoaded = () => (this.appLoaded = true);
}
