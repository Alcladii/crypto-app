import React, {useState, useEffect, useContext} from "react";
import { Link, useHistory} from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";
//import "./styles.css";
import LineChart from "../components/LineChart"
import BarChart from "../components/BarChart"
import LineChartIndividualCoin from "../components/LineChartIndividualCoin"
import '../App.css'
//import api from "../api";
import InfiniteScroll from 'react-infinite-scroll-component'
import { CryptoContext } from "../contexts/cryptoContext";

const CoinTag = styled.img`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IndividualCoinWrapper = styled.div`
  border: 1px solid black;
`

const ProgressBarOuter = styled.div`
  border: 1px solid black;
  border-radius: 99px;
  background: #A505D0;
  height: 10px;
  width: auto;
`

const ProgressBarInner = styled.div`
  border-radius: 99px;
  height: 10px;
  width: ${(props) => props.width * 5.44}px;  
  background: purple;
`

console.clear();

function Coins() {

  const {
    coinList,
    getCoinList,
    coinListDsc,
    setToDsc,
    setToAsc,
    isLoading,
    hasError,
    useLocalState,
  } = useContext(CryptoContext)

  const [priceList, setPriceList] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [numOfDays, setNumOfDays] = useLocalState("numOfDays", []);
  const [sortByPriceDirection, setSortByPriceDirection] = useState(false)
  const [coinPage, setCoinPage] = useState(1)

  /*const getCoinList = async () => {
    try {
      /*setIsLoading(true);
      const {data}  = await axios(      
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${coinPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      setCoinList(coinList.concat(data))
      setCoinPage(coinPage + 1)*/
      /*const { coins }  = await api(
        "/coins/markets",
        "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
      );*/
      /*let coins;
      if (coinListDsc === true){
        setIsLoading(true)
        const response = await api(
          "/coins/markets",
          "vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
        );
        coins = response.data;
        //console.log("top 50", coins)
      } else if (coinListDsc === false) {
        setIsLoading(true)
        const response = await api(
          "/coins/markets",
          "vs_currency=usd&order=market_cap_asc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
        );        
        coins = response.data;   
        //console.log("bottom 50", coins)
      }
      //console.log(coins)
      setCoinList(coins);
      setIsLoading(false);
      setHasError(false)
      //console.log(data)
      } catch (err) {
      //console.log("Error in Fetching Data")
      setHasError(true); 
      setisLoading(false);
    }
  };*/

  const getCoinPriceVolume = async (numOfDays) => {
    try {
      //setIsLoading(true);
      const { data } = await axios(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${numOfDays}&interval=daily`
      );
      /*const { data } = await api(
        "/coins/bitcoin/market_chart",
        `vs_currency=usd&days=${numOfDays}&interval=daily`
      );*/
      //setIsLoading(false);
      //setHasError(false);
      setNumOfDays(numOfDays);
      setPriceList(data.prices);
      setVolumeList(data.total_volumes);
    } catch (err) {
      console.log("error getting price and volume")
      //setHasError(true);
      //setIsLoading(false);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
        text: "Chart.js Line Chart"
      }
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
          drawBorder: false
        }
      },
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    tension: 0.5
  };
  
  useEffect(()=>{
    getCoinList()
  }   
  , []);

  useEffect(()=>{
    getCoinPriceVolume(numOfDays)
  }, [])

  /*const setToDsc = () => {
    setCoinListDsc(true); 
  };

  const setToAsc = () => {
    setCoinListDsc(false); 
  };*/

  useEffect(()=>{
    getCoinList()
  }   
  , [coinListDsc]);

    
    const history = useHistory();

    const handleClick = (item) => {
      history.push(`/coin-page/${item.id}`);
    };


    return (
      
      <div className="App">
        <div>                   
          <button onClick={() => { getCoinPriceVolume(0)}}> 1 Day </button>&nbsp;&nbsp;
          <button onClick={() => { getCoinPriceVolume(6)}}> 7 Days </button>&nbsp;&nbsp;
          <button onClick={() => { getCoinPriceVolume(30)}}> 1 Month </button>&nbsp;&nbsp;
          <button onClick={() => { getCoinPriceVolume(89)}}> 90 Days </button>&nbsp;&nbsp;
          <button onClick={() => { getCoinPriceVolume(179)}}> 180 Days </button>&nbsp;&nbsp;
          <button onClick={() => { getCoinPriceVolume(364)}}> 1 Year </button>
        </div>       
        <div className='chart'>
          <LineChart  priceList={priceList} />
          <BarChart  volumeList={volumeList} />
        </div>
        <div>
          <button onClick={setToDsc}> Top 50 </button>&nbsp;&nbsp;
          <button onClick={setToAsc}> Bottom 50 </button>
          {isLoading && <div>loading</div>}
          {/*<InfiniteScroll
            dataLength={coinList}
            next={getCoinList}
            hasMore={true}
            loader={<h4>Infinite coins loading</h4>}
          >*/}
          {coinList.map((singleCoin) => (
          <div key={singleCoin.id} className='individual-coin'>
          {/*(<Link to={`/coin-page/${item.id}`}>
                {/*<CoinTag src={item.image}/>&nbsp;&nbsp;
                <span >{item.name}</span> 
          </Link>*/}
            
            <div className='coin-column-width' onClick={()=>handleClick(singleCoin)}>            
              <div className='coin-name-icon-wrapper'>
                <CoinTag src={singleCoin.image}/>&nbsp;&nbsp;
                <span >{singleCoin.name}</span>             
              </div>                        
           </div>&nbsp;&nbsp;
            <div className='coin-data-width'>${singleCoin.current_price/*.toLocaleString()*/}</div>&nbsp;&nbsp; 
            <div className='coin-data-width'>{singleCoin.price_change_percentage_1h_in_currency !== null
              ? singleCoin.price_change_percentage_1h_in_currency.toFixed(2)
              : 'N/A'}
            </div>
            <div className='coin-data-width'>{singleCoin.price_change_percentage_24h_in_currency !== null
              ? singleCoin.price_change_percentage_24h_in_currency.toFixed(2)
              : 'N/A'}
            </div>
            <div className='coin-data-width'>{singleCoin.price_change_percentage_7d_in_currency !== null
              ? singleCoin.price_change_percentage_7d_in_currency.toFixed(2)
              : 'N/A'}
            </div>
            {/*<div className='coin-data-width'>{singleCoin.price_change_percentage_24h_in_currency.toFixed(2)}%</div>&nbsp;&nbsp; 
            <div className='coin-data-width'>{singleCoin.price_change_percentage_7d_in_currency.toFixed(2)}%</div>&nbsp;&nbsp;*/}
            <div className='coin-column-width'>
              <span>{(singleCoin.market_cap_change_24h/1000000000).toFixed(2)}B</span>&nbsp;&nbsp;
              <span>{(singleCoin.market_cap/1000000000).toFixed(2)}B</span>
              <ProgressBarOuter>
                <ProgressBarInner width={(singleCoin.market_cap_change_24h/singleCoin.market_cap) * 100}></ProgressBarInner>
              </ProgressBarOuter>
            </div>
            <div className='coin-column-width'>
              <div className='individual-coin-chart'>
                <LineChartIndividualCoin priceList={singleCoin.sparkline_in_7d.price}/>
              </div>
          </div>
          </div>
        ))}
        {/*</InfiniteScroll>*/}
        {hasError && <div>Error in fetching Data</div>}
      </div>
      </div>
    );
}

export default Coins;