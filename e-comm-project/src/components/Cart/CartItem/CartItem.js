import React, { useContext } from "react";
import "./CartItem.css";
import { IoIosClose } from "react-icons/io";
import { Context } from "../../../utils/context";

const CartItem = () => {
  const { cartItems, handleRemoveFromCart, handleCartProductQuantity } = useContext(Context);

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
            <IoIosClose className="close" onClick={() => {handleRemoveFromCart(item)}}/>
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
