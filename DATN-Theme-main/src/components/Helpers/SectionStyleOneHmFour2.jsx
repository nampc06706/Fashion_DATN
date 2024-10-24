import { useState, useEffect } from "react";
import ViewMoreTitle2 from "./ViewMoreTitle2";
import DataIteration from "./DataIteration";
import ProductCardStyleThree2 from "./Cards/ProductCardStyleThree2";

export default function SectionStyleOneHmFour2({
  className,
  sectionTitle,
  seeMoreUrl,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/product-flashsale");
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
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
    <div data-aos="fade-up" className={`section-style-one ${className || ""}`}>
      <ViewMoreTitle2 categoryTitle={sectionTitle} seeMoreUrl={seeMoreUrl}>
        <div className="products-section w-full">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
            <DataIteration
              datas={products}
              startLength={0}
              endLength={products.length}
            >
              {({ data }) => (
                <div key={data.id} className="item">
                  <ProductCardStyleThree2 datas={data} />
                </div>
              )}
            </DataIteration>

          </div>
        </div>
      </ViewMoreTitle2>
    </div>
  );
}
