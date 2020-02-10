import { createContext, SyntheticEvent } from "react";
import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../Models/Activity";
import agent from "../api/agent";
import { AxiosError } from "axios";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  // @observable activities: IActivity[] = [];
  @observable activity: IActivity | null = null;
  @observable target = "";
  @observable loading = false;
  @observable submitting = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate = (activities: IActivity[]) => {
    const sortedActivities = activities
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  };

  @action loadActivities = async () => {
    this.loading = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loadActivities", () => {
        activities.forEach(a => {
          a.date = a.date.split(".")[0];
          this.activityRegistry.set(a.id, a);
        });
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
    let ac = this.getActivity(id);
    if (ac) {
      this.activity = ac;
    } else {
      this.loading = true;
      try {
        ac = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          this.activity = ac;
          this.loading = false;
        });
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
      runInAction("createActivity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      const e = error as AxiosError;
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
    } catch (error) {
      const e = error as AxiosError;
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
}

export default createContext(new ActivityStore());
