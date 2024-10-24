import { useState, useEffect } from "react";

export default function InputQuantityCom({ initialQuantity }) {
  // Khởi tạo state quantity từ props
  const [quantity, setQuantity] = useState(initialQuantity || 1);

  // Cập nhật quantity khi props thay đổi
  useEffect(() => {
    setQuantity(initialQuantity || 1);
  }, [initialQuantity]);

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="w-[120px] h-[40px] px-[26px] flex items-center border border-qgray-border">
      <div className="flex justify-between items-center w-full">
        <button
          onClick={decrement}
          type="button"
          className="text-base text-qgray"
        >
          -
        </button>
        <span className="text-qblack">{quantity}</span>
        <button
          onClick={increment}
          type="button"
          className="text-base text-qgray"
        >
          +
        </button>
      </div>
    </div>
  );
}
