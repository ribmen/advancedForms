import { useState } from "react"
import "./global.css"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * 
 * To-do
 * 
 * [ ] Validação / transformação
 * [ ] Field Arrays
 * [ ] Upload de arquivos
 * [ ] Composition Pattern
 * 
 */

//informando os tipos de dados do formulário
const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
   email: z.string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase()
    .refine(email => {
      return email.endsWith('@gmail.com')
    }, 'O e-mail precisa ser o Gmail.'),
   password: z.string()
    .min(6, 'A senha precisa conter no mínimo 6 caracteres'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('');

  const { 
    register, 
    handleSubmit, 
    formState: {
      errors
    }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  }) 

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
    // ao invés de console.log, colocamos num estado e podemos mostrar na tela
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center flex-col gap-10">
      <form 
        onSubmit={handleSubmit(createUser)} 
        className=" flex flex-col gap-4 w-full max-w-xs" >

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input 
            type="text" 
            className="bg-zinc-900 border-2  text-white border-zinc-600 shaddow-sm rounded h-10 px-3" 
            {...register('name')}       
            />
            {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            className="bg-zinc-900 border-2  text-white border-zinc-600 shaddow-sm rounded h-10 px-3" 
            {...register('email')}       
            />
            {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            className="bg-zinc-900 border-2 text-white border-zinc-600 shaddow-sm rounded h-10 px-3"
            {...register('password')}    
            />
            {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button
         type="submit"
         className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
         >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>

    </main>
  )
}

export default App;