import type { Guitar } from '../types'

type GuitarProps = {
    guitar : Guitar, 
    addToCart : (item: Guitar) => void
}

export default function Guitar({guitar, addToCart} : GuitarProps) {

    const { modelo, imagen_url, descripción, precio } = guitar

    return (
        <div className="col-md-6 col-lg-4 my-4 row align-items-center">
            <div className="col-4">
                <img className="img-fluid" src={`${imagen_url}`} alt="imagen guitarra" />
            </div>
            <div className="col-8">
                <h3 className="text-black fs-4 fw-bold text-uppercase">{modelo}</h3>
                <p>{descripción}</p>
                <p className="fw-black text-primary fs-3">${precio}</p>
                <button 
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={() => addToCart(guitar)}
                >Agregar al Carrito</button>
            </div>
        </div>
    )
}
