$(document).ready(function() {
    // Simulando dados de notas fiscais
    let notas = [];

    $.getJSON('../notas.json', function(data) {
        notas = data;
        updateCharts(currentFilter);
        updateTotals(currentFilter);
    }).fail(function(jqXHR, textStatus, error) {
        console.log("Erro ao carregar JSON: " + textStatus); // lida com possíveis erros
    });


    const monthLabels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    // Função auxiliar para formatar valores monetários
    function formatCurrency(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função auxiliar para verificar se a data está dentro do intervalo de filtro
    function isDateInRange(date, filter) {
        const now = new Date();
        const start = new Date();
        if (filter === 'month') {
            start.setMonth(now.getMonth() - 1);
        } else if (filter === 'quarter') {
            start.setMonth(now.getMonth() - 3);
        } else if (filter === 'year') {
            start.setFullYear(now.getFullYear() - 1);
        }
        return date >= start && date <= now;
    }

    // Função para calcular e exibir os totais
    function updateTotals(filter) {
        let totalIssued = 0, totalUnbilled = 0, totalOverdue = 0, totalUpcoming = 0, totalPaid = 0;

        notas.forEach(nota => {
            const emissionDate = new Date(nota.dataEmissao);
            const billingDate = nota.dataCobranca ? new Date(nota.dataCobranca) : null;
            const paymentDate = nota.dataPagamento ? new Date(nota.dataPagamento) : null;
            const today = new Date();

            if (isDateInRange(emissionDate, filter)) {
                totalIssued += nota.valorNota;

                if (!billingDate) {
                    totalUnbilled += nota.valorNota;
                }

                if (billingDate && !paymentDate) {
                    if (billingDate < today) {
                        totalOverdue += nota.valorNota;
                    } else if ((billingDate.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 30) {
                        totalUpcoming += nota.valorNota;
                    }
                }

                if (paymentDate) {
                    totalPaid += nota.valorNota;
                }
            }
        });

        $('#total-issued').text(formatCurrency(totalIssued));
        $('#total-unbilled').text(formatCurrency(totalUnbilled));
        $('#total-overdue').text(formatCurrency(totalOverdue));
        $('#total-upcoming').text(formatCurrency(totalUpcoming));
        $('#total-paid').text(formatCurrency(totalPaid));
    }

    // Carregar o filtro do localStorage ou definir para 'month' por padrão
    let currentFilter = localStorage.getItem('dashboardFilter') || 'month';
    $('#time-filter').val(currentFilter);

    // Evento de clique nos itens do dropdown
    $('.dropdown-menu a').on('click', function() {
        var selectedValue = $(this).data('value');
        $('#time-filter').text($(this).text()); // Atualiza o texto do botão dropdown
        localStorage.setItem('dashboardFilter', selectedValue);
        updateTotals(selectedValue);
        // Chame aqui a função para atualizar os gráficos
    });

    function initializeMonthlyData() {
        let monthlyData = [];
        for (let i = 0; i < 12; i++) {
            monthlyData[i] = 0;
        }
        return monthlyData;
    }

    function searchInPage(keyword) {
        if (!keyword) {
            // Se a pesquisa for vazia, limpe os destaques anteriores
            $('.highlight').removeClass('highlight');
            return;
        }

        // Remover destaques anteriores
        $('body').unhighlight();

        // Destacar a nova palavra de pesquisa
        $('body').highlight(keyword);
    }

    // jQuery Highlight plugin
    jQuery.fn.highlight = function(pat) {
        function innerHighlight(node, pat) {
            var skip = 0;
            if (node.nodeType === 3) {
                var pos = node.data.toUpperCase().indexOf(pat);
                if (pos >= 0) {
                    var spannode = document.createElement('span');
                    spannode.className = 'highlight';
                    var middlebit = node.splitText(pos);
                    var endbit = middlebit.splitText(pat.length);
                    var middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);
                    skip = 1;
                }
            } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                for (var i = 0; i < node.childNodes.length; ++i) {
                    i += innerHighlight(node.childNodes[i], pat);
                }
            }
            return skip;
        }
        return this.each(function() {
            innerHighlight(this, pat.toUpperCase());
        });
    };

    jQuery.fn.unhighlight = function() {
        return this.find("span.highlight").each(function() {
            this.parentNode.firstChild.nodeName;
            with (this.parentNode) {
                replaceChild(this.firstChild, this);
                normalize();
            }
        }).end();
    };

    // Evento do clique no botão de pesquisa
    $('#search-button').click(function() {
        var keyword = $('#search-input').val();
        searchInPage(keyword);
    });

    // Evento de pressionar 'Enter' na caixa de pesquisa
    $('#search-input').on('keypress', function(e) {
        if (e.which === 13) { // Código do 'Enter'
            var keyword = $(this).val();
            searchInPage(keyword);
        }
    });

    // Gera dados para gráficos com base nas notas
    function generateChartData(filter) {
        let overdueData = initializeMonthlyData();
        let revenueData = initializeMonthlyData();
        notas.forEach(nota => {
            const emissionMonth = new Date(nota.dataEmissao).getMonth();
            const paymentMonth = nota.dataPagamento ? new Date(nota.dataPagamento).getMonth() : null;
            const billingMonth = nota.dataCobranca ? new Date(nota.dataCobranca).getMonth() : null;

            if (isDateInRange(new Date(nota.dataEmissao), filter)) {
                overdueData[emissionMonth] = overdueData[emissionMonth] || 0;
                revenueData[paymentMonth] = revenueData[paymentMonth] || 0;

                if (billingMonth && !paymentMonth) {
                    overdueData[emissionMonth] += nota.valorNota;
                }

                if (paymentMonth) {
                    revenueData[paymentMonth] += nota.valorNota;
                }
            }
        });

        return {
            overdueData: Object.values(overdueData),
            revenueData: Object.values(revenueData)
        };
    }

    // Função para atualizar os gráficos
    function updateCharts(filter) {
        const chartData = generateChartData(filter);

        // Configuração do gráfico de inadimplência
        const overdueChartCtx = document.getElementById('overdue-chart').getContext('2d');
        const overdueChart = new Chart(overdueChartCtx, {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Inadimplência',
                    data: chartData.overdueData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0 // Isso tornará as linhas retas
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false  // Isso assegura que todos os rótulos sejam mostrados
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                spanGaps: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Configuração do gráfico de receita
        const revenueChartCtx = document.getElementById('revenue-chart').getContext('2d');
        const revenueChart = new Chart(revenueChartCtx, {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Receita Recebida',
                    data: chartData.revenueData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0 // Isso tornará as linhas retas
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false  // Isso assegura que todos os rótulos sejam mostrados
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                spanGaps: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

});