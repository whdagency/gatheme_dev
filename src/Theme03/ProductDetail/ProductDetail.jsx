import { Link,useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { APIURL, APIURLS3 } from '../../lib/ApiKey';

const ProductDetail = () => {
    const location = useLocation();
    const { item } = location.state || {}; // Récupère l'élément sélectionné
  

    useEffect(() => {
        if (item) {
          console.log("Détails du produit sélectionné:", item);
        } else {
          console.error("Aucun item trouvé dans l'état.");
        }
      }, [item]);


    return (
      <div className='w-full h-full bg-[green]'>

        <Link to="/menu/${slug}?table_id=${table_id}" className="w-[50px] h-[50px] rounded-[10px] border-[1px] border-[solid] border-[#898989] ml-4 flex justify-center items-center">
                      <FaChevronLeft />
        </Link>
        <div>
            {item.name}
            {item.image1 && (
                <img src={`${APIURLS3}/${item.image1}`} alt={item.name} />
            )}
            {item.desc}

            
            
               
            
        </div>
      </div>
    );
  };
  
  export default ProductDetail;
  