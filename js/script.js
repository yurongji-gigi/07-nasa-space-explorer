const button = document.querySelector(".filters button");
const startInput = document.querySelector("#startDate");
const endInput = document.querySelector("#endDate");
const gallery = document.querySelector("#gallery");

button.addEventListener("click", async () => {
  const start = startInput.value;
  const end = endInput.value;

  if (!start || !end || start > end) {
    gallery.textContent = "Please select a valid date range.";
    return;
  }

  const params = new URLSearchParams({
    date_from: start.slice(2).replaceAll("-", ""),
    date_to: end.slice(2).replaceAll("-", ""),
  });

  gallery.textContent = "Loading space photos…";

  try {
    const response = await fetch(
      `https://science.nasa.gov/wp-json/wp/v2/apod-basic?${params}`
    );

    if (!response.ok) {
      throw new Error(`NASA API returned ${response.status}`);
    }

    const data = await response.json();
gallery.replaceChildren();

for (const entry of data) {
  const item = entry.meta ?? entry;
  const card = document.createElement("article");
  card.className = "space-card";

  const title = document.createElement("h2");
  title.textContent = item.title;

  const date = document.createElement("p");
  date.textContent = item.date;

  if (item.media_type === "image" && item.hdurl) {
    const image = document.createElement("img");
    image.src = item.hdurl;
    image.alt = item.title;
    image.loading = "lazy";
    const photoButton = document.createElement("button");
photoButton.type = "button";
photoButton.className = "photo-button";
photoButton.setAttribute("aria-label", `Open details for ${item.title}`);
photoButton.append(image);

photoButton.addEventListener("click", () => {
  const dialog = document.querySelector("#photoDialog");
  const largeImage = document.querySelector("#photoImage");

  document.querySelector("#photoTitle").textContent = item.title;
  document.querySelector("#photoDate").textContent = item.date;
  const explanation = document.createElement("template");
explanation.innerHTML = item.explanation || "";

document.querySelector("#photoExplanation").textContent =
  explanation.content.textContent.trim() ||
  "No explanation is available for this image.";

  largeImage.src = item.hdurl;
  largeImage.alt = item.title;
  const ganymede = document.querySelector("#ganymede3D");
ganymede.hidden = item.date !== "2014-09-19";
ganymede.open = false;
  dialog.showModal();
});

card.append(photoButton);
  } else if (item.url) {
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = "View on NASA";
    card.append(link);
  }

  card.append(title, date);
  gallery.append(card);
}

if (data.length === 0) {
  gallery.textContent = "No NASA entries found for these dates.";
}
  } catch (error) {
    console.error(error);
    gallery.textContent = "Could not load NASA data. Please try again.";
  }
});
const spaceFacts = [
  "A day on Venus lasts longer than a year on Venus.",
  "Sunlight takes about eight minutes to reach Earth.",
  "Mars has two moons, Phobos and Deimos.",
  "Jupiter is the largest planet in our solar system."
];

const randomIndex = Math.floor(Math.random() * spaceFacts.length);

document.querySelector("#spaceFact").textContent = spaceFacts[randomIndex];
const motionItems = {
  galaxy: {
    title: "Galactic Center 360°",
    embed: "https://www.youtube.com/embed/YKzxmeABbkU",
    source: "https://www.youtube.com/watch?v=YKzxmeABbkU"
  },
  eyes: {
    title: "Jupiter in 3D · NASA Eyes",
    embed: "https://eyes.nasa.gov/apps/solar-system/#/jupiter?time=1997-11-11T03:27:15.513+00:00&rate=0",
    source: "https://eyes.nasa.gov/apps/solar-system/#/jupiter"
  },
  rotation: {
    title: "Jupiter Rotation · NASA Goddard SVS",
    video: "https://svs.gsfc.nasa.gov/vis/a000000/a003600/a003609/rotation_jupiter_1024x1024.mp4",
    source: "https://svs.gsfc.nasa.gov/3609/"
  }
};

const motionDialog = document.querySelector("#motionDialog");
const motionPlayer = document.querySelector("#motionPlayer");

document.querySelectorAll("[data-motion]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = motionItems[button.dataset.motion];

    document.querySelector("#motionTitle").textContent = item.title;
    document.querySelector("#motionSource").href = item.source;

    const player = document.createElement(item.video ? "video" : "iframe");

    if (item.video) {
      player.src = item.video;
      player.controls = true;
      player.loop = true;
      player.playsInline = true;
    } else {
      player.src = item.embed;
      player.title = item.title;
      player.allowFullscreen = true;
      player.referrerPolicy = "strict-origin-when-cross-origin";
    }

    motionPlayer.replaceChildren(player);
    motionDialog.showModal();
  });
});

motionDialog.addEventListener("close", () => {
  motionPlayer.replaceChildren();
});