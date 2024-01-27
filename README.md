# E-commerce Admin Dashboard

This is a multi-store admin dashboard designed to allow users to manage multiple connected stores efficiently. The project was built with Next.js new App Router with Server Actions & Route Handlers.

## Features

#### Routes:

- Billboards: Manage promotional billboards for stores.
- Categories: Organize products into different categories.
- Orders: View and manage customer orders.
- Colors: View and manage product colors.
- Sizes: View and manage product sizes.
- Products: View and manage products in the inventory.
- Settings: Configure dashboard and store settings.

#### User Authentication:

Users can sign in/up using Clerk, an external authentication provider, ensuring secure access to the admin dashboard.

#### Stripe Integration:

The dashboard server provides an endpoint for stores to consume, allowing them to start a Stripe session to fulfill user payments.

## Technologies

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Shadcn/ui - UI library](https://ui.shadcn.com/)
- [Clerk - External Authentication Provider](https://clerk.com/)
- [Stripe - Payment Integration](https://stripe.com/)

## Attribution

This project was developed following a tutorial by Antonio on YouTube/Code With Antonio. Credits and thanks to Antonio for the insightful tutorial.

Check out the original tutorial at https://www.youtube.com/watch?v=5miHyP6lExg&t=35128s&pp=ygUEbmV4dA%3D%3D.
