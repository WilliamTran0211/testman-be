export const regex = {
    passwordRegex:
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
    numberPhoneRegex: '(84|0)[3|5|7|8|9]+([0-9]{8})',
    emailRegex: '^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$'
};
