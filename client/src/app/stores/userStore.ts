import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../Models/User";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction("login action", () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      history.replace("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action logout = async () => {
    this.rootStore.commonStore.clearToken();
    this.user = null;
    history.replace("/");
  };
}
