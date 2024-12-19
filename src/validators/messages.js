import validator from 'validator';

export const validate = (count, page) => {
        if (count <= 0 || count > 100 || !Number.isInteger(count)) {
                return 'Количество сообщений задано неверно';
        }

        if (page < 0 || !Number.isInteger(page)) {
                return 'Страница задана неверно';
        }

        return '';
};
