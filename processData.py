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
print "Province names as they appear in By Industry chart (industries.csv):"
print df['region'].unique()
print "\n"

print "Province names as they appear in By Province chart (capitals.csv):"
print df2['province'].unique()
print "\n"

print "Province names as they appear in the shapefiles:"
shapenames = []
for item in data['objects']['saudi']['geometries']:
	shapenames.append(item['id'])
print shapenames
print "\n"

# Merging capital lat/lon data into industries
df = df.rename(columns={'region': 'province'})
coords = df2[['province','lat','lon']]

print df.shape
print coords.shape

# I think non-merged obs are dropping
result = pd.merge(coords, df, on=['province'], how='inner')
print result.shape
print result.tail()

print result.columns.values
result = result.drop(['%Saudi', '%Non-Saudi'], 1)
print result.columns.values

result.to_csv('_data/donuts.csv', index=False)


