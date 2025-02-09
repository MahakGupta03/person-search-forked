// 'use server'

// import { PrismaClient } from '@prisma/client'
// import { revalidatePath } from 'next/cache'
// import { User, userSchema } from './schemas'

// const prisma = new PrismaClient()

// export async function searchUsers(query: string): Promise<User[]> {
//     console.log('Searching users with query:', query)
//     return prisma.user.findMany({
//         where: {
//             name: {
//                 startsWith: query,
//                 mode: 'insensitive',
//             },
//         },
//     })
// }

// export async function addUser(data: Omit<User, 'id'>): Promise<User> {
//     const validatedUser = userSchema.parse(data)
//     const newUser = await prisma.user.create({
//         data: validatedUser,
//     })
//     return newUser
// }

// export async function deleteUser(id: string): Promise<void> {
//     const user = await prisma.user.findUnique({
//         where: { id },
//     })
//     if (!user) {
//         throw new Error(`User with id ${id} not found`)
//     }
//     await prisma.user.delete({
//         where: { id },
//     })
//     console.log(`User with id ${id} has been deleted.`)
//     revalidatePath('/')
// }

// export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
//     const validatedData = userSchema.partial().parse(data)
//     const updatedUser = await prisma.user.update({
//         where: { id },
//         data: validatedData,
//     })
//     console.log(`User with id ${id} has been updated.`)
//     revalidatePath('/')
//     return updatedUser
// }

// export async function getUserById(id: string): Promise<User | null> {
//     return prisma.user.findUnique({
//         where: { id },
//     })
// }


'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { User, userSchema, userFormSchema } from './schemas'

const prisma = new PrismaClient()

export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query)
    return prisma.user.findMany({
        where: {
            name: {
                startsWith: query,
            },
        },
    })
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    const validatedUser = userFormSchema.parse(data)
    const newUser = await prisma.user.create({
        data: validatedUser,
    })
    return newUser
}

export async function deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id },
    })
    if (!user) {
        throw new Error(`User with id ${id} not found`)
    }
    await prisma.user.delete({
        where: { id },
    })
    console.log(`User with id ${id} has been deleted.`)
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const validatedData = userSchema.partial().parse(data)
    const updatedUser = await prisma.user.update({
        where: { id },
        data: validatedData,
    })
    console.log(`User with id ${id} has been updated.`)
    revalidatePath('/')
    return updatedUser
}

export async function getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    })
}