import { useState, useEffect } from "react";

export default function InputQuantityCom({ initialQuantity, id, onQuantityChange }) {
  const [quantity, setQuantity] = useState(Number(initialQuantity) || 1);

  useEffect(() => {
    const newQuantity = Number(initialQuantity) || 1; // Đảm bảo chuyển đổi thành số
    //console.log("Updated Initial Quantity:", newQuantity);
    setQuantity(newQuantity);
  }, [initialQuantity]);
  

  const increment = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      //console.log("Incremented Quantity:", newQuantity);
      onQuantityChange(id, newQuantity); // Gọi hàm callback với số lượng mới
      return newQuantity;
    });
  };
  

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        //console.log("Decremented Quantity:", newQuantity);
        onQuantityChange(id, newQuantity); // Gọi hàm callback với số lượng mới
        return newQuantity;
      });
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
