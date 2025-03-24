// app/api/register/route.ts (or pages/api/register.ts depending on the Next.js version)
export async function POST(req: Request) {
    try {
      const { username, password } = await req.json();
  
      // Perform registration logic, like saving to a database
      // For example:
      // const user = await db.createUser({ username, password });
  
      return new Response(
        JSON.stringify({ message: 'Registration successful' }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error registering user:', error);
      return new Response(
        JSON.stringify({ error: 'Something went wrong during registration' }),
        { status: 500 }
      );
    }
  }
  