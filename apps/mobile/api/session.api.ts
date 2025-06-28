import API from "~/lib/axios-client";

export const getSessionQueryFunction = async () => await API.get("/session/");
