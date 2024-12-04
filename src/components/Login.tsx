import { useState } from 'react'

type LoginProps = {
    isOpen: boolean
    onClose: () => void
}

export default function Login({ isOpen, onClose }: any) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        dirección: '',
        teléfono: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

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
            const errorMessage = (error as Error).message;
            console.error("Error en el registro:", errorMessage);
            alert("Error: " + errorMessage);
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
                <h3 className="text-center mb-4">Registro de Usuario</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="form-group">
                        <label className="form-label">Nombre completo:</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-input"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ingrese su nombre completo"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Apellido:</label>
                        <input
                            type="text"
                            name="apellido"
                            className="form-input"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                            placeholder="Ingrese su apellido"
                        />
                    </div>
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
                            name="contraseña"
                            className="form-input"
                            value={formData.contraseña}
                            onChange={handleChange}
                            required
                            placeholder="********"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Dirección:</label>
                        <input
                            type="text"
                            name="dirección"
                            className="form-input"
                            value={formData.dirección}
                            onChange={handleChange}
                            required
                            placeholder="Ingrese su dirección completa"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Teléfono:</label>
                        <input
                            type="tel"
                            name="teléfono"
                            className="form-input"
                            value={formData.teléfono}
                            onChange={handleChange}
                            required
                            placeholder="Ej: +34 612345678"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="btn btn-dark w-100 mt-4"
                    >
                        Registrar Usuario
                    </button>
                </form>
            </div>
        </div>
    )
} 