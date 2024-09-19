//Selecionar o display e os botões
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

// Variáveis para controlar o estado do display
let currentValue = '';
let lastKey = '';
let calculationDone = false; // Nova variável para controlar se um cálculo foi finalizado
let expressionOperator = /[\/\*\+\-\^]/;

// Função para atualizar o display
function updateDisplay(value) {
    display.value = value;
}

// Função para apagar o último dígito
function deleteLastDigit() {
        // Remove o último caractere e atualiza o display
    currentValue = currentValue.slice(0, -1);
    updateDisplay(currentValue);
    // Atualiza lastKey baseado no novo valor do display
    lastKey = currentValue.slice(-1);
}

// Função para adicionar valores ao display e verificar pontos consecutivos e operadores seguidos
function addToDisplay(value) {
    // Se um cálculo foi realizado e um número for pressionado, substitui o valor atual
    if (calculationDone && /[0-9]/.test(value)) {
        currentValue = value; // Substitui o valor
        updateDisplay(currentValue);
        calculationDone = false; // Reseta o estado de cálculo concluído
        lastKey = value;
        return;
    }

    // Se um operador for pressionado após o cálculo, continua a operação
    if (calculationDone && expressionOperator.test(value)) {
        calculationDone = false; // Reseta o estado para permitir continuar a operação
    }

    if (currentValue === '' && value === '-') {
        currentValue += value;
        updateDisplay(currentValue);
        lastKey = value;
        return;
    }

    if (currentValue === '' && value === '.') {
        currentValue = '0.';
        updateDisplay(currentValue);
        lastKey = '.';
        return;
    }

    if (currentValue === '0') {
        if (currentValue === '0' && value === '.') {
            currentValue = '0.';
            updateDisplay(currentValue);
            lastKey = value;
            return;
        }
        deleteLastDigit();
    }

    // Impede operadores aritméticos se o display estiver vazio
    if (expressionOperator.test(value) && (currentValue === '' || /[\/\*\+\-\^]$/.test(currentValue))) {
        return;
    }

    if (expressionOperator.test(value) && /[\/\*\+\-\^]$/.test(currentValue)) {
        return;
    }

    // Impede múltiplos pontos decimais no mesmo número
    if (value === '.' && currentValue.includes('.')) {
        return;
    }

    //if (value === '.' && (lastKey === '.' || expressionOperator.test(lastKey))) return;
    

    if (expressionOperator.test(value) && lastKey === '.') {
        return;
    }

    currentValue += value;
    updateDisplay(currentValue);
    lastKey = value;
}

// Função para limpar tudo (C)
function clearAll() {
    currentValue = '';
    updateDisplay('');
    lastKey = ''; // Reseta lastKey
}

// Função para calcular o resultado sem usar eval
function calculate() {
    
    try {
        // Adiciona uma expressão padrão no final para tratar casos sem operadores
        const result = parseExpression(currentValue);
        currentValue = result.toString();
        updateDisplay(currentValue);
        lastKey = currentValue.slice(-1);
        calculationDone = true; // Indica que o cálculo foi finalizado
    } catch (error) {
        if(currentValue === '.' || currentValue === ''){
            clearAll();
        }else{
                updateDisplay('Error');
            setTimeout(() => {
                updateDisplay('');
                lastKey = ''; // Reseta lastKey em caso de erro
                calculationDone = true; // Indica que o cálculo foi finalizado
            }, 3000);
            
            
        }
    }
}

// Função para parser de expressão matemática
function parseExpression(expression) {
    // Função auxiliar para aplicar operações básicas
    function applyOperator(left, operator, right) {
        switch (operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '^': return Math.pow(left, right);  // Potenciação
            default: throw new Error('Operador inválido');
        }
    }
    

    // Remove espaços da expressão
    expression = expression.replace(/\s+/g, '');

    // Corrige a expressão para tratar sinais negativos corretamente
    expression = expression.replace(/--/g, '+');
    if (expression[0] === '-') expression = '0' + expression;

    // Define precedência dos operadores
    const precedence = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };

    const values = [];
    const operators = [];

    let i = 0;

    while (i < expression.length) {
        if (expression[i] >= '0' && expression[i] <= '9') {
            let num = '';
            while (i < expression.length && (expression[i] >= '0' && expression[i] <= '9' || expression[i] === '.')) {
                num += expression[i++];
            }
            values.push(parseFloat(num));
        } else if (expression[i] in precedence) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[expression[i]]) {
                const operator = operators.pop();
                const right = values.pop();
                const left = values.pop();
                values.push(applyOperator(left, operator, right));
            }
            operators.push(expression[i++]);
        } else {
            throw new Error('Caractere inválido');
        }
    }

    while (operators.length) {
        const operator = operators.pop();
        const right = values.pop();
        const left = values.pop();
        values.push(applyOperator(left, operator, right));
    }

    return values[0];
}

// Adicionando os event listeners aos botões
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (button.id === 'clear') {
            clearAll();
        }  else if (button.id === 'deletar') {
            deleteLastDigit();
        } else if (button.id === 'equals') {
            calculate();
        } else {
            addToDisplay(value);
        }
    });
});

