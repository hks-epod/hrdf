This happened:
```
ogr2ogr -f GeoJSON saudi.json raw/SAU_adm1.shp
```
Then this:
```
topojson -o saudi_comp.json --id-property NAME_1 saudi.json
```