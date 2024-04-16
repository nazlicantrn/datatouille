from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import json

app = Flask(__name__)

@app.route('/data/places.geojson')
def places():
    with open('data/places.geojson') as f:
        data = json.load(f)
    return data

@app.route('/')
def index():
   return render_template('index.html')

if __name__ == '__main__':
   app.run(debug=True)