'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { User, userSchema, userFormSchema } from './schemas'

const prisma = new PrismaClient()

export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query)
    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
    })
  
    // Transform Prisma client types to Zod schema User types
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }))
  }
  
  export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    const validatedUser = userFormSchema.parse(data)
    const newUser = await prisma.user.create({
      data: validatedUser,
    })
  
    // Transform Prisma client type to Zod schema User type
    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
    }
  
    return user
  }
  
  export async function deleteUser(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new Error(`User with id ${id} not found`)
    }
  
    // Transform Prisma client type to Zod schema User type before deletion
    const transformedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }
  
    await prisma.user.delete({
      where: { id },
    })
    console.log(`User with id ${id} has been deleted.`)
    revalidatePath('/')
  
    return transformedUser
  }

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const validatedData = userSchema.partial().parse(data)
    const updatedUser = await prisma.user.update({
        where: { id },
        data: validatedData,
    })
    console.log(`User with id ${id} has been updated.`)
    revalidatePath('/')
    // return updatedUser
    // Transform Prisma client type to Zod schema User type
    const user: User = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
    }

    return user
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    })
}