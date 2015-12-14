#!/usr/bin/local/python

import pandas as pd
import json
from pprint import pprint

# IMPORTING DATA
df = pd.read_csv("_data/industries.csv")

df2 = pd.read_csv("_data/capitals.csv")

with open('_geo/saudi_comp.json') as data_file:    
    data = json.load(data_file)

# Let's use df as the master spelling
# ['Riyadh' 'Makkah' 'Eastern Province' 'Qassim' 'Madinah' 'Asir' 'Tabuk'
#  'Hail' 'Northern Border' 'Jazab' 'Al Baha' 'Al Joaf' 'Najran']



# FOR SLACK
print "Province names as they appear in By Industry chart:"
print df['region'].unique()
print "\n"

print "Province names as they appear in By Province chart:"
print df2['province'].unique()
print "\n"

print "Province names as they appear in the shapefiles:"
shapenames = []
for item in data['objects']['saudi']['geometries']:
	shapenames.append(item['id'])
print shapenames
print "\n"


