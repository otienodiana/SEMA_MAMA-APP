import axios from "axios";

export const getForums = async () => {
  return fetch("/api/community/forums").then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });
};

export const joinForum = async (forumId) => {
  return fetch(`/api/community/forums/${forumId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  });
};

