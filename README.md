# UNIFISC - União de notas fiscais
O sistema financeiro UNIFISC, com um dashboard para a gestão de notas fiscais em 2023, é essencial para a equipe financeira. Sua implementação permite à empresa controlar, decidir e otimizar processos, contribuindo para alcançar objetivos estratégicos.

## Recursos do UNIFISC
- Dashboard com indicadores: os indicadores incluem opções de filtro por mês, trimestre e ano, apresentando informações cruciais, como o valor total das notas emitidas, o valor das notas sem cobrança, o montante das notas vencidas (inadimplência), notas a vencer, notas pagas, além de gráficos que ilustram a evolução da inadimplência e da receita recebida mês a mês.
- Lista de Notas Emitidas:informações essenciais, como o nome do pagador, número de identificação da nota, data de emissão, data da cobrança, data do pagamento, valor da nota, documento fiscal, documento do boleto bancário e status da nota. Os filtros disponíveis facilitam a busca por mês de emissão, mês da cobrança, mês do pagamento e status da nota, garantindo uma análise eficiente das informações financeiras.
- Formatação de moeda brasileira para valores monetários.

**Observação:** O recurso da pesquisa e a configuração de notificações não foram implementadas.

## Páginas
- **Início (start.html)**: Introdução ao que se pode realizar no sistema.
- **Dashboard (dashboard.html)**: Visão geral do desempenho financeiro.
- **Lista de Notas (list.html)**: Listagem detalhada das notas fiscais com opções de filtragem.

## Quantidade de Arquivos
- **Total de Arquivos HTML:** 4
- **Total de Arquivos CSS:** 12
- **Total de Arquivos JS:** 4
- **Total de Arquivos JSON:** 1
- **Total de Arquivos de Imagens:** 2

## Estrutura do Projeto
O projeto está organizado da seguinte forma:
- `/css`: Arquivos de estilo CSS.
- `/images`: Imagens usadas no projeto.
- `/js`: Scripts JavaScript para lógica de frontend e interações.
- `/pages`: Arquivos HTML das diferentes páginas da aplicação.
- `index.html`: Página inicial do projeto.
- `LICENSE`: Descrição da licença utilizada no projeto.
- `notas.json`: Dados de exemplo das notas fiscais em formato JSON.
- `README.md`: Informações detalhadas sobre o projeto, desde o que ele é e tudo que foi utilizado para a sua criação.

## Ferramentas Utilizadas
- **Font Awesome**
  - Versão: 6.5.1
  - Descrição: Utilizado para aplicar ícones ao projeto.

- **Bootstrap**
  - Versão: 5.0.2
  - Descrição: Utilizado para aplicar estilizações e componentes ao projeto.

- **Popper.js**
  - Versão: 2.9.2
  - Descrição: Utilizado para inserir a estilização do Bootstrap aos tooltips.

- **Chart.js**
  - Versão: 3.9.1
  - Descrição: Utilizado para a criação de componentes de gráficos.

- **jQuery**
  - Versão: 3.3.1
  - Descrição: Utilizado para o controle e geração do DOM.

- **JSON**
  - Descrição: Utilizado para inserir dados sem utilizar um banco de dados.

- **Chat GPT**
  - Versão: 3.5
  - Descrição: Utilizado para agilizar o desenvolvimento do projeto.

## Arquitetura e Tecnologias
- **SPA (Single Page Application)**
  - Descrição: Utilizado para carregar as demais páginas em uma única página que possui o sidebar e o header.

- **AJAX (Asynchronous JavaScript and XML)**
  - Descrição: Utilizado para agilizar as requisições ao servidor, proporcionando uma experiência fluida ao usuário.

- **Grid Layout do CSS**
  - Descrição: Utilizado para criar o layout de todas as páginas e até pequenos blocos que necessitavam de precisão nos posicionamentos.

## Instruções de Setup e Uso
1. Clone o repositório para sua máquina local.
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git

2. Abra o projeto no Visual Studio Code.

3. Instale a extensão "Live Server" no VS Code, se ainda não estiver instalada.

4. Abra o arquivo `index.html` no VS Code.

5. Clique com o botão direito em cima do arquivo `index.html`, clique em "Open with Live Server" ou utilize o atalho `Alt + L, Alt + O`.

6. O navegador padrão será aberto automaticamente exibindo a página do projeto.

7. Explore as funcionalidades do sistema.

8. Para realizar modificações, certifique-se de ter as versões corretas das ferramentas instaladas. Consulte as seções acima para informações detalhadas sobre as versões utilizadas.

9. Para contribuir ou reportar problemas, abra uma issue ou envie um pull request.

10. Divirta-se desenvolvendo e utilizando o sistema!

**Observação:** Certifique-se de ter uma conexão com a internet para carregar as bibliotecas externas utilizadas no projeto.

## Demo do projeto na Pages do GitHub
[UNIFISC](https://meusestudos.github.io/UNIFISC/)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](https://mit-license.org/) para detalhes.

## Contato

Para mais informações, entre em contato com o mantenedor do projeto pelo LinkedIn: [Marina Micas Jardim](https://www.linkedin.com/in/marinamicas/).
