import Image from "next/image";

export default function Task() {
    const dataList = [
        { text: "Hi", image: "", logo: "", isFullWidth: false },
        { text: "Hello", image: "/path/to/image1.jpg", logo: "", isFullWidth: false },
        { text: "Welcome", image: "", logo: "/path/to/logo1.png", isFullWidth: false },
        { text: "Good Morning", image: "", logo: "", isFullWidth: true },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
    ];

    return (
        <div className="w-full h-full grid grid-cols-2 gap-4 p-4">
            {dataList.map((item, index) => (
                <div
                    key={index}
                    className={`${item.isFullWidth ? 'col-span-2' : 'col-span-1'} bg-white border border-gray-300 p-4 flex flex-col items-center justify-center text-center`}
                >
                    {item.image && <img src={item.image} alt="Image" className="w-12 h-12 object-cover mb-4" />}
                    {item.logo && <img src={item.logo} alt="Logo" className="w-8 h-8 object-cover mb-4" />}
                    {item.text && <p className="text-base">{item.text}</p>}
                </div>
            ))}
        </div>
    );
};