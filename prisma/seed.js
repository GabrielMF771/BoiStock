const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {

    console.log('Iniciando seed...');

    // =========================
    // ADMINISTRADOR PADRÃO
    // =========================

    const senhaHash = await bcrypt.hash('12345', 10);

    await prisma.user.upsert({
        where: {
            email: 'admin@boistock.com'
        },
        update: {},
        create: {
            name: 'Administrador',
            email: 'admin@boistock.com',
            password: senhaHash,
            role: 'gerente',
            isTempPassword: false
        }
    });

    console.log('Usuário administrador criado');

    // =========================
    // PRODUTOS DE EXEMPLO
    // =========================

    const produtos = [
        {
            name: 'Ração Bovina Premium 25kg',
            description: 'Ração balanceada para bovinos de corte.',
            price: 129.90,
            quantity: 50
        },
        {
            name: 'Sal Mineral Bovino 30kg',
            description: 'Suplemento mineral para bovinos.',
            price: 89.50,
            quantity: 40
        },
        {
            name: 'Vacina Contra Febre Aftosa',
            description: 'Dose unitária para prevenção da febre aftosa.',
            price: 14.99,
            quantity: 120
        },
        {
            name: 'Milho Triturado 50kg',
            description: 'Milho triturado para alimentação animal.',
            price: 72.00,
            quantity: 35
        },
        {
            name: 'Farelo de Soja 50kg',
            description: 'Fonte proteica para suplementação animal.',
            price: 115.00,
            quantity: 20
        },
        {
            name: 'Semente de Capim Mombaça',
            description: 'Sementes para formação de pastagens.',
            price: 249.90,
            quantity: 15
        },
        {
            name: 'Inseticida Pulverizável 1L',
            description: 'Controle de pragas em lavouras.',
            price: 54.90,
            quantity: 8
        },
        {
            name: 'Herbicida Seletivo 5L',
            description: 'Controle de plantas daninhas.',
            price: 189.90,
            quantity: 5
        },
        {
            name: 'Arame Farpado Rolo 500m',
            description: 'Arame galvanizado para cercas.',
            price: 599.90,
            quantity: 12
        },
        {
            name: 'Bebedouro Automático para Gado',
            description: 'Bebedouro com abastecimento automático.',
            price: 349.90,
            quantity: 3
        }
    ];

    for (const produto of produtos) {
        const existente = await prisma.product.findFirst({
            where: {
                name: produto.name
            }
        });

        if (!existente) {
            await prisma.product.create({
                data: produto
            });
        }
    }

    console.log('Produtos cadastrados');
    console.log('Seed concluída com sucesso!');
}

main()
    .catch((erro) => {
        console.error('Erro na seed:', erro);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });