import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Star from "../Helpers/icons/Star";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

export default function ProductView() {
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
    if (quantity < sizeStock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error('Số lượng không thể vượt quá số lượng có sẵn trong kho.');
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

    // Khởi tạo ID tạm thời, có thể là null hoặc một giá trị mặc định
    let id = null; // hoặc gán một giá trị tạm thời nếu cần

    const cartItem = {
      id: id, // ID tạm thời sẽ được cập nhật từ backend
      accountId: null, // ID tài khoản, sẽ được cập nhật nếu có
      quantity: parseInt(quantity, 10),
      size: {
        id: selectedSizeInfo.id,
        productId: selectedSizeInfo.productId,
        name: selectedSize,
        quantityInStock: selectedSizeInfo.quantityInStock || "0",
        color: {
          id: selectedSizeInfo.color?.id || null,
          name: selectedSizeInfo.color?.name || "Unknown"
        }
      }
    };

    const updateCartCookie = (item) => {
      let cartItems = JSON.parse(Cookies.get('cart') || '[]');
      const existingItem = cartItems.find(existing => existing.size.id === item.size.id);

      if (existingItem) {
        // Cập nhật quantity
        existingItem.quantity += item.quantity;

        // Cập nhật ID từ phản hồi nếu có
        existingItem.id = item.id || existingItem.id; // Chỉ cập nhật nếu ID có
      } else {
        // Thêm mới mục vào giỏ hàng
        cartItems.push(item);
      }
      // Lưu lại giỏ hàng vào cookie
      Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
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

      // Cập nhật ID tạm thời từ phản hồi
      if (response.data && response.data.id) {
        cartItem.id = response.data.id; // Cập nhật ID từ phản hồi
      } else {
        //console.error('Không tìm thấy ID trong phản hồi:', response.data);
      }

      updateCartCookie(cartItem);
      toast.success('Sản phẩm đã được thêm vào giỏ hàng.');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
      console.error('Error adding product to cart:', error);
    }

  };


  const addFavourite = async () => {
    if (!userInfo) {
      toast.error('Bạn cần đăng nhập để yêu thích sản phẩm này.');
      return;
    }

    const favouriteData = {
      sizeId: id,          // ID của kích thước sản phẩm
      accountId: userInfo.accountId,
      quantity: quantity,  // Sử dụng giá trị quantity từ state
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/favourites',
        favouriteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success('Sản phẩm đã được thêm vào danh sách yêu thích!');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error('Lỗi 403: Không có quyền truy cập hoặc token đã hết hạn.', error.response.data);
        toast.error('Bạn không có quyền yêu thích sản phẩm này.');
      } else {
        console.error('Có lỗi xảy ra khi thêm sản phẩm vào yêu thích:', error);
        toast.error('Không thể thêm sản phẩm vào danh sách yêu thích.');
      }
    }
  };
  const changeImgHandler = (image) => {
    setSrc(image);
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { name, price, description, images, sizes } = productDetails;
  const productName = name || 'No name available';
  const formattedPrice = price || '0.00';
  const productDescription = description || 'No description available';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product-view w-full lg:flex justify-between">
      <div className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]">
        <div className="w-full">
          <div className="w-full h-[600px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3">
            {src ? (
              <img
                src={`/assets/images/${src}`}
                alt="Product Image"
                className="w-full h-full object-contain max-w-full max-h-full"
              />
            ) : (
              <div className="text-center text-qgray">No image available</div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {images.length > 0 ? images.map((img, index) => (
              <div
                onClick={() => changeImgHandler(img.image)}
                key={index}
                className={`w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer ${src === img.image ? "border-2 border-qred" : ""}`}
              >
                <img
                  src={`/assets/images/${img.image}`}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-contain"
                />
              </div>
            )) : (
              <div className="text-center text-qgray">No images available</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="product-details w-full mt-10 lg:mt-0">
          <span className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block">
            {productDetails.category?.name || 'Unknown Category'}
          </span>
          <p className="text-xl font-medium text-qblack mb-4">
            {productName}
          </p>

          <div className="flex space-x-[10px] items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star key={index} />
              ))}
            </div>
            <span className="text-[13px] font-normal text-qblack">
              No reviews
            </span>
          </div>

          <div className="flex space-x-2 items-center mb-7">
            <span className="text-2xl font-500 text-qred">{formatPrice(formattedPrice)}</span>
          </div>

          <p className="text-qgray text-sm text-normal mb-[30px] leading-7">
            {productDescription}
          </p>

          <div className="colors mb-[30px]">
            <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">Color</span>
            <div className="flex space-x-2">
              {availableColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className={`w-[30px] h-[30px] rounded-full border ${color === selectedColor ? 'border-qred' : 'border-qgray-border'} cursor-pointer`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="sizes mb-[30px]">
            <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">Size</span>
            <div className="flex space-x-2">
              {availableSizes.map((size, index) => (
                <div
                  key={index}
                  onClick={() => handleSizeChange(size)}
                  className={`w-[40px] h-[40px] border ${size.name === selectedSize ? 'border-qred' : 'border-qgray-border'} flex items-center justify-center cursor-pointer`}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>

          <div className="quantity mb-[30px] flex items-center">
            <button
              onClick={decrement}
              className="w-[35px] h-[35px] border border-qgray-border flex items-center justify-center text-xl font-medium text-qblack cursor-pointer"
            >
              -
            </button>
            <span className="w-[50px] h-[35px] flex items-center justify-center text-lg font-medium text-qblack">{quantity}</span>
            <button
              onClick={increment}
              className="w-[35px] h-[35px] border border-qgray-border flex items-center justify-center text-xl font-medium text-qblack cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="flex gap-4 mb-[30px]">
            <button onClick={addToCart} className="w-full h-[50px] bg-qyellow text-qblack text-sm font-semibold flex justify-center items-center">
              Thêm vào giỏ hàng
            </button>
            <button onClick={addFavourite} className="w-full h-[50px] bg-qred text-qwhite text-sm font-semibold flex justify-center items-center">
              Yêu thích
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
