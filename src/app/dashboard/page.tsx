import { Container } from "@/components/container"
import { authOptions } from "@/lib/auth"
import {getServerSession} from 'next-auth'
import { redirect } from "next/navigation"
import Link from "next/link"
import { TicketItem } from "./components/ticket"
import prismaClient from '@/lib/prisma'


export default async function Dashboard(){
const session = await getServerSession(authOptions)

if (!session || !session.user) {
   redirect("/")
}

const tickets = await prismaClient.ticket.findMany({
    where:{
        userId:session.user.id,
        status: "ABERTO"
    },
    include: {
        customer:true,
    },
    orderBy: {
        created_at:"asc"
    }
})


    return(
        <Container>
          <main className="mt-9 mb-2">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Chamados</h1>
                <Link href="/dashboard/new" className="bg-blue-500 px-4 py-1 rounded text-white">
                Abrir chamado
                </Link>
            </div>

            <table className="min-w-full my">
                <thead>
                    <tr>
                    <th className="text-medium text-left pl-1">Cliente</th>
                    <th className="text-medium text-left hidden sm:block">DATA CADASTRO</th>
                    <th className="text-medium text-left">STATUS</th>
                    <th className="text-medium text-left">#</th>
                    </tr>
                </thead>
                <tbody>
                
                {tickets.map(ticket =>
                    <TicketItem
                     key={ticket.id}
                    customer={ticket.customer}
                    ticket={ticket}
                    />
                )}

                </tbody>
            </table>
            {tickets.length === 0 && (
                <h1 className="px-2 md:px-0 text-gray-600">Nenhum ticket aberto foi encontrado...</h1>
            )}
          </main>
        </Container>
    )
}