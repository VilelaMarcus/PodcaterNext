/* eslint-disable jsx-a11y/alt-text */
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { PlayerContext } from '../../contexts/PlayerContext';
import style from'./styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef(null);

    const [progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping,
        isShuffing,
        toggleLoop,
        togglePlay,
        toggleShuffle,
        playNext,
        playPrevious,
    } = useContext(PlayerContext);

    function setUpProgressListerner() {
        audioRef.current.currentTime = 0;
        
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(audioRef.current.currentTime);
        })
    }   

    function handleSeek(amount) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }

    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return(
        <div className={style.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ?  
                (
                    <div className={style.currentEpisode}>
                        <Image 
                            width={592} 
                            height={592} 
                            src={episode.thumbnail} 
                            objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) :  (
                    <div className={style.emptyPlayer}>
                        <strong>Selecione um para ouvir</strong>
                    </div>
                )
            }

            <footer className={!episode ? style.empty : '' }> 
                <div className={style.progress}>
                    <span>{episode ? convertDurationToTimeString(Math.floor(progress)) : '00:00'}</span>
                    <div className={style.slider}>
                       { episode ? 
                            (
                                <Slider 
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04d361' }}
                                    railStyle= {{ backgroundColor: '#9f75ff' }}
                                    handleStyle= {{ borderColor: '#04d361', borderWidth: 4 }}
                                />
                            ) : ( 
                            <div className={style.emptySlider}/>
                            )
                        }
                    </div>
                    <span>{episode ? convertDurationToTimeString(episode.duration) : '00:00'}</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        onLoadedMetadata={setUpProgressListerner}
                        onEnded={playNext}
                        autoPlay  
                    />
                )}        

                <div className={style.buttons}>
                    <button type="button" disabled={!episode} onClick={toggleShuffle}  className={isShuffing ? style.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Anterior" onClick={playPrevious} />
                    </button>
                    <button 
                    type="button" 
                    className={style.playButton} 
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        { isPlaying ? 
                        (
                            <img src="/pause.svg" alt="Pause" />
                        ) 
                        : 
                        (
                            <img src="/play.svg" alt="Tocar" />
                        )}
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Proximo" onClick={playNext} />
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? style.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}