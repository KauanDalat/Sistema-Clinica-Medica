# SISTEMA DE CLÍNICA MÉDICA
- Apresentação
* Aluno: Kauan Oliveira Dalat
* Disciplina: Projeto Banco de Dados
* Docente: Isacio Rafael Pereira Galeano



# 1 INTRODUÇÃO
  Este trabalho tem como objetivo apresentar o desenvolvimento de um Sistema de Clínica Médica, focado na organização e automação dos processos administrativos e operacionais de uma clínica. O sistema foi modelado com base em conceitos de bancos de dados relacionais, incluindo entidades, relacionamentos e regras essenciais para o correto funcionamento da aplicação.
  Com o aumento da demanda por atendimentos médicos e a necessidade de um maior controle das informações, é fundamental adotar sistemas informatizados que possam armazenar, organizar e gerenciar dados de maneira segura e eficaz. Nesse cenário, o projeto visa oferecer uma solução que simplifique o gerenciamento de usuários, médicos, pacientes, recepcionistas, especialidades médicas, convênios e atendimentos realizados.
Além disso, o sistema permite o controle de consultas médicas, possibilitando o registro de informações relevantes, como data e horário do atendimento, valor da consulta, status e anamnese do paciente. O projeto também inclui o gerenciamento de convênios médicos e o relacionamento entre médicos e suas respectivas especialidades.
  O principal objetivo do sistema é proporcionar uma maior eficiência no gerenciamento da clínica, reduzir processos manuais, garantir a integridade das informações armazenadas e auxiliar no controle operacional da instituição.









# 2 DESCRIÇÃO DO PROJETO
  O projeto consiste no desenvolvimento de um sistema de gerenciamento para clínicas médicas, permitindo o cadastro e controle das principais informações relacionadas ao ambiente clínico.
A plataforma permitirá que recepcionistas façam o agendamento e gerenciamento de atendimentos médicos, associando pacientes aos médicos responsáveis pelas consultas. O sistema também armazenará informações relevantes sobre os atendimentos realizados, como valor da consulta, data e horário do atendimento, status da consulta e anamnese do paciente.
  Adicionalmente, o sistema possibilitará o gerenciamento de convênios médicos, permitindo que os pacientes tenham um ou mais convênios vinculados por meio de um cadastro específico que contenha o número da carteirinha.
  Além disso, os médicos poderão ter múltiplas especialidades médicas registradas, proporcionando maior flexibilidade no gerenciamento dos profissionais da clínica.

# 3 REQUISITOS FUNCIONAIS
  RF01 – Cadastro de Usuários
O sistema deve permitir o cadastro de usuários contendo as seguintes informações:
•	CPF;
•	Nome;
•	E-mail;
•	Telefone;
•	Data de nascimento;
•	Gênero.
  RF02 – Gerenciamento de Médicos
O sistema deve permitir o cadastro de médicos vinculados a um usuário previamente existente.
  RF03 – Gerenciamento de Pacientes
O sistema deve permitir o cadastro de pacientes vinculados a um usuário previamente existente.
  RF04 – Gerenciamento de Recepcionistas
O sistema deve permitir o cadastro de recepcionistas vinculados a um usuário previamente existente.
  RF05 – Cadastro de Especialidades
O sistema deve permitir o cadastro de especialidades médicas.
  RF06 – Associação de Médicos e Especialidades
O sistema deve permitir associar um médico a uma ou mais especialidades médicas.
  RF07 – Cadastro de Convênios
O sistema deve permitir o cadastro de convênios médicos contendo:
•	Nome do convênio;
•	Cobertura oferecida.
  RF08 – Associação de Pacientes e Convênios
O sistema deve permitir associar pacientes a convênios médicos, armazenando o número da carteirinha do convênio.
  RF09 – Registro de Atendimentos
O sistema deve permitir registrar atendimentos contendo:
•	Data e hora do atendimento;
•	Valor da consulta;
•	Status do atendimento;
•	Anamnese.
  RF10 – Associação de Atendimento ao Médico
O sistema deve permitir vincular um atendimento a um médico responsável.
  RF11 – Associação de Atendimento ao Paciente
O sistema deve permitir vincular um atendimento a um paciente.
  RF12 – Associação de Atendimento ao Recepcionista
O sistema deve permitir registrar qual recepcionista realizou o agendamento ou cadastro do atendimento.
  RF13 – Consulta de Atendimentos
O sistema deve permitir consultar os atendimentos cadastrados no sistema.
  RF14 – Atualização de Atendimentos
O sistema deve permitir alterar informações de atendimentos previamente cadastrados.
  RF15 – Exclusão de Registros
O sistema deve permitir excluir registros relacionados a:
•	Usuários;
•	Atendimentos;
•	Convênios;
•	Especialidades médicas.

# 4 CONSIDERAÇÕES FINAIS
  O desenvolvimento do Sistema de Clínica Médica possibilitou a aplicação de conceitos fundamentais de modelagem de banco de dados, incluindo modelagem conceitual, modelo lógico, normalização e definição de relacionamentos entre entidades.
  O projeto foi estruturado para garantir organização, integridade e eficiência no armazenamento das informações, permitindo um gerenciamento mais adequado das atividades realizadas em uma clínica médica.
Além disso, a adoção de um banco de dados relacional contribui para a segurança das informações e para a redução de inconsistências nos dados armazenados, tornando o sistema mais confiável e eficiente para implementações futuras.

