#!/usr/bin/env python

import json
import sqlite3
import sys


db = sqlite3.connect(sys.argv[1])
cursor = db.cursor()

cursor.execute('SELECT * FROM ground')
data = cursor.fetchall()
db.close()

with open(sys.argv[2], 'w') as output:
    output.write('var map = ')
    output.write(json.dumps(data))
    output.write(';')

