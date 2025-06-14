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
    const { name, email, age } = req.query;

    const usuarios = await prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        }),
        ...(age && !isNaN(Number(age)) && {
          age: Number(age),
        }),
      },
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({
      error: 'Erro interno ao buscar usuários',
    });
  }
});


app.put('/usuarios/:id', async (req, res) => {
      await prisma.user.update({
        where: {
          id: req.params.id
        },
        data: {
          email: req.body.email,
          name: req.body.name,
          age: req.body.age
        }
      })

      res.status(201).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  })
  
  res.status(200).json({ message: 'Usuário deletado com sucesso!' })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
