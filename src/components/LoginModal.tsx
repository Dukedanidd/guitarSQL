import { useState } from 'react'

type LoginModalProps = {
    isOpen: boolean
    onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    //AGREGAR AL CARRITO
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        try {
          const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(data.error || "Error al registrar usuario");
          }
      
          console.log("Usuario registrado:", data);
          onClose(); // Cierra el modal
        } catch (error) {
          console.error("Error en el registro:", error.message);
          alert("Error: " + error.message);
        }
      };

      



    if (!isOpen) return null

    return (
        <div className="modal-overlay animate-fadeIn">
            <div className="login-content animate-slideIn">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-md flex items-center justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="********"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="btn btn-dark w-100 mt-4"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    )
} 