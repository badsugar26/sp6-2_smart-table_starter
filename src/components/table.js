import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(templateId => {
        const clonedTamplate = cloneTemplate(templateId);
        root.container.prepend(clonedTamplate);
        root[templateId] = clonedTamplate;
    });

    after.forEach(templateId => {
        const clonedTamplate = cloneTemplate(templateId);
        root.container.append(clonedTamplate);
        root[templateId] = clonedTamplate;
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction, 100);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    })



    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container; // Не забудьте вернуть строку после заполнения данных
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}