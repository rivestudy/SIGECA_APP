import React from 'react';

const EqTab = ({ eqs }) => {
    return (
        <ul className='grid grid-cols-1 gap-2 mx-2'>
            <div className=''>
                {eqs.map((eq, index) => (
                    <div className={`grid mb-2 min-h-[10svh] rounded-md grid-cols-5 p-3 gap-2 ${index % 2 === 0 ? 'bg-gray-300 shadow-sm shadow-slate-600' : 'bg-gray-100'}`}>
                        <h1
                            key={index}
                            className={` text-2xl font-bold rounded-md flex items-center justify-center h-full ${eq.Magnitude < 3 ? 'bg-green-300' : eq.Magnitude < 5 ? 'bg-yellow-300' : eq.Magnitude < 7 ? 'bg-orange-300' : 'bg-red-300'}`}
                        >
                            {eq.Magnitude}
                        </h1>
                        <h1 key={index} className='flex items-center justify-center h-full col-span-4'>{eq.Wilayah}</h1>
                    </div>
                ))}
            </div>
        </ul>

    );
};

export default EqTab;