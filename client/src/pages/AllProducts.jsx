import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react'

const AllProducts = () => {

    const { products, searchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if(searchQuery.length > 0){
        setFilteredProducts(products.filter(product =>                        
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }else{
        setFilteredProducts(products);
    }
  },[products, searchQuery] );

  return (
    <div className='mt-16 flex flex-col'>
      <div>
        <p className='text-2xl font-medium uppercase'>All Products</p>
         <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-6">
       {filteredProducts.filter((product) => product.inStock).map((product,index) => (
           <ProductCard key={index} product={product} />
       ))}
      </div>

    </div>
  )
}

export default AllProducts
