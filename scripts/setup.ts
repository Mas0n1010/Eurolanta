import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  })

  if (existingAdmin) {
    console.log('Admin user already exists!')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      isAdmin: true,
      robloxUsername: 'AdminRoblox',
    },
  })

  console.log('Admin user created successfully!')
  console.log('Username: admin')
  console.log('Password: admin123')
  console.log('')
  console.log('IMPORTANT: Change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('Error setting up database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
