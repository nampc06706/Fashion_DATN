import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Star from "../Helpers/icons/Star";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { FaCartPlus, FaHeart } from 'react-icons/fa';

export default function ProductView() {
  const [cartItems, setCartItems] = useState(JSON.parse(Cookies.get('cart') || '[]'));
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [src, setSrc] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState(0);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
      toast.error('Lỗi khi giải mã token. Vui lòng đăng nhập lại.');
    }
  }

  // Fetch product details
  useEffect(() => {
    if (!id) {
      console.error("Product ID is not provided");
      return;
    }

    axios.get(`http://localhost:8080/api/guest/products/${id}`)
      .then(response => {
        const details = response.data;
        if (details) {
          const { images, sizes } = details;
          setProductDetails(details);

          if (images && images.length > 0) {
            setSrc(images[0].image);
          }

          if (sizes && sizes.length > 0) {
            const colorsWithStock = sizes
              .filter(size => size.quantityInStock > 0)
              .map(size => size.color.name);

            setAvailableColors([...new Set(colorsWithStock)]);
            const defaultColor = sizes[0].color.name;
            const sizesForDefaultColor = sizes.filter(size => size.color.name === defaultColor);
            setAvailableSizes(sizesForDefaultColor);

          }
        } else {
          console.warn("No product details available.");
        }
      })
      .catch(error => {
        console.error("Error fetching product details:", error.response || error.message);
      });
  }, [id]);

  // Update available sizes when color changes
  useEffect(() => {
    if (productDetails) {
      const sizesForColor = productDetails.sizes.filter(size => size.color.name === selectedColor);
      setAvailableSizes(sizesForColor);

      if (!sizesForColor.some(size => size.name === selectedSize && size.quantityInStock > 0)) {
        setSelectedSize("");
        setSizeStock(0);
      }
    }
  }, [selectedColor, productDetails]);

  const increment = () => {
    // Lấy giỏ hàng từ cookie
    const cartItems = JSON.parse(Cookies.get('cart') || '[]');

    // Tìm thông tin kích cỡ được chọn từ `availableSizes`
    const selectedSizeInfo = availableSizes.find(size => size.name === selectedSize);

    // Kiểm tra nếu không có kích cỡ được chọn hoặc không có tồn kho
    if (!selectedSizeInfo || selectedSizeInfo.quantityInStock <= 0) {
      toast.error('Kích cỡ không hợp lệ hoặc hết hàng.');
      return;
    }

    // Tìm sản phẩm hiện tại trong giỏ hàng
    const existingItem = cartItems.find(item => item.size.id === selectedSizeInfo.id);

    // Tổng số lượng hiện tại trong giỏ hàng
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    // Tổng số lượng mới sau khi tăng
    const newTotalQuantity = currentQuantityInCart + quantity + 1;

    // Kiểm tra tồn kho
    if (newTotalQuantity <= selectedSizeInfo.quantityInStock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Số lượng không thể vượt quá số lượng có sẵn trong kho. Chỉ còn ${selectedSizeInfo.quantityInStock - currentQuantityInCart} sản phẩm.`);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSizeChange = (size) => {
    if (size.quantityInStock > 0) {
      setSelectedSize(size.name);
      setSizeStock(size.quantityInStock);
      const newImage = productDetails.images.find(img => img.size === size.name);
      if (newImage) {
        setSrc(newImage.image);
      }
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const newImage = productDetails.images.find(img => img.color === color);
    if (newImage) {
      setSrc(newImage.image);
    }
  };

  const addToCart = async () => {
    const token = Cookies.get('token');

    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ.');
      return;
    }

    if (quantity <= 0) {
      toast.error('Số lượng không hợp lệ.');
      return;
    }

    const selectedSizeInfo = availableSizes.find(size => size.name === selectedSize);
    if (!selectedSizeInfo) {
      toast.error('Kích cỡ không hợp lệ.');
      return;
    }

    const cartItems = JSON.parse(Cookies.get('cart') || '[]');
    const existingItem = cartItems.find(item => item.size.id === selectedSizeInfo.id);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalQuantity > selectedSizeInfo.quantityInStock) {
      toast.error(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedSizeInfo.quantityInStock} sản phẩm.`);
      return;
    }

    const cartItem = {
      id: null,
      accountId: null,
      quantity: parseInt(quantity, 10),
      size: {
        id: selectedSizeInfo.id,
        productId: selectedSizeInfo.productId,
        name: selectedSize,
        quantityInStock: selectedSizeInfo.quantityInStock || 0,
        color: {
          id: selectedSizeInfo.color?.id || null,
          name: selectedSizeInfo.color?.name || "Unknown"
        }
      }
    };

    const updateCartCookie = (item) => {
      const cartItems = JSON.parse(Cookies.get('cart') || '[]');
      const existingItem = cartItems.find(existing => existing.size.id === item.size.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cartItems.push(item);
      }

      Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
      setCartItems(cartItems);
    };

    try {
      let response;

      if (!token) {
        response = await axios.post('http://localhost:8080/api/guest/carts', cartItem);
      } else {
        const decodedToken = jwtDecode(token);
        cartItem.accountId = decodedToken.accountId;
        response = await axios.post('http://localhost:8080/api/guest/carts', cartItem);
      }

      console.log('API Response:', response.data);

      if (response.data && response.data.id) {
        cartItem.id = response.data.id;
        updateCartCookie(cartItem);
        toast.success('Sản phẩm đã được thêm vào giỏ hàng.');
        setQuantity(1);
      } else {
        toast.success('Sản phẩm đã được thêm vào giỏ hàng.');
      }
    } catch (error) {
      toast.error('Số lượng vượt quá số lượng tồn kho.');
      console.error('Error adding product to cart:', error);
    }
  };

  const addFavourite = async () => {
    if (!token || !userInfo) {
      toast.error('Bạn cần đăng nhập để yêu thích sản phẩm này.');
      return;
    }

    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ.');
      return;
    }

    const selectedSizeInfo = availableSizes.find(size => size.name === selectedSize);
    if (!selectedSizeInfo) {
      toast.error('Kích cỡ không hợp lệ.');
      return;
    }

    const favouriteData = {
      sizeId: selectedSizeInfo.id,
      accountId: userInfo.accountId,
      quantity: parseInt(quantity, 10),
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/favourites',
        favouriteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success('Sản phẩm đã được thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      const errorMessage = error.response?.status === 403
        ? 'Bạn không có quyền yêu thích sản phẩm này.'
        : 'Không thể thêm sản phẩm vào danh sách yêu thích.';
      toast.error(errorMessage);
      console.error('Error adding product to favourites:', error);
    }
  };

  const changeImgHandler = (image) => {
    setSrc(image);
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { name, price, description, images, sizes, originalPrice, discount } = productDetails;
  const productName = name || 'No name available';
  const formattedPrice = price || '0.00';
  const formattedOriginalPrice = originalPrice || '0.00';
  const productDescription = description || 'No description available';
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatOriginalPrice = (originalPrice) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice);
  };

  // Kiểm tra nếu giá mới và giá cũ bằng nhau
  const isSamePrice = price === originalPrice;
  return (
    <div className="product-view w-full flex justify-center">
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
      <div className="product-image-container lg:w-1/2 xl:mr-16 lg:mr-8">
        <div className="relative overflow-hidden mb-4 rounded-lg shadow-lg border">
          {src ? (
            <img
              src={`/assets/images/${src}`}
              alt="Product Image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-qgray">Không có hình ảnh nào</div>
          )}

          {/* Hiển thị discount */}
          {discount && Number(discount) > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xl font-bold rounded-full py-1 px-3 shadow-md">
              -{Number(discount).toFixed(0)}%
            </div>
          )}
        </div>

        <div className="thumbnail-images flex gap-2 flex-wrap">
          {images.length > 0 ? images.map((img, index) => (
            <div
              onClick={() => changeImgHandler(img.image)}
              key={index}
              className={`w-[90px] h-[90px] border cursor-pointer p-2 rounded-md ${src === img.image ? "border-qred" : "border-gray-300"}`}
            >
              <img
                src={`/assets/images/${img.image}`}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          )) : (
            <div className="text-center text-qgray">Không có hình ảnh nào</div>
          )}
        </div>
      </div>

      <div className="product-details flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6">{productName}</h2>
        <div className="price mb-6 flex items-center">
          {!isSamePrice && (
            <span className="text-lg font-medium text-gray-400 line-through mr-4">
              {formatOriginalPrice(formattedOriginalPrice)}
            </span>
          )}
          <span className="text-2xl font-semibold text-qred">
            {formatPrice(formattedPrice)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-6">{productDescription}</p>

        {/* Color Selection */}
        <div className="color-selection mb-6">
          <span className="text-sm font-medium text-gray-500 uppercase mb-2 inline-block">Màu</span>
          <div className="flex gap-3">
            {availableColors.map((color, index) => (
              <div
                key={index}
                onClick={() => handleColorChange(color)}
                className={`w-[35px] h-[35px] rounded-full cursor-pointer transition-all duration-300 ${color === selectedColor
                  ? "border-4 border-white shadow-lg transform scale-110" // Tạo hiệu ứng khi chọn màu
                  : "border-2 border-gray-300" // Viền mặc định
                  }`}
                style={{
                  backgroundColor: color,
                  boxShadow: color === selectedColor ? "0 0 10px rgba(0, 0, 0, 0.4)" : "none", // Tạo bóng đổ khi chọn
                }}
              ></div>
            ))}
          </div>
        </div>


        {/* Lựa chọn kích thước */}
        <div className="size-selection mb-6">
          <span className="text-sm font-medium text-gray-500 uppercase mb-2 inline-block">Kích thước</span>
          <div className="flex gap-3">
            {availableSizes.map((size, index) => (
              <div
                key={index}
                onClick={() => handleSizeChange(size)}
                className={`w-[45px] h-[45px] border flex items-center justify-center cursor-pointer relative transition-all duration-300 ease-in-out
          ${size.name === selectedSize ? "border-qred animate-borderEffect" : "border-gray-300"}`}
              >
                {size.name}
              </div>
            ))}
          </div>
        </div>


        {/* Lựa chọn số lượng */}
        <div className="quantity-selection mb-6 flex items-center">
          <button
            onClick={decrement}
            className="w-[35px] h-[35px] border text-xl font-semibold text-gray-800 flex justify-center items-center"
          >
            -
          </button>
          <span className="w-[50px] h-[35px] flex justify-center items-center text-lg font-medium">{quantity}</span>
          <button
            onClick={increment}
            className="w-[35px] h-[35px] border text-xl font-semibold text-gray-800 flex justify-center items-center"
          >
            +
          </button>
        </div>

        {/* Nút hành động */}
        <div className="action-buttons flex gap-4 mb-6">
          <button
            onClick={addToCart}
            className="w-1/2 h-[50px] bg-blue-500 text-white text-sm font-semibold shadow-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <FaCartPlus className="text-white" /> {/* Thêm biểu tượng giỏ hàng */}
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={addFavourite}
            className="w-1/2 h-[50px] bg-gray-600 text-white text-sm font-semibold shadow-md hover:bg-gray-700 transition duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <FaHeart className="text-white" /> {/* Thêm biểu tượng yêu thích */}
            Yêu thích
          </button>
        </div>

      </div>
    </div>

  );
}
