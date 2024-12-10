export default function BrandSection({ className, sectionTitle }) {
  return (
    <div data-aos="fade-up" className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className="section-title flex justify-between items-center mb-8">
          <div>
            <h1 className="sm:text-3xl text-2xl font-bold text-gray-900">
              {sectionTitle}
            </h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-6">
          
          {/* Brand Item */}
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-8.webp`} alt="logo" className="object-contain" />
            </div>
          </div>

          {/* Additional Brand Items (Repeat for other images) */}
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-9.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-10.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-11.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-12.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand1.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand2.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-3.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-4.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-5.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-6.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
          <div className="item">
            <div className="w-full h-[130px] bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <img src={`/assets/images/brand-7.webp`} alt="logo" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
