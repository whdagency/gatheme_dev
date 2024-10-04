import { useMenu } from '../../hooks/useMenu';
import { Link, useLocation } from "react-router-dom";
import { APIURL, APIURLS3 } from '../../lib/ApiKey';
import { axiosInstance } from '../../../axiosInstance';
import SelectBox from './selectbox';
import logo from './logo.svg'

function Navbar ({  infoRes }) {
    const {
        restoSlug,resInfo
    } = useMenu();
    

    console.log("Logo URL:", infoRes.logo);

    return (
        <>
        
        <div className="w-full h-16 border-b-4 fixed flex justify-between items-center px-4 flex ">
            <div  className='flex items-center'>
                <img src={logo} alt="logo" className="w-12 h-12 mx-2" />
                <h1 className="text-black text-xl font-bold">{restoSlug}</h1>        
            </div>
            <div className='w-[100px] h-[40px] '>
                <SelectBox />
            </div>
        </div>  
        </>
    );

}
export default Navbar;