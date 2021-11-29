import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

import '../styles/globals.scss';

import style from '../styles/_app.module.scss';

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>    
      <div className={style.wrapper}>      
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
 
  )
}

export default MyApp

