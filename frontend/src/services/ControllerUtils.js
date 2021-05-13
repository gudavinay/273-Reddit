const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const randomColors = [
  "A5A4A4",
  "545452",
  "A06A42",
  "C18D42",
  "FF4500",
  "FF8717",
  "FFB000",
  "FFD635",
  "DDBD37",
  "D4E815",
  "94E044",
  "46A508",
  "46D160",
  "0DD3BB",
  "25B79F",
  "008985",
  "24A0ED",
  "0079D3",
  "7193FF",
  "4856A3",
  "7E53C1",
  "FF66AC",
  "DB0064",
  "EA0027",
  "FF585B",
];
const avatarStyle = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

export function getUserProfile() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data;
}

export function sortByPost(array, type) {
  let sortValue;
  if (type == "desc") {
    sortValue = array.sort((a, b) => {
      return parseInt(b.NoOfPost) - parseInt(a.NoOfPost);
    });
  } else {
    sortValue = array.sort((a, b) => {
      return parseInt(a.NoOfPost) - parseInt(b.NoOfPost);
    });
  }
  return sortValue;
}

export function sortByTime(array, type) {
  let sortvalue;
  if (type == "desc") {
    sortvalue = array.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else {
    sortvalue = array.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }
  return sortvalue;
}

export function sortByComments(array, type) {
  let sortValue;
  if (type == "desc") {
    sortValue = array.sort((a, b) => {
      return new Date(b.NoOfComments) - new Date(a.NoOfComments);
    });
  } else {
    sortValue = array.sort((a, b) => {
      return new Date(a.NoOfComments) - new Date(b.NoOfComments);
    });
  }
  return sortValue;
}
export function sortByNoOfUser(array, type) {
  let sortValue;
  if (type == "desc") {
    sortValue = array.sort((a, b) => {
      return (
        parseInt(b.acceptedUsersSQLIds.length) -
        parseInt(a.acceptedUsersSQLIds.length)
      );
    });
  } else {
    sortValue = array.sort((a, b) => {
      return (
        parseInt(a.acceptedUsersSQLIds.length) -
        parseInt(b.acceptedUsersSQLIds.length)
      );
    });
  }
  return sortValue;
}

export function getEntityVoteDir(entityId) {
  const votes = JSON.parse(localStorage.getItem("userVote"));
  console.log("votes = ", votes);
  votes.map((vote) => {
    console.log("entitiyID = ", entityId, vote.entityId);
    if (vote.entityId == entityId) {
      return vote.voteDir;
    }
  });
  return 0;
}

export function getToken() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data.token;
}

export function getMongoUserID() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data._id; // to be impl
}

export function getSQLUserID() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data.userIDSQL; // to be impl
}

export function SetLocalStorage(data) {
  if (typeof Storage !== "undefined") {
    localStorage.clear();
    localStorage.setItem("userData", JSON.stringify(data));
  }
}

export function getMonthFromUtils(date) {
  let localDate = new Date(
    new Date(date).setHours(new Date(date).getHours() - 7)
  );
  return months[localDate.getMonth()];
}

export function getDateFromUtils(date) {
  let localDate = new Date(
    new Date(date).setHours(new Date(date).getHours() - 7)
  );
  return localDate.getDate();
}

export function getDefaultRedditProfilePicture() {
  return (
    "https://www.redditstatic.com/avatars/avatar_default_" +
    avatarStyle[Math.floor(Math.random() * avatarStyle.length)] +
    "_" +
    randomColors[Math.floor(Math.random() * randomColors.length)] +
    ".png"
  );
}

export function getRelativeTime(date) {
  if (!date) {
    return null;
  }
  var now = new Date();
  var diff = parseInt((now.getTime() - Date.parse(date)) / 1000);
  if (diff < 60) {
    return "a few seconds ago";
  } else if (diff < 120) {
    return "about a minute ago";
  } else if (diff < 2700) {
    return parseInt(diff / 60).toString() + " minutes ago";
  } else if (diff < 5400) {
    return "about an hour ago";
  } else if (diff < 86400) {
    return "about " + parseInt(diff / 3600).toString() + " hours ago";
  } else if (diff < 172800) {
    return "1 day ago";
  } else {
    return parseInt(diff / 86400).toString() + " days ago";
  }
}

export function nFormatter(num, digits) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
