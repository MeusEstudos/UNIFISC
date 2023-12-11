$(document).ready(function () {

    // Lista de meses para os dropdowns
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Função para popular os dropdowns de meses
    function populateMonthSelectors() {
        const monthSelects = $('#emission-month-filter, #billing-month-filter, #payment-month-filter');
        monthSelects.each(function () {
            const dropdownMenu = $(this).next('.dropdown-menu');
            dropdownMenu.empty();
            dropdownMenu.append('<li><a class="dropdown-item" href="#" data-value="">Todos</a></li>');
            months.forEach((month, index) => {
                dropdownMenu.append(`<li><a class="dropdown-item" href="#" data-value="${index + 1}">${month}</a></li>`);
            });
        });
    }

    // Chama a função de preenchimento dos dropdowns
    populateMonthSelectors();

    // Array para armazenar as notas fiscais
    let invoices = [];

    // Função para carregar as notas fiscais a partir de um arquivo JSON
    function loadInvoices() {
        $.getJSON('./notas.json', function (data) {
            invoices = data;
            applyCachedFilters();
        }).fail(function (jqXHR, textStatus, error) {
            console.error("Erro ao carregar dados: " + textStatus);
        });
    }

    // Função para formatar um valor como moeda
    function formatCurrency(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função para exibir as notas fiscais na tabela
    function displayInvoices(data) {
        const tableBody = $('#invoices-table-body');
        tableBody.empty();

        //mexe aqui pra mudar as classes
        const statusClassMap = {
            'Emitida': 'primary',
            'Cobrança realizada': 'secondary',
            'Pagamento em atraso': 'warning text-dark',
            'Pagamento realizado': 'success'
        }

        data.forEach(invoice => {
            tableBody.append(`
                <tr>
                    <td>${invoice.nomePagador}</td>
                    <td>${invoice.idNota}</td>
                    <td>${invoice.dataEmissao}</td>
                    <td>${invoice.dataCobranca || ''}</td>
                    <td>${invoice.dataPagamento || ''}</td>
                    <td>${formatCurrency(invoice.valorNota)}</td>
                    <td>${invoice.documentoNotaFiscal ? `<a href="${invoice.documentoNotaFiscal}" target="_blank">Ver</a>` : ''}</td>
                    <td>${invoice.documentoBoleto ? `<a href="${invoice.documentoBoleto}" target="_blank">Ver</a>` : ''}</td>
                    <td><span class="badge rounded-pill bg-${statusClassMap[invoice.status]}">${invoice.status}</span></td>
                </tr>
            `);
        });
    }

    // Função para atualizar os filtros no armazenamento local
    function updateFiltersCache() {
        const filters = {
            emissionMonth: parseInt($('#emission-month-filter').data('value')),
            billingMonth: parseInt($('#billing-month-filter').data('value')),
            paymentMonth: parseInt($('#payment-month-filter').data('value')),
            status: $('#status-filter').data('value')
        };
        console.log('updated filters', filters);
        localStorage.setItem('invoiceFilters', JSON.stringify(filters));
    }

    // Função para aplicar os filtros armazenados localmente
    function applyCachedFilters() {
        const cachedFilters = JSON.parse(localStorage.getItem('invoiceFilters'));
        console.log('cached filters', cachedFilters);
        if (cachedFilters) {
            $('#emission-month-filter').data('value', cachedFilters.emissionMonth);
            $('#billing-month-filter').data('value', cachedFilters.billingMonth);
            $('#payment-month-filter').data('value', cachedFilters.paymentMonth);
            $('#status-filter').data('value', cachedFilters.status);
            filterInvoices();
        }
    }

    // Evento de clique nos itens do dropdown
    $('#emission-month-filter + .dropdown-menu .dropdown-item').on('click', function() {
        const selectedValue = $(this).data('value');
        $('#emission-month-filter').data('value', selectedValue);
        $('#emission-month-filter').text($(this).text()); // Atualiza o texto do botão dropdown
        updateFiltersCache();
        applyCachedFilters();
    });

    $('#billing-month-filter + .dropdown-menu .dropdown-item').on('click', function() {
        const selectedValue = $(this).data('value');
        $('#billing-month-filter').data('value', selectedValue);
        $('#billing-month-filter').text($(this).text()); // Atualiza o texto do botão dropdown
        updateFiltersCache();
        applyCachedFilters();
    });

    $('#payment-month-filter + .dropdown-menu .dropdown-item').on('click', function() {
        const selectedValue = $(this).data('value');
        $('#payment-month-filter').data('value', selectedValue);
        $('#payment-month-filter').text($(this).text()); // Atualiza o texto do botão dropdown
        updateFiltersCache();
        applyCachedFilters();
    });

    $('#status-filter + .dropdown-menu .dropdown-item').on('click', function() {
        const selectedValue = $(this).data('value');
        $('#status-filter').data('value', selectedValue);
        $('#status-filter').text($(this).text()); // Atualiza o texto do botão dropdown
        updateFiltersCache();
        applyCachedFilters();
    });

    // Função para filtrar as notas fiscais com base nos filtros
    function filterInvoices() {

        let filteredInvoices = invoices;

        const cachedFilters = JSON.parse(localStorage.getItem('invoiceFilters'));

        const emissionMonth = cachedFilters.emissionMonth ?? $('#emission-month-filter').data('value');
        const billingMonth = cachedFilters.billingMonth ?? $('#billing-month-filter').data('value');
        const paymentMonth = cachedFilters.paymentMonth ?? $('#payment-month-filter').data('value');
        const status = cachedFilters.statusMonth ?? $('#status-filter').data('value');

        console.log(billingMonth);

        if (emissionMonth) {
            filteredInvoices = filteredInvoices.filter(invoice => {
                const date = new Date(invoice.dataEmissao);
                return date.getMonth() + 1 === parseInt(emissionMonth);
            });

            console.log(filteredInvoices)
        }

        if (billingMonth) {
            filteredInvoices = filteredInvoices.filter(invoice => {
                return invoice.dataCobranca && new Date(invoice.dataCobranca).getMonth() + 1 === parseInt(billingMonth);
            });

            console.log(filteredInvoices);

        }

        if (paymentMonth) {
            filteredInvoices = filteredInvoices.filter(invoice => {
                return invoice.dataPagamento && new Date(invoice.dataPagamento).getMonth() + 1 === parseInt(paymentMonth);
            });
        }

        if (status) {
            filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
        }

        displayInvoices(filteredInvoices);
    }

    // Carrega as notas fiscais ao iniciar
    loadInvoices();

    // Exibe ou restaura os filtros armazenados localmente
    const cachedFiltersJson = localStorage.getItem('invoiceFilters');

    if (!cachedFiltersJson) {
        $("#emission-month-filter, #billing-month-filter, #payment-month-filter, #status-filter").text("Todos");
    } else {
        const cachedFilters = JSON.parse(cachedFiltersJson);
        const emissionMonth = parseInt(cachedFilters.emissionMonth ?? 0);
        const billingMonth = parseInt(cachedFilters.billingMonth ?? 0);
        const paymentMonth = parseInt(cachedFilters.paymentMonth ?? 0);
        const status = cachedFilters.status || "Todos";
        console.log(emissionMonth);

        if (emissionMonth > 0) {
            $("#emission-month-filter").text(months[emissionMonth - 1]);
        } else {
            $("#emission-month-filter").text("Todos");
        }

        if (billingMonth > 0) {
            $("#billing-month-filter").text(months[billingMonth - 1]);
        } else {
            $("#billing-month-filter").text("Todos");
        }

        if (paymentMonth > 0) {
            $("#payment-month-filter").text(months[paymentMonth - 1]);
        } else {
            $("#payment-month-filter").text("Todos");
        }

        $("#status-filter").text(status);
    }

});
