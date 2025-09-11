import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const InputField = ({ type, placeholder, name, handleChange, address }) => {
    return (
        <input 
            type={type}  
            className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'     
            placeholder={placeholder}     
            name={name}     
            value={address[name]}
            onChange={handleChange}     
            required     
        />
    )
}

const AddAddress = () => {

    const {axios, user, setUser, navigate} = useAppContext();

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const onSubmitHandler = async (e) => {
         e.preventDefault();
        try{

            const { data } = await axios.post('/api/address/add', {address});
            if(data.success){
                 toast.success(data.message);
                navigate('/cart');
            }else{
                toast.error(data.message);
            }

        }catch(error){
            toast.error(data.message);
        }
    }

    useEffect(() => {
        if(!user){
            navigate('/cart');
        }
    }, []);

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-300'>Add Shipping
                <span className='font-semibold text-primary'> Address</span>
            </p>

            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='space-y-3'>

                            <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='firstName' 
                                type="text" 
                                placeholder="First Name" 
                            />
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='lastName' 
                                type="text" 
                                placeholder="Last Name" 
                            />
                            </div>

                            
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='email' 
                                type="email" 
                                placeholder="Email Address" 
                            />
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='street' 
                                type="text" 
                                placeholder="Street Address" 
                            />
                            

                            <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='city' 
                                type="text" 
                                placeholder="City" 
                            />
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='state' 
                                type="text" 
                                placeholder="State" 
                            />
                            </div>
                            
                            <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='zipcode' 
                                type="text" 
                                placeholder="Zip Code" 
                            />
                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='country' 
                                type="text" 
                                placeholder="Country" 
                            />
                            </div>

                            <InputField 
                                handleChange={handleChange}  
                                address={address} 
                                name='phone' 
                                type="text" 
                                placeholder="Phone Number" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className='w-full bg-primary text-white py-2.5 rounded hover:bg-primary-dull transition'
                        >
                            Save Address
                        </button>
                    </form>
                </div>
                <img 
                    className='md:mr-16 mb-16 md:mt-0' 
                    src={assets.add_address_iamge} 
                    alt="add_image" 
                />
            </div>
        </div>
    )
}

export default AddAddress