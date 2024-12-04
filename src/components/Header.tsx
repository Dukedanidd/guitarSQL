import { useState } from 'react'
import type { CartItem, Guitar } from "../types"
import Login from './Login'
import LoginModal from './LoginModal'
import api from '../apis/api'



export default function Header({
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
}: any) {
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [userId,setUserId]=useState(null)

    const handleLoginSuccess = (name: string) => {
        setUserName(name);
        setIsLoginOpen(false);
    }

    const handleLogout = () => {
        setUserName(null);
    }

    const handleCheckout =async () => {
        // Asegúrate de que `cart` sea un arreglo válido y tenga datos
        if (!cart || cart.length === 0) {
            console.error("El carrito está vacío.");
            return;
        }
        console.log("userId",userId)
        const {  data:id_carrito  } = await api.post("/insert-new-cart", { id_usuario: userId })
        console.log("data:",id_carrito)
        // Prepara el objeto para enviar al endpoint
        const checkoutData = {
            id_carrito: id_carrito.id_carrito, // Reemplaza con el ID del carrito correspondiente
            items: cart.map((item:any) => ({
                id_guitarra: item.id_guitarra,
                quantity: item.quantity,
                precio: item.precio
            }))
        };
    
        console.log("Datos para checkout:", checkoutData);
    
        // Realiza la solicitud POST al servidor
        api.post("/insert-cart", checkoutData)
            .then((response:any) => {
                console.log("Carrito procesado correctamente:", response.data);
                // Puedes manejar la respuesta como mostrar un mensaje de éxito o redirigir
                alert("¡Compra realizada con éxito!");
            })
            .catch((error:any) => {
                console.error("Error al procesar el carrito:", error);
                alert("Hubo un error al procesar la compra. Inténtalo nuevamente.");
            });
    };
    

    return (
        <>
            <header className="py-5 header">
                <div className="container-xl">
                    <div className="row justify-content-center justify-content-md-between">
                        <div className="col-8 col-md-3">
                            <a href="index.html">
                            </a>
                        </div>
                        <nav className="col-md-6 mt-5 d-flex align-items-center justify-content-end">
                            <div className="d-flex gap-3 align-items-center">
                                {userName ? (
                                    <>
                                        <span className="text-white">¡Hola, {userName}!</span>
                                        <button className="btn btn-dark" onClick={handleLogout}>Cerrar Sesión</button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-outline-light text-uppercase py-2 px-4"
                                            onClick={() => setIsRegisterOpen(true)}
                                        >
                                            Registrarse
                                        </button>
                                        <button
                                            className="btn btn-dark text-uppercase py-2 px-4"
                                            onClick={() => setIsLoginOpen(true)}
                                        >
                                            Iniciar Sesión
                                        </button>
                                    </>
                                )}
                                {userName && (
                                    <div className="carrito">
                                        <img className="img-fluid" src="/img/carrito.png" alt="imagen carrito" />
                                        <div id="carrito" className="bg-white p-3">
                                            {isEmpty ? (
                                                <p className="text-center">El carrito esta vacio</p>
                                            ) : (
                                            <>
                                                <table className="w-100 table">
                                                    <thead>
                                                        <tr>
                                                            <th>Imagen</th>
                                                            <th>Nombre</th>
                                                            <th>Precio</th>
                                                            <th>Cantidad</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cart.map( guitar => (
                                                            console.log("guitar in cart=>",guitar),
                                                            <tr key={guitar.id}>
                                                                <td>
                                                                    <img 
                                                                        className="img-fluid" 
                                                                        src={guitar.imagen_url}
                                                                        alt="imagen guitarra" 
                                                                    />
                                                                </td>
                                                                <td>{guitar.modelo}</td>
                                                                <td className="fw-bold">
                                                                    ${guitar.precio}
                                                                </td>
                                                                <td className="flex align-items-start gap-4">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-dark"
                                                                        onClick={() => decreaseQuantity(guitar.id_guitarra)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                        {guitar.quantity}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-dark"
                                                                        onClick={() => increaseQuantity(guitar.id_guitarra)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        type="button"
                                                                        onClick={() => removeFromCart(guitar.id)}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <p className="text-end">Total pagar: <span className="fw-bold">${cartTotal}</span></p>
                                            </>
                                            )}
                                            <button 
                                                className="btn btn-dark w-40 mt-3 p-2"
                                                onClick={clearCart}
                                            >Vaciar Carrito</button>

                                            <button 
                                                className=" bg-green-800 w-60 mt-3 p-2 pl-2"
                                                onClick={handleCheckout}
                                            >Comprar ahora</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            
            <Login 
                isOpen={isRegisterOpen}
                setUserId={setUserId}
                onClose={() => setIsRegisterOpen(false)}
            />
            <LoginModal 
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                setUserId={setUserId}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    )
}
