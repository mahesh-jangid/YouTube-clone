// ------------------------------ Searchbar for Small Device-----------------------------------//

const search_button = document.querySelector(".search button");
const nav = document.querySelector("nav");
const previous = nav.querySelector(".previous");

search_button.addEventListener("click", () => {
  if (window.innerWidth <= 660) {
    nav.classList.add("open");
  }
});
previous.addEventListener("click", () => {
  nav.classList.remove("open");
});
window.onresize = function (event) {
  if (window.innerWidth > 660) {
    nav.classList.remove("open");
  }
};

// ------------------------------ End of Searchbar for Small Device-----------------------------------//
let API_KEY = "AIzaSyAjQhmvgUl_gT3Tz8wk06-E4sERAaBqoaY";

//THIS IS FOR WHEN USE CLICK ANTHOR PAGE VIDEO FOR SEARCH
var watchvideo = localStorage.getItem("valueFromWatchvideo");
if (watchvideo != null) {
  SearchVideo("wachfromvideo");
  localStorage.removeItem("valueFromWatchvideo");
}

//SHOW MOST POPULAR VIDEOS
var url = `https://www.googleapis.com/youtube/v3/videos/?part=snippet&chart=mostPopular&regionCode=IN&maxResults=32&key=${API_KEY}`;
getData(url, "videos");

//SEARCH VIDEOS FUNCTION (IF PARAMETER IS SEARCHLIST MEAN IS IT FORM CURRENT PAGE SEARCH || IF PARAMETER IS WACTHFORMVIDEO MEAN IS IS FORM ANTHOR PAGE SEARCH)
function SearchVideo(search) {
  if (search == "searchlist") {
    video_name = document.querySelector("#video_search").value;
    url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${video_name}&type=video&key=${API_KEY}`;
  } else if (search == "wachfromvideo") {
    url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${watchvideo}&type=video&key=${API_KEY}`;
  }
  document.querySelector(".video_container").classList.add("search_container");
  getData(url, "search");
}

//GET THE RESPONSE DATA
function getData(url, editdisplaycontent) {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      showVideos(res.items, editdisplaycontent);
    })
    .catch((err) => {
      console.log(err);
    });
}

//SHOW VIDEO FUNCTION ON HTML (THE SECOND PARAMETER IS DESCRIBE FOR SEARCH VIDEOS SHOW APPEND DIFFENTLY )
let showVideos = (items, editdisplaycontent) => {
  console.log(items);
  document.querySelector(".video_container").innerHTML = "";
  items.map((item) => {
    var div = document.createElement("div");

    var videoImg = document.createElement("img");
    videoImg.setAttribute("class", "thmblinails");
    videoImg.src = item.snippet.thumbnails.medium.url;

    var title_and_Profile = document.createElement("div");
    title_and_Profile.setAttribute("class", "title_and_Profile");

    var divTitle = document.createElement("div");
    var title = document.createElement("p");
    title.innerText = item.snippet.title;

    var profile = document.createElement("img");

    var channelName = document.createElement("span");
    channelName.innerText = item.snippet.channelTitle;

    var views = document.createElement("span");

    //GETTING CHANNEL PROFILE IMG AND VIWES VIDEOS
    var channelicon = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${API_KEY}&id=${item.snippet.channelId}`;
    fetch(channelicon)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        channel_Img = res.items[0].snippet.thumbnails.medium.url;
        profile.src = channel_Img;
        viewvideo = res.items[0].statistics.viewCount;
        if (viewvideo >= 1000 && viewvideo < 1000000) {
          views.innerText = Math.floor(viewvideo / 1000) + "K views";
        } else if (viewvideo >= 1000000 && viewvideo < 1000000000) {
          views.innerText = Math.floor(viewvideo / 1000000) + "M views";
        } else if (viewvideo >= 1000000000 && viewvideo < 1e12) {
          views.innerText = Math.floor(viewvideo / 1000000000) + "B views";
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //THIS IS FOR WANTED TO APPEND DIFF DIFF FOR SEARCH RESULT AND DEFAULT VIDEOS
    if (editdisplaycontent == "search") {
      var searchDivChannel = document.createElement("div");
      var searchdes = document.createElement("p");
      searchdes.innerText = item.snippet.description;
      searchDivChannel.append(profile, channelName);
      divTitle.append(title, views, searchDivChannel, searchdes);
      title_and_Profile.append(divTitle);
    } else {
      divTitle.append(title, channelName, views);
      title_and_Profile.append(profile, divTitle);
    }

    div.append(videoImg, title_and_Profile);

    document.querySelector(".video_container").append(div);

    //THIS FOR SHOW CLICKED VIDEO TO ANTHOR PAGE
    div.addEventListener("click", function () {
      getVideo(item, items);
    });
  });
};

function getVideo(item, items) {
  localStorage.setItem("mainVideo", JSON.stringify(item));
  localStorage.setItem("relatedVideo", JSON.stringify(items));
  window.location.href = "showvideo.html";
}

//TOGGLE SIDE MENU
function sidemenusmall() {
  document.querySelector(".container").classList.toggle("small_menu");
  document
    .querySelector(".subscriptions-links ul li")
    .classList.toggle(".search_container");
}
