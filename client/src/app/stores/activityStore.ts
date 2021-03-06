import { SyntheticEvent } from "react";
import { AxiosError } from "axios";
import {
  observable,
  action,
  computed,
  runInAction,
  reaction,
  toJS
} from "mobx";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";
import { toast } from "react-toastify";
import { IActivity } from "../Models/Activity";
import agent from "../api/agent";
import { history } from "../..";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/util/util";

const LIMIT = 3;

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable target = "";
  @observable loading = false;
  @observable submitting = false;
  @observable working = false;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  groupActivitiesByDate = (activities: IActivity[]) => {
    const sortedActivities = activities
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  };

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  @action loadActivities = async () => {
    this.loading = true;
    try {
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction("loadActivities", () => {
        activities.forEach(activity => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
      });
    } catch (error) {
      const e = error as AxiosError;
      console.error(e);
    } finally {
      runInAction("loadActivities complete", () => {
        this.loading = false;
      });
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      // toJS convert an observable to a javascript object
      return toJS(activity);
    } else {
      this.loading = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loading = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loading = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      activity.isHost = true;
      activity.comments = [];
      activity.attendees = [attendee];
      runInAction("createActivity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      const e = error as AxiosError;
      toast.error("Problem submitting data");
      console.error(e);
    } finally {
      runInAction("createActivity complete", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editActivity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      const e = error as AxiosError;
      toast.error("Problem submitting data");
      console.error(e);
    } finally {
      runInAction("editActivity complete", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.target = event.currentTarget.name;
      this.submitting = true;
      await agent.Activities.delete(id);
      runInAction("deleteActivity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      const e = error as AxiosError;
      console.error(e);
    } finally {
      runInAction("deleteActivity complete", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.working = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction("attend activity", () => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.working = false;
        }
      });
    } catch (error) {
      toast.error("Problem signing up to activity");
      runInAction("attend activity error", () => {
        this.working = false;
      });
    }
  };

  @action cancelAttendance = async () => {
    this.working = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction("cancel attendance action", () => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.working = false;
        }
      });
    } catch (error) {
      toast.error("Problem cancelling attendance");
      runInAction("cancel attendance error", () => {
        this.working = false;
      });
    }
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_BASE_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started", this.hubConnection!.state))
      .then(() => {
        console.log("Attempting to join group:", activityId);
        // "AddToGroup" must match methid in ChatHub
        setTimeout(() => {
          this.hubConnection!.invoke("AddToGroup", activityId);
        }, 100);
      })
      .catch(error => console.log("Error connecting signalr", error));

    this.hubConnection.on("ReceiveComment", comment => {
      runInAction("receive comment", () => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", message => {
      // toast.info(message);
    });
  };

  @action stopHubConnection = (activityId: string) => {
    this.hubConnection!.invoke("RemoveFromGroup", activityId)
      .then(() => {
        return this.hubConnection!.stop();
      })
      .then(() => console.log("Connection Stopped"))
      .catch(error => console.log("Stop connection error:", error));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      // "SendComment" needs to match what is in ChatHub.cs
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };
}
