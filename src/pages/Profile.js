const Profile = () => {
    return (
        <div className="p-4 text-center">
            <img className="w-[20svh] aspect-square mx-auto my-5 rounded-full" alt="Profile" src="https://c.tenor.com/kglDzTqoEUAAAAAC/tenor.gif" />
            <h1>Galang Satrio Wicaksono</h1>
            <h1 className="mb-4">21120122130051</h1>
            <a href="https://data.bmkg.go.id" className='text-slate-400'>Data diambil dari data.bmkg.go.id</a>
            <img className="w-[8svh] mx-auto mt-5 rounded-full" alt="BMKG Logo" src="https://pbs.twimg.com/profile_images/2198270324/logo_BMKG_400x400.png" />
            <h1 className="text-2xl">BMKG</h1>
        </div>
    );
};

export default Profile;
