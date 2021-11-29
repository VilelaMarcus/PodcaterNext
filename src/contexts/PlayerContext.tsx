import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
    title: string;
    thumbnail:string;
    members: string;
    duration:number;
    url: string;
};

type PlayerContent = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffing: boolean;
    play: (episode: Episode) => void;
    playList: (episodeList: Episode[], index: number ) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
};

export const PlayerContext = createContext({} as PlayerContent);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider( { children }: PlayerContextProviderProps ) {
  
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffing, setIsShuffing ] = useState(false);

  function play(episode:Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }
  
  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffing(!isShuffing);
  }

  function playList(list : Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function playNext(){
    const nextEpisode =  currentEpisodeIndex + 1;
    if(!isPlaying){
        setIsPlaying(true);
    }

    if(isShuffing){
        const nextRamdomEpisode = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRamdomEpisode);
    }
    else if(nextEpisode  < episodeList.length){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }   
  }

  function playPrevious(){
    const nextEpisode =  currentEpisodeIndex - 1;
    if(nextEpisode  <= 0){
        return;
    }
    setCurrentEpisodeIndex(currentEpisodeIndex - 1);
   }

  return (
    <PlayerContext.Provider 
        value={{ 
            episodeList, 
            currentEpisodeIndex,
            isPlaying,
            isLooping, 
            isShuffing,
            playNext,
            playPrevious,
            play, 
            playList,
            togglePlay,
            toggleShuffle,
            toggleLoop 
        }}>
            {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}