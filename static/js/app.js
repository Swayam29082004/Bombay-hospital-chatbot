const chatboxArgs = {
    openButton: document.querySelector('.toggle-button'),
    closeButton: document.querySelector('.close-button'),
    chatBox: document.querySelector('.chatbox__support'),
    sendButton: document.querySelector('.send__button')
};

let conversation = [];
let state = false;
let messages = [];
let userName = "";
let isSending = false; // Flag to prevent double sending
let conversationStage = "ask_name"; // Track the conversation stage
let doctor = ""; // Declare doctor variable globally

// Initialize chatbox display
function displayChatbox() {
    const { openButton, closeButton, chatBox, sendButton } = chatboxArgs;

    openButton.addEventListener('click', () => toggleState(chatBox));
    closeButton.addEventListener('click', () => toggleState(chatBox));

    const inputField = chatBox.querySelector('input');
    inputField.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
            if (!isSending) { // Check if already sending
                isSending = true; // Set flag to true to prevent double sending
                onSendButton(chatBox);
                isSending = false; // Reset flag after processing
            }
        }
    });

    sendButton.addEventListener('click', () => {
        if (!isSending) { // Prevent double sending on button click
            isSending = true;
            onSendButton(chatBox);
            isSending = false;
        }
    });

    initializeChat(); // Initialize chat with greeting
}

// Toggle the chatbox visibility
function toggleState(chatbox) {
    state = !state;
    chatbox.classList.toggle('chatbox--active', state);
    chatboxArgs.openButton.style.display = state ? 'none' : 'flex';
    chatboxArgs.closeButton.style.display = state ? 'flex' : 'none';
}

// Handle sending a message
function onSendButton(chatbox) {
    const textField = chatbox.querySelector('input');
    const messageText = textField.value.trim();
    if (messageText === "") return;

    addMessage("User", messageText);

    // Determine what to do based on the current conversation stage
    if (conversationStage === "ask_name") {
        userName = messageText; // Save the user's name
        addMessage("Bot", `Hello, ${userName}. What symptom are you experiencing?`);
        conversationStage = "ask_symptom"; // Move to the next stage
        textField.value = ''; // Clear input after first message
        return; // Exit after setting the name
    }

    // If we are asking for the symptom
    if (conversationStage === "ask_symptom") {
        addMessage("Bot", `Thank you for sharing your symptom: ${messageText}. Please select the one you meant (0-low or 1-high):`);
        conversationStage = "ask_selection"; // Move to the next stage
        textField.value = ''; // Clear input after the symptom
        return;
    }

    // If we are asking for the selection
    if (conversationStage === "ask_selection") {
        const selection = messageText; // Assume the user inputs their selection
        // Validate selection and respond accordingly
        if (selection === "0" || selection === "1") {
            addMessage("Bot", `You selected option ${selection}. How many days have you been experiencing this symptom?`);
            conversationStage = "ask_days"; // Move to the next stage for asking about days
        } else {
            addMessage("Bot", "Please enter a valid selection (0-low or 1-high).");
        }

        // Clear input field and refocus for new input
        textField.value = ''; 
        textField.focus(); // Refocus input field
        return;
    }

    // If we are asking for the number of days
    if (conversationStage === "ask_days") {
        const days = messageText; // Assume the user inputs the number of days
        addMessage("Bot", `You have been experiencing the symptom for ${days} days. Thank you for the information!`);
        
        // Fetch symptoms and precautions from the Flask server
        // Assuming the server sends the doctor's name along with symptoms and precautions
        fetch('/get_symptoms_precautions')
        .then(response => response.json())
        .then(data => {
            const symptom = data.symptom;
            const precaution = data.precaution;
            const doctor = data.doctor; // Make sure the doctor name is being retrieved
            
            addMessage("Bot", `You have the following symptom: <strong>${symptom}</strong>.`);
            addMessage("Bot", `Here is a precaution you should take: ${precaution}.`);
            
            // Ask if the user would like to book an appointment
            addMessage("Bot", `Would you like to book an appointment with ?`);
            conversationStage = "ask_booking"; // Update the conversation stage
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            addMessage("Bot", "Sorry, there was an error retrieving the information.");
        });

    
        return; // End function here; no need to update conversation stage
    }

    // If we are asking for booking an appointment
    if (conversationStage === "ask_booking") {
        if (messageText.toLowerCase() === "yes") {
            addMessage("Bot", `Your appointment has been booked with ${doctor}.`); // Ensure doctor is defined
        } else if (messageText.toLowerCase() === "no") {
            addMessage("Bot", "Okay, let me know if you need anything else!");
        } else {
            addMessage("Bot", "Please respond with 'yes' or 'no'.");
        }
        // Clear input field and refocus for new input
        textField.value = ''; 
        textField.focus(); // Refocus input field
    }
    

    // Clear input field and refocus for new input
    textField.value = ''; 
    textField.focus(); // Refocus input field
}

// Add a message to the chat
function addMessage(name, message) {
    messages.push({ name, message });
    conversation.push({ name, message }); // Add to conversation for saving
    updateChatText(chatboxArgs.chatBox);
}

// Update the chat display
function updateChatText(chatbox) {
    const chatHtml = messages.slice().reverse().map(item => 
        `<div class="messages__item ${item.name === "Bot" ? "messages__item--visitor" : "messages__item--operator"}">
            <span class="message__text">${item.message}</span>
        </div>` 
    ).join('');

    const chatMessageContainer = chatbox.querySelector('.chatbox__messages');
    chatMessageContainer.innerHTML = chatHtml;
    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
}

// Initialize chat with greetings
function initializeChat() {
    fetch('/get_info')
    .then(response => response.json())
    .then(data => {
        addMessage("Bot", data.greeting);
        addMessage("Bot", data.name_prompt); // First question (asking for the user's name)
    });
}

// Function to save conversation to a file (should be on the server-side)
function saveConversationToFile(conversation) {
    // This should be handled on the server-side (Node.js), not in client-side code
    fetch('/save_conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversation)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save conversation');
        console.log('Conversation saved successfully!');
    })
    .catch(error => {
        console.error('Error saving conversation:', error);
    });
}

// Initialize the chatbox
displayChatbox();
