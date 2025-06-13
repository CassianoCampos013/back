import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

// Criação de usuário
app.post('/usuarios', async (req, res) => {
  try {
    const novoUsuario = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    })
    res.status(201).json(novoUsuario)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

// Listagem de todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const todosUsuarios = await prisma.user.findMany()
    res.status(200).json(todosUsuarios)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
