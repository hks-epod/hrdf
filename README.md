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

## TODOs
1. ~~`git`.~~
2. Get map up.
3. GPS coords for province capitals.
4. Input `.csv` for bar chart.