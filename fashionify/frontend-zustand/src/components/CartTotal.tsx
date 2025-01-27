import Title from "./Title";
import useProductsStore from "../stores/productsStore";
import useCartStore from "../stores/cartStore";
import { getCartAmount } from "../common/utils";

const CartTotal = () => {
    const { products } = useProductsStore();
    const { currency, delivery_fee, cartItems } = useCartStore();

    const cartAmount = getCartAmount(products, cartItems);
    return (
        <div className="w-full">
            <div className="text-2xl">
                <Title text1="CART" text2="TOTALS" />
            </div>
            <section className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>
                        {currency} {cartAmount}.00
                    </p>
                </div>

                <hr />
                <div className="flex justify-between">
                    <p>Shipping Free</p>
                    <p>
                        {currency} {delivery_fee}
                    </p>
                </div>

                <hr />
                <div className="flex justify-between">
                    <b>Total</b>
                    <b>
                        {currency}{" "}
                        {cartAmount === 0 ? 0 : cartAmount + delivery_fee}
                        .00
                    </b>
                </div>
            </section>
        </div>
    );
};

export default CartTotal;
