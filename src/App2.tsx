import {useContext} from 'react'
import { CryptoContext, CryptoContextProps } from './contexts/GlobalContext'

export const App2 = () => {
    // const {numOfDaysFromUrl } = useContext(CryptoContext) as CryptoContextProps
    //console.log("App2 rendered")
    return <div>
        <div className= "bg-yellow-300"> App 2 render test</div>
        {/* <div className= "bg-yellow-300"> {numOfDaysFromUrl }</div> */}
    </div>
}