const extractGeometries=(geometries)=> {
    const extractedDataArray = [];
    geometries.forEach((geoObject) => {
      if (geoObject.type === 'MultiPolygon') {
        // Flatten nested arrays, adding individual polygons
        extractedDataArray.push(geoObject.arcs );
      } else if (geoObject.type === 'Polygon') {
        // Add the single polygon directly
        extractedDataArray.push(geoObject.arcs[0]);
      }
    });
    return extractedDataArray;
  }
  
    export default extractGeometries;