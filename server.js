const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o Banco de Dados PostgreSQL (pgAdmin)
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'dAlaTKa2351', 
    database: 'clinica_medica'
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err.stack);
    } else {
        console.log('Conectado ao PostgreSQL com sucesso!');
        release();
    }
});

// ROTA UNIFICADA: Cadastro Geral de Usuários (Paciente, Médico ou Recepcionista)
app.post('/usuarios', async (req, res) => {
    const { cpf, nome, email, telefone, data_nascimento, genero, tipo, senha } = req.body;
    
    try {
        // 1. Insere dados na tabela pai (usuario)
        const sqlUsuario = `INSERT INTO usuario (cpf, nome, email, telefone, data_nascimento, genero, senha) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
        
        const senhaSalvar = senha || '123456';
        const resUsuario = await pool.query(sqlUsuario, [cpf, nome, email, telefone, data_nascimento, genero, senhaSalvar]);
        const novoId = resUsuario.rows[0].id;

        // 2. Normaliza e valida o tipo de perfil clínico recebido
        const perfilDefinido = tipo ? tipo.toLowerCase().trim() : 'paciente';
        const tabelasValidas = ['medico', 'paciente', 'recepcionista'];
        
        if (!tabelasValidas.includes(perfilDefinido)) {
            return res.status(400).send({ message: 'Tipo de perfil inválido. Use medico, paciente ou recepcionista.' });
        }
        
        // 3. Vincula o ID gerado à respectiva tabela filha para preservar a integridade relacional
        const sqlFilha = `INSERT INTO ${perfilDefinido} (id) VALUES ($1)`;
        await pool.query(sqlFilha, [novoId]);

        res.status(201).send({ message: 'Usuário e Perfil clínico mapeados com sucesso!', id: novoId });
    } catch (err) {
        console.error("Erro no Postgres ao criar usuário:", err);
        res.status(500).send(err);
    }
});

// ROTA: Autenticação de Usuários direto no PostgreSQL
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const sql = `SELECT id, nome, email, senha, cpf FROM usuario WHERE LOWER(email) = LOWER($1)`;
        const resultado = await pool.query(sql, [email.trim()]);

        if (resultado.rows.length === 0) {
            return res.status(401).send({ message: 'E-mail ou senha incorretos.' });
        }

        const usuario = resultado.rows[0];

        if (usuario.senha !== senha) {
            return res.status(401).send({ message: 'E-mail ou senha incorretos.' });
        }

        res.status(200).send({
            message: 'Login realizado com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf
            }
        });
    } catch (err) {
        console.error("Erro ao realizar login:", err);
        res.status(500).send({ message: 'Erro interno no servidor de banco de dados.' });
    }
});

// ROTA: Registro de Atendimento Clínico (com validação das chaves estrangeiras)
app.post('/atendimentos', async (req, res) => {
    const { id_paciente, id_medico, id_recepcionista, valor, anamnese } = req.body;
    const dataHora = new Date();

    // Validação explícita de integridade antes da inserção
    try {
        const checkPaciente = await pool.query('SELECT 1 FROM paciente WHERE id = $1', [id_paciente]);
        if (checkPaciente.rows.length === 0) return res.status(400).send({ message: `O ID do Paciente (${id_paciente}) informado não existe no banco.` });

        const checkMedico = await pool.query('SELECT 1 FROM medico WHERE id = $1', [id_medico]);
        if (checkMedico.rows.length === 0) return res.status(400).send({ message: `O ID do Médico (${id_medico}) informado não existe no banco.` });

        const checkRecep = await pool.query('SELECT 1 FROM recepcionista WHERE id = $1', [id_recepcionista]);
        if (checkRecep.rows.length === 0) return res.status(400).send({ message: `O ID do Recepcionista (${id_recepcionista}) informado não existe no banco.` });

        const sql = `INSERT INTO atendimento (data_hora_atendimento, valor_consulta, status, anamnese, id_recepcionista, id_medico, id_paciente) 
                     VALUES ($1, $2, 'Agendado', $3, $4, $5, $6)`;

        await pool.query(sql, [dataHora, valor, anamnese, id_recepcionista, id_medico, id_paciente]);
        res.status(201).send({ message: 'Atendimento registrado com sucesso!' });
    } catch (err) {
        console.error("Erro ao registrar atendimento:", err);
        res.status(500).send(err);
    }
});

// ROTA CORRIGIDA: Buscar todos os usuários e mapear o nome corretamente
app.get('/usuarios', async (req, res) => {
    try {
        const sql = `SELECT id, nome, email, cpf, telefone, genero FROM usuario ORDER BY id DESC`;
        const resultado = await pool.query(sql);
        
        const usuariosComPerfil = await Promise.all(resultado.rows.map(async (user) => {
            let perfil = 'Paciente';
            
            const checkMed = await pool.query('SELECT 1 FROM medico WHERE id = $1', [user.id]);
            if (checkMed.rows.length > 0) perfil = 'medico';
            
            const checkRecep = await pool.query('SELECT 1 FROM recepcionista WHERE id = $1', [user.id]);
            if (checkRecep.rows.length > 0) perfil = 'recepcionista';
            
            return {
                id: user.id,
                nome: user.nome || 'Não Informado', // Garante que nunca fique undefined se o banco tiver nulo
                email: user.email,
                cpf: user.cpf,
                role: perfil
            };
        }));

        res.status(200).send(usuariosComPerfil);
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        res.status(500).send({ message: 'Erro ao ler dados do banco.' });
    }
});

// ROTA CORRIGIDA: Buscar atendimentos injetando explicitamente a propriedade id_recepcionista
app.get('/atendimentos', async (req, res) => {
    try {
        const sql = `SELECT id_atendimento, id_paciente, id_medico, id_recepcionista, anamnese, status, data_hora_atendimento 
                     FROM atendimento 
                     ORDER BY id_atendimento DESC`;
        const resultado = await pool.query(sql);
        
        const listaAtendimentos = resultado.rows.map(at => ({
            id: at.id_atendimento,
            id_paciente: at.id_paciente,
            id_medico: at.id_medico,
            id_recepcionista: at.id_recepcionista, // Garante que a propriedade vá com o nome exato do banco
            client: `Pac. ID: ${at.id_paciente}`,
            subject: at.anamnese ? at.anamnese.split('|')[0].trim() : 'Consulta',
            category: `Méd. ID: ${at.id_medico}`,
            priority: 'media',
            status: at.status || 'Aberto',
            date: new Date(at.data_hora_atendimento).toLocaleString('pt-BR')
        }));

        res.status(200).send(listaAtendimentos);
    } catch (err) {
        console.error("Erro ao buscar atendimentos:", err);
        res.status(500).send({ message: 'Erro ao ler dados do banco.' });
    }
});

// NOVA ROTA: Buscar apenas os usuários que são Pacientes (Clientes) cadastrados
app.get('/clientes', async (req, res) => {
    try {
        const sql = `
            SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.data_nascimento, u.genero 
            FROM usuario u
            INNER JOIN paciente p ON u.id = p.id
            ORDER BY u.id ASC
        `;
        const resultado = await pool.query(sql);
        
        // Formata os dados para o HTML ler perfeitamente
        const clientesFormatados = resultado.rows.map(c => ({
            id: c.id,
            nome: c.nome || 'Não Informado',
            cpf: c.cpf,
            email: c.email,
            telefone: c.telefone || 'Não Informado',
            data_nasc: c.data_nascimento ? new Date(c.data_nascimento).toLocaleDateString('pt-BR') : '—',
            genero: c.genero === 'M' ? 'Masculino' : 'Feminino'
        }));

        res.status(200).send(clientesFormatados);
    } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        res.status(500).send({ message: 'Erro ao ler clientes do banco de dados.' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));