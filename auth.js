export async function authenticateRequest(request) {
    // Asegurar que Supabase está configurado
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return {
        error: { status: 500, message: "Supabase no está configurado correctamente" },
        user: null,
      };
    }
  
    // Obtener el token correctamente en Fastify
    const authHeader = request.headers['authorization']; 
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;
  
    if (!token) {
      return {
        error: { status: 401, message: "Token no proporcionado" },
        user: null,
      };
    }
  
    // Validar el token llamando a la API de Supabase
    const userResponse = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.SUPABASE_ANON_KEY,
      },
    });
  
    if (!userResponse.ok) {
      return {
        error: { status: 401, message: "Token inválido o expirado" },
        user: null,
      };
    }
  
    const user = await userResponse.json();
    return { error: null, user };
  }