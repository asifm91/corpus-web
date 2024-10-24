let audio = document.getElementById("audio_player");
const fragmentContainer = document.getElementById("fragment_container");
fetch("./Laitu_0003.json")
  .then((response) => response.json())
  .then((data) => {
    const fuse = new Fuse(data, {
      keys: ["laituText", "engText"], // Define the search keys
    });

    // Create a function to render the search results
    function renderSearchResults(results) {
      fragmentContainer.innerHTML = ""; // Clear the container

      results.forEach((item, i) => {
        // Extracting the required values
        let { startTime, endTime, laituText, engText } = item;

        // Creating a new div element
        let newDiv = document.createElement("div");
        newDiv.className = "flex gap-3 border-2 p-2 rounded-md mt-5 ";
        newDiv.id = `${startTime},${endTime}`;
        newDiv.innerHTML = `
                                <div class="flex items-center ">
                                    <img id="play-${
                                      startTime + "," + endTime
                                    }" class="w-10 play-audio" src="https://www.svgrepo.com/show/13672/play-button.svg" alt="" data-start="${startTime}" data-end="${endTime}">
                                </div>
                                <div class="border-l-2 pl-3  w-full">
                                    <p class=" py-2" id="laitu_text">${laituText}</p>
                                    <div class="border  w-full"></div>
                                    <p class="my-2" id="eng_text">${engText}</p>
                                </div>
                            `;

        // Appending the new div to the fragment_container
        fragmentContainer.appendChild(newDiv);
      });

      // Add event listener to play/pause audio on image click
      const playAudioButtons = document.querySelectorAll(".play-audio");
      playAudioButtons.forEach((button) => {
        button.addEventListener("click", function () {
          let startTime = this.getAttribute("data-start");
          let endTime = this.getAttribute("data-end");
          let currentImage = this;

          if (!audio.paused && audio.getAttribute("data-playing") === "true") {
            // If the audio is playing and the same fragment, pause it
            audio.pause();
            currentImage.src =
              "https://www.svgrepo.com/show/13672/play-button.svg";
            audio.setAttribute("data-playing", "false");
          } else {
            // Set the audio's current time to start time
            audio.currentTime = startTime;
            audio.play();

            // Change the image to indicate playing state
            currentImage.src =
              "https://www.pngall.com/wp-content/uploads/5/Pause-Button-PNG-Pic.png";

            audio.setAttribute("data-playing", "true");

            // Stop audio when it reaches the end time
            audio.ontimeupdate = function () {
              if (audio.currentTime >= endTime) {
                audio.pause();
                audio.ontimeupdate = null; // Remove the event listener
                // Revert the image to the play button
                currentImage.src =
                  "https://www.svgrepo.com/show/13672/play-button.svg";
                audio.setAttribute("data-playing", "false");
              }
            };

            // Revert the image to the play button when audio is paused or ends
            audio.onpause = function () {
              currentImage.src =
                "https://www.svgrepo.com/show/13672/play-button.svg";
              audio.setAttribute("data-playing", "false");
            };
            audio.onended = function () {
              currentImage.src =
                "https://www.svgrepo.com/show/13672/play-button.svg";
              audio.setAttribute("data-playing", "false");
            };
          }
        });
      });
    }

    // Render all data initially
    renderSearchResults(data);

    // Add event listener to the search form
    document
      .getElementById("search-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const searchTerm = document.getElementById("search-input").value.trim();
        if (searchTerm) {
          const results = fuse.search(searchTerm);
          renderSearchResults(results);
        } else {
          // If the search input is empty, render all items
          renderSearchResults(data);
        }
      });
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function checkTime() {
  var currentTime = audio.currentTime.toFixed(2);
  var isPaused = audio.paused;
  var divs = document.querySelectorAll('div[id*=","]');
  divs.forEach(function (div) {
    var idParts = div.id.split(",");
    var startTime = parseFloat(idParts[0]);
    var endTime = parseFloat(idParts[1]);
    var img = div.querySelector("img");
    if (currentTime >= startTime && currentTime <= endTime) {
      div.classList.add("bg-blue-100");
      if (isPaused) {
        img.src = "https://www.svgrepo.com/show/13672/play-button.svg"; // show play button if audio is paused
      } else {
        img.src =
          "https://www.pngall.com/wp-content/uploads/5/Pause-Button-PNG-Pic.png"; // show pause button if audio is playing
      }
    } else {
      div.classList.remove("bg-blue-100");
      img.src = "https://www.svgrepo.com/show/13672/play-button.svg"; // show play button if audio is paused
    }
  });
}

setInterval(checkTime, 100);
