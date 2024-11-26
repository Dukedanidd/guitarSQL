import { useState } from 'react'

type LoginProps = {
    isOpen: boolean
    onClose: () => void
}

export default function Login({ isOpen, onClose }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Add login logic here
        console.log('Login attempt:', { email, password })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="login-modal">
            <div className="login-content bg-white p-3">
                <button 
                    onClick={onClose}
                    className="btn btn-dark close-button"
                >
                    X
                </button>
                <h3 className="text-center">Iniciar Sesión</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="btn btn-dark w-100"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    )
} 