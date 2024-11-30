export default function DiscountBanner({ className }) {
  return (
    <div
      className={`discount-banner w-full h-[307px] bg-cover  relative ${
        className || ""
      }`}
      style={{
        background: `url(/assets/images/discount-banner-3.jpg) no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div className="container-x mx-auto relative h-full">
        <div className="thumb absolute -left-[140px] -top-[87px] w-[520px] h-[394px]">
          <img
            src="/assets/images/banner-4.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex justify-center items-center w-full h-full relative xl:left-[100px]">
          <div>
            <div data-aos="fade-up">
              <h1 className="sm:text-3xl text-xl font-700 text-qblack mb-2 text-center">
              <span className="mx-1 text-qred">"Nâng tầm sự nghiệp, khẳng định phong cách riêng."</span> 
              
              </h1>
              <p className="text-center sm:text-[18px] text-sm font-400">
              Công sở sang trọng, phong cách tinh tế 
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
