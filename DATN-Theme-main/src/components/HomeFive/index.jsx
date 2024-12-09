import { useState, useEffect } from "react";
import BrandSection from "../Home/BrandSection";
import ProductsAds from "../Home/ProductsAds";
import Banner from "./Banner";
import SectionStyleOneHmFour from "../Helpers/SectionStyleOneHmFour";
import SectionStyleOneHmFour2 from "../Helpers/SectionStyleOneHmFour2";
import datas from "../../data/products.json";
import CampaignCountDown from "./CampaignCountDown";
import LayoutHomeFive from "../Partials/LayoutHomeFive";

function Index() {
  const [products, setProducts] = useState([]);
  const [flashSaleInfo, setFlashSaleInfo] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });
  const [isExpired, setIsExpired] = useState(false); // Trạng thái kiểm tra hết hạn

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/product-flashsale");
        const data = await response.json();
        //console.log(data);
        if (Array.isArray(data)) {
          setProducts(data);

          // Giả sử data[0] chứa thông tin flash sale
          if (data.length > 0 && data[0].flashsale) {
            const { name, startdate, enddate } = data[0].flashsale;

            // Chuyển đổi startdate và enddate thành đối tượng Date
            const startDate = new Date(startdate[0], startdate[1] - 1, startdate[2], startdate[3], startdate[4]);
            const endDate = new Date(enddate[0], enddate[1] - 1, enddate[2], enddate[3], enddate[4], enddate[5]);

            setFlashSaleInfo({
              name,
              startDate,
              endDate,
            });

            // Kiểm tra xem flash sale đã hết hạn chưa
            const currentDate = new Date();
            if (currentDate > endDate) {
              setIsExpired(true); // Đánh dấu hết hạn
            }
          }
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <LayoutHomeFive childrenClasses=" pt-0">
      <Banner className="mb-[60px]" />
      <SectionStyleOneHmFour
        products={products.slice(16, 20)}
        sectionTitle="Trendy Design"
        seeMoreUrl="/all-products"
        className="new-products mb-[60px]"
      />
      <BrandSection className="mb-[60px]" />
      <CampaignCountDown
        lastDate="2024-10-01T23:59:59"
        className="mb-[60px]"
        sectionTitle="New Arrival"
        seeMoreUrl="/flash-sale"
        products={products.slice(16, 28)}
      />
      {!isExpired && (
        <SectionStyleOneHmFour2
          sectionTitle="New Arrival"
          seeMoreUrl="/flash-sale"
          products={products.slice(16, 28)}
          className="mb-[60px]"
        />
      )}
    </LayoutHomeFive>
  );
}

export default Index;
