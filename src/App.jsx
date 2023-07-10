import errorimg from './imgs/404img.png';
import './App.css';
import React, { useEffect, useState } from 'react';

function App(){
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [height, setHeight] = useState('60px')
  const [hidden, setHidden] = useState('none')
  const [weatherID, setWeatherID] = useState('')
  const [errorHidden, setErrorHidden] = useState('')

  const weatherstatus = {
    ebdb : [200, 299], //tunder
    f61e : [300, 504], //light rain
    f61d : [511, 511], //frozenrain
    f61f : [520, 531], //heavy rain
    eb3b : [600, 699], //snow
    f076 : [700, 799], // thermostat
    e81a : [800, 800], // sunny
    f172 : [801, 801], // sunnywithclouds
    f15b : [802, 804], // clouds
  }

  if(location && Object.keys(data).length === 0){
    getData()
  }

  useEffect(() => {
    geolocalization()
  }, [])

  function geolocalization() {
    navigator.geolocation.getCurrentPosition((position) =>{
      let lat = position.coords.latitude
      let lon = position.coords.longitude

      fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APIK}`).then(response => response.json()).then(response =>{
        if(response.cod !== '404'){
        setLocation(response[0].name)
        }
      })
    })
  }

  const findLocation = (event) => {
    if (event.key === 'Enter'){
      getData()
    }
  }
  
  function getData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${import.meta.env.VITE_APIK}&units=metric`).then(response => response.json()).then(response =>{
      if(location === ''){
        setHeight('60px')
        setHidden('none')
        return
      }

      if(response.cod === '404'){
        setHidden('none')
        setHeight('400px')
        setTimeout(() =>{
          setErrorHidden('flex')
        }, 1000)
        return
      }
      setErrorHidden('none')
      setData(response)
      setHeight('400px')
      setWeatherID(response.weather[0].id)
      setTimeout(() =>{
        setHidden('contents')
      }, 1000)
    })
  }

  function getweathercode(weatherID) {
    let iconCode = ''
    for (const key in weatherstatus ) {
        let min = weatherstatus[key][0]
        let max = weatherstatus[key][1]
        if (weatherID >= min && weatherID <= max){
            iconCode = key
            break;
        }
    }
    return iconCode;
  }

  return (
      <div className='container' style={{height: height}}>
        <button onClick={geolocalization} className='geo-button'><span className="material-symbols-outlined">&#xe0c8;</span></button>
        <input value={location} onChange={event => setLocation(event.target.value)} onKeyPress={findLocation} type='text' className='text-box' placeholder='Enter a city'></input>
        <button onClick={getData}
        className='search-button'><span className="material-symbols-outlined">&#xe8b6;</span></button>
        <div className='data-container' style={{display: hidden}}>
          <div className='main-weather'>
            <span dangerouslySetInnerHTML={{__html: `&#x${ getweathercode(weatherID)};` }} id='mainweathericon' className="material-symbols-outlined"></span>
            {data.main ? <div>{data.main.temp.toFixed(0)}°C</div> : null}
          </div>
          <div className='max-min-humidity'>
            <div className='max'>
            <span id='specicon' className="material-symbols-outlined">&#xe8e5;</span>
            {data.main ? <div>{data.main.temp_max.toFixed(0)}°C</div> : null}
            </div>
            <div className='hum'>
            <span id='specicon' className="material-symbols-outlined">&#xf87e;</span>
            {data.main ? <div>{data.main.humidity.toFixed(0)}%</div> : null}
            </div>
            <div className='min'>
            <span id='specicon' className="material-symbols-outlined">&#xe8e3;</span>
            {data.main ? <div>{data.main.temp_min.toFixed(0)}°C</div> : null}
            </div>
          </div>
        </div>    
        <div className='errormsg' style={{display: errorHidden}} >
            <img src={errorimg} alt='404' className="errorimg" />
            something went wrong please try again :/
        </div>
      </div>
  );
}

export default App;