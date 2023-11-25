// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {

    // Elements from the DOM
    const form = document.querySelector('form');
    const questionsWrapper = document.getElementById('questionsWrapper');
    const youtubePreview = document.getElementById('youtubePreview');
    
    // Prevent form submission for all buttons except generate
    form.addEventListener('submit', function (event) {
    if (!event.target.matches('#generatebtn')) {
        event.preventDefault();
    }
    });
    
    // Select current mood and preferred language buttons
    const moodButtons = document.querySelectorAll("#question2 .btn");
    const languageButtons = document.querySelectorAll("#question3 .btn");
    
    // Question containers 
    const question1 = document.getElementById("question1");
    const question2 = document.getElementById("question2");
    const question3 = document.getElementById("question3");
    
    // Store selected mood and language
    let selectedMood = "";
    let selectedLanguage = "";
    
    // Event listener for first Next button
    document.getElementById("nextbtn1").addEventListener("click", function () {
    const userName = document.getElementById("nameInput").value;
    // Display users name and move to second question
    if (userName) {
    document.getElementById("greeting").textContent = `Hello ${userName}, how would you describe your mood right now?`;
    question1.style.display = "none";
    question2.style.display = "block";
    } else {
    alert("Please enter your name.");
    }
    });

     // Event listener for second Next button
    document.getElementById("nextbtn2").addEventListener("click", function () {
    if (selectedMood) {
    // Move to the third question if answered 
    question2.style.display = "none";
    question3.style.display = "block";
    } else {
    alert("Please select a mood before proceeding.");
    }
    });
    
    // Event listeners for mood buttons
    moodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
    selectedMood = button.textContent;
    removeSelectedClass(moodButtons);
    button.classList.add("selected"); 
    });
    });
    
    // Event listeners for language buttons
    languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
    selectedLanguage = button.textContent;
    removeSelectedClass(languageButtons); 
    button.classList.add("selected"); 
    });
    });
    
    // Function to remove the selecetd class from buttons
    function removeSelectedClass(buttonList) {
    buttonList.forEach(function (button) {
    button.classList.remove("selected");
    });
    }
    
    // Function to show the result section
    function showResult() {
    const questionsWrapper = document.getElementById('questionsWrapper');
    const resultContainer = document.getElementById('resultContainer');
    const youtubePreview = document.getElementById('youtubePreview');
    const form = document.querySelector('form');
    
    
    questionsWrapper.style.display = 'none';
    document.querySelectorAll('.form-buttons').forEach(button => {
    button.style.display = 'none';
    });
    
    // Remove form once submitted
    form.style.height = '0';
    form.style.padding = '0';
    form.style.margin = '0';
    form.style.border = '0';
    
    
    resultContainer.style.display = 'block';
    youtubePreview.style.display = 'block';
    
    const buttonsContainer = document.getElementById('buttonsContainer');
        buttonsContainer.style.display = 'flex';
    }
    // Event listener for the 'Generate' button
    document.getElementById("generatebtn").addEventListener("click", function () {
    console.log("Generate button clicked");
    
    if (selectedLanguage) {
    console.log("Selected Mood:", selectedMood);
    console.log("Selected Language:", selectedLanguage);
    
    const formData = new FormData(form);
    formData.append('mood', selectedMood);
    formData.append('language', selectedLanguage);
    
    // Fetch data from php file to generate random song 
    fetch('process.php', {
    method: 'POST',
    body: formData,
    })
    .then(response => {
    console.log("Raw server response:", response);
    return response.json(); 
    })
    .then(data => {
    
    console.log("Server Response:", data);
    
    
    if (data.title) {
       
        displaySongDetails(data.title, data.artist, data.youtube_link);
    
    
        showResult();
    } else {
        
        alert("No songs found for the selected mood and language.");
    }
    })
    .catch(error => {
    
    console.error('Error:', error);
    alert("Error has occured generating the music.");
    });
    
    } else {
    alert("Select a language before proceeding.");
    }
    });

    // Function to initialize the YouTube API
    function initYouTubeAPI() {
    gapi.load('client', function () {
    gapi.client.init({
    apiKey: "YOUTUBE_API_KEY", 
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
    })
    .then(function () {
    console.log('YouTube API initialized');
    
    })
    .catch(function (error) {
    console.error('Error initializing YouTube API:', error);
    });
    });
    }
     // Initialize the YouTube API
    initYouTubeAPI();
    
     // Function to display song details in the result section
    function displaySongDetails(title, artist, youtube_link) {
    
    const songDetailsDiv = document.getElementById('songDetails');
    const videoId = extractVideoId(youtube_link);
    
    
    const youtubePreviewDiv = document.getElementById('youtubePreview');
    const youtubeVideoURL = `https://www.youtube.com/embed/${videoId}`;
    youtubePreviewDiv.innerHTML = `<iframe src="${youtubeVideoURL}" allowfullscreen></iframe>`;
    
    const iframeElement = youtubePreviewDiv.querySelector('iframe');
        iframeElement.classList.add('youtube-preview');
    
    }

      // Function to extract video ID from a YouTube link
    function extractVideoId(youtube_link) {
    const url = new URL(youtube_link);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get('v') || url.pathname.split('/').pop();
    }
    // Event listener for the Generate again button
    document.getElementById("generateAgainBtn").addEventListener("click", generateSong);
    
    // Function to generate another song
    function generateSong() {
    
     if (selectedMood && selectedLanguage) {
        const tableName = `${selectedMood.toLowerCase()}_songs`;
    
    
        fetch('process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `mood=${selectedMood}&language=${selectedLanguage}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                displaySongDetails(data.title, data.artist, data.youtube_link);
            } else {
                alert("No songs found for the selected mood and language.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error has occured generating the music.");
        });
    } else {
        alert("Select a mood and language before generating.");
    }
    }
    });
    
