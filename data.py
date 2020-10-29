def init()
    # import depedencies
    import requests as req
    import pandas as pd
    import datetime as dt
    import json

    # getting the APIs
    url_covid = 'https://api.covidtracking.com/v1/states/daily.json'
    url_state_population = 'https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest'

    # retrieving API and storing data in variables
    covid_js = req.get(url_covid).json()
    # usa_pop_js = req.get(url_usa_population).json()
    state_pop_js = req.get(url_state_population).json()

    # converting the data to a dataframe for data manipulation and cleaning
    covid_all = pd.DataFrame(covid_js)
    # usa_pop_df = pd.DataFrame(usa_pop_js['data'])
    state_pop_df = pd.DataFrame(state_pop_js['data'])


    ####### Getting COVID Historical records ########
    # list of fields: all, not-required, and deprecated fields
    all_fields = ['date', 'state', 'positive', 'probableCases', 'negative', 'pending',
        'totalTestResults', 'hospitalizedCurrently', 'hospitalizedCumulative',
        'inIcuCurrently', 'inIcuCumulative', 'onVentilatorCurrently',
        'onVentilatorCumulative', 'recovered', 'dataQualityGrade',
        'lastUpdateEt', 'dateModified', 'checkTimeEt', 'death', 'hospitalized',
        'dateChecked', 'totalTestsViral', 'positiveTestsViral',
        'negativeTestsViral', 'positiveCasesViral', 'deathConfirmed',
        'deathProbable', 'totalTestEncountersViral', 'totalTestsPeopleViral',
        'totalTestsAntibody', 'positiveTestsAntibody', 'negativeTestsAntibody',
        'totalTestsPeopleAntibody', 'positiveTestsPeopleAntibody',
        'negativeTestsPeopleAntibody', 'totalTestsPeopleAntigen',
        'positiveTestsPeopleAntigen', 'totalTestsAntigen',
        'positiveTestsAntigen', 'fips', 'positiveIncrease', 'negativeIncrease',
        'total', 'totalTestResultsSource', 'totalTestResultsIncrease', 'posNeg',
        'deathIncrease', 'hospitalizedIncrease', 'hash', 'commercialScore',
        'negativeRegularScore', 'negativeScore', 'positiveScore', 'score',
        'grade']
    deprecated_fields = ['checkTimeEt', 'commercialScore', 'dateChecked', 'dateModified', 
                        'grade', 'hash', 'hospitalized', 'negativeIncrease', 
                        'negativeRegularScore', 'negativeScore', 'posNeg', 'positiveScore', 
                        'score', 'total', 'totalTestResultsSource']
    non_required_fields = ['deathConfirmed', 'deathProbable', 'lastUpdateEt', 
                        'totalTestsViral', 'positiveTestsViral', 'negativeTestsViral', 
                        'positiveCasesViral', 'probableCases', 'negative', 'recovered',
                        'pending', 'totalTestEncountersViral', 'totalTestsPeopleViral', 
                        'totalTestsAntibody', 'positiveTestsAntibody', 'negativeTestsAntibody',
                        'totalTestsPeopleAntibody', 'positiveTestsPeopleAntibody',
                        'negativeTestsPeopleAntibody', 'totalTestsPeopleAntigen', 
                        'positiveTestsPeopleAntigen','totalTestsAntigen', 'positiveTestsAntigen', 
                        'totalTestResultsIncrease', 'totalTestResults']

    # removing deprecated and non-required fields to obtain the filtered list
    filtered_fields = []
    for i in all_fields:
        if i not in deprecated_fields and i not in non_required_fields:
            filtered_fields.append(i)

    # new DF with the filtered fields
    covid_df = covid_all[filtered_fields]

    # converting date-string format to date
    covid_df['date'] = pd.to_datetime(covid_df['date'], format='%Y%m%d')

    ####### Getting States Historical records ########
    # defining fips field from ID state. This new column will be used for merging
    state_pop_df['fips'] = state_pop_df['ID State'].str[-2:]

    # creating the state_df
    state_df = state_pop_df[['State', 'fips', 'Population']]

    ######## Mergin Datasets #######
    # merging the covid_df with state_df
    covid_wpop = covid_df.merge(state_df, how='inner', on='fips')

    ######## Calculations ########
    # indexing by state and sorting by state and date
    covid_indexed = covid_wpop.set_index(['state']).sort_index().sort_values(['state', 'date'])

    # keeping fields to be used
    covid_rollavg = covid_indexed[['date', 'positive', 'positiveIncrease', 'death', 'deathIncrease']]

    # inserting calculated column: 7 days rolling average of cases
    covid_rollavg['positiveRollingAvg'] = covid_rollavg.groupby(level=0)['positiveIncrease'].rolling(window=7).mean().values

    # inserting calculated column: 7 days rolling average of deaths
    covid_rollavg['deathRollingAvg'] = covid_rollavg.groupby(level=0)['deathIncrease'].rolling(window=7).mean().values

    # new cases: looping to get the date at which the daily reported cases >= threshold for each state.
    state_list = covid_rollavg.index.get_level_values('state').unique()
    new_threshold = 10
    dates_new = []
    for i in state_list:
        new_df = covid_rollavg.loc[i]
        new_df = new_df.loc[new_df['positiveIncrease'] >= new_threshold]
        date = new_df.iloc[0].date
        dates_new.append(date)


    # zipping the states with the respective date
    new_dict = dict(zip(state_list, dates_new))

    # deaths: looping to get the date at which the accumulated death >= threshold for each state.
    death_threshold = 10
    dates_death = []
    for i in state_list:
        death_df = covid_rollavg.loc[i]
        death_df = death_df.loc[death_df['death'] >= death_threshold]
        date_d = death_df.iloc[0].date
        dates_death.append(date_d)


    # zipping the states with the respective date
    death_dict = dict(zip(state_list, dates_death))

    # reseting index
    covid_rollavg.reset_index(inplace=True)

    # creating the column that will hold the cases datelapse
    covid_rollavg['new_datelapse'] = ''

    # creating the column that will hold the death datelapse
    covid_rollavg['death_datelapse'] = ''

    # populating new_datelapse with the date substraction for number of days since reaching the threshold
    for x in covid_rollavg.index:
        covid_rollavg.iloc[x, 8] = (covid_rollavg.iloc[x, 1] - new_dict[covid_rollavg.iloc[x, 0]]).days

    # populating death_datelapse with the date substraction for number of days since reaching the threshold
    for x in covid_rollavg.index:
        covid_rollavg.iloc[x, 9] = (covid_rollavg.iloc[x, 1] - death_dict[covid_rollavg.iloc[x, 0]]).days

    # changing the result to a numeric value
    covid_rollavg['new_datelapse'] = pd.to_numeric(covid_rollavg['new_datelapse'], errors='coerce')
    covid_rollavg['death_datelapse'] = pd.to_numeric(covid_rollavg['death_datelapse'], errors='coerce')

    # renaming columns
    covid_rollavg = covid_rollavg.rename(columns={'positiveIncrease':'positive_increase', 
                                                'deathIncrease':'death_increase', 
                                                'positiveRollingAvg':'positive_rolling_avg', 
                                                'deathRollingAvg':'death_rolling_avg'})


    ############ map ###########
    # call the latest available date for each state
    # latest_date = covid_wpop.date == covid_wpop.date.max() this works, but what if one of the states is not updated to the latest date?
    # need an alternative solution to call the last date, TBD in class
    latest_date = covid_wpop.date == covid_wpop.date.max()
    map_df = covid_wpop[latest_date]

    # reorganizing columns
    map_df = map_df[['date', 'State', 'state', 'Population', 
                    'positive', 'positiveIncrease', 'death', 'deathIncrease', 
                    'hospitalizedCurrently', 'hospitalizedIncrease', 'hospitalizedCumulative', 
                    'inIcuCurrently', 'inIcuCumulative', 
                    'onVentilatorCurrently', 'onVentilatorCumulative', 
                    'dataQualityGrade']]

    # calculations: normalizing by 100K people
    map_df['positive_per_100K'] = (map_df['positive'] / (map_df['Population'] / 100000)).round(1)
    map_df['death_per_100K'] = (map_df['death'] / (map_df['Population'] / 100000)).round(1)

    # renaming map_df fields
    map_df = map_df.rename(columns={'state':'state_abbr', 
                                    'State':'state', 'Population':'population', 
                                    'positiveIncrease':'positive_increase', 
                                    'deathIncrease':'death_increase', 
                                    'hospitalizedCurrently':'hospitalized_currently', 
                                    'hospitalizedIncrease':'hospitalized_increase', 
                                    'hospitalizedCumulative':'hospitalized_cumulative', 
                                    'inIcuCurrently':'in_icu_currently', 
                                    'inIcuCumulative':'in_icu_cumulative',
                                    'onVentilatorCurrently':'on_ventilator_currently', 
                                    'onVentilatorCumulative':'on_ventilator_cumulative',
                                    'dataQualityGrade':'data_quality_grade', 
                                    'positive_per_100K':'positive_per_100k', 
                                    'death_per_100K':'death_per_100k'})

    # filling NaN with 0 and checking results
    map_df = map_df.fillna(0)



    ############### US HISTORIC CASES ##############
    # getting the API, retrieving API, converting to a DataFrame 
    us_hist_covid = 'https://api.covidtracking.com/v1/us/daily.json'
        
    covid_hist_js = req.get(us_hist_covid).json()

    covid_hist = pd.DataFrame(covid_hist_js)

    ## Change date field to Date
    covid_hist['date'] = pd.to_datetime(covid_hist['date'], format='%Y%m%d')

    # defining fields to be used, renaming columns
    keep_fields = ['date', 'positive', 'negative', 'death', 'deathIncrease', 'hospitalizedCurrently', 'onVentilatorCurrently', 'hospitalizedIncrease', 'positiveIncrease']

    covid_hist = covid_hist[keep_fields]
    covid_hist = covid_hist.rename(columns={'deathIncrease':'death_increase', 'hospitalizedCurrently':'hospitalized_currently', 'onVentilatorCurrently':'on_ventilator_currently', 'hospitalizedIncrease':'hospitalized_increase', 'positiveIncrease':'positive_increase'})

    ############### JSONIFY ALL DF ###########################

    # covid_hist.to_json("covid_hist.json", orient="records")

    # map_df.to_json("map_df.json", orient="records")

    # covid_rollavg.to_json("covid_rollavg.json", orient="records")

return covid_hist.to_json("covid_hist.json", orient="records"), map_df.to_json("map_df.json", orient="records"), covid_rollavg.to_json("covid_rollavg.json", orient="records")