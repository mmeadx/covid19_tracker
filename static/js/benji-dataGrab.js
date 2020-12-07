/**
 * 
 * @callback setValueCallback
 * @param {*} value The value being passed back.
 * @param {*} [current] The corresponding element from the dataset
 * @returns {undefined}
 */
​
​
/**
 * @callback Extractor
 * @param {*} Current The current element from the dataset
 * @returns {*} Some value
 */
​
/**
 * @callback Aggeragtor
 * @param {*[]} arr An array of values
 * @param {number} offset The first value in the array (the array should be though of wrapping around starting at offset and ending at offset - 1 (this means no change when offset=0)) 
 * @returns {*} an aggergate value
 */
​
/**
 * 
 * @param {*[]} dataSet Assumed to be in correct order, may include gaps
 * @param {setValueCallback} setValueCallback is called on every aggergate value in order.
 * @param {number} rollingLength This is the "length" of the rolling aggergation. For example a weekly average when the input data is daily would have a 7.
 * @param {Extractor} keyExtractor Gets the key from an element in the dataset, this should be a number where in a dataset with no gaps you would have consecutive integers returned from this function.
 * @param {Extractor} valueExtractor Gets the value from an element in the dataset
 * @param {*} defaultValue a default value to use when there is a gap.
 * @param {Aggeragtor} aggergator The aggergation to apply.
 */
function rollingAggergate(dataSet, setValueCallback, rollingLength, keyExtractor, valueExtractor, defaultValue, aggergator){
    const rollingBuffer = new Array(rollingLength).fill(defaultValue);
    const dataSetLength = dataSet.length;
    if(dataSetLength === 0) return;
    let previousKey = keyExtractor(dataSet[0]);
    let bufferIndex = 1;
​
    rollingBuffer[0] = valueExtractor(dataSet[0]);
    setValueCallback(aggergator(rollingBuffer, 0), dataSet[0]);
​
    function incrementBufferIndex(){
        bufferIndex++;
        bufferIndex %= rollingLength;
    }
​
    function jumpGap(gapSize){
        if(gapSize >= rollingLength){
            rollingBuffer.fill(defaultValue);
        }
        else{
            for(let i = 1; i < gapSize; i++){
                rollingBuffer[bufferIndex] = defaultValue;
                incrementBufferIndex();
            }
        }
    }
​
    for(let i = 1; i < dataSetLength; i++){
        const currentRow = dataSet[i];
        let currentKey = keyExtractor(currentRow);
        jumpGap(currentKey - previousKey);
        rollingBuffer[bufferIndex] = valueExtractor(currentRow);
        setValueCallback(aggergator(rollingBuffer, bufferIndex), currentRow);
        incrementBufferIndex();
    }
}