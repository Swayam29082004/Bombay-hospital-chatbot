# Bombay Hospital Bot 🤖

Welcome to the **Bombay Hospital Bot** project! This is a Flask-based web application designed to simulate a conversational chatbot that guides users through a basic medical diagnostic process. It collects the user's name, symptoms, and symptom duration, then provides relevant precautions and doctor recommendations. Additionally, it allows users to book appointments with suggested doctors based on their symptoms.

---

## Features 🌟

- **🏥 Symptom Diagnosis**: The bot engages users in a step-by-step diagnostic process to gather symptoms and severity levels.
- **💡 Precaution Suggestions**: Offers useful precautions based on the provided symptoms.
- **🩺 Doctor Recommendations**: Suggests specialists according to the user’s condition.
- **📅 Appointment Booking**: Enables users to book appointments with doctors directly through the chat.
- **🔄 Interactive Chatbox**: A dynamic chatbox interface for seamless user interaction.

---

## Technologies Used 🛠️

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Data**: Pandas (for handling CSV files containing symptom data)
- **Timezone Handling**: `pytz` for managing timezones
- **API**: RESTful API endpoints using Flask
- **Libraries**: 
  - `pandas` for reading and processing symptom data
  - `datetime` for time-based greeting generation

---

## How It Works ⚙️

1. The bot greets the user and asks for their name.
2. The user provides their symptoms.
3. Based on the input, the bot asks how long the user has been experiencing the symptoms.
4. The bot suggests precautions and possible treatments for the symptom using a preloaded dataset.
5. Relevant doctors are recommended, and the user can book an appointment directly through the bot.

---

## File Structure 📁

```bash
├── Bombay-Hospital-Bot/
│   ├── MasterData/
│   │   ├── Symptom_severity.csv
│   │   └── symptom_precaution.csv
│   ├── static/
│   │   ├── css/
│   │   │   ├── chatbot.css
│   │   │   └── style.css
│   │   ├── img/
│   │   ├── js/
│   │   │   ├── chatbot.js
│   │   │   └── main.js
│   ├── templates/
│   │   ├── aboutUs.html
│   │   ├── contact.html
│   │   └── index.html
│   ├── app.py
│   └── README.md


## Setup and Installation 🚀

To run this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/bombay-hospital-bot.git
   cd bombay-hospital-bot
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask App**:
   ```bash
   python app.py
   ```

5. **Open your browser** and navigate to `http://127.0.0.1:5000/`.

## Future Improvements 🚧

- Integrating a **database** to store user conversations and booking history.
- Adding **natural language processing (NLP)** to better understand user inputs.
- Expanding **symptom datasets** to cover a wider range of conditions.
- Enabling **email or SMS notifications** for appointment reminders.

## Contributing 🤝

Feel free to fork this repository, make improvements, and submit pull requests! Contributions are always welcome.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This README outlines the project's functionality, key features, and setup instructions, with appropriate emojis to make it engaging. Let me know if you want any changes!
