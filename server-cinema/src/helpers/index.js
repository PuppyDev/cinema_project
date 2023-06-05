exports.generatePassword = () => {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const allChars = uppercaseLetters + lowercaseLetters + symbols;

    let password = "";
    password += getRandomChar(uppercaseLetters);
    password += getRandomChar(lowercaseLetters);
    password += Math.floor(Math.random() * 10);
    password += getRandomChar(symbols);

    while (password.length < 10) {
        password += getRandomChar(allChars);
    }

    return password;
};

function getRandomChar(characters) {
    return characters[Math.floor(Math.random() * characters.length)];
}
