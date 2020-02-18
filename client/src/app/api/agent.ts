import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IActivity } from "../Models/Activity";
import { history } from "../..";
import { IUser, IUserFormValues } from "../Models/User";
import { IProfile, IPhoto } from "../Models/Profile";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, error => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error");
  }
  const { status, data, config, statusText } = error.response;
  if (status === 404) {
    history.push("/not_found");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/not_found");
  }
  if (status === 500) {
    toast.error(`Error - ${statusText}`);
  }
  throw error.response;
});

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const responseBody = (response: AxiosResponse) => response.data;

// const sleep = (ms: number) => (response: AxiosResponse) =>
//   new Promise<AxiosResponse>(resolve =>
//     setTimeout(() => resolve(response), ms)
//   );

const requests = {
  get: (url: string) =>
    axios
      .get(url)
      // .then(sleep(1500))
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      // .then(sleep(1500))
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body)
      // .then(sleep(1500))
      .then(responseBody),
  delete: (url: string) =>
    axios
      .delete(url)
      // .then(sleep(1500))
      .then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" }
      })
      .then(responseBody);
  }
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string): Promise<IActivity> =>
    requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.delete(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/register`, user)
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    requests.put(`/profiles`, profile),
  follow: (username: string) =>
    requests.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) =>
    requests.delete(`/profiles/${username}/follow`),
  lostFollowings: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/follow?predicate=${predicate}`)
};

export default { Activities, User, Profiles };
