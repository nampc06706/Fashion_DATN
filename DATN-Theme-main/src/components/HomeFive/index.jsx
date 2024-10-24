import React from "react";
import BrandSection from "../Home/BrandSection";
import ProductsAds from "../Home/ProductsAds";
import Banner from "./Banner";
import SectionStyleOneHmFour from "../Helpers/SectionStyleOneHmFour";
import SectionStyleOneHmFour2 from "../Helpers/SectionStyleOneHmFour2";
import datas from "../../data/products.json";
import CampaignCountDown from "./CampaignCountDown";
import SectionStyleFour from "../Helpers/SectionStyleFour";
import LayoutHomeFive from "../Partials/LayoutHomeFive";

function Index() {
  const { products } = datas;
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
      <CampaignCountDown lastDate="2024-10-01T23:59:59"  className="mb-[60px]" />
      <ProductsAds
        ads={[`/assets/images/banner-cs.webp`]}
        className="products-ads-section mb-[60px]"
      />
      <SectionStyleOneHmFour2
        sectionTitle="New Arrival"
        seeMoreUrl="/all-products"
        products={products.slice(16, 28)}
        className="mb-[60px]" 
      />

      <ProductsAds
        sectionHeight="164"
        ads={[`/assets/images/banner-cs1.jpg`]}
        className="products-ads-section mb-[60px]"
      />
    </LayoutHomeFive>
  );
}

export default Index;
