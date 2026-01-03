import Image from "next/image";

export default function Event() {
    const dataList = [
        { text: "Hi", image: "", logo: "", isFullWidth: false },
        { text: "Hello", image: "/path/to/image1.jpg", logo: "", isFullWidth: false },
        { text: "Welcome", image: "", logo: "/path/to/logo1.png", isFullWidth: true },
        { text: "Good Morning", image: "", logo: "", isFullWidth: true },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
        { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false }, { text: "Hi Again", image: "/path/to/image2.jpg", logo: "", isFullWidth: false },
        { text: "Evening", image: "", logo: "", isFullWidth: false },
    ];

    return (

        <div className="scrollbar-hide w-full h-screen  grid grid-cols-2 gap-4 p-4">
            {dataList.map((item, index) => (
                <div key={index} className={`${item.isFullWidth ? "col-span-2" : "col-span-1"} h-50  bg-red-500 flex justify-center items-center `}>
                    <h1 className="text-black">
                        {item.text}
                    </h1>
                </div>
            ))
            }
        </div >

    );
}
