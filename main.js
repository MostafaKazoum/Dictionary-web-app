const themeToggeler = document.querySelector(".theme-toggeler")
const dropDownBtn = document.querySelector(".drop-btn")
const dorpDownMenu = document.querySelector(".menu")
const WordForm = document.querySelector(".word-form")
const container = document.querySelector(".word-content")
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
let sansSerif = true,serif = false,mono = false



// toggle-theme
themeToggeler.onclick = ()=>{
    const handl = document.querySelector(".handl")
    handl.classList.toggle("toggle-theme")
    document.body.classList.toggle("dark-mode")
    
}
//drop down menu interaction
dropDownBtn.onclick = ()=>{
    dorpDownMenu.classList.toggle("hide")
    document.querySelector(".arrow").classList.toggle("turn")
    
}

//handel the the drop down menu events
dorpDownMenu.querySelectorAll("button").forEach(btn => {
    btn.onclick = (event)=>{
        console.log(event.target.classList);
        
        if(event.target.classList.contains("san-serif")){
            sansSerif = true
            serif = false
            mono = false
        }
        if(event.target.classList.contains("serif")){
            sansSerif = false
            serif = true
            mono = false
        }
        if(event.target.classList.contains("mono")){
            sansSerif = false
            serif = false
            mono = true
        }
        dorpDownMenu.classList.toggle("hide")
        displayFont()
    }
    
});

//dispal the selected font
function displayFont(){
    const root = document.querySelector(":root")
    const dropDownTite = dropDownBtn.querySelector(".selected")
    var rs = getComputedStyle(root)

    if(sansSerif){
        root.style.setProperty("--ff-curunt",rs.getPropertyValue("--ff-sans-serif"))
        dropDownTite.innerHTML = "sans serif"
    }
    if(serif){
        root.style.setProperty("--ff-curunt",rs.getPropertyValue("--ff-serif"))
        dropDownTite.innerHTML = "serif"

    }
    if(mono){
        root.style.setProperty("--ff-curunt",rs.getPropertyValue("--ff-mono"))
        dropDownTite.innerHTML = "mono"
    }
}
displayFont()

//Handling form input
WordForm.onsubmit = (e)=>{
    e.preventDefault()
    const prompt = document.querySelector(".invalid-prompt")
    const text = e.target.word
    if(text.value.trim() == ""){
        //invalid data
        text.parentElement.parentElement.classList.add("invalidform")
        prompt.classList.remove("hide")

        return
    }
    text.parentElement.parentElement.classList.remove("invalidform")

    prompt.classList.add("hide")
    fetchWord(text.value)

}

//fecth word definitions
async function fetchWord(word) {
    try {
        const response = await axios.get(url + word);
        const data = response.data[0];

        const phoneticText = data.phonetics.find(p => p.text)?.text || "Not Available";
        const phoneticAudio = data.phonetics.find(p => p.audio)?.audio || "";
        document.querySelector(".not-found").classList.add("hide")
        container.innerHTML = 
            `<div class="word-header">
                <div class="word">
                    <h1>${data.word}</h1>
                    <h3>${phoneticText}</h3>
                </div>
                <div class="word-audio" onclick="handleAudio('${phoneticAudio}')">
                    ${
                        phoneticAudio 
                        ? `<audio id="audio-player" src="${phoneticAudio}"></audio>
                           <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75"><g fill="#A445ED" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/><path d="M29 27v21l21-10.5z"/></g></svg>`
                        : `<p>Audio not available</p>`
                    }
                </div>
            </div>
            ${displayWordSections(data.meanings)}
            <div class="divider"></div>
            <div class="source">
                <p>Source</p>
                <a href="${data.sourceUrls[0]}" target="_blank" rel="noopener noreferrer">
                    ${data.sourceUrls[0]}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="none" stroke="#838383" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5"/></svg>
                </a>
            </div>`;

    } catch (error) {
        console.error("Error fetching the word:", error.message);
        container.innerHTML = ""
        document.querySelector(".not-found").classList.remove("hide")
    }
}

// Function to handle audio playback
function handleAudio(audioSrc) {
    if (!audioSrc) return;
    const audio = document.getElementById("audio-player");
    if (audio) {
        audio.play();
    } else {
        console.error("Audio element not found.");
    }
}

function displayWordSections(data){
    const list = data.map((item)=>{
        return `
         <div class="section">
                <div class="section-header">
                    <h4>${item.partOfSpeech}</h4><div class="line"></div>
                </div>
                <div class="word-meaning">
                    <h4 class="title">Meaning</h4>
                    <ul class="meaning-list">
                        
                        ${
                            item.definitions.map((def)=>{
                                return `
                                <li>
                                    <p>${def.definition}</p>
                                    <p class="example">${(!!def.example) ? '\"' + def.example + '\"' : ""}</p>
                                </li>
                                `
                            }).join("")
                        }
                    </ul>
                    ${( item.synonyms.length > 0)? `<div class="synonyms">
                        <ul class="Synonyms-list">
                            <li>
                                <h4 class="title">Synonyms</h4>
                            </li>
                            ${
                                item.synonyms.map((syn)=>{
                                    return `
                                    <li>
                                        <p>${syn}</p>
                                    </li>
                                    `
                                }).join("")
                            }
                        </ul>
                    </div>`: ""}
                </div>
            </div>
        `

    }).join("")

    return list
}






