"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const saltRounds = 10;
    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@projetorh.com' },
        update: {},
        create: {
            nome: 'Admin RH',
            email: 'admin@projetorh.com',
            senhaHash: await (0, bcryptjs_1.hash)('admin123', saltRounds),
            role: client_1.Role.ADMIN,
        },
    });
    const gestor = await prisma.usuario.upsert({
        where: { email: 'gestor@projetorh.com' },
        update: {},
        create: {
            nome: 'Gestor Equipe',
            email: 'gestor@projetorh.com',
            senhaHash: await (0, bcryptjs_1.hash)('gestor123', saltRounds),
            role: client_1.Role.GESTOR,
        },
    });
    const funcionarioMaria = await prisma.funcionario.upsert({
        where: { cpf: '12345678901' },
        update: {},
        create: {
            nomeCompleto: 'Maria Souza',
            cpf: '12345678901',
            cargo: 'Analista de RH',
            departamento: 'Recursos Humanos',
            dataAdmissao: new Date('2022-03-15'),
            salarioBase: 5500,
            usuario: {
                create: {
                    nome: 'Maria Souza',
                    email: 'maria@projetorh.com',
                    senhaHash: await (0, bcryptjs_1.hash)('maria123', saltRounds),
                    role: client_1.Role.RH,
                },
            },
        },
    });
    const funcionarioJoao = await prisma.funcionario.upsert({
        where: { cpf: '98765432100' },
        update: {
            gestorId: funcionarioMaria.id,
        },
        create: {
            nomeCompleto: 'João Silva',
            cpf: '98765432100',
            cargo: 'Desenvolvedor Fullstack',
            departamento: 'Tecnologia',
            gestor: {
                connect: { id: funcionarioMaria.id },
            },
            dataAdmissao: new Date('2023-06-01'),
            salarioBase: 7200,
        },
    });
    const processoContratacao = await prisma.processoContratacao.create({
        data: {
            cargo: 'Designer UX',
            candidatoNome: 'Ana Lima',
            candidatoEmail: 'ana.lima@example.com',
            status: client_1.StatusProcessoContratacao.EM_ANDAMENTO,
            responsavel: {
                connect: { id: funcionarioMaria.usuarioId ?? admin.id },
            },
            observacoes: 'Processo focado em experiência mobile.',
            etapas: {
                create: [
                    {
                        ordem: 1,
                        titulo: 'Triagem de currículo',
                        status: client_1.StatusEtapaContratacao.CONCLUIDA,
                        concluidoEm: new Date(),
                    },
                    {
                        ordem: 2,
                        titulo: 'Entrevista técnica',
                        status: client_1.StatusEtapaContratacao.EM_ANDAMENTO,
                        agendadoPara: addDays(new Date(), 3),
                    },
                    {
                        ordem: 3,
                        titulo: 'Oferta',
                        status: client_1.StatusEtapaContratacao.PENDENTE,
                    },
                ],
            },
        },
    });
    await prisma.ferias.create({
        data: {
            funcionario: { connect: { id: funcionarioJoao.id } },
            inicio: new Date('2024-12-02'),
            fim: new Date('2024-12-20'),
            dias: 15,
            status: client_1.StatusFerias.APROVADO,
            aprovador: { connect: { id: gestor.id } },
            observacoes: 'Recesso de fim de ano.',
        },
    });
    await prisma.despesaViagem.createMany({
        data: [
            {
                funcionarioId: funcionarioJoao.id,
                categoria: client_1.CategoriaDespesa.TRANSPORTE,
                descricao: 'Passagem aérea para evento',
                valor: 1450.75,
                dataDespesa: new Date('2024-08-12'),
                status: client_1.StatusDespesa.REEMBOLSADA,
                aprovadorId: gestor.id,
                observacoes: 'Evento React Summit SP.',
            },
            {
                funcionarioId: funcionarioJoao.id,
                categoria: client_1.CategoriaDespesa.ALIMENTACAO,
                descricao: 'Almoço com cliente',
                valor: 120.5,
                dataDespesa: new Date('2024-08-13'),
                status: client_1.StatusDespesa.APROVADA,
                aprovadorId: gestor.id,
            },
        ],
    });
    await prisma.registroPonto.createMany({
        data: [
            {
                funcionarioId: funcionarioJoao.id,
                tipo: client_1.TipoRegistroPonto.ENTRADA,
                registradoEm: addHours(new Date(), -6),
                observacao: 'Registro automático via app.',
            },
            {
                funcionarioId: funcionarioJoao.id,
                tipo: client_1.TipoRegistroPonto.SAIDA,
                registradoEm: new Date(),
            },
        ],
    });
    await prisma.holerite.create({
        data: {
            funcionarioId: funcionarioJoao.id,
            competencia: '2024-07',
            referencia: new Date('2024-07-31'),
            valorBruto: 7200,
            valorLiquido: 5800.45,
            arquivoUrl: 'https://storage.projetorh.com/holerites/2024-07-joao.pdf',
        },
    });
    console.log('Seed executado com sucesso.');
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}
main()
    .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map