import React, { useState, useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, details }) => {
    const modalRef = useRef();

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center px-5 bg-black bg-opacity-50">
            <div ref={modalRef} className="p-4 bg-white rounded-lg shadow-lg">
                <div className='grid grid-cols-4 m-3'>
                    <ul className='font-semibold'>Magnitudo</ul>
                    <ul className='col-span-3'>: {details.Magnitude} SR</ul>
                    <ul className='font-semibold'>Episenter</ul>
                    <ul className='col-span-3'>: {details.Wilayah}</ul>
                    <ul className='font-semibold'>Waktu</ul>
                    <ul className='col-span-3'>: {`${details.Tanggal} - ${details.Jam}`}</ul>
                    <ul className='font-semibold'>Kedalaman</ul>
                    <ul className='col-span-3'>: {details.Kedalaman}</ul>
                    <ul className='font-semibold'>Koordinat</ul>
                    <ul className='col-span-3'>: {details.Coordinates}</ul>
                </div>
            </div>
        </div>
    );
};


const EqTab = ({ eqs }) => {
    const [selectedEq, setSelectedEq] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleEqClick = (eq) => {
        setSelectedEq(eq);
        setModalOpen(true);
    };

    return (
        <>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {eqs.map((eq, index) => (
                    <div
                        key={index}
                        onClick={() => handleEqClick(eq)}
                        className={`grid grid-cols-5 mb-2 min-h-[10svh] rounded-md p-3 gap-2 cursor-pointer ${index % 2 === 0 ? 'bg-gray-300 shadow-sm shadow-slate-600' : 'bg-gray-100'}`}
                    >
                        <h1
                            className={`text-2xl font-bold rounded-md flex items-center justify-center h-full ${eq.Magnitude < 3 ? 'bg-green-300' : eq.Magnitude < 5 ? 'bg-yellow-300' : eq.Magnitude < 7 ? 'bg-orange-300' : 'bg-red-300'}`}
                        >
                            {eq.Magnitude}
                        </h1>
                        <h1 className='flex items-center justify-center h-full col-span-4'>{eq.Wilayah}</h1>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} details={selectedEq} />
        </>
    );
};

export default EqTab;
