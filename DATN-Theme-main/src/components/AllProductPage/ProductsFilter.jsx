import { Range } from "react-range";
import Checkbox from "../Helpers/Checkbox";

export default function ProductsFilter({
  filters,
  checkboxHandler,
  volume,
  volumeHandler,
  storage,
  filterstorage,
  className,
  filterToggle,
  filterToggleHandler,
}) {
  return (
    <>
      <div
        className={`filter-widget w-full fixed lg:relative left-0 top-0 h-screen z-10 lg:h-auto overflow-y-scroll lg:overflow-y-auto bg-white px-[30px] pt-[40px] ${
          className || ""
        }  ${filterToggle ? "block" : "hidden lg:block"}`}
      >
        <div className="filter-subject-item pb-10 border-b border-qgray-border">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">
              Tìm sản phẩm theo danh mục
            </h1>
          </div>
          <div className="filter-items">
            <ul>
              {[
                { id: 'furnitures', label: 'Furnitures', checked: filters.furnitures },
                { id: 'sport', label: 'Sport', checked: filters.sport },
                { id: 'foodDrinks', label: 'Food & Drinks', checked: filters.foodDrinks },
                { id: 'fashion', label: 'Fashion Accessories', checked: filters.fashion },
                { id: 'toilet', label: 'Toilet & Sanitation', checked: filters.toilet },
                { id: 'makeupCorner', label: 'Makeup Corner', checked: filters.makeupCorner },
                { id: 'babyItem', label: 'Baby Items', checked: filters.babyItem }
              ].map(({ id, label, checked }) => (
                <li key={id} className="item flex justify-between items-center mb-5">
                  <div className="flex space-x-[14px] items-center">
                    <div>
                      <Checkbox
                        id={id}
                        name={id}
                        handleChange={(e) => checkboxHandler(e)}
                        checked={checked}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={id}
                        className="text-xs font-black font-400 capitalize"
                      >
                        {label}
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className="cursor-pointer">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect y="4" width="10" height="2" fill="#C4C4C4" />
                        <rect
                          x="6"
                          width="10"
                          height="2"
                          transform="rotate(90 6 0)"
                          fill="#C4C4C4"
                        />
                      </svg>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="filter-subject-item pb-10 border-b border-qgray-border mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Price Range</h1>
          </div>
          <div className="price-range mb-5">
            <Range
              draggableTrack
              step={1}
              max={1000}
              min={0}
              values={volume}
              onChange={volumeHandler}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="h-1 w-full bg-qgray-border rounded-md"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div {...props} className="h-4 w-4 bg-qyellow rounded-full" />
              )}
            />
          </div>
          <p className="text-xs text-qblack font-400">
            Price: ${volume[0]} - ${volume[1]}
          </p>
        </div>
        
        <div className="filter-subject-item pb-10 mt-10">
          <div className="subject-title mb-[30px]">
            <h1 className="text-black text-base font-500">Sizes</h1>
          </div>
          <div className="filter-items">
            <ul>
              {[
                { id: 'sizeS', label: 's', checked: filters.sizeS },
                { id: 'sizeM', label: 'M', checked: filters.sizeM },
                { id: 'sizeXL', label: 'XL', checked: filters.sizeXL },
                { id: 'sizeXXL', label: 'XXL', checked: filters.sizeXXL },
                { id: 'sizeFit', label: 'Sliem Fit', checked: filters.sizeFit }
              ].map(({ id, label, checked }) => (
                <li key={id} className="item flex justify-between items-center mb-5">
                  <div className="flex space-x-[14px] items-center">
                    <div>
                      <Checkbox
                        id={id}
                        name={id}
                        handleChange={(e) => checkboxHandler(e)}
                        checked={checked}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={id}
                        className="text-xs font-black font-400 capitalize"
                      >
                        {label}
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={filterToggleHandler}
          type="button"
          className="w-10 h-10 fixed top-5 right-5 z-50 rounded  lg:hidden flex justify-center items-center border border-qred text-qred"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
