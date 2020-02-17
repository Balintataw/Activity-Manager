import { createContext } from "react";
import { configure } from "mobx";
import ActivityStore from "./activityStore";
import ProfileStore from "./profileStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {
  activityStore: ActivityStore;
  profileStore: ProfileStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  userStore: UserStore;

  constructor() {
    this.activityStore = new ActivityStore(this);
    this.profileStore = new ProfileStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
    this.userStore = new UserStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
