import validator from 'validator';

export const validate = (body) => {
        const { firstname, lastname, email, password, passwordConfirm } = body;

        if (password != passwordConfirm) {
                return 'Пароли не совпадают';
        }

        if (!validator.isEmail(email)) {
                return 'Почта задана неверно';
        }

        if (!password.match('^[a-zA-Z0-9!"#$%&\' ()*+,-./:;<=>?@^_`|]{8,32}$')) {
                return 'Пароль должен иметь длину от 8 до 32 символов и состоять из букв латинского алфавита, чисел и спецсимволов';
        }

        if (!validator.isAlpha(firstname, 'ru-RU') && !validator.isAlpha(firstname, 'en-US')) {
                return 'Имя должно состоять из букв латинского или русского алфавитов';
        }

        if (!validator.isLength(firstname, { min: 1, max: 128 })) {
                return 'Имя должно иметь длину от 1 до 128 символов';
        }

        if (lastname) {
                if (!validator.isLength(lastname, { min: 1, max: 128 })) {
                        return 'Фамилия должна иметь длину от 1 до 128 символов';
                }

                if (!validator.isAlpha(lastname, 'ru-RU') && !validator.isAlpha(lastname, 'en-US')) {
                        return 'Фамилия должна состоять из букв латинского или русского алфавитов';
                }
        }

        return '';
};
