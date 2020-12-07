function average(arr){
    let sum = 0;
    for(let i = arr.length - 1; i >= 0; i--)
        sum += arr[i];
    return sum / arr.length;
}
/**
 * 
 * @param {*} dataSet Assumed to be in correct order
 * @param {*} outputFieldName 
 * @param {*} rollingLength 
 * @param {*} keyExtractor 
 * @param {*} valueExtractor 
 * @param {*} defaultValue 
 * @param {*} aggergator 
 */
function rollingAggergate(dataSet, setValueCallback, rollingLength, keyExtractor, valueExtractor, defaultValue, aggergator){
    const rollingBuffer = new Array(rollingLength).fill(defaultValue);
    const dataSetLength = dataSet.length;
    if(dataSetLength === 0) return;
    let previousKey = keyExtractor(dataSet[0]);
    let bufferIndex = 1;

    rollingBuffer[0] = valueExtractor(dataSet[0]);
    setValueCallback(aggergator(rollingBuffer, 0), dataSet[0]);
    function incrementBufferIndex(){
        bufferIndex++;
        bufferIndex %= rollingLength;
    }

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

    for(let i = 1; i < dataSetLength; i++){
        const currentRow = dataSet[i];
        let currentKey = keyExtractor(currentRow);
        jumpGap(currentKey - previousKey);
        rollingBuffer[bufferIndex] = valueExtractor(currentRow);
        setValueCallback(aggergator(rollingBuffer, bufferIndex), currentRow);
        incrementBufferIndex();
    }
}

async function getCovidData(){

    console.log("Loaded app-dataGrab.js")

    // getting the APIs
    const url_covid = 'https://api.covidtracking.com/v1/states/daily.json';
    const url_state_population = 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest';

    let [covid_data, {data: state_population_data}] = await Promise.all([
        d3.json(url_covid),
        d3.json(url_state_population),
    ]);

    function parseDateNumber(date){
        const dayPart = date % 100;
        date = (date / 100) | 0;
        const monthPart = date % 100;
        const yearPart = (date / 100) | 0;
        return new Date(yearPart, monthPart, dayPart);
    }

    covid_data.forEach(x => {
        x.cleanDate = parseDateNumber(x.date);
    });

    function getFips(row) { 
        return row['ID State'].slice(-2);
    }

    //setup fip to state mapping
    let fipToState = {};
    state_population_data.forEach(state => {
        fipToState[getFips(state)] = state;
        state.covidData = [];
    });

    //add state data to covid data and add covid data to state data in order of occurence (earliest first)
    for(let i = covid_data.length - 1; i >= 0; i--){
        const currentRow = covid_data[i];
        const currentState = currentRow.stateData = fipToState[currentRow.fips];
        if(currentState)
            currentState.covidData.push(currentRow);
    }

    state_population_data.forEach(x => {
        //postive increase
        rollingAggergate(
            x.covidData,
            (rollingAvg, covidData) => {
                covidData.positiveIncreaseRollingAverage = rollingAvg;
            },
            7,
            covidData => covidData.cleanDate.getDate() / 1000 / 60 / 60 / 24, //are leapseconds and daylight savings an issue?
            covidData => covidData.positiveIncrease,
            0,
            average
        );

        //deaths
        rollingAggergate(
            x.covidData,
            (rollingAvg, covidData) => {
                covidData.deathIncreaserollingAverage = rollingAvg;
            },
            7,
            covidData => covidData.cleanDate.getDate() / 1000 / 60 / 60/ 24,
            covidData => covidData.deathIncrease,
            0,
            average
        );
    });


    state_population_data.forEach(state => {
        state.modifiedIndex0 = state.covidData.findIndex(covid => covid.positiveIncreaseRollingAverage >= 10);
    });
    
    return state_population_data;
}