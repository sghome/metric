import { BetaAnalyticsDataClient } from "@google-analytics/data"

const analytics = new BetaAnalyticsDataClient({
 credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
})

const propertyId = process.env.GA_PROPERTY_ID


function mapRows(rows){

const labels=[]
const values=[]

rows?.forEach(r=>{
labels.push(r.dimensionValues[0].value)
values.push(Number(r.metricValues[0].value))
})

return {labels,values}

}


export async function handler(event,context){

try{

const [summaryReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

metrics:[
{name:"activeUsers"},
{name:"newUsers"},
{name:"sessions"},
{name:"screenPageViews"},
{name:"engagementRate"},
{name:"userEngagementDuration"}
]

})

const summaryRow = summaryReport.rows?.[0]


const [trendReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"date"}],

metrics:[{name:"activeUsers"}]

})


const [countryReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"country"}],

metrics:[{name:"activeUsers"}],

limit:10

})


const [deviceReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"deviceCategory"}],

metrics:[{name:"activeUsers"}]

})


const [osReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"operatingSystem"}],

metrics:[{name:"activeUsers"}]

})


const [browserReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"browser"}],

metrics:[{name:"activeUsers"}]

})


const [eventsReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"eventName"}],

metrics:[{name:"eventCount"}]

})


const [trafficReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[
{name:"sessionSource"},
{name:"sessionMedium"}
],

metrics:[{name:"sessions"}]

})


const [landingReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"landingPagePlusQueryString"}],

metrics:[{name:"sessions"}],

limit:10

})


const [pagesReport] = await analytics.runReport({

property:`properties/${propertyId}`,

dateRanges:[{
startDate:"30daysAgo",
endDate:"today"
}],

dimensions:[{name:"pagePath"}],

metrics:[{name:"screenPageViews"}],

limit:10

})


const dates=[]
const users=[]

trendReport.rows?.forEach(row=>{
dates.push(row.dimensionValues[0].value)
users.push(Number(row.metricValues[0].value))
})


const response={

summary:{
activeUsers:Number(summaryRow?.metricValues[0]?.value || 0),
newUsers:Number(summaryRow?.metricValues[1]?.value || 0),
sessions:Number(summaryRow?.metricValues[2]?.value || 0),
pageViews:Number(summaryRow?.metricValues[3]?.value || 0),
engagementRate:Number(summaryRow?.metricValues[4]?.value || 0),
engagementTime:Number(summaryRow?.metricValues[5]?.value || 0)
},

trend:{dates,users},

countries:mapRows(countryReport.rows),

devices:mapRows(deviceReport.rows),

os:mapRows(osReport.rows),

browser:mapRows(browserReport.rows),

events:mapRows(eventsReport.rows),

pages:mapRows(pagesReport.rows),

landing:mapRows(landingReport.rows),

traffic:trafficReport.rows?.map(r=>({

source:r.dimensionValues[0].value,
medium:r.dimensionValues[1].value,
sessions:Number(r.metricValues[0].value)

})) || []

}


return{

statusCode:200,

headers:{
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
},

body:JSON.stringify(response)

}

}catch(e){

console.log(e)

return{

statusCode:500,
body:JSON.stringify({error:"analytics error"})

}

}

}
