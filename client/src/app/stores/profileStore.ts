import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto } from "../Models/Profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction("load profile", () => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction("load profile error", () => {
        this.loadingProfile = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction("upload photo", () => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      this.uploadingPhoto = false;
      toast.error("Problem uploading photo");
      runInAction("upload photo error", () => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction("set main photo", () => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(p => p.isMain)!.isMain = false;
        this.profile!.photos.find(p => p.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
        return;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction("set main photo error", () => {
        this.loading = false;
      });
      return;
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction("delete photo", () => {
        this.profile!.photos = this.profile!.photos.filter(
          p => p.id !== photo.id
        );
        this.loading = false;
      });
      return;
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction("delete photo error", () => {
        this.loading = false;
      });
      return;
    }
  };

  @action updateProfile = async (profile: IProfile) => {
    this.loading = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction("update profile", () => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
        toast.success("Success");
      });
      return profile;
    } catch (error) {
      toast.error("Problem updating profile");
      return profile;
    }
  };
}
