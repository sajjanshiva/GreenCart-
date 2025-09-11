import { dummyOrders } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import { Dice1 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const MyOrders = () => {
      const [myorders, setMyOrders] = useState([]); // Assuming you will fetch or manage orders state
      const {currency,axios,user} = useAppContext(); // Assuming you have a context for currency

      const fetchMyOrders = async () => {
       try{
          const {data} = await axios.get('/api/order/user');
          if(data.success){
            setMyOrders(data.orders);
          }
       }catch(error){
        console.log(error.message);
       }
      }

        useEffect(() => {
          if(user){
            fetchMyOrders();
          }       
        }, [user]);


  return (
    <div className='mt-8'>
        <div className='mt-16pb-16'>
            <p className='text-2xl font-medium uppercase'>My orders</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>

        {myorders.map((order, index) => (
             <div key={index} className='border border-gray-300 mt-8 rounded-lg mb-10 p-4 py-5 max-w-4xl'> 

                <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col '>
                    <span> OrderId : {order._id}</span>
                    <span> Payment : {order.paymentType}</span>
                    <span> Total Amount :{currency}{order.amount}</span> 
                </p>
  
        {order.items.map((item,index) => (
            <div key={index} className='relative bg-white text-gray-500/70
               ${ order.items.length !== index+1 && "border-b"  }
             border-gray-300  flex flex-col md:flex-row justify-between items-center p-4
              py-4 md:gap-16 w-full max-w-4xl'>
              <div className='flex items-center mg-4 md:mb-0 '>

                <div className='bg-primary/10 p-4 rounded-lg'>
                    <img src={item.product.image[0]} alt={item.name} className='w-16 h-16' />
                </div>

               <div className='ml-4'>
                <h2 className='text-4xl font-medium text-gray-800'>{item.product.name}</h2>
                <p>category:{item.product.category}</p>
               </div>

              </div>

              <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
               <p>Quantity : {item.quantity}</p>
               <p>status : {order.status}</p>
               <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <p className='text-primary text-lg font-medium'
              >Amount:{currency} {item.product.offerPrice * item.quantity}</p>

             </div>
        ))}


             </div>
        ))} 

        
    </div>
  )
}

export default MyOrders
