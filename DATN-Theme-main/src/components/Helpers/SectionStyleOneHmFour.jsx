import { useState, useEffect } from "react";
import DataIteration from "./DataIteration";
import ViewMoreTitle from "./ViewMoreTitle";
import ProductCardStyleThree from "./Cards/ProductCardStyleThree";

export default function SectionStyleOneHmFour({
  className,
  sectionTitle,
  seeMoreUrl,
}) {
  const [products, setProducts] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/guest/products/latest");
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
      <ViewMoreTitle categoryTitle={sectionTitle} seeMoreUrl={seeMoreUrl}>
        <div className="products-section w-full">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
            <DataIteration
              datas={products}
              startLength={0}
              endLength={products.length}
            >
              {({ data }) => (
                <div key={data.id} className="item">
                  <ProductCardStyleThree datas={data} />
                </div>
              )}
            </DataIteration>

          </div>
        </div>
      </ViewMoreTitle>
    </div>
  );
}
