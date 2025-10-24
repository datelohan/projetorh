-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'RH', 'GESTOR', 'FUNCIONARIO') NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NULL,
    `gestorId` VARCHAR(191) NULL,
    `dataAdmissao` DATETIME(3) NOT NULL,
    `dataDemissao` DATETIME(3) NULL,
    `salarioBase` DECIMAL(10, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Funcionario_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `Funcionario_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcessoContratacao` (
    `id` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `candidatoNome` VARCHAR(191) NOT NULL,
    `candidatoEmail` VARCHAR(191) NULL,
    `status` ENUM('RASCUNHO', 'EM_ANDAMENTO', 'OFERTA_ENVIADA', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'EM_ANDAMENTO',
    `observacoes` VARCHAR(191) NULL,
    `funcionarioId` VARCHAR(191) NULL,
    `responsavelId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcessoContratacaoEtapa` (
    `id` VARCHAR(191) NOT NULL,
    `processoId` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `status` ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    `agendadoPara` DATETIME(3) NULL,
    `concluidoEm` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProcessoContratacaoEtapa_processoId_ordem_key`(`processoId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ferias` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `inicio` DATETIME(3) NOT NULL,
    `fim` DATETIME(3) NOT NULL,
    `dias` INTEGER NOT NULL,
    `status` ENUM('PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    `observacoes` VARCHAR(191) NULL,
    `aprovadorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DespesaViagem` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `categoria` ENUM('TRANSPORTE', 'HOSPEDAGEM', 'ALIMENTACAO', 'COMUNICACAO', 'OUTROS') NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `dataDespesa` DATETIME(3) NOT NULL,
    `status` ENUM('PENDENTE', 'APROVADA', 'REJEITADA', 'REEMBOLSADA') NOT NULL DEFAULT 'PENDENTE',
    `observacoes` VARCHAR(191) NULL,
    `aprovadorId` VARCHAR(191) NULL,
    `reciboUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroPonto` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ENTRADA', 'SAIDA', 'PAUSA', 'RETORNO') NOT NULL,
    `registradoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacao` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RegistroPonto_funcionarioId_registradoEm_idx`(`funcionarioId`, `registradoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holerite` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `competencia` VARCHAR(191) NOT NULL,
    `referencia` DATETIME(3) NULL,
    `valorBruto` DECIMAL(10, 2) NOT NULL,
    `valorLiquido` DECIMAL(10, 2) NOT NULL,
    `arquivoUrl` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Holerite_funcionarioId_competencia_key`(`funcionarioId`, `competencia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_gestorId_fkey` FOREIGN KEY (`gestorId`) REFERENCES `Funcionario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoContratacao` ADD CONSTRAINT `ProcessoContratacao_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoContratacao` ADD CONSTRAINT `ProcessoContratacao_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoContratacaoEtapa` ADD CONSTRAINT `ProcessoContratacaoEtapa_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `ProcessoContratacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ferias` ADD CONSTRAINT `Ferias_aprovadorId_fkey` FOREIGN KEY (`aprovadorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ferias` ADD CONSTRAINT `Ferias_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaViagem` ADD CONSTRAINT `DespesaViagem_aprovadorId_fkey` FOREIGN KEY (`aprovadorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DespesaViagem` ADD CONSTRAINT `DespesaViagem_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroPonto` ADD CONSTRAINT `RegistroPonto_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holerite` ADD CONSTRAINT `Holerite_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

