HRDF
====

December 2015. Creating data visualizations of labor issues in Saudi Arabia.

## Notes on geodata

Original shapefiles for Saudi's provinces were found at [DIVA-GIS](http://www.diva-gis.org/). They were then converted to GeoJSON using the command-line tool, `ogr2ogr`:
```
ogr2ogr -f GeoJSON saudi.json raw/SAU_adm1.shp
```

To compress this file, [TopoJSON](https://github.com/mbostock/topojson) was used, where `NAME_1` was assumed to be the province names:
```
topojson -o saudi_comp.json --id-property NAME_1 saudi.json
```

## Resources
* [ColorHexa - Help with picking colors](http://www.colorhexa.com/)
* [ColorBrewer - Help with picking map colors](http://colorbrewer2.org/)
* [DIVA-GIS](http://www.diva-gis.org/)
* [Mike Bostock - Let's Make a Map](http://bost.ocks.org/mike/map/)

## TODOs
1. ~~`git`.~~
2. ~~Get map up.~~
3. ~~GPS coords for province capitals.~~
4. ~~Workforce population.~~
5. Total population (Saudi, non-Saudi) data.
6. ~~Input `.csv` for dynamic bar chart.~~
7. Linking the map to `d3.filter`/`d3.update` of the dynamic bar chart.
8. Better way to toggle between graphs? 
