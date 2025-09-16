import { useState } from "react";
import { ICartItems } from "./type";



interface CartIconProps {
  cartItems: ICartItems[];
}

export default function CartIcon({ cartItems }: CartIconProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setShowDropdown(!showDropdown)}>
        🛒 {cartItems.length}
      </button>

      {showDropdown && (
        <div style={{ position: "absolute", top: "100%", right: 0, border: "1px solid #ccc", background: "#fff", width: "200px", zIndex: 10, padding: "10px" }}>
          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <p>{item.product.name}</p>
                <p>{item.quantity} x {item.price.toLocaleString("id-ID")}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
