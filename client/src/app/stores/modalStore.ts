import { RootStore } from "./rootStore";
import { observable, action } from "mobx";
import { ModalProps } from "semantic-ui-react";

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  // shallow so that observable doesnt try to observe body, which can be a react component
  @observable.shallow modal: ModalProps = {
    open: false,
    body: null,
    size: "mini",
    title: ""
  };

  @action openModal = (
    content: any,
    size: "mini" | "tiny" | "small" | "large" | "fullscreen" = "mini",
    title?: string
  ) => {
    this.modal.open = true;
    this.modal.body = content;
    this.modal.size = size;
    this.modal.title = title;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
    this.modal.title = "";
  };
}
