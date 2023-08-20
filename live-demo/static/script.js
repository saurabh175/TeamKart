document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const chatMessages = document.getElementById("chat-messages");
  const chatContainer = document.getElementById("chat-container");
  const openButton = document.getElementById("open-button");
  const resetButton = document.getElementById("reset-button");
  var prodNames = [];
  var imageLinks = [];
  var prodLinks = [];
  const chatColumn = document.querySelector(".chat-column");

  let isChatExpanded = false; // Track the state of chat expansion

  const expandButton = document.querySelector("#expand-button");
  const container = document.querySelector(".container");

  expandButton.addEventListener("click", function () {
    if (container.style.width === "600px") {
      container.style.width = "400px";
      // collapseButton.style.marginLeft = "580px";

      expandButton.innerHTML =
        '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';
    } else {
      container.style.width = "600px";
      // collapseButton.style.marginLeft = "380px";
      expandButton.innerHTML =
        '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>';
    }
  });
  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  resetButton.addEventListener("click", function () {
    resetConversation();
    collapseContainer();
  });

  openButton.addEventListener("click", function () {
    openButton.classList.toggle("rotate");

    expandChat();
  });

  messageInput.addEventListener("click", function () {
    if (sendButton.disabled) {
      // Add shake animation to the search bar
      messageInput.classList.add("shake-animation");
      messageInput.preventDefault();

      setTimeout(() => {
        messageInput.classList.remove("shake-animation");
      }, 500);
    }
  });

  messageInput.addEventListener("keydown", function (event) {
    if (sendButton.disabled) {
      event.preventDefault();
    } else {
      if (event.key === "Enter") {
        sendMessage();
      }
    }
  });
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
      sendButton.disabled = true; // Disable send button
      scrollToBottomAnimated();
      //adjustContainer();
      appendMessage(message, "sent-message");
      messageInput.value = "";
      generateResponse(message);

      // Change arrow direction
      // const collapseButton = document.getElementById("collapse-button");
      // if (collapseButton.classList.contains("up")) {
      //   collapseButton.classList.remove("up");
      // } else {
      //   collapseButton.classList.add("up");
      // }
    }
  }

  // collapseButton.addEventListener("click", function () {
  //   if (collapseButton.classList.contains("up")) {
  //     adjustContainer();
  //     collapseButton.classList.remove("up");
  //   } else {
  //     collapseContainer();
  //     collapseButton.classList.add("up");
  //   }
  // });

  function adjustContainer() {
    var firstContainer = document.getElementById("chat-title");
    var chatContainer = document.getElementById("chat-container");
    var container = document.getElementById("flexible-container");

    firstContainer.style.display = "none";
    chatContainer.style.height = "calc(100vh - 40px)"; // Adjust the height according to your needs
    container.style.height = "100vh";
    container.style.marginTop = "20px";
    chatContainer.style.animation = "adjust-container-animation 1.5s forwards";

    setTimeout(function () {
      container.classList.remove("collapsing");
    }, 1500);
  }

  function collapseContainer() {
    var firstContainer = document.getElementById("chat-title");
    var chatContainer = document.getElementById("chat-container");

    firstContainer.style.display = "block";
    chatContainer.style.height = "auto"; // Adjust the height according to your needs
    chatContainer.style.animation =
      "collapse-container-animation 1.5s forwards";
  }

  function scrollToBottomAnimated() {
    var scrollHeight = chatContainer.scrollHeight;
    var currentScrollTop = chatContainer.scrollTop;
    var scrollStep = Math.ceil((scrollHeight - currentScrollTop) / 40);

    function scroll() {
      if (chatContainer.scrollTop < scrollHeight && isAtBottom()) {
        chatContainer.scrollTop += scrollStep;
        requestAnimationFrame(scroll);
      }
    }

    scroll();
  }

  function isAtBottom() {
    return (
      chatContainer.scrollTop + chatContainer.clientHeight >=
      chatContainer.scrollHeight
    );
  }

  function redirectToURL(url) {
    window.open(url, "_blank");
  }

  function appendMessage(message, messageType) {
    const messageContainer = document.createElement("div");
    messageContainer.className = "message " + messageType;

    const messageRow = document.createElement("div");
    messageRow.className = "message-row";
    messageRow.style.display = "flex";
    messageRow.style.alignItems = "flex-start"; // Keeps the profile picture at the top

    const profilePicture = document.createElement("div");
    profilePicture.className = "profile-picture";
    profilePicture.style.marginTop = "10px"; // Adjust the margin instead of setting top
    profilePicture.style.marginRight = "1px"; // Add margin to the right

    const messageText = document.createElement("div");
    messageText.className = "message-text";

    const separatorLarge = document.createElement("div");
    const separatorSmall = document.createElement("div");

    separatorLarge.className = "message-separator-large";
    separatorSmall.className = "message-separator-small";

    const productSlider = document.createElement("div");
    productSlider.className = "product-slider";

    // Create individual product boxes and add them to the slider
    if (messageType === "received-message") {
      for (let i = 0; i < prodNames.length; i++) {
        const productBox = document.createElement("div");
        productBox.className = "product-box";

        // Create an anchor element for the URL
        const anchor = document.createElement("a");
        anchor.href = prodLinks[i];
        anchor.target = "_blank";

        // Create an image element
        const image = document.createElement("img");
        image.src = imageLinks[i];

        // Apply CSS styles to make the image fill the box
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";

        // Append the image to the anchor, and the anchor to the product box
        anchor.appendChild(image);
        productBox.appendChild(anchor);

        productSlider.appendChild(productBox);
      }
    }

    const feedbackContainer = document.createElement("div");
    feedbackContainer.classList.add("feedback-container");

    const feedbackText = document.createElement("div");
    feedbackText.classList.add("feedback-text");
    feedbackText.textContent = "Was this response helpful?";

    feedbackContainer.appendChild(feedbackText);

    // Create rating container
    var ratingContainer = document.createElement("div");
    ratingContainer.classList.add("rating");

    // Thumbs up button
    var thumbsUpButton = document.createElement("div");
    thumbsUpButton.classList.add("like", "grow");
    thumbsUpButton.addEventListener("click", function (event) {
      event.preventDefault();

      var activeButtons = document.querySelectorAll(".active");

      activeButtons.forEach(function (activeButton) {
        activeButton.classList.remove("active");
      });

      this.classList.add("active");
    });

    // Thumbs up icon
    var thumbsUpIcon = document.createElement("i");
    thumbsUpIcon.classList.add("fa", "fa-thumbs-up", "fa-3x", "like");
    thumbsUpIcon.setAttribute("aria-hidden", "true");
    thumbsUpIcon.id = "thumbsUp";

    // Append thumbs up icon to the thumbs up button
    thumbsUpButton.appendChild(thumbsUpIcon);

    // Thumbs down button
    var thumbsDownButton = document.createElement("div");
    thumbsDownButton.classList.add("dislike", "grow");
    thumbsDownButton.addEventListener("click", function (event) {
      event.preventDefault();

      var activeButtons = document.querySelectorAll(".active");

      activeButtons.forEach(function (activeButton) {
        activeButton.classList.remove("active");
      });

      this.classList.add("active");
    });

    // Thumbs down icon
    var thumbsDownIcon = document.createElement("i");
    thumbsDownIcon.classList.add("fa", "fa-thumbs-down", "fa-3x", "like");
    thumbsDownIcon.setAttribute("aria-hidden", "true");
    thumbsDownIcon.id = "thumbsDown";

    // Append thumbs down icon to the thumbs down button
    thumbsDownButton.appendChild(thumbsDownIcon);

    // Append thumbs up and thumbs down buttons to the rating container
    ratingContainer.appendChild(thumbsUpButton);
    ratingContainer.appendChild(thumbsDownButton);

    feedbackContainer.appendChild(ratingContainer);
    if (messageType === "sent-message") {
      profilePicture.style.backgroundColor = "white";
      messageText.textContent = message;
    } else if (messageType === "received-message") {
      profilePicture.style.backgroundImage = "url(static/icons/wingpfp.png)";
      profilePicture.style.backgroundSize = "cover";

      // do it here
      let keywordString = message;

      function redirectToURL(url) {
        window.open(url, "_blank");
      }

      for (let i = 0; i < prodNames.length; i++) {
        const keyword = prodNames[i];
        const link = prodLinks[i];
        keywordString = keywordString.replace(
          new RegExp(keyword, "gi"),
          `<span class="highlight-text" onclick="window.open('${link}', '_blank')">${keyword}</span>`
        );
      }

      // const message =
      //   'Here are some clothes for you: <span class="highlight-text">Wing AI</span>';

      messageText.innerHTML = keywordString;

      sendButton.disabled = false; // Disable send button

      messageText.style.animation = "flowy-in-animation 0.5s forwards";
      feedbackContainer.style.animation = "flowy-in-animation 0.5s forwards";
      productSlider.style.animation = "flowy-in-animation 0.5s forwards";
    } else if (messageType === "loading") {
      profilePicture.style.backgroundImage = "url(static/icons/wingpfp.png)";
      profilePicture.style.backgroundSize = "cover";
      messageText.classList.add("loading-animation");
    }
    messageRow.appendChild(profilePicture);
    messageRow.appendChild(messageText);

    messageContainer.appendChild(messageRow);
    if (messageType === "sent-message") {
      chatMessages.appendChild(messageContainer);
      messageContainer.appendChild(messageRow);
      messageContainer.appendChild(separatorLarge);
    } else if (messageType === "received-message") {
      messageContainer.appendChild(separatorLarge);
      chatMessages.appendChild(messageContainer);
      messageContainer.appendChild(messageRow);

      messageContainer.appendChild(productSlider);

      messageContainer.appendChild(feedbackContainer);

      messageContainer.appendChild(separatorLarge);
    } else if (messageType == "loading") {
      chatMessages.appendChild(messageContainer);
      messageContainer.appendChild(messageRow);
      messageContainer.appendChild(separatorLarge);
    } else if (messageType == "remove") {
      const lastChild = chatMessages.lastChild;
      chatMessages.removeChild(lastChild);
    }

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatMessages.style.animation = "flowy-in-animation 0.5s forwards";
  }

  function expandChat() {
    const chatInterface = document.getElementById("app-interface");
    const isOpen = chatInterface.style.display === "flex";

    if (!isOpen) {
      openButton.classList.add("active");
      chatInterface.style.display = "flex";
      chatInterface.style.animation = "flowy-in-animation 0.5s forwards";
    } else {
      openButton.classList.remove("active");
      chatInterface.style.animation = "flowy-out-animation 0.5s forwards";
      setTimeout(() => {
        chatInterface.style.display = "none";
      }, 500);
    }

    resetConversation();
  }

  var likeButtons = document.querySelectorAll(".like, .dislike");

  function simulateTypingEffect(element, message, callback) {
    const typingSpeed = 10; // Adjust typing speed as desired
    let currentCharIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentCharIndex < message.length) {
        element.textContent += message.charAt(currentCharIndex);
        currentCharIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(callback, 1000); // Call the callback function after 1 second delay
      }
    }, typingSpeed);

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function generateResponse(param) {
    var input = param; // The input value you want to send
    //appendMessage("ouhsdf udfh udsf sduifhisud fuidsfh siudfh usdfhiusdfsiu sdu dsfiuhds", "received-message");
    // Show the loading indicator
    appendMessage("loading...", "loading");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = xhr.responseText;

        // Make a separate AJAX request to retrieve the parameter value
        var xhrParam = new XMLHttpRequest();
        xhrParam.open(
          "GET",
          "/get_parameter?input=" + encodeURIComponent(input),
          true
        );
        xhrParam.onreadystatechange = function () {
          if (xhrParam.readyState === 4 && xhrParam.status === 200) {
            var parameterValue = JSON.parse(xhrParam.responseText);
            console.log(parameterValue["data"]);
            // console.log(parameterValue["source"]);
            var result = parameterValue["data"];

            var llm_response = parameterValue["result"];

            // get product names, hyperlink them, and get images.

            prodNames = [];
            imageLinks = [];
            prodLinks = [];
            result.forEach((res) => {
              prodNames.push(res.title);
              imageLinks.push(res.image);
              prodLinks.push(res.link);
            });

            // prodNames contains all the products

            appendMessage("", "remove");
            appendMessage(llm_response, "received-message");
          }
        };
        xhrParam.send();
      }
    };
    xhr.send("input=" + input);
  }

  function resetConversation() {
    const chatMessages = document.getElementById("chat-messages");

    messageInput.value = "";

    chatMessages.innerHTML = `
      <div class="message received-message">
        <div class="message-row">
        <div class="profile-picture" style="background-image: url(static/icons/wingpfp.png); background-size: cover;"></div>
        <div class="message-text">How can I help you?</div>
        </div>
        <div class="message-separator-large"></div>
      </div>
    `;

    // Reset chat interface to initial state
    const chatTitle = document.getElementById("chat-title");
    chatTitle.style.display = "block";

    const chatContainer = document.getElementById("chat-container");
    chatContainer.style.height = "calc(100vh - 40px)";

    const container = document.getElementById("flexible-container");
    container.style.height = "100vh";
    container.style.marginTop = "20px";

    //expandChat(); // Close the chat interface
  }
});
