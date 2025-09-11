import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { Link, NavLink, Outlet } from "react-router-dom";

const SellerLayout = () => {

const { axios , navigate} = useAppContext();

const logout = async () => {
  try{
   const {data} = await axios.get('/api/seller/logout');
   if(data?.success){
    toast.success(data.message);
    navigate("/");
   }else{
    toast.error(data.message);
   }
  }catch(error){
    toast.error(error.message);
  }
}

   

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon:assets.add_icon  },
        { name: "product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    return (
        <>
        <div className="min-h-screen flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="cursor-pointer w-34" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500">
        <p>Hi! Admin</p>
        <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
      </div>
    </div>

    {/* Main content: Sidebar + Page Content */}
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <div className="md:w-64 w-16 border-r border-gray-300 pt-4 flex flex-col">
        {sidebarLinks.map((item) => (
          <NavLink to={item.path} key={item.name} end={item.path === '/seller'}
            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
              ${isActive
                ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-primary text-primary-dull"
                : "hover:bg-gray-100/90 border-white text-gray-700"
              }`}>
            <img src={item.icon} alt="icon" className="w-7 h-7" />
            <p className="md:block hidden">{item.name}</p>
          </NavLink>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  </div>
        </>
    );
};

export default SellerLayout;