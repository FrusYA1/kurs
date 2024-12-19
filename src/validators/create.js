import validator from 'validator';

export const validate = (body) => {
        const { name } = body;

        if (!validator.isLength(name, { min: 1, max: 256 })) {
                return 'Название чата должно иметь длину от 1 до 256 символов';
        }

        return '';
};
