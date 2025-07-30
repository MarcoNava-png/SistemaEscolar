export interface User {
    id: number;
    nombreUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    // Add any other fields you need for the user
  }
  
  export interface LoginResponse {
    token?: string;
    user?: User;  // Include user data in the response
  }
  