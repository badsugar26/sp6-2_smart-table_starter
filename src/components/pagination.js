import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    console.log("pageTemplate:", pageTemplate);
    pages.firstElementChild.remove();
    
    return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;                        // будем часто обращаться, чтобы короче записывать
        const pageCount = Math.ceil(data.length / rowsPerPage);        // число страниц округляем в большую сторону
        let page = state.page;   
        console.log("rowsPerPage:", rowsPerPage);
        console.log("pageCount:", pageCount);
        console.log("page:", page);

        // @todo: #2.6 — обработать действия
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
            case 'next': page = Math.min(pageCount, page + 1); break;    // переход на следующую страницу
            case 'first': page = 1; break;                                // переход на первую страницу
            case 'last': page = pageCount; break;                        // переход на последнюю страницу
        } 

        console.log("action:", action);

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);                // Получим массив страниц, которые нужно показать, выводим только 5 страниц
        console.log("visiblePages:", visiblePages);
        pages.replaceChildren(...visiblePages.map(pageNumber => {        // перебираем их и создаём для них кнопку
            const el = pageTemplate.cloneNode(true);                    // клонируем шаблон, который запомнили ранее
            console.log("el:", el);
            return createPage(el, pageNumber, pageNumber === page);        // вызываем колбэк из настроек, чтобы заполнить кнопку данными
        }));

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage;
        toRow.textContent = (page + 1) * rowsPerPage;
        totalRows.textContent = data.length;

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}