function updateHTML(data) {
    const avatar = document.getElementById("myImage")
    avatar.src = data.avatar_url

    const name = document.querySelector(".username")
    name.textContent = data.name

    const location = document.querySelector(".location")
    location.textContent = data.location

    const followers = document.querySelector(".stats-num")
    followers.textContent = data.followers

    const githubLink = document.querySelector("a")
    githubLink.href = data.html_url
}

function styleContainerDiv(childContainer) {
    childContainer.style.width = "100%";
    childContainer.style.height = "35px"; // Set desired height
    childContainer.style.display = "flex"; // Set flex display
    childContainer.style.boxSizing = "border-box";
    // childContainer.style.textAlign = "center"; // Optional, if needed
}

function styleInputAndSubmit(input, submit) {
    input.style.flex = "4"; // Takes 80% width (relative to flex settings)
    submit.style.flex = "1"; // Takes 20% width
    input.style.width = "100%"; // Ensure full width of its flex space
    input.style.height = "100%"; // Matches container height

    submit.style.width = "100%"; // Ensure full width of its flex space
    submit.style.height = "100%"; // Matches container height
    submit.style.color = "#fff";
    submit.style.backgroundColor = "green";


    // Some basic default cleaning
    input.style.border = "1px solid #ccc"; // Light grey border for input
    input.style.borderRadius = "2px"; // Rounded corners for input
    input.style.outline = "none"; // Remove focus outline

    submit.style.border = "none"; // Remove border for submit button
    submit.style.borderRadius = "2px"; // Rounded corners for submit
    submit.style.boxShadow = "none"; // Remove 3D effect
    submit.style.cursor = "pointer"; // Pointer cursor for hover
}


function createInputHolder(parentContainer) {
    const containerDiv = document.createElement("div");
    // containerDiv.style.display = "flex";
    parentContainer.appendChild(containerDiv);
    styleContainerDiv(containerDiv)
    return containerDiv; // Ensure to return the containerDiv
}


function createInputAndSubmitElement(parentContainer) {
    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Enter URL");

    let submitButton = document.createElement("button");
    submitButton.textContent = "Submit";

    styleInputAndSubmit(inputElement, submitButton);

    parentContainer.appendChild(inputElement);
    parentContainer.appendChild(submitButton);

    return { input: inputElement, submit: submitButton }; // Return as an object
}


function getAndUpdateData(requestURL) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", requestURL)

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            const data = JSON.parse(this.responseText)   
            updateHTML(data)   
        }
    }

    xhr.send()      
}


function main() {
    const content = document.querySelector(".content");
    const containerDiv = createInputHolder(content);      
    const { input, submit } = createInputAndSubmitElement(containerDiv);
    console.log("Created elements successfully.");

    submit.addEventListener("click", () => {
        const inputValue = input.value.trim()

        if (!input) {
            alert("Please enter a valid URL!");
            return;
        }

        getAndUpdateData(inputValue);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    main();
});

