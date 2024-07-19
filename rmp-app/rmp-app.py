import ratemyprofessor
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

def getFromRmp(profName):
    professor = ratemyprofessor.get_professor_by_school_and_name(SCHOOL, profName)
    if professor is not None:
        print(round(professor.would_take_again, 1))
        return {"name" : professor.name,
            "department": professor.department,
            "school": professor.school.name,
             "rating" : professor.rating,
            "difficulty" : professor.difficulty,
            "num_ratings": professor.num_ratings,
            "would_take_again"  : round(professor.would_take_again, 2)}
    else:
        return None

app = Flask(__name__)
CORS(app)
SCHOOL = ratemyprofessor.get_school_by_name("University of British Columbia")

@app.route('/process-rmp', methods=['POST'])
def process_input():
    profName = request.json
    response =  getFromRmp(profName)
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

