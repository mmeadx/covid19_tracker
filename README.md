# COVID-19 US Daily Tracker

[LIVE SITE](https://mmeadx.github.io/covid19_tracker/)

**Team Members**

[_Matt Mead_](https://www.linkedin.com/in/mattmeadmpls/)

[_Emilio Bello_](https://www.linkedin.com/in/emilio-bello-09938760/)

[_Allan Hunt_](https://www.linkedin.com/in/allanrhunt/)

**Intent**

_This project aims to use data from [The COVID Tracking Project](https://covidtracking.com/data/api) and display graphics that show the impact of the COVID-19 virus in the United States._

_This project was orginally created for a University of Minnesota Bootcamp project. Because we're using data from an API source, we wanted to create a new project that does not rely on an database (as the project required)._


**_HOMEPAGE_**

_The homepage displays the overall statistics for the entire United States including Total Deaths, Positive Cases (daily), Hospitalizations (daily) and ICU cases (daily). It also graphs the statistics overtime using Plotly.

![Homepage]()


**_USA Tab_**

_In the Explore > USA tab we created a heatmap of each statistic using custom SVG code from Rising Stack. Each square represents a day of the year and holds a daily value - the darker the color the higher the number.

![Heatmap]()


_These daily values can be toggled on and off by clicking the color value_

![Heatmap-toggled]()


**_By State Tab_**

_In the Explore > By State tab the viewer is able to choose a specific state to see their numbers. The graph shows statistics overtime and the numbers below show percentages compared with the state population as well as the USA population.

![By State]()


_After choosing a state - you can see all of the statistics by viewing the console_

![consoleLog]()


_We were able to create a JavaScript function with the help of a very smart man named Benji to determine the 10 day rolling average of infections so that the graph wasn't as spuradic.  This also allowed us to put all of the information of each state into JSON format to pull the information_

![benjifunction]()


![10DayRollingAverage]()


