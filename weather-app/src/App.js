import { useState } from 'react';
import Select from 'react-select'

const options = [
  { value: 'İstanbul', label: 'İstanbul' },
  { value: 'Ankara', label: 'Ankara' },
  { value: 'İzmir', label: 'İzmir' },
  { value: 'Bursa', label: 'Bursa' },
  { value: 'Çanakkale', label: 'Çanakkale' },
  { value: 'Manisa', label: 'Manisa' },
  { value: 'Antalya', label: 'Antalya' },
  { value: 'Aydın', label: 'Aydın' },
]
function App() {
  const [selectedCity,setSelectedCity] = useState(null)
  const [toastInfo,setToastInfo] = useState(false)
  const [weatherData,setWeatherData] = useState([])
  const [tomWeatherData,setTomWeatherData] = useState([])
  const tableTitles=["Temprature","Feels Like","Wind K/H","Humidity"]
  const tableTomTitles=["Avg Temp","Max Temp","Min Temp","Max Wind K/H","Avg Humidity"]

  function getWeather(){
    if(!selectedCity){return;}
    let data={city:selectedCity}
    const urlEncodedData = new URLSearchParams(data).toString();
    fetch("https://{your_ngrok_url}/api",{
      method:"post",
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:urlEncodedData
    }).then(response=>response.json()).then(data=>{
      setToastInfo(false)
      let newWeatherData=[]
      let newTomWeatherData=[]
      newWeatherData.push(data[0].temp_c)
      newWeatherData.push(data[0].feelslike_c)
      newWeatherData.push(data[0].wind_kph)
      newWeatherData.push(data[0].humidity)
      newTomWeatherData.push(data[1].avgtemp_c)
      newTomWeatherData.push(data[1].maxtemp_c)
      newTomWeatherData.push(data[1].mintemp_c)
      newTomWeatherData.push(data[1].maxwind_kph)
      newTomWeatherData.push(data[1].avghumidity)
      setWeatherData(newWeatherData)
      setTomWeatherData(newTomWeatherData)
    }).catch((error)=>{
      setToastInfo(true)
    })
  }
  return (
    <div className="flex flex-row pt-10">
    <div className="flex flex-grow flex-col pl-24 mt-36">
      <h1 className=" text-4xl font-semibold ">Pick a city</h1>
      <Select options={options} onChange={(e) =>{
        setSelectedCity(e.value)
        setWeatherData([])
        setTomWeatherData([])
      }} className=' font-medium mt-6 w-60' />
      <button onClick={getWeather} className=' bg-blue-600 p3 font-semibold text-white rounded-md mt-6 h-12 w-36 hover:bg-blue-900'>Show weather</button>
    </div>
    {toastInfo &&
    <div id="toast-default" className="flex absolute bottom-10 start-1/2 -translate-x-1/2 items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg shadow-slate-400" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span className="sr-only">Info icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">You have reached the request limit. Wait 10 seconds.</div>
        <button onClick={()=>{setToastInfo(false)}} type="button" className="ms-auto -mx-0.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-default" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    </div>}
    {selectedCity && 
    <div className="flex flex-grow flex-col">  
      <h1 className=" text-3xl font-semibold mt-10 self-center">{selectedCity}</h1>
      <hr className="h-px my-5 w-52 bg-gray-200 border-0 dark:bg-gray-300 self-center"></hr>
      <h2 className=" text-xl font-semibold mt-1 mb-2 self-center">Today</h2>   
      <table className="w-80 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 self-center">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
              {
                 tableTitles.map((value,j)=>
                  <th key={j} scope="col" className="px-6 py-3">
                      {value}
                  </th>
                 )
               }
              </tr>
          </thead>
          <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {
                 weatherData.map((value,k)=>
                  <td key={k} className="px-6 py-4">{value}</td>
                 )
               }
              </tr>
          </tbody>
      </table>
      <h2 className=" text-xl font-semibold mt-3 mb-2 self-center">Tomorrow</h2>  
      <table className="w-84 self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            {
               tableTomTitles.map((value,j)=>
                <th key={j} scope="col" className="px-6 py-3">
                    {value}
                </th>
               )
             }
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {
               tomWeatherData.map((value,k)=>
                <td key={k} className="px-6 py-4">{value}</td>
               )
             }
            </tr>
        </tbody>
      </table>
    </div>
    }
    </div>
  );
}

export default App;
