import React, { useContext, useState, useEffect } from "react";
import "./CartItem.css";
import { IoIosClose } from "react-icons/io";
import { Context } from "../../../utils/context";

const CartItem = () => {
  const { cartItems, handleRemoveFromCart, handleCartProductQuantity } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('CartItem rendered - isAdmin:', isAdmin);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      const isAdminUser = localStorage.getItem('isAdmin');
      const adminStatus = token && (isAdminUser === 'true' || isAdminUser === true);
      console.log('CartItem - isAdmin check - token:', token, 'isAdminUser:', isAdminUser, 'result:', adminStatus);
      setIsAdmin(adminStatus);
    };
    
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);

  return (
    <div className="cart-products">
      {cartItems.map((item) => {
        return(
        <div key={item.id} className="cart-product">
          <div className="img-container">
            <img src={
              item.attributes.img.data[0].attributes.url} alt="" />
          </div>
          <div className="prod-details">
            <span className="p-name">{item.attributes.title}</span>
            {isAdmin && (
              <IoIosClose className="close" onClick={() => {handleRemoveFromCart(item)}}/>
            )}
            <div className="quantity-buttons">
              <span onClick={() => handleCartProductQuantity('dec', item)}>-</span>
              <span>{item.attributes.quantity}</span>
              <span onClick={() => handleCartProductQuantity('inc', item)}>+</span>
            </div>
            <div className="textt">
              <span>{item.attributes.quantity}</span>
              <span>x</span>
              <span className="highlightt">&#8377;{item.attributes.price * item.attributes.quantity}</span>
            </div>
          </div>
        </div> )
      })}
    </div>
  );
};

export default CartItem;
