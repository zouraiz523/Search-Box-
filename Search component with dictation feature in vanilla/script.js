// Speech recognition setup
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const searches = document.querySelectorAll(".search-component");

for (let x = 0; x < searches.length; x++) {
    const search = searches[x];
    const submitButton = search.querySelector("button[type='submit']");
    const dictateButton = search.querySelector("button[type='button']");
    const searchBox = search.querySelector("input");
    const suggBox = document.createElement("ul");  // Create suggestion box dynamically
    suggBox.className = "autocom-box";
    search.appendChild(suggBox); // Add suggestion box to the component

    let listening = false;
    let webLink;

    // Autocomplete suggestions array
    let suggestions = [
        "CodingMak", "CodingMaker", "YouTube", "YouTube cod", "YouTube CodingMak", "YouTube CodingMaker",
        "YouTuber", "YouTube Channel", "Blogger", "Facebook", "Freelancer", "Facebook Page", "Developer",
        "Web Designer", "Website Developer", "Login Form in HTML & CSS", "How to learn HTML & CSS",
        "How to learn JavaScript", "How to become Freelancer", "How to become Web Designer",
        "How to start Gaming Channel", "How to start YouTube Channel", "What does HTML stand for?",
        "What does CSS stand for?"
    ]; 

    // Event listener for input box typing
    searchBox.addEventListener("keyup", (e) => {
        let userData = e.target.value;
        let emptyArray = [];
        if (userData) {
            emptyArray = suggestions.filter((data) =>
                data.toLowerCase().startsWith(userData.toLowerCase())
            ).map((data) => `<li>${data}</li>`);

            showSuggestions(emptyArray);

            let allList = suggBox.querySelectorAll("li");
            allList.forEach((item) => {
                item.addEventListener("click", () => select(item));
            });

            suggBox.classList.add("active"); // Show suggestion box
        } else {
            suggBox.classList.remove("active"); // Hide suggestion box if empty
        }
    });

    function select(element) {
        let selectData = element.textContent;
        searchBox.value = selectData;
        suggBox.classList.remove("active");

        webLink = "https://www.google.com/search?q=" + selectData;
        window.open(webLink, "_blank"); // Open the link in a new tab
    }

    function showSuggestions(list) {
        let listData = !list.length ? `<li>${searchBox.value}</li>` : list.join('');
        suggBox.innerHTML = listData;
    }

    // Submit button click to perform Google search
    submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        webLink = "https://www.google.com/search?q=" + searchBox.value;
        window.open(webLink, "_blank");
    });

    // Speech recognition functionality
    if (SpeechRecognition) {
        dictateButton.classList.add("visible");
        dictateButton.addEventListener("click", function (e) {
            if (!listening) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';

                recognition.onspeechend = function () {
                    recognition.stop();
                    listening = false;
                    search.classList.remove("listening");
                };

                recognition.onerror = function () {
                    listening = false;
                    search.classList.remove("listening");
                };

                recognition.onresult = function (e) {
                    const transcript = e.results[0][0].transcript;
                    searchBox.value = transcript;
                    searchBox.dispatchEvent(new Event('keyup')); // Trigger keyup to update suggestions
                };

                recognition.start();
                listening = true;
                search.classList.add("listening");
            }
        });
    }
}
