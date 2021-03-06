import { IActivity, IAttendee } from "../../Models/Activity";
import { IUser } from "../../Models/User";

export const combineDateTime = (date: Date, time: Date) => {
  // const timeString = time.getHours() + ":" + time.getMinutes() + ":00";
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1; // months are zero indexed
  // const day = date.getDate();
  // const dateString = `${year}-${month}-${day}`;

  // ***** Needs to be done as below to appease safari
  const dateString = date.toISOString().split("T")[0];
  const timeString = time.toISOString().split("T")[1];
  return new Date(dateString + "T" + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    attendee => attendee.username === user.username
  );
  activity.isHost = activity.attendees.some(
    attendee => attendee.username === user.username && attendee.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  };
};
