document.getElementById("clear").addEventListener("click", () => document.getElementById('display').value = '');


document.querySelectorAll(".number, .operation").forEach(button => {
    button.addEventListener("click", () => 
        document.getElementById('display').value += button.getAttribute("data-value"));
});

document.getElementById("equals").addEventListener("click", () => {
    const display = document.getElementById('display');
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Erro';
    }
});
