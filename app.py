from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import random
import re
import pandas as pd
import pytz
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Renders the home page

# Function to generate a greeting based on the current time
def get_greeting():
    ist = pytz.timezone('Asia/Kolkata')
    current_hour = datetime.now(ist).hour

    if 5 <= current_hour < 12:
        return "Good morning,"
    elif 12 <= current_hour < 18:
        return "Good afternoon,"
    else:
        return "Good evening,"

# Route for greeting and prompts
@app.route('/get_info', methods=['GET'])
def get_info():
    """Initial greeting and first question."""
    greeting = "Hi! I am Bombay Hospital Bot."
    name_prompt = "What is your name?"
    return jsonify({"greeting": greeting, "name_prompt": name_prompt})

@app.route('/process', methods=['POST'])
def process_message():
    """Process the user message based on the conversation stage."""
    data = request.json
    user_message = data.get('message')
    conversation_stage = data.get('stage')

    if conversation_stage == "ask_name":
        # After receiving the name, ask for the symptom
        response = {
            "answer": f"Hello {user_message}, what symptom are you experiencing?",
            "next_stage": "ask_symptom"
        }

    elif conversation_stage == "ask_symptom":
        # After receiving the symptom, ask how long the user has been experiencing it
        response = {
            "answer": f"Thank you for providing your symptom: {user_message}. How long have you been experiencing this?",
            "next_stage": "ask_days"
        }

    elif conversation_stage == "ask_days":
        # After receiving the number of days, the conversation ends
        response = {
            "answer": f"Okay, you've been experiencing it for {user_message} days. I will now assist you.",
            "next_stage": "done"
        }

    else:
        # Handle an unknown stage or unexpected input
        response = {
            "answer": "I'm not sure how to respond to that. Can you please provide your name or symptom?",
            "next_stage": conversation_stage  # Remain in the current stage
        }

    return jsonify(response)




@app.route('/get_symptoms_precautions', methods=['GET'])
def get_symptoms_precautions():
    # Load the CSV files
    symptoms_df = pd.read_csv('MasterData/Symptom_severity.csv')
    precautions_df = pd.read_csv('MasterData/symptom_precaution.csv')
    
    # Strip whitespace from column names
    precautions_df.columns = precautions_df.columns.str.strip()
    
    # Debugging print to check column names
    # print(precautions_df.columns)

    # Randomly select a symptom based on severity
    random_symptom = symptoms_df.sample(n=1).iloc[0]
    symptom_name = random_symptom['symptom']
    
    # Get precautions for the selected symptom
    related_precautions = precautions_df[precautions_df['symptom'] == symptom_name]
    
    
    # Randomly select one precaution from the related precautions
    # List of user conditions
    user_conditions = [
        "Fever", "Cold", "Headache", "Diabetes", "Hypertension", 
        "Asthma", "Allergy", "Cancer", "COVID-19"
    ]

    # Sample related precautions for demonstration
    related_precautions = {
        "Fever": ["Stay hydrated", "Rest well", "Take fever-reducing medication as advised"],
        "Cold": ["Drink warm fluids", "Avoid cold exposure", "Use saline nasal spray"],
        "Headache": ["Rest in a dark room", "Stay hydrated", "Consider over-the-counter pain relief"],
        "Diabetes": ["Monitor blood sugar levels", "Follow a balanced diet", "Exercise regularly"],
        "Hypertension": ["Limit salt intake", "Exercise regularly", "Manage stress"],
        "Asthma": ["Avoid triggers", "Use prescribed inhaler", "Keep emergency medication handy"],
        "Allergy": ["Identify and avoid allergens", "Take antihistamines", "Consult an allergist"],
        "Cancer": ["Follow your treatment plan", "Stay positive", "Seek support groups"],
        "COVID-19": ["Stay isolated if symptomatic", "Monitor symptoms", "Get tested"],
        # Add more conditions and precautions as needed
    }

    # Dictionary of doctors for each condition
    doctor_dict = {
        "Fever": "Dr. Smith - General Practitioner",
        "Cold": "Dr. Johnson - ENT Specialist",
        "Headache": "Dr. Lee - Neurologist",
        "Diabetes": "Dr. Patel - Endocrinologist",
        "Hypertension": "Dr. Kim - Cardiologist",
        "Asthma": "Dr. Brown - Pulmonologist",
        "Allergy": "Dr. Garcia - Allergy Specialist",
        "Cancer": "Dr. Wong - Oncologist",
        "COVID-19": "Dr. Davis - Infectious Disease Specialist",
        # Add more diseases and corresponding doctors here
    }

    # Process each user condition
    for condition in user_conditions:
        if condition in related_precautions:
            random_precaution = random.choice(related_precautions[condition])
        else:
            random_precaution = "You should take the consultation from a doctor..."

        doctor_suggestion = doctor_dict.get(condition, "Please consult a general practitioner.")

        # Combine the precaution and doctor suggestion
        random_precaution = f"For {condition}: {random_precaution}. Also, we recommend: {doctor_suggestion}."


    # Process each user condition
    for condition in user_conditions:
        if condition in related_precautions:
            random_precaution = random.choice(related_precautions[condition])
        else:
            random_precaution = "You should take the consultation from a doctor..."

        doctor_suggestion = doctor_dict.get(condition, "Please consult a general practitioner.")

        # Combine the precaution and doctor suggestion
        random_precaution = f"For {condition}: {random_precaution} Also, we recommend: {doctor_suggestion}"

        return jsonify({
            'symptom': symptom_name,
            'precaution': random_precaution
        })



# Example bot response function
def get_bot_response(user_message):
    # This is where you can implement your logic to generate a bot response
    return f"You said: {user_message}"

@app.route('/about')
def about():
    return render_template('aboutUs.html')  # Renders the About page

@app.route('/contact')
def contact():
    return render_template('contact.html')  # Renders the Contact Us page


@app.context_processor
def inject_js():
    return dict(js_file='static/js/app.js')

if __name__ == '__main__':
    app.run(debug=True)

