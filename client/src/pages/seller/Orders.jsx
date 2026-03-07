import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
    'All',
    'Order Placed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
];

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [statusFilter, setStatusFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchOrders = async (page = 1) => {
        try {
            let url = `/api/order/seller?page=${page}&limit=10`;
            if (statusFilter !== 'All') url += `&status=${statusFilter}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;

            const { data } = await axios.get(url);
            if (data.success) {
                setOrders(data.orders);
               setCurrentPage(data.pagination?.currentPage || 1);
              setTotalPages(data.pagination?.totalPages || 1);
               setTotalOrders(data.pagination?.totalOrders || 0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const { data } = await axios.post('/api/order/status', { orderId, status });
            if (data.success) {
                toast.success('Status updated!');
                fetchOrders(currentPage);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleFilter = () => {
        setCurrentPage(1);
        fetchOrders(1);
    };

    const handleReset = () => {
        setStatusFilter('All');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
        setTimeout(() => fetchOrders(1), 100);
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, []);

    return (
        <div className='flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">
                    Orders List
                    <span className="text-sm text-gray-500 ml-2">
                        ({totalOrders} total)
                    </span>
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Status Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
                        >
                            {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">From Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
                        />
                    </div>

                    {/* Date To */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">To Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-end gap-2">
                        <button
                            onClick={handleFilter}
                            className="bg-primary text-white px-4 py-1.5 rounded text-sm hover:bg-primary-dull transition"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-300 transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No orders found</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                            
                            {/* Items */}
                            <div className="flex gap-5">
                                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                                <div>
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex flex-col">
                                            <p className="font-medium">
                                                {item.product.name}{'  '}
                                                <span className='text-primary'>x {item.quantity}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="text-sm">
                                <p className='font-medium mb-1'>
                                    {order.address.firstName} {order.address.lastName}
                                </p>
                                <p>{order.address.street}, {order.address.city}</p>
                                <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                <p>{order.address.phone}</p>
                            </div>

                            {/* Amount */}
                            <p className="font-medium text-base">
                                {currency}{order.amount}
                            </p>

                            {/* Status + Info */}
                            <div className="flex flex-col text-sm md:text-base text-black/60 gap-1">
                                <p>Method: {order.paymentType}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                                {/* Status Dropdown */}
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                    className="mt-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none text-black"
                                >
                                    {ORDER_STATUSES.filter(s => s !== 'All').map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => {
                                setCurrentPage(p => p - 1);
                                fetchOrders(currentPage - 1);
                            }}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            ← Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    fetchOrders(i + 1);
                                }}
                                className={`px-3 py-1 rounded border text-sm transition
                                    ${currentPage === i + 1
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                setCurrentPage(p => p + 1);
                                fetchOrders(currentPage + 1);
                            }}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;