// Função para simular o carregamento de conteúdo da página
function loadPageContent(pageId) {
    // Aqui você carregaria o conteúdo real, por exemplo, através de uma chamada AJAX
    const contentMap = {
        "start-link": "start.html",
        "dashboard-link": "dashboard.html",
        "list-link": "list.html",
    };

    const pageName = contentMap[pageId];
    // Injeta o conteúdo correspondente no elemento principal
    $.get(`pages/${pageName}`, (data) => {
        $('#main-content').html(data);
    }, 'html');
}

$(document).ready(function() {
    // Evento de clique para os links da sidebar
    $('.nav-link').on('click', function(event) {
        event.preventDefault();

        // Remove a classe 'active' de todos os links e adiciona ao clicado
        $('.nav-link').removeClass('active');
        $(this).addClass('active');

        // Carrega o conteúdo correspondente ao link clicado
        const pageId = $(this).attr('id');
        loadPageContent(pageId);
    });

    // Carrega o conteúdo inicial do UNIFISC
    loadPageContent('start-link');
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
