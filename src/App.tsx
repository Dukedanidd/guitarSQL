import Guitar from "./components/Guitar"
import Header from "./components/Header"
import { useCart } from './hooks/useCart'
import { useEffect, useState } from 'react'
import api from './apis/api'

function App() {
  // Cambiar el tipo de estado según la estructura de tu tabla
  const [apiData, setApiData] = useState<any[]>([])
  const { data, cart, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, clearCart, isEmpty, cartTotal,userId } = useCart()
  const [guitars, setGuitars] = useState([]);
  console.log("userID this header=>",userId)
  useEffect(() => {
    api.get("/data")  // Cambiar la ruta de "/" a "/data"
      .then((response) => {
       // console.log(response)
        setGuitars(response.data);
        setApiData(response.data)
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error)
      })
  }, [])

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
        userId={userId}
      />
      
      {/* Actualizar la visualización de los datos */}
      <div>
        <h1>Datos de la base de datos</h1>
        {apiData.map((item, index) => (
          <div key={index}>
            {/* Ajusta esto según la estructura de tu tabla */}
           
          </div>
        ))}
      </div>

      <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>

          <div className="row mt-5">
              {guitars.map((guitar) => (
                  <Guitar 
                    key={guitar.id}
                    guitar={guitar}
                    addToCart={addToCart}
                  />
              ))}
              
          </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
          <div className="container-xl">
              <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
          </div>
      </footer>
    </>
  )
}

export default App
