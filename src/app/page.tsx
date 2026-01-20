// app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
    // Redireciona para dashboard se autenticado, senão para login
    redirect('/login');

    // Ou pode mostrar uma landing page pública
    // return (
    //   <div className="min-h-screen flex items-center justify-center">
    //     <h1>Bem-vindo ao Consultório</h1>
    //   </div>
    // );
}