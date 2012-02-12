#!/usr/bin/env python

import json
import os
import sqlite3
import sys

UH_PATH = '/home/squiddy/projekte/unknown-horizons/'

data = {
    'islands': []
}

db = sqlite3.connect(sys.argv[1])
cursor = db.cursor()

# retrieve buildings
cursor.execute('SELECT type, x, y FROM building ORDER BY x DESC, y ASC')
result = cursor.fetchall()

def s(a, b):
    # sort X descending, Y ascending to help remove overlaps when rendering
    # in order
    if a[1] == b[1]:
        return cmp(a[2], b[2])
    else:
        return cmp(b[1], a[1])

result.sort(cmp=s)

data['buildings'] = result

# retrieve islands
cursor.execute('SELECT x, y, file FROM island')
for (x, y, filename) in cursor.fetchall():
    island = {'x': x, 'y': y}
    island_db = sqlite3.connect(os.path.join(UH_PATH, filename))
    cursor = island_db.cursor()
    cursor.execute('SELECT * FROM ground')
    island['grounds'] = cursor.fetchall()
    island_db.close()
    data['islands'].append(island)


db.close()

with open(sys.argv[2], 'w') as output:
    output.write('var map = ')
    output.write(json.dumps(data))
    output.write(';')

