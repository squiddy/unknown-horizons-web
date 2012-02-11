#!/usr/bin/env python

import json
import sys
import xml.etree.ElementTree as ElementTree


doc = ElementTree.parse(sys.argv[1])
data = doc.findall('image')

sprites = {}
for image in data:
    attributes = dict([(key, image.attrib[key]) for key in ('xpos', 'ypos', 'width', 'height')])
    name = image.attrib['source']
    name = name.replace('ts_', '').replace('0/', '/').replace('/0.png', '')
    sprites[name] = attributes

with open(sys.argv[2], 'w') as f:
    f.write('var sprites = ')
    f.write(json.dumps(sprites))
    f.write(';')
