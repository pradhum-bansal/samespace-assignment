import React, { useEffect, useState } from "react";
import ListItem from "../components/list";
import Frame from '../assets/Frame.svg'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import logo from '../assets/Logo.svg'
import profile from '../assets/Profile.svg'

const TABS = {
    for_you: 'for_you',
    top_tracks: 'top_tracks'
}

const Homepage = () =>{
    const [songsData, setSongsData] = useState([]);
    const [selectedSong, setSelectedSong] = useState({})
    const [activeTab, setActiveTab] = useState(TABS.for_you);
    const [filteredData, setFilteredData] = useState([])
    const getSongsInfo = () => {
        fetch('https://cms.samespace.com/items/songs', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then((res)=> {
            setSongsData(res.data);
            setFilteredData(res.data);
            setSelectedSong(res.data[0])
        })
    }

    useEffect(()=>{
        getSongsInfo();
        setActiveTab(TABS.for_you)
    }, [])
    useEffect(()=>{
        if(activeTab === TABS.top_tracks){
            let list_of_songs = songsData.filter((item)=> item.top_track === true);
            setFilteredData(list_of_songs)
        }
        else if(activeTab === TABS.for_you){
            setFilteredData(songsData)
        }
    },[activeTab])
    function handleNext(data){
        let id = data.id;
        filteredData.forEach((item, index)=> {
            if(item.id === id){

                setSelectedSong(filteredData[(index+1) % filteredData.length])
            }
        })
    }
    function handlePrev(data){
        let id = data.id;
        filteredData.forEach((item, index)=> {
            if(item.id === id){
                console.log((index - 1 + filteredData.length) % filteredData.length, "pradhum")
                setSelectedSong(filteredData[(index - 1 + filteredData.length) % filteredData.length])
            }
        })
    }
    return(
        <div className="homepage" style={{background: `linear-gradient(108deg, ${selectedSong.accent}, rgba(0, 0, 0, 0.60) 99.84%), #000`}}>
            <div className="sidebar">
                <div>
                    <img src={logo} alt="logo"/>
                </div>
                <div>
                    <img src={profile} alt="profile"/>
                </div>
            </div>
            <div className="middle">
                <div className="topbar">
                    <div onClick={()=> setActiveTab(TABS.for_you)} className={`for_you ${activeTab === TABS.for_you ? '' : 'not_selected'}`}>For You</div>
                    <div onClick={()=> setActiveTab(TABS.top_tracks)} className={`top_tracks ${activeTab === TABS.top_tracks ? '' : 'not_selected'}`}>Top Tracks</div>
                </div>
                <div className="search_bar">
                    <input placeholder="Search Song, Artist"/>
                    <img src={Frame} alt="search"/>
                </div>
                 <div className="list_item_container">
            {filteredData.map((item, index)=> {
                return(
                     <ListItem
                        icon = {item.cover}
                        artist={item.artist}
                        name={item.name}
                        data = {item}
                        selectedSong = {selectedSong}
                        setSelectedSong = {(value)=> setSelectedSong(value)}
                     />
                )
            })} 
            </div>
            </div>
            {selectedSong && Object.keys(selectedSong).length > 0 &&
            <div className="media-player">
                <div className="played_songs_details">
                    <div className="song_played">{selectedSong.name}</div>
                    <div className="artist_played">{selectedSong.artist}</div>
                </div>
                <div className="cover_art_container">
                   <img src={`https://cms.samespace.com/assets/${selectedSong.cover}`} alt="name" className="cover_art"/>
                </div>
                <AudioPlayer
                    autoPlay
                    src={selectedSong.url}
                    onPlay={e => console.log(e, "onPlay")}
                    showDownloadProgress={false}
                    showSkipControls={true}
                    showJumpControls={false}
                    onClickNext= {(e)=> handleNext(selectedSong)}
                    onClickPrevious= {(e)=> handlePrev(selectedSong)}
                    // other props here
                />
            </div>}
        </div>
    )
}
export default Homepage;